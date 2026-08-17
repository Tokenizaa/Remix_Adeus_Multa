# FASE 7: USER AREA + COMPONENTES COMPARTILHADOS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all tasks for FASE 7 to share components between user and admin areas, consolidate views, update sidebar, remove obsolete language, delete obsolete views, and complete user/admin flow testing.

**Architecture:** 
- Share existing components in src/components/shared between user and admin areas
- Consolidate duplicate views into tabbed interfaces
- Update navigation to reflect consolidated views
- Remove obsolete terminology and views
- Complete end-to-end testing of user and admin flows

**Tech Stack:** React, TypeScript, Lucide Icons, Context API

## Global Constraints
- Preserve existing functionality - no downgrades allowed
- All changes must be backward compatible where possible
- Follow existing code patterns and conventions
- Maintain clean, readable code with proper error handling
- Zero secrets in frontend code
- All tests must pass before considering work complete

---

### Task 7.1: CasesTable compartilhado (user + admin)

**Files:**
- Modify: `src/components/admin/AdminCasesListView.tsx` to use shared CasesTable
- Modify: `src/components/cases/CasesListView.tsx` to use shared CasesTable  
- Modify: `src/components/shared/CasesTable.tsx` (if needed to support both variants)

**Interfaces:**
- Consumes: CasesTable component from shared
- Produces: Unified cases table component usable in both user and admin contexts

- [ ] **Step 1: Analyze current AdminCasesListView and CasesListView implementations**
  - Examine how tables are currently implemented in both files
  - Identify differences in functionality that need to be preserved

- [ ] **Step 2: Update AdminCasesListView to use shared CasesTable**
  - Replace custom table implementation with CasesTable component
  - Map admin-specific props to CasesTable variant='admin'
  - Preserve all existing functionality (search, filters, badges, etc.)

- [ ] **Step 3: Update CasesListView to use shared CasesTable**
  - Replace custom table implementation with CasesTable component  
  - Map user-specific props to CasesTable variant='user'
  - Preserve all existing functionality

- [ ] **Step 4: Enhance CasesTable component if needed**
  - Ensure it supports both 'user' and 'admin' variants properly
  - Add any missing props or functionality required by both contexts
  - Maintain backward compatibility

- [ ] **Step 5: Verify implementation**
  - Check that both admin and user cases pages display correctly
  - Confirm all existing functionality works (search, filters, navigation, etc.)
  - Ensure responsive design works on different screen sizes

- [ ] **Step 6: Commit changes**
```bash
git add src/components/admin/AdminCasesListView.tsx src/components/cases/CasesListView.tsx src/components/shared/CasesTable.tsx
git commit -m "feat: share CasesTable component between user and admin areas"
```

### Task 7.2: CaseDetailBase compartilhado (user + admin)

**Files:**
- Modify: `src/components/admin/AdminCaseDetailView.tsx` to use shared CaseDetailBase
- Modify: `src/components/cases/CaseDetailView.tsx` to use shared CaseDetailBase
- Modify: `src/components/shared/CaseDetailBase.tsx` (if needed to support both variants)

**Interfaces:**
- Consumes: CaseDetailBase component from shared
- Produces: Unified case detail base component usable in both user and admin contexts

- [ ] **Step 1: Analyze current AdminCaseDetailView and CaseDetailView implementations**
  - Examine how case details are currently implemented in both files
  - Identify differences in functionality that need to be preserved

- [ ] **Step 2: Update AdminCaseDetailView to use shared CaseDetailBase**
  - Replace custom detail implementation with CaseDetailBase component
  - Map admin-specific props and callbacks appropriately
  - Preserve all existing functionality (actions, tabs, etc.)

- [ ] **Step 3: Update CaseDetailView to use shared CaseDetailBase**
  - Replace custom detail implementation with CaseDetailBase component
  - Map user-specific props and callbacks appropriately
  - Preserve all existing functionality

- [ ] **Step 4: Enhance CaseDetailBase component if needed**
  - Ensure it supports both user and admin contexts properly
  - Add any missing props or functionality required by both contexts
  - Maintain backward compatibility

- [ ] **Step 5: Verify implementation**
  - Check that both admin and user case detail pages display correctly
  - Confirm all existing functionality works (tabs, actions, navigation, etc.)
  - Ensure data loading and error handling works properly

- [ ] **Step 6: Commit changes**
```bash
git add src/components/admin/AdminCaseDetailView.tsx src/components/cases/CaseDetailView.tsx src/components/shared/CaseDetailBase.tsx
git commit -m "feat: share CaseDetailBase component between user and admin areas"
```

### Task 7.3: AdminAuditView — merge AdminLogsView + AuditLogsView

**Files:**
- Modify: `src/components/admin/AdminAuditView.tsx` (ensure proper merge)
- Remove: `src/components/admin/AdminLogsView.tsx` (if exists)
- Remove: `src/components/audit/AuditLogsView.tsx` (if exists)
- Update: `src/App.tsx` to remove imports of deleted views

**Interfaces:**
- Consumes: None (consolidating existing views)
- Produces: Single unified audit view with system and audit logs tabs

- [ ] **Step 1: Verify AdminLogsView and AuditLogsView files exist**
  - Check if `src/components/admin/AdminLogsView.tsx` exists
  - Check if `src/components/audit/AuditLogsView.tsx` exists
  - If they don't exist, verify AdminAuditView already contains merged functionality

- [ ] **Step 2: Examine AdminAuditView implementation**
  - Confirm it properly handles both system logs and audit logs
  - Verify tab switching works correctly
  - Check that all necessary functionality from both views is present

- [ ] **Step 3: If separate view files exist, merge them into AdminAuditView**
  - Extract unique functionality from AdminLogsView and AuditLogsView
  - Integrate into AdminAuditView while preserving all features
  - Ensure proper state management and API calls

- [ ] **Step 4: Remove obsolete view files**
  - Delete AdminLogsView.tsx if it exists
  - Delete AuditLogsView.tsx if it exists

- [ ] **Step 5: Update App.tsx imports**
  - Remove imports for deleted view files
  - Ensure AdminAuditView import remains

- [ ] **Step 6: Verify implementation**
  - Check that admin audit page loads correctly
  - Confirm both system logs and audit logs tabs work
  - Verify all functionality (search, filters, refresh, etc.) works for both tabs

- [ ] **Step 7: Commit changes**
```bash
git add src/components/admin/AdminAuditView.tsx src/App.tsx
# Add deleted files if they existed
git commit -m "feat: merge AdminLogsView and AuditLogsView into AdminAuditView"
```

### Task 7.4: Consolidar /perfil + /configuracoes → UserSettingsView (tabs)

**Files:**
- Remove: `src/components/user/UserProfileView.tsx` (if exists)
- Modify: `src/components/user/UserSettingsView.tsx` (ensure proper tab consolidation)
- Update: `src/App.tsx` to remove UserProfileView import if removed
- Update: `src/components/layout/UserSidebar.tsx` (if needed)

**Interfaces:**
- Consumes: None (consolidating existing views)
- Produces: Single unified user settings view with profile, settings, and privacy tabs

- [ ] **Step 1: Verify UserProfileView file exists**
  - Check if `src/components/user/UserProfileView.tsx` exists
  - If it doesn't exist, verify UserSettingsView already contains profile functionality

- [ ] **Step 2: Examine UserSettingsView implementation**
  - Confirm it already has tabs for profile, settings, and privacy (as seen in code)
  - Verify profile tab contains all necessary profile fields
  - Verify settings tab contains all necessary settings options
  - Check that tab switching works correctly

- [ ] **Step 3: If separate view files exist, merge them into UserSettingsView**
  - Extract profile functionality from UserProfileView
  - Integrate into UserSettingsView profile tab while preserving all features
  - Extract settings functionality from any separate config view
  - Integrate into UserSettingsView settings tab while preserving all features

- [ ] **Step 4: Remove obsolete view files**
  - Delete UserProfileView.tsx if it exists
  - Delete any separate configuration view file if it exists

- [ ] **Step 5: Update App.tsx imports**
  - Remove imports for deleted view files
  - Ensure UserSettingsView import remains

- [ ] **Step 6: Update UserSidebar if needed**
  - Verify the sidebar correctly navigates to consolidated view
  - Update path if necessary (should already point to /perfil which shows UserSettingsView)

- [ ] **Step 7: Verify implementation**
  - Check that user profile page loads correctly (navigating to /perfil)
  - Confirm user settings page loads correctly (navigating to /configuracoes if route exists)
  - Verify both tabs display correct content and functionality
  - Ensure form submission and validation works for both profile and settings

- [ ] **Step 8: Commit changes**
```bash
git add src/components/user/UserSettingsView.tsx src/App.tsx src/components/layout/UserSidebar.tsx
# Add deleted files if they existed
git commit -m "feat: consolidate profile and settings views into UserSettingsView with tabs"
```

### Task 7.5: Atualizar UserSidebar — 3 itens + CTA "Nova Análise"

**Files:**
- Modify: `src/components/layout/UserSidebar.tsx`

**Interfaces:**
- Consumes: None (modifying existing sidebar)
- Produces: Updated user sidebar with 3 navigation items + CTA button

- [ ] **Step 1: Analyze current UserSidebar implementation**
  - Verify current nav items:
    1. Painel do Cidadão → /dashboard
    2. Meus Recursos → /cases
    3. Minhas Configurações → /perfil (shows consolidated UserSettingsView)
  - Verify CTA button exists for "Nova Análise" → /novo-caso

- [ ] **Step 2: Make any necessary adjustments**
  - Ensure labels, icons, and paths are correct
  - Verify badge functionality works correctly on Meus Recursos item
  - Confirm CTA button properly navigates to case creation flow

- [ ] **Step 3: Verify implementation**
  - Check that sidebar renders correctly
  - Confirm all navigation items work and highlight appropriately
  - Verify CTA button navigates to correct case creation page
  - Ensure responsive behavior works on different screen sizes

- [ ] **Step 4: Commit changes**
```bash
git add src/components/layout/UserSidebar.tsx
git commit -m "feat: update user sidebar with 3 nav items + Nova Análise CTA"
```

### Task 7.6: Remover linguagem "acompanhamento humano" / "advogado"

**Files:**
- Modify: Various files where these terms appear

**Interfaces:**
- Consumes: None (removing text from existing components)
- Produces: Codebase with obsolete terminology removed

- [ ] **Step 1: Search for "acompanhamento humano" in codebase**
```bash
grep -r "acompanhamento humano" src/
```
  - Document all locations where this term appears
  - Determine appropriate replacement or removal for each instance

- [ ] **Step 2: Search for "advogado" in codebase**
```bash
grep -r "advogado" src/
```
  - Document all locations where this term appears
  - Determine appropriate replacement or removal for each instance

- [ ] **Step 3: Remove or replace terminology**
  - For each instance found, either:
    * Remove the text entirely if it's obsolete
    * Replace with appropriate terminology if needed for functionality
    * Update surrounding context as needed

- [ ] **Step 4: Verify changes**
  - Confirm no instances of "acompanhamento humano" remain
  - Confirm no instances of "advogado" remain (unless intentionally kept for specific reasons)
  - Verify UI still displays correctly and all functionality works

- [ ] **Step 5: Commit changes**
```bash
git add $(git ls-files -m | grep -E "\.(tsx|ts|js|json|md)$")
git commit -m "feat: remove obsolete terminology 'acompanhamento humano' and 'advogado'"
```

### Task 7.7: Deletar views obsoletas

**Files:**
- Remove: Obsolete view files as identified

**Interfaces:**
- Consumes: None (removing obsolete files)
- Produces: Cleaner codebase with obsolete views removed

- [ ] **Step 1: Identify obsolete views**
  - Based on previous tasks, identify views that were consolidated or replaced
  - Check for any other views that appear to be unused or duplicated
  - Verify views are not referenced anywhere before deletion

- [ ] **Step 2: Delete obsolete view files**
  - Remove identified obsolete view files
  - Common candidates might include:
    * Separate profile/view files that were consolidated
    * Separate config/view files that were consolidated
    * Duplicate admin views that were merged
    * Any other clearly obsolete components

- [ ] **Step 3: Update imports**
  - Check files that might import the deleted views
  - Remove or update those imports as necessary
  - Pay special attention to App.tsx and route definitions

- [ ] **Step 4: Verify implementation**
  - Confirm application still builds and runs correctly
  - Verify all navigation and functionality still works
  - Ensure no broken references or missing components

- [ ] **Step 5: Commit changes**
```bash
git rm path/to/obsolete/View1.tsx path/to/obsolete/View2.tsx
git add $(git ls-files -m | grep -E "\.(tsx|ts|js|json|md)$")
git commit -m "feat: delete obsolete views"
```

### Task 7.8: Testes: User flow completo, Admin flow completo

**Files:**
- Modify: Test files as needed
- Create: New test files if necessary

**Interfaces:**
- Consumes: Application code
- Produces: Comprehensive test coverage for user and admin flows

- [ ] **Step 1: Analyze existing test coverage**
  - Check what user flow tests already exist
  - Check what admin flow tests already exist
  - Identify gaps in coverage

- [ ] **Step 2: Create/user flow tests**
  - Test complete user journey: login → dashboard → cases → case detail → profile/settings → logout
  - Test profile creation and editing
  - Test settings modification
  - Test case viewing and interaction

- [ ] **Step 3: Create/admin flow tests**
  - Test complete admin journey: login → admin dashboard → cases → case detail → users → logs → settings → logout
  - Test user management
  - Test case administration
  - Test log viewing and filtering
  - Test system monitoring functions

- [ ] **Step 4: Run tests and verify**
  - Execute all user flow tests and confirm they pass
  - Execute all admin flow tests and confirm they pass
  - Fix any failing tests and retest

- [ ] **Step 5: Commit changes**
```bash
git add path/to/tests/
git commit -m "feat: implement complete user and admin flow tests"
```

## Plan Complete

**Plan complete and saved to `docs/superpowers/plans/2026-08-17-fase7-user-area-shared-components.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**