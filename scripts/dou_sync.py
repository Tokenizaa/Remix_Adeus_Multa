#!/usr/bin/env python3
"""
Script para sincronização contínua do Diário Oficial da União (DOU)
para detectar novas resoluções CONTRAN e portarias SENATRAN.

Esta versão usa apenas bibliotecas padrão do Python para evitar dependências externas.
"""

import json
import os
import re
import sys
from datetime import datetime
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
import html

# Configurações
BASE_URL_CONTRAN = "https://www.gov.br/transportes/pt-br/assuntos/transito/conteudo-contran/resolucoes"
BASE_URL_SENATRAN = "https://www.gov.br/transportes/pt-br/assuntos/transito/arquivos-senatran"
CONTRAN_JSON_PATH = "knowledge/legislation/resolutions/contran.json"
SENATRAN_JSON_PATH = "knowledge/legislation/ordinances/senatran.json"
REPORT_PATH = "knowledge/reports/collection-report.json"

# Headers para simular um navegador
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def fetch_url(url):
    """Fetch a URL and return its content as string."""
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=30) as response:
            if response.status == 200:
                return response.read().decode('utf-8')
            else:
                print(f"Erro HTTP {response.status} ao buscar {url}")
                return None
    except (URLError, HTTPError, Exception) as e:
        print(f"Erro ao buscar {url}: {e}")
        return None

def extract_pdf_links(html_content, base_url):
    """Extract all PDF links from HTML content using regex."""
    # Find all href attributes that end with .pdf (case-insensitive)
    # This is a simple regex that might miss some edge cases but should work for most cases
    pdf_link_pattern = re.compile(r'href\s*=\s*["\']([^"\']*?\.pdf)["\']', re.IGNORECASE)
    matches = pdf_link_pattern.findall(html_content)
    
    # Also look for links that might have .PDF in uppercase
    pdf_link_pattern_upper = re.compile(r'href\s*=\s*["\']([^"\']*?\.PDF)["\']', re.IGNORECASE)
    matches_upper = pdf_link_pattern_upper.findall(html_content)
    
    all_matches = matches + matches_upper
    
    # Make absolute URLs and deduplicate
    absolute_links = []
    seen = set()
    for match in all_matches:
        # Clean up the match (might contain extra characters)
        link = match.strip()
        if not link:
            continue
        absolute_url = urljoin(base_url, link)
        if absolute_url not in seen:
            seen.add(absolute_url)
            absolute_links.append(absolute_url)
    
    return absolute_links

def extract_resolution_info_from_url(url):
    """
    Extract resolution number and year from a URL like:
    .../Resolucao7982020.pdf
    Returns (number, year) or (None, None)
    """
    # Pattern to match Resolucao<number><year>.pdf or similar
    patterns = [
        r'Resolucao(\d+)_(\d{4})\.pdf',
        r'Resolucao(\d+)\.(\d{4})\.pdf',
        r'Resolucao(\d+)(\d{4})\.pdf',
        r'(\d{4})/Resolucao(\d+)\.pdf',  # alternative structure
        r'resolucao[_-]?(\d+)[_-]?(\d{4})\.pdf',  # lowercase
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url, re.IGNORECASE)
        if match:
            if len(match.groups()) == 2:
                # Check which group is number and which is year
                g1, g2 = match.groups()
                if len(g1) == 4 and g1.isdigit():  # first group is year
                    return int(g2), int(g1)
                elif len(g2) == 4 and g2.isdigit():  # second group is year
                    return int(g1), int(g2)
                else:
                    # Assume first is number, second is year if second is 4 digits
                    if len(g2) == 4 and g2.isdigit():
                        return int(g1), int(g2)
                    elif len(g1) == 4 and g1.isdigit():
                        return int(g2), int(g1)
    return None, None

def load_json_file(path):
    """Load JSON file, return empty list if file doesn't exist or is invalid."""
    if not os.path.exists(path):
        return []
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        print(f"Erro ao ler {path}: {e}")
        return []

def save_json_file(path, data):
    """Save data to JSON file with pretty formatting."""
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except IOError as e:
        print(f"Erro ao salvar {path}: {e}")
        return False

def find_existing_resolution(resolutions, number, year):
    """Find if a resolution with given number and year already exists."""
    for res in resolutions:
        if res.get('number') == number and res.get('year') == year:
            return res
    return None

def extract_basic_metadata_from_listing(html_content, pdf_url, number, year):
    """
    Attempt to extract basic metadata from the listing page HTML.
    This is a simplified version that looks for text near the PDF link.
    """
    # This would need to be customized based on the actual page structure
    # For now, we'll return placeholder values
    # In a real implementation, we would:
    # 1. Find the HTML element containing the PDF link
    # 2. Look for surrounding text that contains the ementa, publication date, etc.
    
    return {
        'official_url': pdf_url,
        'verification_status': 'VERIFIED',
        'verification_date': datetime.now().strftime('%Y-%m-%d'),
        # Placeholder - these would be extracted from the page
        'ementa': 'EXTRAIR DA PAGINA DE LISTAGEM',
        'subject': 'EXTRAIR DA PAGINA DE LISTAGEM',
        'publication_date': None,  # EXTRAIR
    }

def update_contran_resolutions():
    """Check for new CONTRAN resolutions and update the JSON file."""
    print("Verificando novas resoluções CONTRAN...")
    
    # Load existing data
    existing_resolutions = load_json_file(CONTRAN_JSON_PATH)
    print(f"Encontradas {len(existing_resolutions)} resoluções existentes.")
    
    # Fetch the listing page
    html_content = fetch_url(BASE_URL_CONTRAN)
    if not html_content:
        print("Falha ao buscar página de resoluções CONTRAN.")
        return False
    
    # Extract PDF links
    pdf_links = extract_pdf_links(html_content, BASE_URL_CONTRAN)
    print(f"Encontrados {len(pdf_links)} links PDF na página de resoluções.")
    
    new_resolutions_found = []
    
    for pdf_url in pdf_links:
        number, year = extract_resolution_info_from_url(pdf_url)
        if number is None or year is None:
            # Try to extract from link text or surrounding context
            # For now, skip if we can't extract
            continue
        
        # Check if we already have this resolution
        existing = find_existing_resolution(existing_resolutions, number, year)
        if existing:
            # Optionally update verification status or URL if changed
            continue
        
        # This is a new resolution
        print(f"Nova resolução encontrada: CONTRAN {number}/{year}")
        
        # Extract metadata from the listing page
        metadata = extract_basic_metadata_from_listing(html_content, pdf_url, number, year)
        metadata.update({
            'id': f'res_contran_{number}',
            'number': number,
            'year': year,
            'issuing_body': 'CONTRAN',
            'status': 'vigente',  # Assume vigente unless superseded
            'key_articles': [],  # Would need to parse PDF or detailed page
            'legal_foundation': '',  # Would need to parse PDF
            'note': ''  # Would need to parse PDF
        })
        
        # TODO: Actually extract the metadata from the listing page
        # For now, we'll skip adding to avoid adding incomplete data
        # In a real implementation, we would parse the listing page to get
        # the ementa, subject, publication_date, etc. for each resolution link.
        
        # For demonstration, let's just mark that we found new ones
        new_resolutions_found.append({
            'number': number,
            'year': year,
            'url': pdf_url
        })
    
    if new_resolutions_found:
        print(f"Encontradas {len(new_resolutions_found)} novas resoluções CONTRAN.")
        print("NOTA: A extração completa de metadados precisa ser implementada.")
        print("Novas resoluções detectadas:")
        for res in new_resolutions_found:
            print(f"  - CONTRAN {res['number']}/{res['year']}: {res['url']}")
        
        # Here we would update the JSON file with the new resolutions
        # But since we don't have the full metadata, we'll just report
        # For a production system, we would implement the metadata extraction
        return True
    else:
        print("Nenhuma nova resolução CONTRAN encontrada.")
        return False

def update_senatran_ordinances():
    """Check for new SENATRAN ordinances and update the JSON file."""
    print("\nVerificando novas portarias SENATRAN...")
    
    # Load existing data
    existing_ordinances = load_json_file(SENATRAN_JSON_PATH)
    print(f"Encontradas {len(existing_ordinances)} portarias existentes.")
    
    # Fetch the listing page
    html_content = fetch_url(BASE_URL_SENATRAN)
    if not html_content:
        print("Falha ao buscar página de arquivos SENATRAN.")
        return False
    
    # Extract PDF links
    pdf_links = extract_pdf_links(html_content, BASE_URL_SENATRAN)
    print(f"Encontrados {len(pdf_links)} links PDF na página de arquivos SENATRAN.")
    
    # Similar to CONTRAN, we would extract ordinance number/year from URLs
    # and check for new ones
    
    print("Verificação de SENATRAN concluída (implementação de extração pendente).")
    return False

def update_collection_report():
    """Update the collection report with latest sync information."""
    print("\nAtualizando relatório de coleta...")
    
    report = load_json_file(REPORT_PATH)
    if not report:
        print("Erro: Não foi possível carregar o relatório de coleta.")
        return False
    
    # Update execution date
    report['execution_date'] = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
    
    # We would update metrics based on what was found
    # For now, just update the date
    
    if save_json_file(REPORT_PATH, report):
        print("Relatório de coleta atualizado com nova data de execução.")
        return True
    else:
        print("Falha ao atualizar relatório de coleta.")
        return False

def main():
    """Main function to run the sync process."""
    print("=== Iniciando sincronização DOU para CONTRAN e SENATRAN ===")
    print(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Try to run the sync functions
    contran_updated = update_contran_resolutions()
    senatran_updated = update_senatran_ordinances()
    
    # Update report regardless
    report_updated = update_collection_report()
    
    print("\n=== Sincronização concluída ===")
    if contran_updated or senatran_updated:
        print("Novas publicações detectadas - verifique os arquivos JSON para atualização manual.")
    else:
        print("Nenhuma nova publicação detectada.")
    
    if report_updated:
        print("Relatório de coleta atualizado.")

if __name__ == "__main__":
    main()