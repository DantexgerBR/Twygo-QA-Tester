# Casos de teste — Widgets

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Modo de uso - Painéis do usuário

_3 caso(s) — 2 aprovado(s), 0 falha(s), 1 ignorado(s)_

### ✅ Aprovado · TC2 · Listar painéis disponíveis no campo 'Espaço' · 🟡 Normal

<a id="listar-paineis-disponiveis-no-campo-espaco"></a>_Arquivo:_ `listar-paineis-campo-espaco.spec.ts` · _Duração:_ 19.50s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar opções listadas no campo Espaço.

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existem mais de 3 painéis ativos e outros inativos cadastrados
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a configuração de um menu de modo de uso | Formulário é exibido | ✅ | — | 14.63s |
| 2 | Selecionar 'Painéis do usuário' no modelo de página | Campo 'Espaço' é exibido | ✅ | — | 0.22s |
| 3 | Abrir o dropdown 'Espaço' | Opções listadas correspondem aos painéis ativos disponíveis para a organização, confirmando que painéis inativos não são exibidos | ✅ | — | 0.28s |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/`](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/)

- 📸 **Screenshot (step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu)** — [`step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu-5e51d1739ffd5c1cc1422eb4267644bc328dfea2.png`](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu-5e51d1739ffd5c1cc1422eb4267644bc328dfea2.png)

  ![](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu-5e51d1739ffd5c1cc1422eb4267644bc328dfea2.png)

- 📸 **Screenshot (step-02-2-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-campo-Es)** — [`step-02-2-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-campo-Es-dc0e5fc5c00ee4b534fea0a169c83c68cff40496.png`](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/step-02-2-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-campo-Es-dc0e5fc5c00ee4b534fea0a169c83c68cff40496.png)

  ![](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/step-02-2-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-campo-Es-dc0e5fc5c00ee4b534fea0a169c83c68cff40496.png)

- 📸 **Screenshot (step-03-3-Abrir-dropdown-e-validar-op-es-painel-ativo-aparece-inativ)** — [`step-03-3-Abrir-dropdown-e-validar-op-es-painel-ativo-aparece-inativ-774eda3affc25efe389021340dcd926777296f05.png`](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/step-03-3-Abrir-dropdown-e-validar-op-es-painel-ativo-aparece-inativ-774eda3affc25efe389021340dcd926777296f05.png)

  ![](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/step-03-3-Abrir-dropdown-e-validar-op-es-painel-ativo-aparece-inativ-774eda3affc25efe389021340dcd926777296f05.png)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/test-finished-1.png)

  ![](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/modo-de-uso-paineis-do-usuario_20260514-130856/artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-bd646-isponíveis-no-campo-Espaço--chromium/video-1.webm)


---

### ⊘ Ignorado · TC3 · Não permitir reabilitar menu inativado quando 'Espaço' do 'Painel do usuário' inativo · 🔴 Crítico

<a id="nao-permitir-reabilitar-menu-inativado-quando-espaco-do-painel-do-usuario-inativo"></a>_Arquivo:_ `nao-reabilitar-menu-painel-inativo.spec.ts` · _Duração:_ 1.13s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** Marcado para revisão (test.fixme): seed ausente: TC depende de painel inativo COM menu vinculado, mas o backend dispara 500 (title_for#NoMethodError em GET /panels/{id}/linked_menus) impedindo PATCH /change_status. Bug bloqueia ensureInactive() apenas em sessão automatizada (user 'Claude Agents'); manual passa. Ver bug_title_for_linked_menus.md.

**Sumário (objetivo do caso):** Validar que não permite reativar um 'Menu' cujo espaço tenha sido inativado. (RN 9

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Ter 1 painel ativo Criar um modo de uso com este painel ativo Confirmar que o menu de 'Painéis do usuário' esteja 'Habilitado' Salvar edições do modo de uso Desabilitar o menu de 'Painéis do usuário' Inativar o painel utilizado
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar a edição do modo de uso criado | Menus devem ser listados corretamente | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed ausente: TC depende de painel inativo COM menu vinculado, mas o backend dispara 500 (title_for#NoMethodError em GET /panels/{id}/linked_menus) impedindo PATCH /change_status. Bug bloqueia ensureInactive() apenas em sessão automatizada (user 'Claude Agents'); manual passa. Ver bug_title_for_linked_menus.md. | — |
| 2 | Tentar habilitar o menu de 'Painéis do usuário' | Não deve permitir habilitar e deve exibir mensagem: "Painel está inativo e não pode ser reativado" | ⊘ | Step não executado — Marcado para revisão (test.fixme): seed ausente: TC depende de painel inativo COM menu vinculado, mas o backend dispara 500 (title_for#NoMethodError em GET /panels/{id}/linked_menus) impedindo PATCH /change_status. Bug bloqueia ensureInactive() apenas em sessão automatizada (user 'Claude Agents'); manual passa. Ver bug_title_for_linked_menus.md. | — |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/`](artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/test-finished-1.png)

  ![](artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/modo-de-uso-paineis-do-usuario_20260514-130856/artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-981b4-o-Painel-do-usuário-inativo-chromium/video-1.webm)

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Motivo do skip / fixme:** seed ausente: TC depende de painel inativo COM menu vinculado, mas o backend dispara 500 (title_for#NoMethodError em GET /panels/{id}/linked_menus) impedindo PATCH /change_status. Bug bloqueia ensureInactive() apenas em sessão automatizada (user 'Claude Agents'); manual passa. Ver bug_title_for_linked_menus.md.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Ter 1 painel ativo Criar um modo de uso com este painel ativo Confirmar que o menu de 'Painéis do usuário' esteja 'Habilitado' Salvar edições do modo de uso Desabilitar o menu de 'Painéis do usuário' Inativar o painel utilizado
1. 1. Acessar a edição do modo de uso criado
1. 2. Tentar habilitar o menu de 'Painéis do usuário'

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ✅ Aprovado · TC1 · Selecionar 'Painéis do usuário' como modelo de página no modo de uso · 🔴 Crítico

<a id="selecionar-paineis-do-usuario-como-modelo-de-pagina-no-modo-de-uso"></a>_Arquivo:_ `selecionar-paineis-usuario-modelo-pagina.spec.ts` · _Duração:_ 38.11s · _Browser:_ chromium

**Sumário (objetivo do caso):** Validar seleção do modelo e exibição do campo Espaço (R11 RN88).

**Pré-condições:**

```
Ambiente Stage configurado Funcionalidade 'Gestão de Painéis' habilitada no contrato Feature flag 'habilitar_paineis_do_usuario' ativa Usuário logado como Admin Existe painel 'Painel Aluno' ativo cadastrado
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar Configurações > Menu > Modos de uso | Tela de Modos de uso é exibida | ✅ | — | 13.09s |
| 2 | Acessar a configuração de um menu existente (ou criar novo) | Formulário de configuração é exibido | ✅ | — | 0.23s |
| 3 | Ao adicionar menu, selecionar 'Painéis do usuário' no modelo de página | Campo 'Espaço' é exibido para selecionar o painel | ✅ | — | 0.31s |
| 4 | Selecionar 'Painel Aluno' no campo 'Espaço' | Painel é selecionado e configuração é salva | ✅ | — | 7.32s |

**Evidências:**

📁 _Pasta:_ [`artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/)

- 📸 **Screenshot (step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu)** — [`step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu-11c5d3438424ff1a908ad1df5d40eecb41d9ce81.png`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu-11c5d3438424ff1a908ad1df5d40eecb41d9ce81.png)

  ![](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/step-01-1-Setup-navegar-ao-form-de-novo-item-de-menu-11c5d3438424ff1a908ad1df5d40eecb41d9ce81.png)

- 📸 **Screenshot (step-02-2-Preencher-Nome-do-menu)** — [`step-02-2-Preencher-Nome-do-menu-13ad4ea31bfd30ef9987c1e09239851e5b57b621.png`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/step-02-2-Preencher-Nome-do-menu-13ad4ea31bfd30ef9987c1e09239851e5b57b621.png)

  ![](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/step-02-2-Preencher-Nome-do-menu-13ad4ea31bfd30ef9987c1e09239851e5b57b621.png)

- 📸 **Screenshot (step-03-3-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina)** — [`step-03-3-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-c4bc557d5e8efc485cf40f81b08b02cb6620e2e0.png`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/step-03-3-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-c4bc557d5e8efc485cf40f81b08b02cb6620e2e0.png)

  ![](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/step-03-3-Selecionar-Pain-is-do-usu-rio-no-Modelo-de-p-gina-c4bc557d5e8efc485cf40f81b08b02cb6620e2e0.png)

- 📸 **Screenshot (step-04-4-Escolher-primeiro-painel-dispon-vel-no-campo-Espa-o-e-salv)** — [`step-04-4-Escolher-primeiro-painel-dispon-vel-no-campo-Espa-o-e-salv-6dc5f6254e5b11547874a1318bb43a2a9b5c4655.png`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/step-04-4-Escolher-primeiro-painel-dispon-vel-no-campo-Espa-o-e-salv-6dc5f6254e5b11547874a1318bb43a2a9b5c4655.png)

  ![](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/step-04-4-Escolher-primeiro-painel-dispon-vel-no-campo-Espa-o-e-salv-6dc5f6254e5b11547874a1318bb43a2a9b5c4655.png)

- 📸 **Screenshot (screenshot)** — [`test-finished-1.png`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/test-finished-1.png)

  ![](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/test-finished-1.png)

- 🎬 [Vídeo da execução (video.webm)](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/video.webm)

- 🎬 [Vídeo da execução (video-1.webm)](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/video-1.webm)

- 📦 **Trace** — [`trace.zip`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/trace.zip)

  ```bash
  npx playwright show-trace outputs/widgets/reports/modo-de-uso-paineis-do-usuario_20260514-130856/artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/trace.zip
  ```

- 🎥 **Vídeo** — [`video.webm`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/video.webm)

- 🎥 **Vídeo** — [`video-1.webm`](artifacts/projects-widgets-tests-fea-c0faa-lo-de-página-no-modo-de-uso-chromium/video-1.webm)


---
