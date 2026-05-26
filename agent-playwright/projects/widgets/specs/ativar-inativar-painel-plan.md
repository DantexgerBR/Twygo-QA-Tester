# Ativar / Inativar painel — Plano de testes

## Application Overview

Testsuite "Ativar / Inativar painel" do projeto widgets (Twygo). Cobre 5 testcases que validam o comportamento do switch de ativação/inativação de painéis na aba Painéis (`/o/36988/use_modes?tab=panels-tab`): inativação direta (TC1), reativação (TC2), bloqueio modal por vinculação a menu (TC3 — falha intencional por bug de servidor), bloqueio ao reativar menu vinculado a painel inativo (TC4 — fixme legítimo, seed ausente), e persistência de estado após reload (TC5). Todos os specs usam auto-seed (beforeAll/afterAll via PaineisListPage) e storageState global. Org: staging-widgets (orgId 36988, widgets.stage.twygoead.com). Feature flag habilitar_paineis_do_usuario ATIVA. Use modes seedados: 70077 (Colaborador) e 70078 (Aluno).

## Test Scenarios

### 1. Ativar / Inativar painel

**Seed:** `tests/seed.spec.ts`

#### 1.1. Inativar um painel não associado a nenhum modo de uso

**File:** `projects/widgets/tests/features/ativar-inativar-painel/inativar-painel-nao-associado.spec.ts`

**Steps:**
  1. SETUP — Status do contrato: Módulo Widgets habilitado, feature flag habilitar_paineis_do_usuario ATIVA, orgId 36988 (staging-widgets). Use modes seedados: 70077 (Colaborador) e 70078 (Aluno). Gestão de Painéis habilitada no contrato.
  2. PRECONDITIONS (XML literal): Ambiente Stage configurado · Funcionalidade 'Gestão de Painéis' habilitada no contrato · Feature flag 'habilitar_paineis_do_usuario' ativa · Usuário logado como Admin · Existe painel 'Painel QA Teste' cadastrado e ativo, sem associação com modo de uso. ESTRATÉGIA AUTO-SEED: beforeAll cria painel próprio via paineisListPage.createPanel({ name: `Painel Inativar TC1 w${workerIndex}-${Date.now()}` }); painel nasce sem associação a nenhum modo de uso. afterAll: paineisListPage.deletePanelByNameSafe(panelName).
  3. DATA FILE (adjacente ao spec): inativar-painel-nao-associado.data.ts exporta { useModeIds: [70077, 70078] as const }. Spec importa como `import { data } from './inativar-painel-nao-associado.data.js'`.
  4. ALLURE ANNOTATIONS (1ª linha do test()): await allure.epic('Twygo - Widgets'); await allure.feature('Ativar / Inativar painel'); await allure.story('Inativar um painel não associado a nenhum modo de uso'); await allure.severity('critical'); await allure.label('executionType', 'automated');
  5. Step 1 — Acessar a aba 'Painéis' em Configurações > Menu: await paineisListPage.goToList(); (navega para /o/${getOrgId()}/use_modes?tab=panels-tab)
    - expect: Listagem é exibida: await expect(paineisListPage.getRowByName(panelName)).toBeVisible(). Switch do painel criado no beforeAll está ligado (ativo): await expect(paineisListPage.getActiveStateByName(panelName)).toBe('ativo')
  6. Step 2 — Clicar no switch da coluna 'Ativo' na linha do painel: await paineisListPage.toggleActiveByName(panelName); (usa o label.chakra-switch clicável, não o input diretamente — seletor: label[data-test-id=`panel-situation-{id}`] ou label.chakra-switch:has(> input#panel-situation-{id}))
    - expect: Switch fica desligado imediatamente: await expect(paineisListPage.getRowActiveSwitchByName(panelName)).not.toBeChecked()
    - expect: Estado 'Inativo' é persistido — verificar via getActiveStateByName: await expect(paineisListPage.getActiveStateByName(panelName)).toBe('inativo')
  7. Step 3 — Recarregar a página: await page.reload(); await paineisListPage.goToList();
    - expect: Painel permanece com switch desligado após reload: await expect(paineisListPage.getRowActiveSwitchByName(panelName)).not.toBeChecked()
    - expect: getActiveStateByName retorna 'inativo': await expect(paineisListPage.getActiveStateByName(panelName)).toBe('inativo')

#### 1.2. Ativar um painel previamente inativo

**File:** `projects/widgets/tests/features/ativar-inativar-painel/ativar-painel-previamente-inativo.spec.ts`

**Steps:**
  1. SETUP — Status do contrato: idem TC1. Módulo Widgets habilitado, feature flag ativa, orgId 36988.
  2. PRECONDITIONS (XML literal): Ambiente Stage configurado · Funcionalidade 'Gestão de Painéis' habilitada no contrato · Feature flag 'habilitar_paineis_do_usuario' ativa · Usuário logado como Admin · Existe painel 'Painel QA Teste' cadastrado e inativo. ESTRATÉGIA AUTO-SEED: beforeAll cria painel via paineisListPage.createPanel({ name: `Painel Ativar TC2 w${workerIndex}-${Date.now()}` }), depois garante que está inativo via paineisListPage.ensureInactive(panelName). afterAll: paineisListPage.deletePanelByNameSafe(panelName).
  3. DATA FILE (adjacente ao spec): ativar-painel-previamente-inativo.data.ts exporta { useModeIds: [70077, 70078] as const }.
  4. ALLURE ANNOTATIONS (1ª linha do test()): await allure.epic('Twygo - Widgets'); await allure.feature('Ativar / Inativar painel'); await allure.story('Ativar um painel previamente inativo'); await allure.severity('critical'); await allure.label('executionType', 'automated');
  5. Step 1 — Acessar a aba 'Painéis' em Configurações > Menu: await paineisListPage.goToList();
    - expect: Listagem é exibida: await expect(paineisListPage.getRowByName(panelName)).toBeVisible()
    - expect: Painel está inativo no beforeAll: await expect(paineisListPage.getActiveStateByName(panelName)).toBe('inativo')
  6. Step 2 — Clicar no switch da coluna 'Ativo' na linha do painel inativo: await paineisListPage.toggleActiveByName(panelName);
    - expect: Switch fica ligado: await expect(paineisListPage.getRowActiveSwitchByName(panelName)).toBeChecked()
    - expect: Estado 'Ativo' é persistido: await expect(paineisListPage.getActiveStateByName(panelName)).toBe('ativo')

#### 1.3. Tentar inativar painel associado a um ou mais modos de uso

**File:** `projects/widgets/tests/features/ativar-inativar-painel/tentar-inativar-painel-associado.spec.ts`

**Steps:**
  1. SETUP — Status do contrato: idem TC1. 2 use modes seedados: 70077 (Colaborador), 70078 (Aluno).
  2. PRECONDITIONS (XML literal): Ambiente Stage configurado · Funcionalidade 'Gestão de Painéis' habilitada no contrato · Feature flag 'habilitar_paineis_do_usuario' ativa · Usuário logado como Admin · Existe painel 'Painel Vinculado' associado a 2 menus de modos de uso ativos. ESTRATÉGIA AUTO-SEED: beforeAll cria painel via paineisListPage.createPanel({ name: `Painel Vinculado TC3 w${workerIndex}-${Date.now()}` }), depois associa a AMBOS os use modes via paineisListPage.associatePanelToMenu(panelName, 70077) e paineisListPage.associatePanelToMenu(panelName, 70078). afterAll: paineisListPage.disassociatePanelFromMenu_safe(panelName, 70077); paineisListPage.disassociatePanelFromMenu_safe(panelName, 70078); paineisListPage.deletePanelByNameSafe(panelName).
  3. DATA FILE (adjacente ao spec): tentar-inativar-painel-associado.data.ts exporta { useModeIds: [70077, 70078] as const, inactivationBlockedModalConfirmTestId: 'panel-in-use-modal-confirm' as const }.
  4. BUG DE SERVIDOR — FALHA INTENCIONAL (NÃO usar test.fixme): Após o auto-seed associar painel↔menu, GET /panels/{id}/linked_menus retorna 500 (NoMethodError em app/models/use_mode_item.rb#title_for — commit 6461dbf499, 06/05/2026). UI trata 500 como 'sem menus vinculados' → inativa diretamente sem exibir o modal. Asserção toBeVisible(modal) FALHA por timeout — isso é ESPERADO e INTENCIONAL para sinalizar o bug ao dev. Comentário marcado // FAILING-BY-PRODUCT-BUG deve estar no topo do spec. Fix sugerido upstream: usar &.title no find, OU criar translation pt-BR no POST de use_mode_itens.
  5. ALLURE ANNOTATIONS (1ª linha do test()): await allure.epic('Twygo - Widgets'); await allure.feature('Ativar / Inativar painel'); await allure.story('Tentar inativar painel associado a um ou mais modos de uso'); await allure.severity('critical'); await allure.label('executionType', 'automated');
  6. Step 1 — Acessar a aba 'Painéis' em Configurações > Menu: await paineisListPage.goToList();
    - expect: Listagem é exibida: await expect(paineisListPage.getRowByName(panelName)).toBeVisible()
    - expect: Painel está ativo (foi associado no beforeAll): await expect(paineisListPage.getActiveStateByName(panelName)).toBe('ativo')
  7. Step 2 — Clicar no switch da coluna 'Ativo' na linha do painel vinculado: await paineisListPage.toggleActiveByName(panelName);
    - expect: Modal informativo 'Painel em uso' é exibido (container: .chakra-modal__content com botão [data-test-id='panel-in-use-modal-confirm']): await expect(paineisListPage.getInactivationBlockedModal()).toBeVisible()
    - expect: Título do modal é 'Painel em uso': await expect(paineisListPage.getInactivationBlockedModalTitle()).toContainText('Painel em uso')
    - expect: Corpo do modal lista os menus vinculados: await expect(paineisListPage.getInactivationBlockedModalBody()).toContainText('Não é possível desabilitar')
    - expect: NOTA: esta asserção FALHA por timeout enquanto bug 500 existir (GET /panels/{id}/linked_menus retorna 500)
  8. Step 3 — Clicar no botão 'Fechar'/'Entendi' do modal: await paineisListPage.closeInactivationBlockedModal(); (usa data-test-id='panel-in-use-modal-confirm')
    - expect: Modal é fechado: await expect(paineisListPage.getInactivationBlockedModal()).toBeHidden()
    - expect: Switch permanece ligado (painel continua ativo): await expect(paineisListPage.getRowActiveSwitchByName(panelName)).toBeChecked()

#### 1.4. Tentar reativar modo de uso vinculado a um painel inativo

**File:** `projects/widgets/tests/features/ativar-inativar-painel/tentar-reativar-modo-uso-painel-inativo.spec.ts`

**Steps:**
  1. SETUP — Status do contrato: idem TC1. Use modes: 70077 (Colaborador), 70078 (Aluno).
  2. PRECONDITIONS (XML literal): Ambiente Stage configurado · Funcionalidade 'Gestão de Painéis' habilitada no contrato · Feature flag 'habilitar_paineis_do_usuario' ativa · Usuário logado como Admin · Existe menu de modo de uso vinculado ao painel 'Painel QA Teste' que está inativo · Menu está inativo. FIXME LEGÍTIMO (categoria §7.6: seed ausente — destinatário QA Lead): cenário composto exige simultaneamente (a) painel inativo, (b) menu de modo de uso vinculado a esse painel, (c) esse menu também inativo. Auto-seed determinístico desse estado depende do bug do TC3 ser corrigido primeiro (GET /panels/{id}/linked_menus retornando 500 impede associação verificável). Spec usa test.fixme(true, '<razão completa>') no BODY do test, NUNCA a forma declarativa test.fixme('título', fn).
  3. DATA FILE (adjacente ao spec): tentar-reativar-modo-uso-painel-inativo.data.ts exporta { useModeId: 70077 as const, useModeIdAluno: 70078 as const }.
  4. ALLURE ANNOTATIONS (1ª linha do test()): await allure.epic('Twygo - Widgets'); await allure.feature('Ativar / Inativar painel'); await allure.story('Tentar reativar modo de uso vinculado a um painel inativo'); await allure.severity('critical'); await allure.label('executionType', 'automated');
  5. test.fixme(true, 'Seed ausente: cenário composto (painel inativo + menu vinculado ao mesmo painel + menu inativo) não tem auto-seed determinístico. Depende da correção do bug GET /panels/{id}/linked_menus 500 (TC3) para que a associação painel→menu seja verificável antes de inativar o painel. Destinatário: QA Lead — criar seed manual ou aguardar fix do TC3.') — inserir como 1ª instrução no body do test(), após as annotations Allure.
  6. Step 1 (TODO — executar quando seed disponível) — Acessar Menu > Modos de uso: await paineisListPage.goToModosDeUso(); (navega para /o/${getOrgId()}/use_modes?tab=list-tab)
    - expect: Tela de Modos de uso é exibida: await expect(page).toHaveURL(/use_modes.*tab=list-tab/)
  7. Step 2 (TODO) — Clicar no switch de ativação do menu vinculado ao painel inativo: identificar linha do menu via paineisListPage.getModoDeUsoRowByName(useModeMenuName); clicar no switch #menu-enabled-{menuId} dentro da sub-tab items do modo de uso.
    - expect: Modal informativo é exibido informando que o painel está inativo: await expect(paineisListPage.getBlockedModal()).toBeVisible()
    - expect: Título do modal confirma bloqueio: await expect(paineisListPage.getBlockedModalTitle()).toContainText('// REVISAR: texto exato do modal R15 RN93 não confirmado no recon')
  8. Step 3 (TODO) — Clicar no botão 'Fechar' do modal: await paineisListPage.closeBlockedModal();
    - expect: Modal é fechado: await expect(paineisListPage.getBlockedModal()).toBeHidden()
    - expect: Menu permanece inativo após fechar modal

#### 1.5. Verificar persistência do estado Ativo após reload

**File:** `projects/widgets/tests/features/ativar-inativar-painel/verificar-persistencia-estado-ativo.spec.ts`

**Steps:**
  1. SETUP — Status do contrato: idem TC1. Módulo Widgets habilitado, feature flag ativa, orgId 36988.
  2. PRECONDITIONS (XML literal): Ambiente Stage configurado · Funcionalidade 'Gestão de Painéis' habilitada no contrato · Feature flag 'habilitar_paineis_do_usuario' ativa · Usuário logado como Admin · Existem painéis ativos e inativos. ESTRATÉGIA AUTO-SEED: beforeAll cria painel via paineisListPage.createPanel({ name: `Painel Persistencia TC5 w${workerIndex}-${Date.now()}` }); painel nasce ativo por padrão. afterAll: paineisListPage.deletePanelByNameSafe(panelName). Cenário usa painel no estado oposto ao inicial (começa ativo, toggled para inativo, verifica persistência; OU começa inativo via ensureInactive, toggled para ativo, verifica persistência — escolher o que for mais determinístico no beforeAll).
  3. DATA FILE (adjacente ao spec): verificar-persistencia-estado-ativo.data.ts exporta { useModeIds: [70077, 70078] as const }.
  4. ALLURE ANNOTATIONS (1ª linha do test()): await allure.epic('Twygo - Widgets'); await allure.feature('Ativar / Inativar painel'); await allure.story('Verificar persistência do estado Ativo após reload'); await allure.severity('normal'); await allure.label('executionType', 'automated');
  5. Step 1 — Acessar a aba 'Painéis' em Configurações > Menu: await paineisListPage.goToList();
    - expect: Listagem é exibida: await expect(paineisListPage.getRowByName(panelName)).toBeVisible()
  6. Step 2 — Alterar o switch 'Ativo' de um painel para o estado oposto: const estadoAntes = await paineisListPage.getActiveStateByName(panelName); await paineisListPage.toggleActiveByName(panelName);
    - expect: Switch reflete o novo estado (oposto ao estadoAntes): se estadoAntes era 'ativo', await expect(paineisListPage.getRowActiveSwitchByName(panelName)).not.toBeChecked(); se era 'inativo', await expect(paineisListPage.getRowActiveSwitchByName(panelName)).toBeChecked()
  7. Step 3 — Recarregar a página (F5): await page.reload(); (equivalente a F5 conforme prosa XML)
    - expect: Listagem é recarregada: await expect(paineisListPage.getRowByName(panelName)).toBeVisible()
    - expect: Switch mantém o estado alterado após reload: estado após reload === estado capturado no step 2
