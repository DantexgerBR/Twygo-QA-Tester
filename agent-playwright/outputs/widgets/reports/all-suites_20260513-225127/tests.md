# Casos de teste — Widgets

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Adicionar widgets

_11 caso(s) — 10 aprovado(s), 1 falha(s)_

### ✅ Aprovado · TC1 · Abrir drawer de widgets disponíveis · 🔴 Crítico

<a id="abrir-drawer-de-widgets-disponiveis"></a>_Arquivo:_ `abrir-drawer-widgets.spec.ts` · _Duração:_ 11.01s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar abertura do drawer (R9 RN66, RN67).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba selecionada
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir Layouts | — | ✅ | — | 8.94s |
| 1 | Acessar a aba 'Layouts' do painel em edição | Layout é exibido | ✅ | — | 0.19s |
| 2 | Clicar no botão '+ Adicionar widget' da toolbar | Drawer lateral é aberto com título 'Widgets disponíveis' | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC11 · Adicionar múltiplos widgets em sequência · 🔴 Crítico

<a id="adicionar-multiplos-widgets-em-sequencia"></a>_Arquivo:_ `adicionar-multiplos-widgets-sequencia.spec.ts` · _Duração:_ 16.13s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar empilhamento e cálculo de próxima posição.

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba 'Nova aba' vazia
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir Layouts | — | ✅ | — | 8.99s |
| — | _Pré-condição:_ Adicionar widget 1: Resumo de atividades | — | ✅ | — | 1.68s |
| — | _Pré-condição:_ Adicionar widget 2: Conteúdos em andamento | — | ✅ | — | 0.91s |
| — | _Pré-condição:_ Adicionar widget 3: Ranking | — | ✅ | — | 0.93s |
| — | _Pré-condição:_ Adicionar widget 4: Meus certificados | — | ✅ | — | 0.97s |
| — | _Pré-condição:_ Validar total final de 4 widgets | — | ✅ | — | 0.02s |
| 1 | Abrir o drawer de widgets disponíveis | Drawer é exibido | ✅ | — | — |
| 2 | Clicar no widget 'Resumo das atividades' | Widget é adicionado e ocupa a primeira posição do grid | ✅ | — | — |
| 3 | Clicar no widget 'Conteúdos em andamento' | Widget é adicionado e posicionado abaixo/à direita do anterior conforme próxima posição calculada | ✅ | — | — |
| 4 | Clicar no widget 'Meus certificados' | Widget é adicionado e posicionado na próxima posição disponível | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC8 · Adicionar widget 'Conteúdos em andamento' · 🔴 Crítico

<a id="adicionar-widget-conteudos-em-andamento"></a>_Arquivo:_ `adicionar-widget-conteudos-andamento.spec.ts` · _Duração:_ 13.32s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar adição com largura padrão (R9 RN83.1).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba 'Nova aba' vazia
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir Layouts | — | ✅ | — | 8.85s |
| 1 | Abrir o drawer de widgets disponíveis | Drawer é exibido | ✅ | — | 2.22s |
| 2 | Clicar no widget 'Conteúdos em andamento' | Widget é adicionado ao layout e toast exibida: "Widget adicionado com sucesso" | ✅ | — | 0.04s |
| 3 | Verificar a largura do widget no grid | Widget ocupa 6 colunas do grid | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC10 · Adicionar widget 'Meus certificados' · 🔴 Crítico

<a id="adicionar-widget-meus-certificados"></a>_Arquivo:_ `adicionar-widget-meus-certificados.spec.ts` · _Duração:_ 13.36s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar adição com largura padrão (R9 RN83.1).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba 'Nova aba' vazia
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir Layouts | — | ✅ | — | 8.93s |
| 1 | Abrir o drawer de widgets disponíveis | Drawer é exibido | ✅ | — | 2.19s |
| 2 | Clicar no widget 'Conteúdos em andamento' | Widget é adicionado ao layout e toast exibida: "Widget adicionado com sucesso" | ✅ | — | 0.03s |
| 3 | Verificar a largura do widget no grid | Widget ocupa 6 colunas do grid | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC9 · Adicionar widget 'Ranking' · 🔴 Crítico

<a id="adicionar-widget-ranking"></a>_Arquivo:_ `adicionar-widget-ranking.spec.ts` · _Duração:_ 12.56s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar largura específica do Ranking (R9 RN83.1).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba 'Nova aba' vazia
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir Layouts | — | ✅ | — | 8.24s |
| 1 | Abrir o drawer de widgets disponíveis | Drawer é exibido | ✅ | — | 2.21s |
| 2 | Clicar no widget 'Ranking' | Widget é adicionado ao layout e toast exibida: "Widget adicionado com sucesso" | ✅ | — | 0.04s |
| 3 | Verificar exibição e a largura do widget no grid | Widget Ranking é exibido com sucesso e deve ocupar a largura padrão diferente de 6 colunas (exceção descrita na documentação) | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC7 · Adicionar widget 'Resumo das atividades' · 🔴 Crítico

<a id="adicionar-widget-resumo-das-atividades"></a>_Arquivo:_ `adicionar-widget-resumo-atividades.spec.ts` · _Duração:_ 11.98s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar adição de widget (R9 RN80, RN81, RN83).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba 'Nova aba' vazia
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir Layouts | — | ✅ | — | 8.14s |
| 1 | Abrir o drawer de widgets disponíveis | Drawer é exibido | ✅ | — | 1.77s |
| 2 | Clicar no widget 'Resumo das atividades' | Widget é adicionado ao layout da aba ativa e toast exibida: "Widget adicionado com sucesso" | ✅ | — | 0.03s |
| 3 | Verificar a posição do widget no layout | Widget 'Resumo das atividades' é exibido no layout (largura padrão diferente de 6 colunas conforme exceção) | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ❌ Falhou · TC5 · Filtrar widgets pelo multi select 'Categorias' · 🟡 Normal

<a id="filtrar-widgets-pelo-multi-select-categorias"></a>_Arquivo:_ `filtrar-widgets-categorias.spec.ts` · _Duração:_ 37.04s · _Browser:_ chromium

> **❌ Por que falhou:** A página não navegou para a URL esperada dentro do tempo limite.
> _Step impactado:_ **Pré-condição: criar painel e abrir drawer**

**Sumário (objetivo do caso):** Validar filtro por categoria (R9 RN69.1).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba selecionada
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir drawer | — | ❌ | A página não navegou para a URL esperada dentro do tempo limite. | 35.18s |
| 1 | Abrir o drawer e expandir os filtros | Filtros são exibidos com 'Todos' e 'Aprendizagem' | ⊘ | Step não executado: o teste foi interrompido antes. Causa: A página não navegou para a URL esperada dentro do tempo limite.. | — |
| 2 | Selecionar apenas 'Aprendizagem' no multi select | Listagem exibe somente widgets da categoria 'Aprendizagem' | ⊘ | Step não executado: o teste foi interrompido antes. Causa: A página não navegou para a URL esperada dentro do tempo limite.. | — |
| 3 | Selecionar 'Todos' | Listagem exibe todos os widgets disponíveis | ⊘ | Step não executado: o teste foi interrompido antes. Causa: A página não navegou para a URL esperada dentro do tempo limite.. | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/`](artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/all-suites_20260513-225127/artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video-1.webm)

#### 🐛 Pronto para registro de bug

**Descrição do BUG:** [Normal] Filtrar widgets pelo multi select 'Categorias' — A página não navegou para a URL esperada dentro do tempo limite.

**Passo a passo para reprodução:**
1. Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba selecionada
1. 1. Abrir o drawer e expandir os filtros
1. 2. Selecionar apenas 'Aprendizagem' no multi select
1. 3. Selecionar 'Todos'

**Comportamento esperado:** Filtros são exibidos com 'Todos' e 'Aprendizagem'

**Comportamento atual:** A página não navegou para a URL esperada dentro do tempo limite.

**Informações:**

| Campo | Valor |
|---|---|
| URL | `https://widgets.stage.twygoead.com/` |
| Login | ${TWYGO_STAGING_WIDGETS_EMAIL} |
| Senha | ${TWYGO_STAGING_WIDGETS_PASSWORD} |
| orgId | — |
| Outros | Browser: chromium |
| Outros | runId: all-suites_20260513-225127 |
| Outros | Duração até a falha: 37.04s |
| Outros | Step impactado: 1. Pré-condição: criar painel e abrir drawer |

**Evidências:**

- Vídeo da execução (video-1.webm): artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video-1.webm
- Vídeo da execução (video.webm): artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video.webm
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/trace.zip

<details><summary>📋 Ver texto agregado para copiar (Jira/GitHub/Linear)</summary>

```
Descrição do BUG
[Normal] Filtrar widgets pelo multi select 'Categorias' — A página não navegou para a URL esperada dentro do tempo limite.

Passo a passo para reprodução
  Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba selecionada
  1. Abrir o drawer e expandir os filtros
  2. Selecionar apenas 'Aprendizagem' no multi select
  3. Selecionar 'Todos'

Comportamento esperado
Filtros são exibidos com 'Todos' e 'Aprendizagem'

Comportamento atual
A página não navegou para a URL esperada dentro do tempo limite.

Informações
- URL: https://widgets.stage.twygoead.com/
- Login: ${TWYGO_STAGING_WIDGETS_EMAIL}
- Senha: ${TWYGO_STAGING_WIDGETS_PASSWORD}
- ID do ambiente (orgId): —
- Outros:
  - Browser: chromium
  - runId: all-suites_20260513-225127
  - Duração até a falha: 37.04s
  - Step impactado: 1. Pré-condição: criar painel e abrir drawer

Evidências
- Vídeo da execução (video-1.webm): artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video-1.webm
- Vídeo da execução (video.webm): artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/video.webm
- Trace completo do Playwright (.zip) — `npx playwright show-trace`: artifacts/projects-widgets-tests-fea-0e9cf-lo-multi-select-Categorias--chromium/trace.zip

Execução
- runId: all-suites_20260513-225127
- environment.json: staging-widgets
- testsuite: Adicionar widgets
- testcase: Filtrar widgets pelo multi select 'Categorias'

```

</details>

<details><summary>🔧 Stack trace técnica completa (para desenvolvedor)</summary>

```
TimeoutError: page.waitForURL: Timeout 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

</details>

---

### ✅ Aprovado · TC6 · Pesquisar widget pelo nome no drawer · 🟡 Normal

<a id="pesquisar-widget-pelo-nome-no-drawer"></a>_Arquivo:_ `pesquisar-widget-nome.spec.ts` · _Duração:_ 10.91s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar campo de busca (R9 RN70).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba selecionada
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir drawer | — | ✅ | — | 8.95s |
| 1 | Abrir o drawer de widgets disponíveis | Drawer é exibido | ✅ | — | 0.03s |
| 2 | Preencher o campo 'Buscar' com 'Ranking' | Listagem exibe somente o widget 'Ranking' | ✅ | — | 0.19s |
| 3 | Limpar o campo 'Buscar' | Listagem volta a exibir todos os widgets | ✅ | — | — |
| 4 | Preencher o campo 'Buscar' com 'XXXX9999' | Listagem do drawer exibe estado vazio sem widgets | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC2 · Validar componentes do drawer de widgets · 🔴 Crítico

<a id="validar-componentes-do-drawer-de-widgets"></a>_Arquivo:_ `validar-componentes-drawer.spec.ts` · _Duração:_ 10.44s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar campos de filtro, busca e listagem (R9 RN67, RN68, RN69, RN69.1, RN70).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba selecionada
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir drawer | — | ✅ | — | 8.64s |
| 1 | Abrir o drawer de widgets disponíveis | Drawer 'Widgets disponíveis' é exibido | ✅ | — | 0.19s |
| 2 | Verificar a área de filtros | Bloco de filtros está colapsado por padrão | ✅ | — | — |
| 3 | Clicar no campo de filtros para expandir | Filtros são exibidos, incluindo o multi select 'Categorias' com opções 'Todos' e 'Aprendizagem' | ✅ | — | — |
| 4 | Verificar o campo 'Buscar' | Campo "Buscar" é exibido com placeholder "Digite o nome do widget..." | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC4 · Validar informação literal dos widgets · 🟡 Normal

<a id="validar-informacao-literal-dos-widgets"></a>_Arquivo:_ `validar-informacao-literal-widgets.spec.ts` · _Duração:_ 11.00s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar textos descritivos, badges e tags (R9 RN73-76).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba selecionada
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir drawer | — | ✅ | — | 9.13s |
| — | _Pré-condição:_ Validar widget Resumo de atividades | — | ✅ | — | 0.17s |
| — | _Pré-condição:_ Validar widget Conteúdos em andamento | — | ✅ | — | 0.05s |
| — | _Pré-condição:_ Validar widget Ranking | — | ✅ | — | 0.05s |
| — | _Pré-condição:_ Validar widget Meus certificados | — | ✅ | — | 0.05s |
| 1 | Abrir o drawer de widgets disponíveis | Drawer é exibido | ✅ | — | — |
| 2 | Verificar widget 'Resumo das atividades' | Descrição: "Exibe um resumo completo das atividades de aprendizagem do usuário"<br /> Badge: Usuário<br /> Tag: Aprendizagem<br /> Tooltip: exibe descrição completa do widget | ✅ | — | — |
| 3 | Verificar widget 'Conteúdos em andamento' | Descrição: "Exibe os conteúdos que o usuário está cursando atualmente"<br /> Badge: Usuário<br /> Tag: Aprendizagem<br /> Tooltip: exibe descrição completa do widget | ✅ | — | — |
| 4 | Verificar widget 'Ranking' | Descrição: "Exibe para o usuário a sua posição do ranking e o top 5 do ambiente"<br /> Badge: Usuário<br /> Tag: Aprendizagem<br /> Tooltip: exibe descrição completa do widget | ✅ | — | — |
| 5 | Verificar widget 'Meus certificados' | Descrição: "Exibe todos os certificados que o usuário conquistou"<br /> Badge: Usuário<br /> Tag: Aprendizagem<br /> Tooltip: exibe descrição completa do widget | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---

### ✅ Aprovado · TC3 · Validar widgets disponíveis na categoria Aprendizagem · 🔴 Crítico

<a id="validar-widgets-disponiveis-na-categoria-aprendizagem"></a>_Arquivo:_ `validar-widgets-categoria-aprendizagem.spec.ts` · _Duração:_ 10.70s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar listagem completa dos widgets (R9 RN73-77).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Painel em edição com aba selecionada
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| — | _Pré-condição:_ Pré-condição: criar painel e abrir drawer | — | ✅ | — | 8.89s |
| 1 | Abrir o drawer de widgets disponíveis e selecionar a categoria 'Aprendizagem' | Widgets são listados abaixo dos filtros, agrupados por categoria | ✅ | — | 0.19s |
| 2 | Verificar o agrupamento dos widgets | Devem estar agrupados na categoria 'Aprendizagem' e exibidos em formato de lista ou grid | ✅ | — | — |
| 3 | Verificar a apresentação de cada widget | Cada widget exibe: Nome, Descrição, tags associadas (quando aplicável, indicando a categoria) e badge (indicando o perfil: Usuário, Instrutor, Administrador) | ✅ | — | — |
| 4 | Verificar os widgets exibidos na categoria 'Aprendizagem' | Drawer exibe os widgets: 'Resumo das atividades', 'Conteúdos em andamento', 'Ranking', 'Meus certificados' | ✅ | — | — |

**Evidências:**

_Sem evidências anexadas._


---
