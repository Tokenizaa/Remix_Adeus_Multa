import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Zap,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  Share2,
  TrendingUp,
  ShieldCheck,
  RotateCw,
  PlusCircle,
  Eye,
  Send,
  Link2,
  Instagram,
  Facebook,
  Check,
  AlertCircle
} from 'lucide-react';
import { MarketingAgentState, EditorialContentItem, MetaAccountState } from '../../types';
import { getMetaStatus, publishToMeta, connectMetaWithToken, disconnectMeta } from '../../core/integrations/meta-client';

export const MarketingOSView: React.FC = () => {
  const [agents, setAgents] = useState<MarketingAgentState[]>([]);
  const [contents, setContents] = useState<EditorialContentItem[]>([]);
  const [isTicking, setIsTicking] = useState<boolean>(false);
  const [selectedContent, setSelectedContent] = useState<EditorialContentItem | null>(null);
  const [isCreatingContent, setIsCreatingContent] = useState<boolean>(false);
  const [newTheme, setNewTheme] = useState<string>('Multa de Radar Portátil em Rodovia: Falta de Estudo Técnico');
  const [newChannel, setNewChannel] = useState<'instagram' | 'tiktok' | 'blog'>('instagram');

  // Meta Integration State
  const [metaState, setMetaState] = useState<MetaAccountState | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    facebookPostId?: string;
    instagramMediaId?: string;
  } | null>(null);
  const [showMetaConnectModal, setShowMetaConnectModal] = useState<boolean>(false);
  const [manualToken, setManualToken] = useState<string>('');

  const fetchMarketingStatus = async () => {
    try {
      const res = await fetch('/api/marketing/status');
      const data = await res.json();
      setAgents(data.agents);
      setContents(data.contents);
    } catch (err) {
      console.error('Error loading Marketing OS:', err);
    }
  };

  const fetchMetaConnection = async () => {
    try {
      const state = await getMetaStatus();
      setMetaState(state);
    } catch (err) {
      console.error('Error fetching Meta status:', err);
    }
  };

  useEffect(() => {
    fetchMarketingStatus();
    fetchMetaConnection();
  }, []);

  const handleRunCycleTick = async () => {
    setIsTicking(true);
    try {
      const res = await fetch('/api/marketing/cycle-tick', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAgents([...data.agents]);
      }
    } catch (err) {
      console.error('Error running cycle tick:', err);
    } finally {
      setIsTicking(false);
    }
  };

  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/marketing/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: newTheme,
          channel: newChannel,
          format: newChannel === 'tiktok' ? 'reels_roteiro' : 'carrossel',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContents([data.content, ...contents]);
        setIsCreatingContent(false);
        setSelectedContent(data.content);
      }
    } catch (err) {
      console.error('Error generating content:', err);
    }
  };

  const handlePublishToMeta = async (destination: 'facebook' | 'instagram' | 'both') => {
    if (!selectedContent) return;
    setIsPublishing(true);
    setPublishResult(null);

    try {
      const result = await publishToMeta({
        destination,
        message: `${selectedContent.copyText}\n\n${selectedContent.hashtags.join(' ')}`,
        mediaUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1080&q=80',
        linkUrl: 'https://defesai.com.br',
      });

      if (result.success) {
        setPublishResult(result);
        // Mark content as published in state
        setContents((prev) =>
          prev.map((c) =>
            c.id === selectedContent.id ? { ...c, status: 'publicado' as const } : c
          )
        );
      }
    } catch (err: any) {
      alert(`Erro na publicação Meta: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConnectToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await connectMetaWithToken(manualToken);
      if (result.success) {
        setMetaState(result.connection);
        setShowMetaConnectModal(false);
      }
    } catch (err: any) {
      alert(`Erro ao conectar Meta: ${err.message}`);
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Deseja desconectar a conta Meta?')) {
      await disconnectMeta();
      await fetchMetaConnection();
    }
  };

  const activePage = metaState?.pages[0];
  const activeIg = activePage?.instagram_business_account;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider font-mono flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-orange-500" />
            Organismo Autônomo • 7 Agentes de Aquisição
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            Marketing OS — Aquisição & Canais Meta
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Geração autônoma de conteúdo jurídico e publicação oficial integrada com Facebook e Instagram.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="trigger-cycle-tick-button"
            onClick={handleRunCycleTick}
            disabled={isTicking}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-orange-500 ${isTicking ? 'animate-spin' : ''}`} />
            <span>Ciclo Autônomo</span>
          </button>

          <button
            id="new-marketing-content-button"
            onClick={() => setIsCreatingContent(true)}
            className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shadow-orange-200 transition-all uppercase tracking-tight"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova Pauta IA</span>
          </button>
        </div>
      </div>

      {/* Meta Graph API Connection Status Bar */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Integração Oficial Meta</span>
              {metaState?.isConnected ? (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Conectado Graph API v20.0
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold font-mono">
                  Sandbox / Desconectado
                </span>
              )}
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Facebook className="w-3 h-3 text-blue-600" />
                {activePage?.name || 'Página DefesAi Facebook'}
              </span>
              <span className="flex items-center gap-1">
                <Instagram className="w-3 h-3 text-pink-600" />
                {activeIg?.username ? `@${activeIg.username}` : '@defesai.oficial'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {metaState?.isConnected ? (
            <button
              onClick={handleDisconnect}
              className="px-3 py-1.5 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-lg text-xs font-semibold"
            >
              Desconectar
            </button>
          ) : (
            <button
              onClick={() => setShowMetaConnectModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Conectar Meta</span>
            </button>
          )}
        </div>
      </div>

      {/* 7 Agents Organism Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-mono">
          <Layers className="w-3.5 h-3.5 text-slate-600" />
          Status dos 7 Agentes Especialistas:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-3 bg-white border border-slate-200 hover:border-orange-500 rounded-xl shadow-2xs text-xs space-y-1.5 relative group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-orange-600 text-[10px]">{agent.handle}</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {agent.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs truncate">{agent.name}</h4>
              <p className="text-slate-500 text-[10px] line-clamp-2 leading-tight">{agent.description}</p>

              <div className="pt-1.5 border-t border-slate-100 text-[10px]">
                <span className="text-slate-400 block text-[9px] uppercase font-mono">Atividade Atual:</span>
                <p className="text-slate-700 font-medium truncate mt-0.5">{agent.currentTask}</p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                <span>{agent.tasksCompleted} tarefas</span>
                <span className="text-emerald-700 font-semibold">{agent.confidenceScore}% precisão</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Calendar & Generated Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-600" />
            Grade de Conteúdos Produzidos pelos Agentes:
          </h3>

          <div className="space-y-2">
            {contents.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedContent(item);
                  setPublishResult(null);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                  selectedContent?.id === item.id
                    ? 'border-orange-500 bg-orange-50/20 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-400 bg-white shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 text-slate-800 uppercase font-mono">
                    {item.channel} • {item.format}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 font-mono">
                    Qualidade: {item.qualityReviewScore}/10
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs mt-1">{item.title}</h4>
                <p className="text-slate-500 text-[10px] mt-0.5">Tese: {item.legalTheme}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Alcance est.: {item.estimatedReach.toLocaleString()}</span>
                  <span className="text-orange-600 font-semibold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Ver Copy & Publicar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Content Details / Copy Viewer & Meta Publish Actions */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs sticky top-20 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-900 uppercase font-mono">Prévia do Copy Final</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[10px] font-mono">
                Aprovado
              </span>
            </div>

            {selectedContent ? (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">{selectedContent.title}</h4>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[10px] text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {selectedContent.copyText}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 font-mono">Hashtags Estratégicas:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedContent.hashtags.map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-mono text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta Publish Action Box */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-700 uppercase font-mono block">
                    Publicação Direta na Meta:
                  </span>

                  {publishResult && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px] space-y-1">
                      <div className="flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Publicado com Sucesso!</span>
                      </div>
                      {publishResult.facebookPostId && (
                        <p className="font-mono text-[10px]">Facebook ID: {publishResult.facebookPostId}</p>
                      )}
                      {publishResult.instagramMediaId && (
                        <p className="font-mono text-[10px]">Instagram ID: {publishResult.instagramMediaId}</p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePublishToMeta('facebook')}
                      disabled={isPublishing}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 text-xs shadow-2xs transition-all disabled:opacity-50"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                      <span>Facebook</span>
                    </button>

                    <button
                      onClick={() => handlePublishToMeta('instagram')}
                      disabled={isPublishing}
                      className="px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-500 hover:opacity-95 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 text-xs shadow-2xs transition-all disabled:opacity-50"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400">
                <Share2 className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-slate-400" />
                <p className="text-[11px]">Selecione um conteúdo da grade para visualizar o roteiro completo.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: New Content Generator */}
      {isCreatingContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">Gerar Conteúdo com os Agentes</h3>
            <p className="text-slate-500 mb-3 text-[11px]">
              O @marketing-criador e @marketing-qualidade redigirão o texto dentro dos limites do CTB.
            </p>

            <form onSubmit={handleCreateContent} className="space-y-2.5">
              <div>
                <label className="font-bold text-slate-700 uppercase block text-[10px] font-mono">Tema Jurídico / Pauta</label>
                <input
                  type="text"
                  required
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase block text-[10px] font-mono">Canal de Distribuição</label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value as any)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="instagram">Instagram (Carrossel Educativo)</option>
                  <option value="tiktok">TikTok / Reels (Roteiro em Vídeo)</option>
                  <option value="blog">Blog SEO (Artigo Técnico Aprofundado)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingContent(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 shadow-xs shadow-orange-200"
                >
                  Gerar Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Meta Token Connect */}
      {showMetaConnectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">Conectar Meta (Facebook & Instagram)</h3>
            <p className="text-slate-500 mb-3 text-[11px]">
              Insira o token de acesso da página ou conta comercial da Meta Graph API.
            </p>

            <form onSubmit={handleConnectToken} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 uppercase block text-[10px] font-mono">Page / System User Access Token</label>
                <input
                  type="password"
                  required
                  placeholder="EAAB..."
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600 space-y-1 font-mono">
                <p>💡 Em ambiente local/sandbox, qualquer token gerará uma conexão simulada válida.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMetaConnectModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Salvar Conexão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

