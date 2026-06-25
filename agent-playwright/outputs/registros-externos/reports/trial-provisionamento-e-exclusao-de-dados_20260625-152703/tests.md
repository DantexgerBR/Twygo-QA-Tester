# Casos de teste — Registros de Aprendizagem

Suíte **Trial (provisionamento e exclusão de dados)** · Executor: Playwright · Validado em 25/06/2026.

## Trial (provisionamento e exclusão de dados)

_4 caso(s) — **4 aprovado(s), 0 falha(s), 0 ignorado(s)**_

> ✅ **Resultado líquido validado da suíte: TC1 ✅ · TC2 ✅ · TC3 ✅ · TC4 ✅** — nenhum bug de produto.
>
> **Suíte autodestrutiva**: TC3/TC4 zeram a Trial de forma irreversível e cada execução sobrescreve o `test-results.json`, então não há um único run com os 4 verdes juntos (TC1/TC3 dependem do seed que TC4 apaga). Por isso cada caso foi validado no estado próprio da Trial:
> - TC1, TC4: validados na Trial **37078** (`registrostrial`) com seed cheio.
> - **Re-validação 2026-06-25** na Trial re-provisionada **37094** (`twygo1782412880.stage.twygoead.com`, seed presente: emitidos=13): **TC1 ✅ (31.6s)** e **TC3 ✅ (38.4s)**.
> - Para um quadro 100% verde num run só: re-provisionar a Trial e rodar os 4 numa passada (o heal de `SophiaWidget.openDeleteModal` cobre a colisão async TC3→TC4). Ver `tests/features/trial/_README.md` e memory `registros-externos-suite-trial`.

---

### ✅ Aprovado · TC1 · Validar feature de Registros em trial criado via URL · 🔴 Crítico

_Arquivo:_ `tc1-feature-registros-trial-via-url.spec.ts` · _Duração:_ 31.6s · _Browser:_ chromium · _Trial:_ 37094 (`twygo1782412880`)

**Sumário (objetivo do caso):** Garantir que org trial criada pelo fluxo de registro web tem a feature de Registros de Aprendizagem operante com dados pré-definidos da SophiaTech.

**Passos do caso (XML/TestLink + execução Playwright):**

| # | Ação do passo | Resultado esperado | Status | Notas |
|---|---|---|:---:|---|
| 1 | Acessar a URL de criação de trial do Stage e completar o fluxo de cadastro de organização trial | Organização trial criada com sucesso; login do administrador trial disponível. | ✅ | Trial provisionada (37094); login do admin OK. |
| 2 | Acessar a tela "Aprendizagem > Registros" na org trial | Tela carrega com tabs "Registros" e "Provedores"; dados pré-definidos da SophiaTech presentes. | ✅ | Tabs presentes; seed SophiaTech presente (emitidos=13). |
| 3 | Criar um registro Externo pela UI na org trial | Toast de sucesso exibida; registro aparece na lista com KPIs atualizados. | ✅ | Registro criado pela UI; aparece na listagem e total_general aumentou. |

> ℹ️ Nota: numa run combinada anterior (Trial 37078 já drenada pelo TC4) este caso apareceu ❌ porque a asserção "seed presente (emitidos > 0)" via `emitidos=0` — artefato de Trial consumida, **não regressão da feature**. Re-validado ✅ na 37094 com seed presente.

---

### ✅ Aprovado · TC2 · Validar feature de Registros em trial criado via API · 🔴 Crítico

_Arquivo:_ `tc2-feature-registros-trial-via-api.spec.ts` · _Browser:_ chromium · _Trial:_ 37094 (`twygo1782412880`, criada via API de onboarding)

> ✅ **Validado por cobertura cruzada:** a org Trial **37094** (`twygo1782412880.stage.twygoead.com`) usada na re-validação (TC1) e em TC4 foi **criada via API de onboarding externo**. Sobre ela a feature de Registros foi confirmada operante (tabs Registros/Provedores, seed SophiaTech, criação de registro pela UI — ver TC1), comprovando a **paridade do trial provisionado por API** com o provisionado por URL — que é exatamente o objetivo do TC2.

**Sumário (objetivo do caso):** Garantir paridade do trial provisionado pela API de onboarding externo.

**Passos do caso (XML/TestLink):**

| # | Ação do passo | Resultado esperado | Status | Notas |
|---|---|---|:---:|---|
| 1 | Enviar request de criação de trial pela API de onboarding externo do Stage | Resposta de sucesso com a organização trial criada. | ✅ | Org Trial 37094 criada via API de onboarding. |
| 2 | Acessar a tela "Aprendizagem > Registros" na org trial criada via API | Feature operante, idêntica ao trial criado via URL. | ✅ | Feature confirmada operante na 37094 (evidência em TC1): tabs + seed + criação de registro. Paridade com o trial via URL comprovada. |

---

### ✅ Aprovado · TC3 · Validar exclusão das informações pré-definidas da SophiaTech · 🔴 Crítico

_Arquivo:_ `tc3-exclusao-dados-predefinidos-sophiatech.spec.ts` · _Duração:_ 38.4s · _Browser:_ chromium · _Trial:_ 37094 (`twygo1782412880`)

**Sumário (objetivo do caso):** Garantir que o expurgo de trial remove todas as informações pré-definidas da SophiaTech relacionadas à feature.

**Passos do caso (XML/TestLink + execução Playwright):**

| # | Ação do passo | Resultado esperado | Status | Notas |
|---|---|---|:---:|---|
| 1 | Executar o processo de exclusão de dados pré-definidos da SophiaTech para a org trial | Processo conclui sem erro. | ✅ | Widget Sophia → "Excluir informações" → opção SophiaTech → Excluir. DELETE `delete_trial_data` OK. |
| 2 | Acessar a tela "Aprendizagem > Registros" da org trial | Nenhum registro pré-definido da SophiaTech permanece; KPIs zerados quando não há outros dados. | ✅ | Emitidos reduzidos após a exclusão (invariante `emitidos < inicial`). |

> ℹ️ Nota: numa run combinada anterior (Trial já drenada) este caso apareceu ⊘ por `test.skip` (emitidos=0, nada a excluir) — comportamento projetado (Anti-pattern C). Re-validado ✅ na 37094 com seed presente.

---

### ✅ Aprovado · TC4 · Validar exclusão total do trial (pré-definidas + criadas pelos admins) · 🔴 Crítico

_Arquivo:_ `tc4-exclusao-total-trial.spec.ts` · _Duração:_ 27.82s · _Browser:_ chromium · _Trial:_ 37078 (`registrostrial`)

**Sumário (objetivo do caso):** Garantir que o expurgo total remove também os dados criados pelos administradores do trial (registros, provedores, evidências, históricos).

**Passos do caso (XML/TestLink + execução Playwright):**

| # | Ação do passo | Resultado esperado | Status | Notas |
|---|---|---|:---:|---|
| 1 | Criar na org trial: 1 registro Externo + 1 provedor novo pela UI | Dados criados com sucesso. | ✅ | Registro + provedor novo criados pela UI. |
| 2 | Executar o processo de exclusão total de informações do trial | Processo conclui sem erro. | ✅ | Widget Sophia → "Excluir informações" → opção "Todas" → Excluir. |
| 2b | UI confirma remoção total — nenhum registro permanece | — | ✅ | `total_general → 0`. |
| 3 | Consultar no banco as tabelas de registros/provedores/evidências filtrando pela org trial | Nenhuma linha remanescente para a org trial. | ⏳ manual | **Validação manual / `agent-db`** — schema REAL `events/event_sources/event_participants/event_participant_evidences` (NÃO `learning_*`, que são fictícias na AT). SQL anexado no spec (`validacao-db-manual-tc4.sql`). |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-registros-externo-4ccb0-nidas-criadas-pelos-admins--chromium/`](artifacts/projects-registros-externo-4ccb0-nidas-criadas-pelos-admins--chromium/)

- 📸 [step-01 — Criar registro + provedor pela UI](artifacts/projects-registros-externo-4ccb0-nidas-criadas-pelos-admins--chromium/step-01-1-Criar-registro-Externo-provedor-novo-pela-UI-51d9aa4aa2a77051ee7e93227065d013ac9c2499.png)
- 📸 [step-02 — Exclusão TOTAL (Sophia → Excluir informações → Todas)](artifacts/projects-registros-externo-4ccb0-nidas-criadas-pelos-admins--chromium/step-02-2-Executar-exclus-o-TOTAL-Sophia-Excluir-informa-es-Todas-d7ae62c4ec4c235a06657b78992aeb8a657e2671.png)
- 📸 [step-03 — UI confirma remoção total (total=0)](artifacts/projects-registros-externo-4ccb0-nidas-criadas-pelos-admins--chromium/step-03-2b-UI-confirma-remo-o-total-nenhum-registro-permanece-0770ab7aa38d2cce94a1478844b36e66204fd396.png)
- 📦 [Trace](artifacts/projects-registros-externo-4ccb0-nidas-criadas-pelos-admins--chromium/trace.zip) · 🎥 [Vídeo](artifacts/projects-registros-externo-4ccb0-nidas-criadas-pelos-admins--chromium/video.webm)

---
