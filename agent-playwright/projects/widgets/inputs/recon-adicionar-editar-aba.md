# Reconnaissance — Adicionar/editar aba

> Snapshot do DOM da área desta testsuite, capturado em 2026-05-11T17:46:37.684Z.
> Planners DEVEM consumir este arquivo + a prosa do XML, e PULAR exploração ao vivo.

## Testcases desta testsuite (do XML)

1. **Acessar a tela de criação de painel** (importance: crítico, 2 steps)
2. **Criar painel com Nome e Descrição preenchidos (happy path)** (importance: crítico, 5 steps)
3. **Tentar salvar painel sem preencher o campo obrigatório 'Nome'** (importance: crítico, 2 steps)
4. **Validar limite de 255 caracteres no campo Nome** (importance: normal, 2 steps)
5. **Validar limite de 500 caracteres no campo Descrição** (importance: normal, 2 steps)
6. **Validar tipos de caracteres aceitos no campo Nome** (importance: menor, 3 steps)
7. **Validar exibição da aba inicial 'Nova aba' criada automaticamente** (importance: crítico, 4 steps)
8. **Renomear aba existente via ícone de lápis** (importance: crítico, 4 steps)
9. **Validar 255 caracteres para o 'Nome da aba'** (importance: crítico, 5 steps)
10. **Cancelar renomeação de aba** (importance: normal, 4 steps)
11. **Adicionar nova aba via opção 'Criar nova aba'** (importance: crítico, 7 steps)
12. **Cancelar criação de nova aba a partir da seleção de tipo** (importance: normal, 5 steps)
13. **Voltar do step 'Criar nova aba' para a seleção de tipo** (importance: normal, 3 steps)
14. **Excluir aba quando há mais de uma aba** (importance: crítico, 3 steps)
15. **Tentar excluir aba quando há apenas uma aba** (importance: crítico, 3 steps)
16. **Modal padrão de confirmação ao alternar abas com alterações não salvas** (importance: normal, 3 steps)
17. **Modal de confirmação do navegador ao sair com alterações não salvas** (importance: menor, 3 steps)
18. **Validar acessibilidade por teclado ao criar aba** (importance: menor, 4 steps)

---

# URL 1: `/o/36988/use_modes?tab=panels-tab`

- Após carregamento: `https://widgets.stage.twygoead.com/o/36988/use_modes?tab=panels-tab`
- Page title: widgets [36988]
- Sync alert: não · Modal aberto: SIM

## Test IDs encontrados (data-test-id)

| data-test-id | tag | role | name (aria-label/text) |
|---|---|---|---|
| `panel-situation-803018` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-803016` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-803015` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-803013` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-803012` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-803011` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-803010` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-802408` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801935` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801934` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801936` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801937` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801938` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801939` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801940` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801941` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801942` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801943` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801944` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801933` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801920` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801921` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801922` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801923` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `panel-situation-801924` | label |  |  |
| `panels-duplicate-action` | div |  | content_copy |
| `chat-widget-iframe` | iframe |  |  |

## Roles + accessible names

| role | name |
|---|---|
| button | OK |
| button | Continuar mesmo assim |
| button | Open chat |
| button | Users |
| button | Close |
| button | Administrador |
| button | Modos de uso |
| button | Painéis |
| button | Adicionar |
| button | filter_altFiltro |
| button | keyboard_double_arrow_left |
| button | chevron_left |
| button | chevron_right |
| button | Enviar |
| link | leaderboard



Dashboard |
| link | format_list_bulleted_add


Conteúdos |
| link | send


Compartilhamentos |
| link | description


Registros

BETA |
| link | workspace_premium


Certificados |
| link | group



Usuários |
| link | work



Empresas |
| link | live_help



Questionários |
| link | groups



Comunidades |
| link | lan


Organograma |
| link | badge


Funções |
| link | award_star


Competências |
| link | send


Repositórios |
| link | send


Arquitetura de Processos |
| link | send


Agente de Documentação |
| link | send


Documentos de Referência |
| link | send


Portal de processos |
| link | Organização |
| link | Menu |
| link | electrical_services

Integrações |
| link | flash_auto

Piloto automático |
| link | Regras do Jogo |
| link | Comunicação |
| link | sell

Cobrança de inscrição |
| link | credit_card

Plano e assinatura |
| link | Segurança

NOVO |
| link | palette

Aparência |
| link | smart_toy

Controle de IA

BETA |
| link | Administração |
| link | Editar |
| link | Cancelar inscrição |
| link | Cancelar assinatura |
| link | Falar com o administrador |
| link | Twygo Academy |
| link | Twygo Connect |
| link | Falar com o suporte |
| link | Sair |
| link | Continuar mesmo assim |
| link | manage_accounts


Administrador |
| link | school



Aluno |
| link | Rede |
| link | Adicionar |
| link | Marcar todos |
| link | Mostrar mais |
| link | Salvar e fechar |
| textbox | Digite aqui sua mensagem. |
| textbox | exemplo@email.com |
| textbox | (__) ____-____ |
| textbox | Pesquise por nome ou descrição |
| textbox | Gostei de um evento e gostaria de compartilhar com você, ace |
| tab | Modos de uso |
| tab | Painéis |
| heading | Meu perfil |
| heading | Suporte |
| heading | Modo administrador |
| heading | Perfil

Alterar seu perfil |
| heading | Enviar e-mail ao administrador |
| heading | Compartilhar evento por e-mail |
| heading | Recomende este evento para sua rede. |

## Labels

- `Assunto:`
- `Anexo:`
- `Mensagem:`
- `Desejo receber uma cópia do e-mail`
- `Para (email)`
- `Mensagem`

## Placeholders

- `Digite aqui sua mensagem.`
- `exemplo@email.com`
- `(__) ____-____`
- `Pesquise por nome ou descrição`

---

# URL 2: `/o/36988/panels/new`

- Após carregamento: `https://widgets.stage.twygoead.com/o/36988/panels/new`
- Page title: widgets [36988]
- Sync alert: não · Modal aberto: SIM

## Test IDs encontrados (data-test-id)

| data-test-id | tag | role | name (aria-label/text) |
|---|---|---|---|
| `panel-form-save-button` | button |  | Salvar |
| `panel-form-cancel-button` | button |  | Cancelar |
| `chat-widget-iframe` | iframe |  |  |

## Roles + accessible names

| role | name |
|---|---|
| button | OK |
| button | Continuar mesmo assim |
| button | Open chat |
| button | Users |
| button | Close |
| button | Administrador |
| button | Voltar |
| button | Identificação |
| button | Layouts |
| button | Parágrafo |
| button | more_horiz |
| button | Título 1 |
| button | Título 2 |
| button | Título 3 |
| button | Tabela |
| button | Código |
| button | Citação |
| button | Divisor |
| button | Lista com marcadores |
| button | Lista numerada |
| button | Lista de tarefas |
| button | Lista de alternantes |
| button | Imagem |
| button | Vídeo |
| button | Áudio |
| button | Índice |
| button | Colunas |
| button | Equação |
| button | Link |
| button | Data |
| button | Equação em linha |
| button | Salvar |
| button | Cancelar |
| button | Enviar |
| link | leaderboard



Dashboard |
| link | format_list_bulleted_add


Conteúdos |
| link | send


Compartilhamentos |
| link | description


Registros

BETA |
| link | workspace_premium


Certificados |
| link | group



Usuários |
| link | work



Empresas |
| link | live_help



Questionários |
| link | groups



Comunidades |
| link | lan


Organograma |
| link | badge


Funções |
| link | award_star


Competências |
| link | send


Repositórios |
| link | send


Arquitetura de Processos |
| link | send


Agente de Documentação |
| link | send


Documentos de Referência |
| link | send


Portal de processos |
| link | Organização |
| link | Menu |
| link | electrical_services

Integrações |
| link | flash_auto

Piloto automático |
| link | Regras do Jogo |
| link | Comunicação |
| link | sell

Cobrança de inscrição |
| link | credit_card

Plano e assinatura |
| link | Segurança

NOVO |
| link | palette

Aparência |
| link | smart_toy

Controle de IA

BETA |
| link | Administração |
| link | Editar |
| link | Cancelar inscrição |
| link | Cancelar assinatura |
| link | Falar com o administrador |
| link | Twygo Academy |
| link | Twygo Connect |
| link | Falar com o suporte |
| link | Sair |
| link | Continuar mesmo assim |
| link | manage_accounts


Administrador |
| link | school



Aluno |
| link | Rede |
| link | Marcar todos |
| link | Mostrar mais |
| link | Salvar e fechar |
| textbox | Digite aqui sua mensagem. |
| textbox | exemplo@email.com |
| textbox | (__) ____-____ |
| textbox | Blocos básicosParágrafoTítulo 1Título 2Título 3TabelaCódigoC |
| textbox | Pesquisar blocos... |
| textbox | Gostei de um evento e gostaria de compartilhar com você, ace |
| tab | Identificação |
| tab | Layouts |
| heading | Meu perfil |
| heading | Suporte |
| heading | Modo administrador |
| heading | Perfil

Alterar seu perfil |
| heading | Enviar e-mail ao administrador |
| heading | Adicionar painel |
| heading | Compartilhar evento por e-mail |
| heading | Recomende este evento para sua rede. |
| menuitem | Parágrafo |
| menuitem | Título 1 |
| menuitem | Título 2 |
| menuitem | Título 3 |
| menuitem | Tabela |
| menuitem | Código |
| menuitem | Citação |
| menuitem | Divisor |
| menuitem | Lista com marcadores |
| menuitem | Lista numerada |
| menuitem | Lista de tarefas |
| menuitem | Lista de alternantes |
| menuitem | Imagem |
| menuitem | Vídeo |
| menuitem | Áudio |
| menuitem | Índice |
| menuitem | Colunas |
| menuitem | Equação |
| menuitem | Link |
| menuitem | Data |
| menuitem | Equação em linha |

## Labels

- `Assunto:`
- `Anexo:`
- `Mensagem:`
- `Desejo receber uma cópia do e-mail`
- `Nome*`
- `Descrição`
- `Painel ativo`
- `Para (email)`
- `Mensagem`

## Placeholders

- `Digite aqui sua mensagem.`
- `exemplo@email.com`
- `(__) ____-____`
- `Pesquisar blocos...`
