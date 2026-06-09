---
contract_version: 1.2
at_version: 1
project: desempenho-feedback
project_name: "Desempenho e Feedback"
generated_at: 2026-06-09T00:00:00Z
source_docs:
  - "docs/prd-desempenho.md"
  - "docs/prd-admin-desenvolvimento.md"
  - "docs/prd-admin-feedbacks-anotacoes.md"
  - "docs/prd-admin-usuarios-dho.md"
  - "docs/prd-lider-desenvolvimento.md"
  - "docs/prd-lider-feedbacks-anotacoes.md"
  - "docs/prd-aluno-avaliacoes.md"
  - "docs/prd-aluno-feedbacks-recebidos.md"
  - "docs/status-x-acoes.md"
  - "docs/QA_Only_Desempenho_e_Feedback.xlsx"
env: staging-desempenho
env_secondary: staging-desempenho-aditional
totals:
  suites: 25
  test_cases: 122
  steps: 520
---

# Análise de Teste — Desempenho e Feedback

> **AT v1 (contract_version 1.2)** — módulo Desempenho da Twygo: Ciclo → Campanha
> → Avaliação individual → Consolidação → Devolutiva → 9-box, mais Registros
> ("Feedbacks e Anotações"), cadastro/importação de Usuários DHO, e transversais
> (RBAC, feature flag, ambientes adicionais, Trial, banco histórico, logs).
>
> **Origem**: 8 PRDs por persona + recon do protótipo `claude-twygo-prototype`
> (branch `poc-revisao-desempenho`). Comportamento descrito é o **alvo (twyg-app)** —
> gaps do protótipo (`@skip-proto-gap-NN`) são concern de execução, anotados como REVISAR.
>
> **Marcadores `(REVISAR-FIGMA: ...)`**: textos literais de modais/toasts ainda não
> confirmados — pendentes de recon live (dev server sobe em `localhost:5173`).
>
> **Decisões em aberto sinalizadas (resolver com Produto/AT antes da execução)**:
> - Reversibilidade de Ciclo "Finalizado": glossary trata como terminal (adotado aqui);
>   glossario-rh fala em reabertura. Confirmar.
> - "Salvar e Programar" vs "Salvar e Ativar" (PRD#1) — adotado "Ativar ciclo".
> - CA-15 duplicado no PRD#1 (HU-03 e HU-04).
> - Público-alvo da Campanha: glossary marca fora de escopo nesta fase (PRD#1 descreve).
> - Notificações (suíte 25): D09 entregue por Dev sem RNs nos PRDs — placeholder.
>
> **Executor**: todas as suítes `executor: playwright`. Suítes "Banco Histórico" e
> "Logs / Auditoria" têm TCs `Tipo: db` (validação secundária via subprocess agent-db,
> conforme CONTRACT.md §11). Nomes de tabela são premissa (REVISAR — Dev confirma schema).

## Dados de teste

### Organizações (chaves simbólicas — resolvidas pelo consumidor)
- `org: principal` — default. Resolvido via `getOrgId()` (env `staging-desempenho`).
- `org: secundario` — ambiente adicional pareado (env `staging-desempenho-aditional`), suíte de isolamento.
- `org: trial` — Trial dedicada (env `staging-desempenho-trial`), suíte de exclusão de dados.

> Valores concretos (orgIds, hosts) ficam em `agent-playwright/.env` (gitignored),
> referenciados via `${VAR}` em `config/environment.json`.

### Feature flag e gate
- `featureFlag`: `performance_module_enabled` (Flipper, escopo por organização) — pré-requisito de todo o módulo.

### Recursos para criação (worker-isolated)
- `cicloNameFormat`: "Ciclo {tipo} QA w{workerIndex}-{timestamp}"
- `campanhaNameFormat`: "Campanha {bloco} QA w{workerIndex}-{timestamp}"
- `formularioNameFormat`: "Formulário QA w{workerIndex}-{timestamp}"
- `usuarioEmailFormat`: "usuario-dho-w{workerIndex}-{timestamp}@empresa.com"

### Enums de domínio (alvo de validação)
- `cargoNivel`: Júnior | Pleno | Sênior | Especialista | Coord. | Gerente | Diretor
- `tiposColeta`: Auto | Líder | Pares | Liderado
- `tiposAvaliacao` (AvaliacaoKey): desempenho | experiencia | 9-box | analise-perfis
- `metodoFinalizacao`: consenso | ponderado | adocao
- `matrizes`: 9-box (default 3×3) | 16-box | 6-box | 3-box

### Faixas do tipo de ciclo derivado (RN 7)
- Mensal: 25–35 dias · Trimestral: 80–100 · Semestral: 170–200 · Anual: 330–400 · Personalizado: qualquer outro

### Defaults de configuração avaliativa (do Ciclo)
- `configPares.qtdEsperada`: 5 · `configPares.minimoEncerrar`: 2 · `configPares.modo`: sorteio | manual
- `thresholdDiscrepancia`: 1.5 (dispara flag de divergência auto × líder)
- Soma de pesos por tipo de avaliação: 100%

### Limites de importação CSV (DHO)
- Tamanho máx: 5 MB · Linhas máx: 500 · Separador default: `;` (alt `,`/tab) · Delimitador default: `"`

## Textos literais

### Status do Ciclo (chips)
- "Rascunho" · "Programado" · "Em andamento" · "Finalizado" (terminal, não reabrível)

### Status da Campanha (chips)
- "Rascunho" · "Aguardando pares" · "Agendada" · "Em andamento" · "Encerrada" (terminal)

### Status da Avaliação individual
- "A iniciar" · "Iniciado" · "Início em atraso" · "Aguardando feedback" · "Feedback em atraso" · "Concluída" · badge "Atrasada"

### Estados da coluna Pares (Campanha)
- "Definir pares" · "Aguardando aprovação" · "✓ Aprovado"

### Tipos de Registro (5 visíveis) — "Feedbacks e Anotações"
- "Reconhecimento" · "Ponto de atenção" · "Feedback" · "Devolutiva" · "Anotação"
- Buckets da listagem: "Feedbacks" (Reconhecimento + Ponto de atenção + Feedback + Devolutiva) e "Anotações" (só Anotação)

### Navegação
- Menu primário: "Gestão de Time(s)" (Admin/Líder) · submenu "Desenvolvimento" · módulo "Feedbacks e Anotações"
- Abas do Colaborador: "Avaliações a preencher" · "Feedbacks recebidos"

### Métodos de finalização (labels)
- "Reunião de consenso (líder + liderado)" · "Reunião de consenso (líder + RH)" · "Adoção da nota do líder"

### Upload de CSV (DHO)
- Dropzone: "Arraste o arquivo ou clique para selecionar"
- Erro de formato: "Formato do arquivo não suportado. Tente novamente."
- Erro de tamanho: "Arquivo acima do tamanho máximo suportado. Tente novamente."

### Toasts e mensagens (a confirmar literal via recon — marcadas REVISAR-FIGMA nos passos)
- Sucesso de save (ciclo/campanha/formulário/usuário), "Rascunho salvo", prorrogação de prazo, devolutiva registrada, exclusão.

## Modais relevantes

> Regra Chakra: modais NÃO fecham por clique fora — apenas no "X" ou tecla ESC. Race-handle deve usar o botão/ESC.
> Os textos literais abaixo marcados (REVISAR-FIGMA) precisam de confirmação no recon live — os dumps de Figma não os trazem.

### Confirmação de exclusão (Ciclo / Campanha / Formulário em Rascunho)
- **Quando aparece**: ação "Excluir" em item Rascunho
- **Texto**: (REVISAR-FIGMA: título e corpo do confirm de exclusão)
- **Botões**: "Confirmar" / "Cancelar"

### Finalizar ciclo com campanhas em andamento
- **Quando aparece**: "Finalizar"/"Encerrar ciclo" em Ciclo "Em andamento" com campanhas ativas
- **Texto**: aviso de impacto + lista das campanhas afetadas (REVISAR-FIGMA: copy exata)
- **Botões**: "Confirmar" / "Cancelar"

### Descartar alterações (form sujo — beforeunload)
- **Quando aparece**: "Cancelar"/sair de form de ciclo/campanha/registro com alterações pendentes
- **Texto**: (REVISAR-FIGMA: copy do aviso de descarte)

### Concluir avaliação
- **Quando aparece**: "Concluir avaliação" na tela de resposta
- **Texto**: "Você não poderá editar após concluir. Deseja continuar?" (REVISAR-FIGMA: confirmar)
- **Botões**: "Continuar" / "Cancelar"

### Justificar movimentação (Calibração 9-box)
- **Quando aparece**: arrastar chip entre quadrantes
- **Texto**: comentário obrigatório (REVISAR-FIGMA: título do modal + nomes literais dos quadrantes, ex. "Estrela"/"Especialista")
- **Botões**: "Confirmar" / "Cancelar"

### Aprovar pares
- **Quando aparece**: "Aprovar pares" numa campanha com coleta de pares
- **Texto**: (REVISAR-FIGMA: título/corpo do confirm de aprovação de pares)

### Exclusão de dados Trial (widget Sophia)
- **Quando aparece**: ícone Sophia (canto inferior esquerdo) → "Excluir informações"
- **Opções**: SophiaTech / Admin / Usuários / Tudo
- **Botão**: "Excluir"

### Modais de liberação (plataforma)
- "Modal beta" / "Modal launch" — componentes de liberação Twygo (REVISAR-FIGMA: corpo).

## Campos e validações

| Campo | Tipo | Obrigatório | Limite/Enum | Observação |
|---|---|---|---|---|
| Nome (Ciclo) | input texto | Sim | — | único obrigatório p/ salvar rascunho |
| Data de início / fim (Ciclo) | input data | Sim (p/ ativar) | — | derivam o tipo do ciclo (RN 7) |
| Tipo do ciclo | derivado | — | Mensal/Trimestral/Semestral/Anual/Personalizado | read-only |
| Avaliações do ciclo | multi-select | Não | desempenho/experiencia/9-box/analise-perfis | default desempenho |
| Nome (Campanha) | input texto | Sim | — | — |
| Pesos por tipo de coleta | input numérico | Sim | soma = 100% | submit bloqueado se ≠ 100 |
| Data fim (Campanha) | input data | Sim | ≤ data fim do ciclo | date picker bloqueia |
| Email (Usuário) | input texto | Sim | regex email; único na org | RN 8 |
| Nome / Sobrenome (Usuário) | input texto | Sim | — | RN 7 |
| cargoNivel | dropdown | Não | enum 7 valores | — |
| liderDiretoId | dropdown | Não | Pessoa ativa ≠ a própria | desativada não selecionável (RN 3) |
| Data de admissão / no cargo | input data | Não | — | sem validação cross-data (RN 9) |
| Arquivo CSV (importação) | upload | Sim | .csv, ≤5MB, ≤500 linhas | RN 15 |
| Comentário de calibração | textarea | Sim (em movimentação manual) | — | RN 31 |
| Pontos fortes / Áreas a desenvolver (Devolutiva) | textarea | Sim | — | Recomendações e Comentário opcionais (RN 30) |

---
suite: Ciclos — Listagem e Filtros
executor: playwright
org: principal
playbooks: [filtro-drawer, toast-chakra]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin na organização principal
  - Existem ciclos pré-cadastrados nos status "Rascunho", "Programado", "Em andamento" e "Finalizado"
---

# Ciclos — Listagem e Filtros

## TC1 — Tab "Todos os ciclos" carrega por default com a tabela de ciclos
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 1

### Objetivo
Garantir que ao entrar no módulo Desenvolvimento a tab "Todos os ciclos" já está ativa com a tabela carregada (RN 1).

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → URL contém 'dashboard'
2. Clicar no submenu 'Gestão de Time(s)'
   → Submenu "Desenvolvimento" é exibido
3. Clicar no submenu 'Desenvolvimento'
   → Aba "Todos os ciclos" está selecionada
4. Aguardar a tabela de ciclos ser exibida
   → Listagem exibe os ciclos da organização

## TC2 — Colunas da tabela de ciclos
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 1, 4

### Objetivo
Garantir que a tabela exibe as colunas previstas e que NÃO exibe coluna de Tipo (RN 4 — derivação interna, removida da UI).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba "Todos os ciclos" está selecionada
2. Aguardar o cabeçalho 'Nome' ser exibido
   → Cabeçalho de coluna "Nome" exibido
3. Aguardar o cabeçalho 'Período' ser exibido
   → Cabeçalho de coluna "Período" exibido
4. Aguardar o cabeçalho 'Status' ser exibido
   → Cabeçalho de coluna "Status" exibido
5. Aguardar o cabeçalho 'Ações' ser exibido
   → Cabeçalho de coluna "Ações" exibido
6. Aguardar a tabela ser exibida
   → Cabeçalho de coluna "Tipo" não está presente na tabela

## TC3 — Chips de status distintos por ciclo
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 1

### Objetivo
Garantir que cada status do ciclo é exibido com chip visual distinto (RN 1).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba "Todos os ciclos" está selecionada
2. Aguardar o chip 'Rascunho' ser exibido
   → Chip "Rascunho" exibido
3. Aguardar o chip 'Programado' ser exibido
   → Chip "Programado" exibido
4. Aguardar o chip 'Em andamento' ser exibido
   → Chip "Em andamento" exibido
5. Aguardar o chip 'Finalizado' ser exibido
   → Chip "Finalizado" exibido

## TC4 — Busca por nome filtra a listagem
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 5

### Objetivo
Garantir que a busca por nome filtra os ciclos por substring (RN 5).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba "Todos os ciclos" está selecionada
2. Preencher o campo 'Buscar por nome' com 'Semestral'
   → Listagem exibe apenas ciclos cujo nome contém "Semestral"

## TC5 — Filtro por status (multi-select) via drawer
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 5

### Objetivo
Garantir que o filtro por status é multi-select e restringe a listagem (RN 5). Filtro abre via drawer Chakra.

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba "Todos os ciclos" está selecionada
2. Clicar no botão 'Filtrar'
   → Drawer de filtros é exibido
3. Marcar 'Em andamento' no filtro de status
   → Opção "Em andamento" marcada
4. Marcar 'Programado' no filtro de status
   → Opção "Programado" marcada
5. Clicar no botão 'Aplicar'
   → Listagem exibe apenas ciclos nos status "Em andamento" e "Programado"

## TC6 — Limpar filtros restaura a listagem
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 5

### Objetivo
Garantir que limpar o filtro restaura a listagem completa (RN 5).

### Passos
1. Clicar no botão 'Filtrar'
   → Drawer de filtros é exibido
2. Marcar 'Rascunho' no filtro de status
   → Opção "Rascunho" marcada
3. Clicar no botão 'Aplicar'
   → Listagem exibe apenas ciclos no status "Rascunho"
4. Clicar no botão 'Limpar filtro'
   → Listagem exibe ciclos de todos os status novamente

## TC7 — Menu de ações de ciclo Finalizado não oferece "Reabrir"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 2

### Objetivo
Garantir que ciclo "Finalizado" é estado terminal — menu de ações não exibe "Reabrir" (RN 2).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba "Todos os ciclos" está selecionada
2. Clicar no menu de ações do ciclo no status 'Finalizado'
   → Menu de ações é exibido
3. Aguardar o menu de ações ser exibido
   → Opção "Reabrir" não está presente no menu

## TC8 — Excluir só disponível em ciclo Rascunho, com confirmação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 3

### Objetivo
Garantir que "Excluir" só aparece em ciclo Rascunho e pede confirmação antes de deletar (RN 3).

### Passos
1. Clicar no menu de ações do ciclo no status 'Rascunho'
   → Opção "Excluir" é exibida
2. Clicar no link 'Excluir'
   → Modal de confirmação de exclusão é exibido (REVISAR-FIGMA: título/corpo do modal de exclusão de ciclo)

## TC9 — Excluir NÃO disponível em ciclo não-Rascunho
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 3

### Objetivo
Garantir que ciclo "Em andamento" não oferece a ação "Excluir" (RN 3).

### Passos
1. Clicar no menu de ações do ciclo no status 'Em andamento'
   → Menu de ações é exibido
2. Aguardar o menu de ações ser exibido
   → Opção "Excluir" não está presente no menu

## TC10 — Duplicar ciclo gera novo Rascunho
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 6.1

### Objetivo
Garantir que "Duplicar" cria um novo ciclo em Rascunho com nome iniciado por "Cópia de" (RN 6.1).

### Passos
1. Clicar no menu de ações do ciclo no status 'Em andamento'
   → Opção "Duplicar" é exibida
2. Clicar no link 'Duplicar'
   → Listagem exibe um novo ciclo com nome iniciado por "Cópia de"
3. Aguardar a linha do novo ciclo ser exibida
   → Chip "Rascunho" exibido na linha do ciclo "Cópia de"

---
suite: Ciclos — Criação e Estados
executor: playwright
org: principal
playbooks: [switch-chakra, beforeunload, toast-chakra]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin na organização principal
  - Existe pelo menos um modelo de formulário de avaliação disponível para seleção
  - Não há ciclo "Em andamento" com período sobreposto às datas usadas nos testes (exceto onde o TC exige o conflito)
---

# Ciclos — Criação e Estados

## TC1 — Abrir form de novo ciclo com as 4 seções
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 7

### Objetivo
Garantir que "Novo ciclo" abre o form com as 4 seções previstas (RN 7).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba "Todos os ciclos" está selecionada
2. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
3. Aguardar a aba 'Avaliações' ser exibida
   → Aba "Avaliações" exibida
4. Aguardar a aba 'Etapas' ser exibida
   → Aba "Etapas" exibida
5. Aguardar a aba 'Configurações adicionais' ser exibida
   → Aba "Configurações adicionais" exibida

## TC2 — Salvar como Rascunho com nome vazio é bloqueado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 12

### Objetivo
Garantir que Salvar rascunho bloqueia quando o Nome está vazio (RN 12).

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Clicar no botão 'Salvar rascunho'
   → Campo "Nome" exibe mensagem de obrigatoriedade e o ciclo não é salvo

## TC3 — Salvar como Rascunho permitido só com o Nome
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 12

### Objetivo
Garantir que Salvar rascunho é permitido apenas com o Nome preenchido, mesmo com demais campos incompletos (RN 12).

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Preencher o campo 'Nome' com 'Ciclo Rascunho QA'
   → Campo "Nome" preenchido com "Ciclo Rascunho QA"
3. Clicar no botão 'Salvar rascunho'
   → Toast exibida: "Rascunho salvo" (REVISAR-FIGMA: texto exato da toast de rascunho salvo)
4. Aguardar a linha do ciclo 'Ciclo Rascunho QA' ser exibida
   → Chip "Rascunho" exibido na linha do ciclo "Ciclo Rascunho QA"

## TC4 — Tipo "Trimestral" derivado de período de 90 dias
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 7

### Objetivo
Garantir que datas de 90 dias derivam o tipo "Trimestral", sem chip de detecção no form (RN 7).

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Preencher o campo 'Nome' com 'Ciclo Trimestral QA'
   → Campo "Nome" preenchido com "Ciclo Trimestral QA"
3. Preencher o campo 'Data de início' com '01/01/2026'
   → Campo "Data de início" preenchido com "01/01/2026"
4. Preencher o campo 'Data de fim' com '31/03/2026'
   → Campo "Data de fim" preenchido com "31/03/2026"
5. Clicar no botão 'Salvar rascunho'
   → Toast exibida: "Rascunho salvo" (REVISAR-FIGMA: confirmar persistência do tipo "Trimestral")

## TC5 — Tipo "Personalizado" derivado de período de 50 dias
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 7

### Objetivo
Garantir que um range de 50 dias resulta em tipo "Personalizado" (RN 7).

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Preencher o campo 'Nome' com 'Ciclo Personalizado QA'
   → Campo "Nome" preenchido com "Ciclo Personalizado QA"
3. Preencher o campo 'Data de início' com '01/01/2026'
   → Campo "Data de início" preenchido com "01/01/2026"
4. Preencher o campo 'Data de fim' com '20/02/2026'
   → Campo "Data de fim" preenchido com "20/02/2026"
5. Clicar no botão 'Salvar rascunho'
   → Toast exibida: "Rascunho salvo" (REVISAR-FIGMA: confirmar persistência do tipo "Personalizado")

## TC6 — Avaliação de Desempenho sem modelo bloqueia ativar ciclo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [switch-chakra]
**RNs cobertas**: 7.1

### Objetivo
Garantir que marcar "Avaliação de Desempenho" sem selecionar modelo de formulário bloqueia "Ativar ciclo" (RN 7.1). REVISAR: PRD diverge "Salvar e Programar" vs "Salvar e Ativar" — adotado "Ativar ciclo".

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Preencher o campo 'Nome' com 'Ciclo Sem Modelo QA'
   → Campo "Nome" preenchido com "Ciclo Sem Modelo QA"
3. Clicar na aba 'Avaliações'
   → Aba "Avaliações" é exibida
4. Marcar 'Avaliação de Desempenho'
   → Opção "Avaliação de Desempenho" marcada
5. Clicar no botão 'Ativar ciclo'
   → Aba "Avaliações" exibe indicador de pendência e mensagem de modelo de formulário obrigatório

## TC7 — Método ponderado com pesos somando 80% bloqueia ativar ciclo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 10, 11

### Objetivo
Garantir que método "ponderado" com pesos somando 80% bloqueia "Ativar ciclo" com erro de soma (RN 10, RN 11).

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Clicar na aba 'Etapas'
   → Aba "Etapas" é exibida
3. Selecionar 'ponderado' no dropdown 'Método de finalização'
   → Campo "Método de finalização" exibe "ponderado"
4. Preencher os pesos dos tipos de coleta somando 80%
   → Soma dos pesos exibida é "80%"
5. Clicar no botão 'Ativar ciclo'
   → Mensagem de erro "Pesos devem somar 100%" é exibida

## TC8 — configPares expõe modo, quantidade esperada e mínimo
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 9

### Objetivo
Garantir que a aba Etapas expõe os sub-campos de configPares com defaults (qtdEsperada=5, minimoEncerrar=2) (RN 9).

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Clicar na aba 'Etapas'
   → Aba "Etapas" é exibida
3. Aguardar o campo 'Quantidade esperada' ser exibido
   → Campo "Quantidade esperada" exibe valor "5"
4. Aguardar o campo 'Mínimo para encerrar' ser exibido
   → Campo "Mínimo para encerrar" exibe valor "2"

## TC9 — Threshold de discrepância: slider aparece ao ativar
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [switch-chakra]
**RNs cobertas**: 7.1

### Objetivo
Garantir que na aba "Configurações adicionais" o threshold inicia desmarcado e o slider (default 1.5) só aparece quando ativado.

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Clicar na aba 'Configurações adicionais'
   → Aba "Configurações adicionais" é exibida
3. Aguardar o checkbox de threshold ser exibido
   → Checkbox "Threshold de discrepância" está desmarcado
4. Marcar 'Threshold de discrepância'
   → Slider de threshold é exibido com valor "1.5"

## TC10 — Cancelar form de ciclo com alterações dispara aviso de saída
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [beforeunload]
**RNs cobertas**: 12

### Objetivo
Garantir que sair do form com alterações pendentes dispara o diálogo de descarte (beforeunload).

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Preencher o campo 'Nome' com 'Ciclo Descarte QA'
   → Campo "Nome" preenchido com "Ciclo Descarte QA"
3. Clicar no botão 'Cancelar'
   → Diálogo de descarte de alterações é exibido (REVISAR-FIGMA: copy do aviso de saída com alterações pendentes)

## TC11 — Ativar ciclo válido transiciona para Programado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 12

### Objetivo
Garantir que ao Ativar um ciclo com obrigatórios preenchidos e data de início futura ele entra em "Programado".

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Preencher o campo 'Nome' com 'Ciclo Programado QA'
   → Campo "Nome" preenchido com "Ciclo Programado QA"
3. Preencher o campo 'Data de início' com '01/07/2026'
   → Campo "Data de início" preenchido com "01/07/2026"
4. Preencher o campo 'Data de fim' com '30/09/2026'
   → Campo "Data de fim" preenchido com "30/09/2026"
5. Clicar na aba 'Avaliações'
   → Aba "Avaliações" é exibida
6. Marcar 'Avaliação de Experiência'
   → Opção "Avaliação de Experiência" marcada
7. Clicar no botão 'Ativar ciclo'
   → Toast exibida: "Ciclo programado" (REVISAR-FIGMA: texto exato da toast de ativação)
8. Aguardar a linha do ciclo 'Ciclo Programado QA' ser exibida
   → Chip "Programado" exibido na linha do ciclo "Ciclo Programado QA"

## TC12 — Edição de ciclo Em andamento só permite prorrogar prazo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 8

### Objetivo
Garantir que ciclo "Em andamento" só permite prorrogar prazo (alterar dataFim), com datas planejadas read-only, registrando histórico (RN 8).

### Passos
1. Clicar no menu de ações do ciclo no status 'Em andamento'
   → Opção "Prorrogar prazo" é exibida
2. Clicar no link 'Prorrogar prazo'
   → Campo "Data de fim" está habilitado para edição
3. Aguardar o campo 'Data de início planejada' ser exibido
   → Campo "Data de início planejada" está desabilitado
4. Preencher o campo 'Data de fim' com '31/10/2026'
   → Campo "Data de fim" preenchido com "31/10/2026"
5. Clicar no botão 'Confirmar'
   → Toast exibida: "Prazo prorrogado" (REVISAR-FIGMA: texto da confirmação de prorrogação)

## TC13 — Ativar ciclo com período sobreposto a outro Em andamento é bloqueado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 13

### Objetivo
Garantir que não é possível Ativar um ciclo cujo período se sobrepõe ao de outro ciclo já "Em andamento" (RN 13).

### Passos
1. Clicar no botão 'Novo ciclo'
   → Aba "Identificação" é exibida
2. Preencher o campo 'Nome' com 'Ciclo Sobreposto QA'
   → Campo "Nome" preenchido com "Ciclo Sobreposto QA"
3. Preencher o campo 'Data de início' com '01/06/2026'
   → Campo "Data de início" preenchido com "01/06/2026"
4. Preencher o campo 'Data de fim' com '30/06/2026'
   → Campo "Data de fim" preenchido com "30/06/2026"
5. Clicar no botão 'Ativar ciclo'
   → Mensagem de erro de período sobreposto é exibida (REVISAR-FIGMA: texto do erro de sobreposição)

---
suite: Campanhas — Configuração, Tipos e Pesos
executor: playwright
org: principal
playbooks: [switch-chakra, toast-chakra]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin
  - Ciclo 'Ciclo Anual 2026' no status 'Programado' com tipos de avaliação 'Avaliação de Desempenho' e '9-box', modo de pares 'sorteio'
  - Formulário 'Avaliação de Desempenho — Padrão' disponível no catálogo
---

# Campanhas — Configuração, Tipos e Pesos

## TC1 — Criar campanha herda tipos de avaliação do ciclo como read-only
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 14

### Objetivo
Garantir que a campanha herde os tipos de avaliação configurados no ciclo, exibidos como read-only (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Anual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Anual 2026' é exibida
4. Clicar no botão 'Nova campanha'
   → Form 'Nova campanha' é exibido
5. Aguardar a seção 'Tipos de avaliação' ser exibida
   → Tipos 'Avaliação de Desempenho' e '9-box' são exibidos como read-only
6. Clicar no tipo 'Avaliação de Desempenho'
   → Campo 'Avaliação de Desempenho' está desabilitado

## TC2 — Configuração por tipo: coleta, anonimato, datas e precedência
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [switch-chakra]
**RNs cobertas**: 14

### Objetivo
Validar que cada tipo de avaliação tem sua própria config de tipos de coleta, anonimato, datas e precedência (dependeDe) (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Anual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Anual 2026' é exibida
4. Clicar no botão 'Nova campanha'
   → Form 'Nova campanha' é exibido
5. Clicar na aba de configuração do tipo 'Avaliação de Desempenho'
   → Seção 'Tipos de coleta' do tipo 'Avaliação de Desempenho' é exibida
6. Marcar 'Auto' na seção 'Tipos de coleta'
   → Campo 'Auto' marcado
7. Ativar o switch 'Anonimato' do tipo de coleta 'Pares'
   → Switch 'Anonimato' está ativado
8. Preencher o campo 'Data de início' com '01/02/2026'
   → Campo 'Data de início' preenchido
9. Selecionar 'Avaliação de Desempenho' no dropdown 'Depende de'
   → Opção 'Avaliação de Desempenho' é exibida no campo 'Depende de'

## TC3 — Validação de soma de pesos em tempo real e bloqueio se ≠ 100%
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 14

### Objetivo
Garantir que a soma dos pesos seja exibida em tempo real e o submit fique bloqueado quando ≠ 100% (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Anual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Anual 2026' é exibida
4. Clicar no botão 'Nova campanha'
   → Form 'Nova campanha' é exibido
5. Preencher o campo 'Peso' do tipo de coleta 'Auto' com '50'
   → Indicador de pesos exibido: "Pesos: 50% · falta 50%"
6. Preencher o campo 'Peso' do tipo de coleta 'Líder' com '30'
   → Indicador de pesos exibido: "Pesos: 80% · falta 20%"
7. Clicar no botão 'Salvar'
   → Botão "Salvar" está desabilitado
8. Preencher o campo 'Peso' do tipo de coleta 'Líder' com '50'
   → Indicador de pesos exibido: "Pesos: 100%"

## TC4 — Data fim da campanha ≤ data fim do ciclo (date picker bloqueia)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 15

### Objetivo
Garantir que o date picker impede selecionar dataFim de campanha posterior ao fim do ciclo (RN 15).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Anual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Anual 2026' é exibida
4. Clicar no botão 'Nova campanha'
   → Form 'Nova campanha' é exibido
5. Clicar no campo 'Data de término'
   → Date picker do campo 'Data de término' é exibido
6. Aguardar o calendário do campo 'Data de término' ser exibido
   → Datas posteriores a '31/12/2026' estão desabilitadas

## TC5 — Período fora do ciclo é bloqueado no submit com erro
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 15

### Objetivo
Garantir que a campanha com período fora do intervalo do ciclo seja bloqueada no submit (RN 15).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Anual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Anual 2026' é exibida
4. Clicar no botão 'Nova campanha'
   → Form 'Nova campanha' é exibido
5. Preencher o campo 'Nome' com 'Campanha Fora do Ciclo'
   → Campo 'Nome' preenchido
6. Preencher o campo 'Data de início' com '01/06/2027'
   → Campo 'Data de início' preenchido
7. Preencher o campo 'Data de término' com '30/06/2027'
   → Campo 'Data de término' preenchido
8. Clicar no botão 'Salvar'
   → Mensagem inline exibida: "Período fora do ciclo"

## TC6 — Selecionar formulário do catálogo via drawer
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 14

### Objetivo
Garantir que o admin selecione um modelo de formulário do catálogo via drawer (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Anual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Anual 2026' é exibida
4. Clicar no botão 'Nova campanha'
   → Form 'Nova campanha' é exibido
5. Clicar no botão 'Opções de Formulário'
   → Drawer 'Opções de Formulário' é exibido
6. Selecionar 'Avaliação de Desempenho — Padrão' no drawer 'Opções de Formulário'
   → Opção 'Avaliação de Desempenho — Padrão' está marcada
7. Clicar no botão 'Confirmar' do drawer 'Opções de Formulário'
   → Campo 'Formulário' preenchido com 'Avaliação de Desempenho — Padrão'

## TC7 — Público-alvo ausente no form da campanha
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 16

### Objetivo
Confirmar a ausência do campo público-alvo no form da campanha (RN 16 — glossary marca fora de escopo). REVISAR: confirmar se o campo deve ser ocultado ou removido.

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Anual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Anual 2026' é exibida
4. Clicar no botão 'Nova campanha'
   → Form 'Nova campanha' é exibido
5. Aguardar o campo 'Nome' ser exibido
   → Campo 'Público-alvo' não é exibido no form (REVISAR-FIGMA)

---
suite: Campanhas — Aprovação de Pares
executor: playwright
org: principal
playbooks: []
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin
  - Ciclo 'Ciclo Semestral 2026' no status 'Em andamento' com coleta de pares no modo 'sorteio'
  - Ciclo 'Ciclo Manual 2026' no status 'Em andamento' com coleta de pares no modo 'manual'
  - Campanha 'Campanha Pares Sorteio' do ciclo 'Ciclo Semestral 2026' no status 'Aguardando pares' com pares sorteados
  - Campanha 'Campanha Pares Manual' do ciclo 'Ciclo Manual 2026' no status 'Aguardando pares' com indicações concluídas
---

# Campanhas — Aprovação de Pares

## TC1 — Sorteio: coluna Pares fica 'Aguardando aprovação'
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 16.1, 18

### Objetivo
Garantir que, no modo sorteio, após o sistema sortear os avaliadores a coluna Pares exiba 'Aguardando aprovação' (RN 16.1).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Semestral 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Semestral 2026' é exibida
4. Aguardar a linha da campanha 'Campanha Pares Sorteio' ser exibida
   → Estado 'Aguardando aprovação' é exibido na coluna 'Pares' da linha 'Campanha Pares Sorteio'

## TC2 — Sorteio: campanha só avança após 'Aprovar pares'
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 16.1, 18

### Objetivo
Garantir que, no modo sorteio, a campanha só saia de 'Aguardando pares' após o clique em 'Aprovar pares' (RN 18).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Semestral 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Semestral 2026' é exibida
4. Clicar no botão 'Aprovar pares' da linha 'Campanha Pares Sorteio'
   → Modal de aprovação de pares é exibido (REVISAR-FIGMA: título do modal)
5. Clicar no botão 'Confirmar' do modal de aprovação de pares
   → Estado '✓ Aprovado' é exibido na coluna 'Pares' da linha 'Campanha Pares Sorteio'

## TC3 — Manual: coluna Pares fica 'Aguardando aprovação' após indicações
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 16.1, 18

### Objetivo
Garantir que, no modo manual, após as indicações a coluna Pares exiba 'Aguardando aprovação' (RN 16.1).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Manual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Manual 2026' é exibida
4. Aguardar a linha da campanha 'Campanha Pares Manual' ser exibida
   → Estado 'Aguardando aprovação' é exibido na coluna 'Pares' da linha 'Campanha Pares Manual'

## TC4 — Manual: campanha só avança após 'Aprovar pares'
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 16.1, 18

### Objetivo
Garantir que, no modo manual, a campanha só saia de 'Aguardando pares' após o clique em 'Aprovar pares' (RN 18).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Manual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Manual 2026' é exibida
4. Clicar no botão 'Aprovar pares' da linha 'Campanha Pares Manual'
   → Modal de aprovação de pares é exibido (REVISAR-FIGMA: título do modal)
5. Clicar no botão 'Confirmar' do modal de aprovação de pares
   → Estado '✓ Aprovado' é exibido na coluna 'Pares' da linha 'Campanha Pares Manual'

## TC5 — Campanha com pares não aprovados não vai para 'Agendada'
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 17, 18

### Objetivo
Garantir que uma campanha com pares não aprovados permaneça em 'Aguardando pares' ao tentar agendá-la (RN 17).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Manual 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Manual 2026' é exibida
4. Clicar no botão 'Agendar' da linha 'Campanha Pares Manual'
   → Status 'Aguardando pares' é exibido na linha 'Campanha Pares Manual'

## TC6 — Transição 'Aguardando pares' para 'Agendada' após aprovação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 17, 18

### Objetivo
Garantir que, após aprovar os pares, a campanha transite de 'Aguardando pares' para 'Agendada' (RN 17, RN 18).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento'
   → Tab 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Semestral 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Ver campanhas'
   → Listagem de campanhas do ciclo 'Ciclo Semestral 2026' é exibida
4. Clicar no botão 'Aprovar pares' da linha 'Campanha Pares Sorteio'
   → Modal de aprovação de pares é exibido (REVISAR-FIGMA: título do modal)
5. Clicar no botão 'Confirmar' do modal de aprovação de pares
   → Estado '✓ Aprovado' é exibido na coluna 'Pares' da linha 'Campanha Pares Sorteio'
6. Clicar no botão 'Agendar' da linha 'Campanha Pares Sorteio'
   → Status 'Agendada' é exibido na linha 'Campanha Pares Sorteio'

---
suite: Formulários — Catálogo e Custom
executor: playwright
org: principal
playbooks: [filtro-drawer]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin
  - Catálogo de formulários com modelo padrão 'standard' por tipo de avaliação disponível
  - Formulário custom 'Formulário Engenharia 2026' pré-existente no catálogo
---

# Formulários — Catálogo e Custom

## TC1 — Catálogo exibe formulário padrão por tipo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 14

### Objetivo
Garantir que o catálogo traga um modelo padrão por tipo de avaliação (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento/formularios'
   → Listagem de formulários do catálogo é exibida
2. Aguardar a listagem de formulários ser exibida
   → Formulário 'Avaliação de Desempenho — Padrão' é exibido na listagem
3. Aguardar a listagem de formulários ser exibida
   → Formulário 'Avaliação de Experiência — Padrão' é exibido na listagem

## TC2 — Criar formulário custom com sessões e perguntas
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 14

### Objetivo
Garantir o CRUD de formulário custom com sessões e perguntas escala/texto/múltipla escolha (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento/formularios'
   → Listagem de formulários do catálogo é exibida
2. Clicar no botão 'Novo formulário'
   → Form 'Novo formulário' é exibido
3. Preencher o campo 'Nome' com 'Formulário Custom QA'
   → Campo 'Nome' preenchido
4. Selecionar 'Avaliação' no dropdown 'Tipo de questionário'
   → Opção 'Avaliação' é exibida no campo 'Tipo de questionário' (REVISAR: nomenclatura Prova/Pesquisa/Avaliação em aberto)
5. Clicar no botão 'Adicionar sessão'
   → Seção 'Nova sessão' é exibida
6. Preencher o campo 'Título da sessão' com 'Performance'
   → Campo 'Título da sessão' preenchido
7. Clicar no botão 'Adicionar pergunta'
   → Seção 'Nova pergunta' é exibida
8. Selecionar 'Escala' no dropdown 'Tipo de resposta'
   → Opção 'Escala' é exibida no campo 'Tipo de resposta'
9. Preencher o campo 'Enunciado' com 'Qual o nível de entrega?'
   → Campo 'Enunciado' preenchido
10. Clicar no botão 'Salvar'
    → Toast exibida: "Formulário salvo com sucesso" (REVISAR-FIGMA: texto da toast)

## TC3 — Editar formulário custom adicionando pergunta de texto
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 14

### Objetivo
Garantir a edição de formulário custom existente com pergunta do tipo texto (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento/formularios'
   → Listagem de formulários do catálogo é exibida
2. Clicar no menu de ações da linha do formulário 'Formulário Engenharia 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Editar'
   → Form 'Editar formulário' é exibido
4. Clicar no botão 'Adicionar pergunta'
   → Seção 'Nova pergunta' é exibida
5. Selecionar 'Texto' no dropdown 'Tipo de resposta'
   → Opção 'Texto' é exibida no campo 'Tipo de resposta'
6. Preencher o campo 'Enunciado' com 'Descreva os principais resultados'
   → Campo 'Enunciado' preenchido
7. Clicar no botão 'Salvar'
   → Toast exibida: "Formulário salvo com sucesso" (REVISAR-FIGMA: texto da toast)

## TC4 — Adicionar pergunta de múltipla escolha
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 14

### Objetivo
Garantir a adição de pergunta de múltipla escolha com opções (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento/formularios'
   → Listagem de formulários do catálogo é exibida
2. Clicar no menu de ações da linha do formulário 'Formulário Engenharia 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Editar'
   → Form 'Editar formulário' é exibido
4. Clicar no botão 'Adicionar pergunta'
   → Seção 'Nova pergunta' é exibida
5. Selecionar 'Múltipla escolha' no dropdown 'Tipo de resposta'
   → Campo 'Opções' é exibido
6. Preencher o campo 'Opção 1' com 'Atingiu as metas'
   → Campo 'Opção 1' preenchido
7. Clicar no botão 'Adicionar opção'
   → Campo 'Opção 2' é exibido
8. Preencher o campo 'Opção 2' com 'Superou as metas'
   → Campo 'Opção 2' preenchido

## TC5 — Filtrar catálogo por tipo de questionário via drawer
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [filtro-drawer]
**RNs cobertas**: 14

### Objetivo
Garantir que o catálogo seja filtrável por tipo de questionário via drawer (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento/formularios'
   → Listagem de formulários do catálogo é exibida
2. Clicar no botão 'Filtrar'
   → Drawer 'Filtros' é exibido
3. Marcar 'Pesquisa' no filtro 'Tipo de questionário'
   → Opção 'Pesquisa' está marcada (REVISAR: nomenclatura Prova/Pesquisa/Avaliação)
4. Clicar no botão 'Aplicar filtros'
   → Listagem de formulários filtrada por 'Pesquisa' é exibida

## TC6 — Excluir formulário custom do catálogo
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 14

### Objetivo
Garantir a exclusão de um formulário custom do catálogo (RN 14).

### Passos
1. Acessar a URL '/o/{orgId}/desenvolvimento/formularios'
   → Listagem de formulários do catálogo é exibida
2. Clicar no menu de ações da linha do formulário 'Formulário Engenharia 2026'
   → Menu de ações da linha é exibido
3. Clicar na opção 'Excluir'
   → Modal de confirmação de exclusão é exibido (REVISAR-FIGMA: título do modal)
4. Clicar no botão 'Confirmar'
   → Toast exibida: "Formulário excluído com sucesso" (REVISAR-FIGMA: texto da toast)

---
suite: Avaliações — Responder (Colaborador)
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Colaborador
  - Campanha 'Ciclo Semestral 2026.1' no status 'Em andamento' com avaliações pendentes para o Colaborador (Auto, Liderado e Pares)
---

# Avaliações — Responder (Colaborador)

## TC1 — Listar avaliações pendentes com chips de papel, badge Atrasada, progresso e prazo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 8

### Objetivo
Garantir que a aba "Avaliações a preencher" lista as pendências do Colaborador com chip de papel, badge de atraso, progresso e prazo.

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard do Colaborador é exibido
2. Selecionar "Colaborador" no popover de perfil (canto superior direito)
   → Hub de Desenvolvimento do Colaborador é exibido
3. Clicar na aba "Avaliações a preencher"
   → Tabela de avaliações pendentes é exibida
4. Aguardar a linha da auto-avaliação ser exibida
   → Chip "Auto" exibido na coluna Papel
5. Aguardar uma avaliação com prazo vencido ser exibida
   → Badge "Atrasada" exibido na linha
6. Aguardar a coluna Progresso ser exibida
   → Coluna Progresso exibe percentual e a coluna Prazo exibe a data limite

## TC2 — Responder via SectionNav com escala obrigatória e texto opcional
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 8

### Objetivo
Validar o preenchimento de uma auto-avaliação navegando por sessões, com banner de papel, escala obrigatória e texto opcional.

### Passos
1. Clicar na aba "Avaliações a preencher"
   → Tabela de avaliações pendentes é exibida
2. Clicar na linha da avaliação com chip "Auto"
   → Tela de resposta da avaliação é exibida
3. Aguardar o banner de papel ser exibido
   → Banner exibido com o texto "Sua auto-avaliação"
4. Clicar na primeira sessão no SectionNav
   → Perguntas da sessão são exibidas
5. Marcar a opção de pontuação na pergunta escala obrigatória
   → Progresso da sessão no SectionNav é atualizado
6. Preencher o campo da pergunta texto com "Comentário opcional de teste"
   → Campo de texto exibe o conteúdo digitado

## TC3 — Salvar rascunho preserva respostas e posição da sessão
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 9

### Objetivo
Garantir que "Salvar rascunho" preserva respostas parciais e a posição da sessão, deixando a avaliação como "Iniciado".

### Passos
1. Clicar na linha da avaliação com chip "Auto"
   → Tela de resposta da avaliação é exibida
2. Clicar na segunda sessão no SectionNav
   → Perguntas da segunda sessão são exibidas
3. Marcar a opção de pontuação na pergunta escala obrigatória
   → Progresso da sessão é atualizado
4. Clicar no botão "Salvar rascunho"
   → Toast exibida: "Rascunho salvo" (REVISAR-FIGMA: texto exato; gap-15 — protótipo só exibe toast sem persistir)
5. Clicar no botão "Voltar"
   → Tabela de avaliações pendentes é exibida com Status "Iniciado" na linha
6. Clicar novamente na linha da avaliação com chip "Auto"
   → Segunda sessão permanece selecionada e a resposta marcada é exibida

## TC4 — Concluir avaliação aciona confirm e deixa a tela read-only
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 11

### Objetivo
Validar que concluir uma avaliação com todas as escalas preenchidas aciona confirm e deixa a avaliação read-only definitivo.

### Passos
1. Clicar na linha da avaliação com chip "Auto"
   → Tela de resposta da avaliação é exibida
2. Marcar a opção de pontuação em todas as perguntas escala obrigatórias
   → Botão "Concluir avaliação" deixa de estar desabilitado
3. Clicar no botão "Concluir avaliação"
   → Modal "Concluir avaliação" é exibido com o texto "Você não poderá editar após concluir. Deseja continuar?"
4. Clicar no botão "Continuar"
   → Toast exibida: "Avaliação concluída" (REVISAR-FIGMA: texto exato)
5. Clicar na linha da avaliação concluída
   → Tela fica em modo somente leitura

## TC5 — Submit incompleto destaca as sessões pendentes no SectionNav
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 10

### Objetivo
Garantir que com pergunta escala vazia o botão Concluir fica desabilitado e a sessão pendente é destacada.

### Passos
1. Clicar na linha da avaliação com chip "Pares"
   → Tela de resposta da avaliação é exibida
2. Marcar a opção de pontuação nas perguntas escala de todas as sessões exceto a última
   → Progresso superior exibe percentual parcial
3. Aguardar o botão "Concluir avaliação" ser exibido
   → Botão "Concluir avaliação" está desabilitado
4. Clicar na última sessão no SectionNav
   → Sessão com pergunta escala vazia fica destacada no SectionNav (REVISAR-FIGMA: destaque vermelho depende de gap-05 — RN 10)

## TC6 — Rever avaliação concluída em modo read-only
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 11

### Objetivo
Validar que uma avaliação concluída abre em read-only, com data de conclusão e campos não-interativos.

### Passos
1. Clicar na aba "Avaliações a preencher"
   → Tabela de avaliações é exibida
2. Selecionar "Concluído" no dropdown "Status"
   → Lista exibe apenas avaliações concluídas
3. Clicar na linha de uma avaliação concluída
   → Tela de resposta da avaliação é exibida
4. Aguardar o banner de papel ser exibido
   → Banner exibe a data de conclusão (REVISAR-FIGMA: formato do sufixo de data)
5. Clicar em uma pergunta escala da tela
   → Tela fica em modo somente leitura

---
suite: Avaliações — Pendências e Responder (Líder)
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Líder com liderados diretos
  - Campanha 'Ciclo Semestral 2026.1' no status 'Em andamento' com avaliações distribuídas ao Líder em múltiplos papéis
---

# Avaliações — Pendências e Responder (Líder)

## TC1 — Listar "Minhas avaliações pendentes" multi-papel por ciclo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 12

### Objetivo
Garantir que o Líder vê a aba "Avaliações a preencher" com chips de papel e filtro por ciclo, restrita ao escopo de liderados diretos (RN 12).

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard é exibido
2. Selecionar "Líder" no popover de perfil (canto superior direito)
   → Módulo de Desenvolvimento do Líder é exibido com a aba "Avaliações a preencher" ativa
3. Aguardar a tabela de avaliações ser exibida
   → Chip "Líder" exibido na linha de avaliação sobre liderado direto
4. Selecionar "Ciclo Semestral 2026.1" no dropdown "Ciclo"
   → Lista exibe apenas avaliações do ciclo selecionado
5. Aguardar a coluna Avaliado ser exibida
   → Linhas exibem somente liderados diretos do Líder

## TC2 — Responder avaliação do liderado com banner de papel Líder
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 12

### Objetivo
Validar o preenchimento de uma avaliação onde o Líder avalia um liderado direto.

### Passos
1. Clicar na aba "Avaliações a preencher"
   → Tabela de avaliações é exibida
2. Clicar na linha com chip "Líder"
   → Tela de resposta da avaliação é exibida
3. Aguardar o banner de papel ser exibido
   → Banner exibe o texto "Como líder · avaliando" (REVISAR-FIGMA: nome do liderado depende do seed)
4. Marcar a opção de pontuação na pergunta escala obrigatória da primeira sessão
   → Progresso da sessão no SectionNav é atualizado

## TC3 — Salvar rascunho N vezes preserva respostas e posição
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 9

### Objetivo
Garantir que salvar rascunho repetidamente preserva respostas acumuladas e a posição da sessão.

### Passos
1. Clicar na linha com chip "Líder"
   → Tela de resposta da avaliação é exibida
2. Marcar a opção de pontuação na pergunta escala da primeira sessão
   → Progresso da primeira sessão é atualizado
3. Clicar no botão "Salvar rascunho"
   → Toast exibida: "Rascunho salvo" (REVISAR-FIGMA: texto; gap-15)
4. Clicar na segunda sessão no SectionNav
   → Perguntas da segunda sessão são exibidas
5. Marcar a opção de pontuação na pergunta escala da segunda sessão
   → Progresso da segunda sessão é atualizado
6. Clicar no botão "Salvar rascunho"
   → As respostas das duas sessões permanecem marcadas

## TC4 — Concluir avaliação do liderado deixa a tela read-only
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 19

### Objetivo
Validar que o Líder conclui uma avaliação de liderado e, ao reabri-la, a tela é read-only.

### Passos
1. Clicar na linha com chip "Líder"
   → Tela de resposta da avaliação é exibida
2. Marcar a opção de pontuação em todas as perguntas escala obrigatórias
   → Botão "Concluir avaliação" deixa de estar desabilitado
3. Clicar no botão "Concluir avaliação"
   → Modal "Concluir avaliação" é exibido com o texto "Você não poderá editar após concluir. Deseja continuar?"
4. Clicar no botão "Continuar"
   → Toast exibida: "Avaliação concluída" (REVISAR-FIGMA: texto exato)
5. Clicar na linha da avaliação concluída
   → Tela fica em modo somente leitura

---
suite: Dashboard de Acompanhamento (Admin/RH)
executor: playwright
org: principal
playbooks: [filtro-drawer]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin
  - Ciclo 'Ciclo Semestral 2026.1' com duas campanhas no status 'Em andamento' e avaliações em diferentes status (incluindo ao menos uma com prazo vencido)
---

# Dashboard de Acompanhamento (Admin/RH)

## TC1 — Cards de status do dashboard "Status dos times"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 20

### Objetivo
Garantir que a aba "Status dos times" exibe os KPIs consolidados das campanhas ativas (RN 20).

### Passos
1. Clicar no submenu "Desenvolvimento"
   → Módulo de Desenvolvimento é exibido
2. Clicar na aba "Status dos times"
   → Dashboard de acompanhamento é exibido
3. Aguardar os KPIs do topo serem exibidos
   → Card "% concluído" exibe percentual consolidado das campanhas ativas
4. Aguardar a tabela por campanha ser exibida
   → Linha de campanha exibe Status "Em andamento" e a coluna Progresso exibe percentual

## TC2 — Filtrar dashboard por Ciclo via drawer
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [filtro-drawer]
**RNs cobertas**: 22

### Objetivo
Validar que aplicar o filtro de Ciclo no drawer restringe o dashboard às campanhas do ciclo (RN 22).

### Passos
1. Clicar na aba "Status dos times"
   → Dashboard de acompanhamento é exibido
2. Clicar no botão "Filtrar"
   → Drawer de filtros é exibido
3. Selecionar "Ciclo Semestral 2026.1" no dropdown "Ciclo"
   → Opção de ciclo fica selecionada no drawer
4. Clicar no botão "Aplicar"
   → Dashboard exibe apenas campanhas do "Ciclo Semestral 2026.1"

## TC3 — Drill-down por campanha exibe avaliações com badge Atrasada (read-only)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 21, 23

### Objetivo
Garantir que o drill-down de uma campanha lista as avaliações individuais, com badge de atraso e em modo read-only (RN 21, RN 23).

### Passos
1. Clicar na aba "Status dos times"
   → Dashboard de acompanhamento é exibido
2. Clicar no botão "Ver detalhes" da linha de uma campanha ativa
   → Lista de avaliações individuais da campanha é exibida
3. Aguardar a primeira linha da lista ser exibida
   → Badge "Atrasada" exibido na primeira linha
4. Aguardar a coluna Status ser exibida
   → Linhas exibem Status "A iniciar", "Iniciado" e "Concluída"
5. Clicar em uma linha de avaliação concluída
   → Tela fica em modo somente leitura

## TC4 — Filtros combinados (Ciclo + Status) com busca textual
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [filtro-drawer]
**RNs cobertas**: 22

### Objetivo
Validar que filtros acumulativos (Ciclo e Status) combinados com busca textual restringem o dashboard de forma cumulativa (AND) (RN 22).

### Passos
1. Clicar na aba "Status dos times"
   → Dashboard de acompanhamento é exibido
2. Clicar no botão "Filtrar"
   → Drawer de filtros é exibido
3. Selecionar "Ciclo Semestral 2026.1" no dropdown "Ciclo"
   → Opção de ciclo fica selecionada
4. Selecionar "Em andamento" no dropdown "Status"
   → Opção de status fica selecionada
5. Clicar no botão "Aplicar"
   → Dashboard exibe apenas campanhas do ciclo e status selecionados
6. Preencher o campo "Buscar" com "Time A"
   → Dashboard exibe apenas a campanha cujo nome contém "Time A"

---
suite: Status do Time (Líder)
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Líder com liderados diretos
  - Campanha 'Ciclo Semestral 2026.1' no status 'Em andamento' com avaliações distribuídas aos liderados diretos
---

# Status do Time (Líder)

## TC1 — KPIs do time exibidos na aba "Status do time"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 12

### Objetivo
Garantir que a aba "Status do time" exibe os KPIs do time do Líder, com escopo recortado pelos liderados diretos (RN 12).

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard é exibido
2. Selecionar "Líder" no popover de perfil (canto superior direito)
   → Módulo de Desenvolvimento do Líder é exibido
3. Clicar na aba "Status do time"
   → Dashboard do time é exibido
4. Aguardar os KPIs do topo serem exibidos
   → Card "% concluído" exibe percentual do time do Líder

## TC2 — Tabela de liderados restrita ao escopo do time
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 12

### Objetivo
Validar que a tabela de liderados lista apenas subordinados diretos do Líder com contadores (RN 12).

### Passos
1. Clicar na aba "Status do time"
   → Dashboard do time é exibido
2. Aguardar a tabela de liderados ser exibida
   → Tabela exibe apenas liderados diretos do Líder
3. Aguardar a coluna de contadores ser exibida
   → Linha de liderado sem pendências exibe contador "Pendentes" igual a "0"

## TC3 — Drill-down de liderado exibe avaliações em todos os papéis
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 19

### Objetivo
Garantir que o drill-down de um liderado exibe as avaliações em curso dele dentro do escopo do time (RN 19).

### Passos
1. Clicar na aba "Status do time"
   → Dashboard do time é exibido
2. Clicar no botão "Ver detalhes" da linha de um liderado
   → Detalhes de avaliações em curso do liderado são exibidos
3. Aguardar a lista de avaliações do liderado ser exibida
   → Lista exibe avaliações nos papéis Auto, Líder e Pares para o liderado

---
suite: Encerramento e Consolidação
executor: playwright
org: principal
playbooks: [toast-chakra]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin
  - Ciclo 'Ciclo Semestral 2026.1' no status 'Em andamento' com campanhas em andamento
  - Avaliação consolidada existente para um colaborador da campanha
---

# Encerramento e Consolidação

## TC1 — Finalizar ciclo Em andamento com campanhas ativas exige confirmação
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 24

### Objetivo
Garantir que finalizar um ciclo Em andamento com campanhas ativas dispara confirmação listando as campanhas afetadas antes de tornar o ciclo terminal (RN 24).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Semestral 2026.1'
   → Menu de ações é exibido
3. Clicar na opção 'Finalizar'
   → Modal "Finalizar ciclo?" é exibido com aviso de impacto e lista das campanhas afetadas (REVISAR-FIGMA: copy do confirm de finalização)
4. Clicar no botão 'Confirmar'
   → Toast exibida: "Ciclo finalizado" (REVISAR-FIGMA: texto da toast)

## TC2 — Ciclo Finalizado é terminal e ResumoCiclo read-only
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 24, 27

### Objetivo
Verificar que após finalizar o ciclo o estado é terminal (sem "Reabrir") e o card de Consolidação é read-only (RN 24, RN 27).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo no status 'Finalizado'
   → Menu de ações é exibido sem a opção "Reabrir"
3. Clicar na opção 'Ver histórico'
   → Card de Consolidação (ResumoCiclo) é exibido com métricas derivadas
4. Clicar em uma métrica do ResumoCiclo
   → Tela fica em modo somente leitura

## TC3 — Consolidação respeita método de finalização configurado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 24

### Objetivo
Validar o branching da aba Consolidação conforme o método de finalização do Ciclo (RN 24 — gap-02 REVISAR: consenso/ponderado não implementados no protótipo).

### Passos
1. Clicar na aba 'Status dos times'
   → Dashboard de progresso é exibido
2. Clicar no botão 'Ver detalhes' da campanha encerrada
   → Drill-down de avaliações individuais é exibido
3. Clicar no botão 'Consolidar' da linha de um colaborador
   → Aba 'Consolidação' é exibida
4. Aguardar a aba 'Consolidação' ser exibida
   → Para "Adoção da nota do líder", o Select de papel exibe as opções "Auto", "Líder", "Pares" e "Liderado"

## TC4 — Gráfico comparativo exibe curvas por papel com benchmarks em overlay
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 24, 25

### Objetivo
Verificar que a aba Consolidação exibe o gráfico comparativo das notas por papel e os benchmarks como overlay (RN 24, RN 25).

### Passos
1. Clicar na aba 'Status dos times'
   → Dashboard de progresso é exibido
2. Clicar no botão 'Ver detalhes' da campanha encerrada
   → Drill-down de avaliações individuais é exibido
3. Clicar no botão 'Consolidar' da linha de um colaborador
   → Aba 'Consolidação' é exibida
4. Aguardar o gráfico comparativo ser exibido
   → Gráfico comparativo exibe curvas "Auto", "Líder", "Pares" e "Liderado"
5. Aguardar o overlay de benchmarks ser exibido
   → Overlay de benchmarks é exibido sobre o gráfico (REVISAR: fonte do benchmark indefinida — labels a confirmar)

## TC5 — Threshold de discrepância destaca sessão com delta acima do limite
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 25

### Objetivo
Validar que sessão com delta de notas ≥ threshold (default 1.5) recebe destaque de discrepância (RN 25 — gap-11 REVISAR: protótipo cobre só auto × líder).

### Passos
1. Clicar na aba 'Status dos times'
   → Dashboard de progresso é exibido
2. Clicar no botão 'Consolidar' da linha de um colaborador
   → Aba 'Consolidação' é exibida
3. Aguardar a linha de sessão com discrepância ser exibida
   → Sessão com delta ≥ 1.5 é exibida com destaque de discrepância

## TC6 — Concluir consolidação desabilitado enquanto nota final não definida
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 27

### Objetivo
Garantir que o botão "Concluir consolidação" só habilita após a nota final ser definida (RN 27).

### Passos
1. Clicar na aba 'Status dos times'
   → Dashboard de progresso é exibido
2. Clicar no botão 'Consolidar' da linha de um colaborador
   → Aba 'Consolidação' é exibida com a nota final ainda não definida
3. Aguardar o botão 'Concluir consolidação' ser exibido
   → Botão 'Concluir consolidação' está desabilitado
4. Selecionar 'Líder' no dropdown 'Adoção da nota'
   → Botão 'Concluir consolidação' fica habilitado

---
suite: Devolutiva Pós-Avaliação
executor: playwright
org: principal
playbooks: [toast-chakra]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin
  - Ciclo 'Ciclo Semestral 2026.1' no status 'Finalizado'
  - Colaborador 'Colaborador A' com avaliação consolidada
  - Colaborador 'Colaborador B' sem avaliação consolidada
---

# Devolutiva Pós-Avaliação

## TC1 — Botão "Dar devolutiva" só aparece com avaliação consolidada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 21, 30

### Objetivo
Verificar que o botão "Dar devolutiva" aparece para colaborador com avaliação consolidada e fica oculto (não desabilitado) quando ausente (RN 21, RN 30).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar na linha do colaborador 'Colaborador A'
   → Timeline do 'Colaborador A' é exibida com o botão 'Dar devolutiva' na toolbar
3. Clicar no botão 'Voltar'
   → Listagem de colaboradores é exibida
4. Clicar na linha do colaborador 'Colaborador B'
   → Timeline do 'Colaborador B' é exibida sem o botão 'Dar devolutiva'

## TC2 — Salvar devolutiva grava Registro tipo "Devolutiva" visível ao colab
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 30, 33

### Objetivo
Validar que preencher os campos obrigatórios e salvar cria um Registro tipo "Devolutiva" visível ao colaborador, com autorPapel "RH" (RN 30, RN 33).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar na linha do colaborador 'Colaborador A'
   → Timeline do 'Colaborador A' é exibida
3. Clicar no botão 'Dar devolutiva'
   → Tela de devolutiva é exibida com form vazio
4. Preencher o campo 'Pontos fortes' com 'Comunicação assertiva em reuniões'
   → Campo 'Pontos fortes' preenchido
5. Preencher o campo 'Áreas a desenvolver' com 'Delegação de tarefas técnicas'
   → Campo 'Áreas a desenvolver' preenchido
6. Clicar no botão 'Salvar'
   → Toast exibida: "Devolutiva registrada" (REVISAR-FIGMA: texto exato)
7. Aguardar a timeline ser exibida
   → Card de Registro tipo "Devolutiva" é exibido na timeline

## TC3 — Pontos fortes e Áreas a desenvolver são obrigatórios
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 30

### Objetivo
Garantir que salvar sem os campos obrigatórios bloqueia o submit com erro inline (RN 30).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar na linha do colaborador 'Colaborador A'
   → Timeline do 'Colaborador A' é exibida
3. Clicar no botão 'Dar devolutiva'
   → Tela de devolutiva é exibida com form vazio
4. Clicar no botão 'Salvar'
   → Campo 'Pontos fortes' exibe erro inline de campo obrigatório (REVISAR-FIGMA: texto do erro)

## TC4 — Copiloto IA adiciona sugestão ao campo e remove da lista
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 30

### Objetivo
Verificar que o painel Copiloto IA separa sugestões em baldes e que aceitar uma sugestão preenche o campo e a remove do painel (RN 30 — gap-03 REVISAR: 3 baldes vs 4 accordions).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar na linha do colaborador 'Colaborador A'
   → Timeline do 'Colaborador A' é exibida
3. Clicar no botão 'Dar devolutiva'
   → Painel Copiloto IA é exibido à direita com selo de sugestão IA (REVISAR-FIGMA: títulos dos baldes)
4. Clicar na sugestão 'Comunicação assertiva em reuniões' no balde de pontos fortes
   → Campo 'Pontos fortes' é preenchido com o texto da sugestão

## TC5 — Devolutiva existente abre em modo edição pré-preenchido
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 30, 33

### Objetivo
Validar que, havendo Devolutiva para o colaborador no ciclo vigente, o fluxo abre em modo edição com os campos pré-preenchidos (RN 30).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar na linha do colaborador 'Colaborador A'
   → Timeline do 'Colaborador A' é exibida
3. Clicar no botão 'Dar devolutiva'
   → Tela de devolutiva é exibida com os campos pré-preenchidos pela devolutiva existente

---
suite: Calibração 9-box
executor: playwright
org: principal
playbooks: []
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin
  - Ciclo 'Ciclo Trimestral 2026.Q2' no status 'Em andamento' configurado com matriz "9-box" e avaliações consolidadas
  - Ciclo 'Ciclo Semestral 2025.2' no status 'Finalizado' com snapshot de calibração salvo
---

# Calibração 9-box

## TC1 — Calibração com posicionamento automático em matriz 9-box
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 28, 30

### Objetivo
Verificar que a calibração 9-box renderiza a matriz 3×3 com os chips posicionados automaticamente pela nota consolidada (RN 28, RN 30).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba 'Todos os ciclos' é exibida
2. Clicar no menu de ações da linha do ciclo 'Ciclo Trimestral 2026.Q2'
   → Menu de ações é exibido
3. Clicar na opção 'Calibrar 9-box'
   → Matriz 9-box é exibida
4. Aguardar a matriz 9-box ser exibida
   → Matriz exibe quadrante 3×3 com chips de colaboradores posicionados automaticamente

## TC2 — Arrastar chip entre quadrantes exige comentário e registra histórico
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 31

### Objetivo
Validar que reposicionar manualmente um chip via drag-and-drop exige comentário e grava o histórico antes/depois (RN 31).

### Passos
1. Clicar no menu de ações da linha do ciclo 'Ciclo Trimestral 2026.Q2'
   → Menu de ações é exibido
2. Clicar na opção 'Calibrar 9-box'
   → Matriz 9-box é exibida
3. Arrastar 'chip de um colaborador' para 'quadrante superior direito'
   → Modal de justificativa de movimentação é exibido com campo de comentário (REVISAR-FIGMA: título do modal e nomes dos quadrantes)
4. Preencher o campo 'Comentário' com 'Realocado após calibração de consenso'
   → Campo 'Comentário' preenchido
5. Clicar no botão 'Confirmar'
   → Matriz exibe o chip no novo quadrante e o histórico de movimentação é registrado

## TC3 — Movimentação manual sem comentário é bloqueada
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 31

### Objetivo
Garantir que confirmar uma movimentação manual sem comentário é bloqueado (RN 31).

### Passos
1. Clicar no menu de ações da linha do ciclo 'Ciclo Trimestral 2026.Q2'
   → Menu de ações é exibido
2. Clicar na opção 'Calibrar 9-box'
   → Matriz 9-box é exibida
3. Arrastar 'chip de um colaborador' para 'quadrante superior direito'
   → Modal de justificativa de movimentação é exibido com campo de comentário vazio
4. Clicar no botão 'Confirmar'
   → Campo 'Comentário' exibe erro de obrigatoriedade e a movimentação não é gravada

## TC4 — Salvar snapshot mantém edição até Finalizar o ciclo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 32, 33

### Objetivo
Verificar que "Salvar snapshot" grava as posições e a calibração segue editável enquanto o ciclo não está Finalizado (RN 32, RN 33).

### Passos
1. Clicar no menu de ações da linha do ciclo 'Ciclo Trimestral 2026.Q2'
   → Menu de ações é exibido
2. Clicar na opção 'Calibrar 9-box'
   → Matriz 9-box é exibida
3. Clicar no botão 'Salvar snapshot da calibração'
   → Toast exibida: "Snapshot salvo" (REVISAR-FIGMA: texto da toast)
4. Arrastar 'chip de um colaborador' para 'quadrante adjacente'
   → Matriz permanece editável e o chip é movido

## TC5 — Calibração em Ciclo Finalizado é read-only
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 28, 29, 33

### Objetivo
Validar que a calibração de um ciclo Finalizado abre somente leitura (sem drag), e matrizes alternativas com eixos configuráveis são renderizadas (RN 28, RN 29).

### Passos
1. Clicar no menu de ações da linha do ciclo 'Ciclo Semestral 2025.2' no status 'Finalizado'
   → Menu de ações é exibido
2. Clicar na opção 'Calibrar 9-box'
   → Matriz de calibração é exibida
3. Aguardar a matriz de calibração ser exibida
   → Tela fica em modo somente leitura (chips sem drag) (REVISAR-FIGMA: rótulos dos eixos média final/por sessão — gap-14)

---
suite: Visão 9-box Standalone
executor: playwright
org: principal
playbooks: []
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin
  - Snapshots de calibração existentes de múltiplos ciclos para colaboradores da organização
  - Colaborador 'Novo Contratado' sem snapshot de calibração
---

# Visão 9-box Standalone

## TC1 — Visão 9-box renderiza matriz consolidada read-only multi-ciclo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 34, 35

### Objetivo
Verificar que a aba "Visão 9-box" renderiza a matriz consolidada da organização em modo somente leitura (RN 34, RN 35).

### Passos
1. Clicar no submenu 'Desenvolvimento'
   → Aba 'Todos os ciclos' é exibida
2. Clicar na aba 'Visão 9-box'
   → Matriz consolidada da organização é exibida
3. Aguardar a matriz consolidada ser exibida
   → Tela fica em modo somente leitura (chips sem drag)

## TC2 — Filtros acumulativos por área e período restringem a matriz
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 34, 36

### Objetivo
Validar que filtros de área e período aplicados em conjunto (AND) restringem os colaboradores exibidos (RN 34, RN 36).

### Passos
1. Clicar na aba 'Visão 9-box'
   → Matriz consolidada é exibida
2. Selecionar 'Engenharia' no dropdown 'Área'
   → Matriz exibe apenas colaboradores da área Engenharia
3. Selecionar 'Últimos 12 meses' no dropdown 'Período'
   → Matriz exibe apenas colaboradores de Engenharia com snapshots dos últimos 12 meses

## TC3 — Colaborador sem snapshot não aparece na matriz consolidada
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 34

### Objetivo
Garantir que colaborador sem snapshot de calibração não é posicionado na Visão 9-box (RN 34).

### Passos
1. Clicar na aba 'Visão 9-box'
   → Matriz consolidada é exibida
2. Aguardar a matriz consolidada ser exibida
   → Chip do colaborador 'Novo Contratado' não é exibido na matriz (REVISAR: tratamento de colaboradores sem snapshot — Spike)

## TC4 — Side panel do chip exibe timeline de movimentações
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 37, 38

### Objetivo
Verificar que clicar num chip abre side panel com timeline de movimentações entre boxes (RN 37, RN 38 — gap-12 REVISAR: timeline/heatmap parcialmente implementados).

### Passos
1. Clicar na aba 'Visão 9-box'
   → Matriz consolidada é exibida
2. Clicar em um chip de colaborador
   → Side panel é exibido com a timeline de movimentações entre boxes
3. Clicar no botão 'Mapa de calor'
   → Matriz exibe densidade por box sem revelar identidades (REVISAR: modo mapa de calor — gap-12)

---
suite: Feedbacks e Anotações — Admin
executor: playwright
org: principal
playbooks: [toast-chakra]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin na organização principal
  - Organização principal com ao menos 1 colaborador possuindo registros dos 5 tipos
---

# Feedbacks e Anotações — Admin

## TC1 — Listagem exibe buckets "Feedbacks" e "Anotações" com contagens e último registro
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 1, 4

### Objetivo
Validar que a listagem mostra os colaboradores com contagem agregada por bucket (Admin vê totais) e a data do último registro (RN 4).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Aguardar a tabela de colaboradores ser exibida
   → Coluna "Feedbacks" exibida e coluna "Anotações" exibida
3. Aguardar a linha de um colaborador ser exibida
   → Bucket "Feedbacks" exibe a contagem agregada e bucket "Anotações" exibe a contagem
4. Aguardar a coluna "Último registro" ser exibida
   → Coluna "Último registro" exibe a data do registro mais recente

## TC2 — Criar registro tipo "Anotação" exibe chip de visibilidade privada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 9

### Objetivo
Validar a criação de registro ad-hoc (4 tipos criáveis, Devolutiva ausente) e o chip de visibilidade dinâmico ao selecionar "Anotação" (RN 9).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar no botão 'Novo registro'
   → Modal "Adicionar registro" é exibido
3. Aguardar o dropdown 'Tipo' ser exibido
   → Dropdown "Tipo" oferece "Reconhecimento", "Ponto de atenção", "Feedback" e "Anotação" e não oferece "Devolutiva"
4. Selecionar 'Anotação' no dropdown 'Tipo'
   → Chip de visibilidade exibido com o texto "Anotação privada — só você + RH"
5. Preencher o campo 'Comentário' com 'Conversa de alinhamento sobre prazos'
   → Campo "Comentário" preenchido
6. Clicar no botão 'Salvar'
   → Toast exibida: "Anotação adicionada" (REVISAR-FIGMA: texto exato)

## TC3 — Timeline ordena por data desc e filtra por tipo via chips (OR)
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 4

### Objetivo
Validar a timeline completa: ordenação decrescente e filtro por tipo via chips toggle com semântica OR (RN 4).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar na linha de um colaborador
   → Timeline do colaborador é exibida
3. Aguardar a lista de registros ser exibida
   → Registros exibidos em ordem decrescente de data
4. Clicar no chip de filtro 'Reconhecimento'
   → Registro tipo "Reconhecimento" exibido e demais tipos ocultos
5. Clicar no chip de filtro 'Feedback'
   → Registro tipo "Reconhecimento" exibido e Registro tipo "Feedback" exibido

## TC4 — Preview por bucket é read-only e exibe só os tipos do bucket
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 3

### Objetivo
Validar o modal de preview por bucket: lista read-only com os tipos corretos e sem ações de criar/editar/excluir (RN 3).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar no bucket 'Anotações' da linha de um colaborador
   → Modal de preview de "Anotações" é exibido
3. Aguardar a lista do modal de preview ser exibida
   → Registro tipo "Anotação" exibido e nenhum outro tipo exibido
4. Aguardar o corpo do modal de preview ser exibido
   → Botão "Abrir timeline" exibido e nenhum botão de criar, editar ou excluir exibido

## TC5 — Cinco tipos de registro renderizam com identidade visual distinta
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 9

### Objetivo
Validar que os 5 tipos são exibidos com cor/ícone próprios, badge privado na Anotação e campos estruturados da Devolutiva (RN 9).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar na linha de um colaborador
   → Timeline do colaborador é exibida
3. Aguardar o card tipo "Anotação" ser exibido
   → Registro tipo "Anotação" exibido com badge de privado
4. Aguardar o card tipo "Devolutiva" ser exibido
   → Registro tipo "Devolutiva" exibido em modo read-only com os campos "Pontos fortes", "Áreas a desenvolver", "Recomendações" e "Comentário geral"
5. Aguardar os cards de Reconhecimento, Ponto de atenção e Feedback serem exibidos
   → Registro tipo "Reconhecimento", Registro tipo "Ponto de atenção" e Registro tipo "Feedback" exibidos com cores e ícones distintos

---
suite: Feedbacks e Anotações — Líder
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Líder na organização principal
  - Líder com liderados diretos cadastrados e ao menos 1 colaborador fora do seu time
---

# Feedbacks e Anotações — Líder

## TC1 — Listagem mostra apenas liderados diretos do Líder logado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 1

### Objetivo
Validar que a listagem, no perfil Líder, exibe somente os liderados diretos e nenhum outro colaborador (RN 1).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Aguardar a tabela de liderados ser exibida
   → Linha de colaborador liderado direto exibida
3. Aguardar a tabela de liderados ser exibida
   → Nenhuma linha de colaborador fora do time do Líder exibida

## TC2 — Combobox "Para" restringe a liderados diretos
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 4

### Objetivo
Validar que, ao criar registro como Líder, o combobox "Para" só permite liderados diretos (RN 4).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar no botão 'Novo registro'
   → Modal "Adicionar registro" é exibido
3. Preencher o campo 'Para' com nome de liderado direto
   → Liderado direto é exibido na lista do combobox
4. Preencher o campo 'Para' com nome de colaborador fora do time
   → Mensagem exibida: "Nenhum colaborador encontrado"

## TC3 — Acessar timeline de não-liderado retorna HTTP 403
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 7

### Objetivo
Validar o RBAC do perfil Líder: abrir timeline de colaborador que não é liderado direto resulta em HTTP 403 (RN 7).

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard do Líder é exibido
2. Acessar a URL '/o/{orgId}/feedbacks/timeline/{idColaboradorNaoLiderado}'
   → HTTP 403

## TC4 — Registro criado pelo Líder grava autorPapel "Líder"
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 5, 12

### Objetivo
Validar que registros criados pelo Líder gravam autorPapel="Líder" e exibem a identificação de autor correta (RN 5, RN 12).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar no botão 'Adicionar registro' da linha de um liderado
   → Modal "Adicionar registro" é exibido
3. Selecionar 'Feedback' no dropdown 'Tipo'
   → Opção "Feedback" selecionada no dropdown "Tipo"
4. Preencher o campo 'Comentário' com 'Boa evolução na entrega do sprint'
   → Campo "Comentário" preenchido
5. Clicar no botão 'Salvar'
   → Toast exibida: "Feedback adicionado" (REVISAR-FIGMA: texto exato)
6. Clicar na linha do liderado
   → Registro tipo "Feedback" exibido com autor "Líder"

## TC5 — Timeline do liderado exibe Anotações com badge privado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 11

### Objetivo
Validar que a timeline de um liderado direto exibe Anotações do próprio Líder e do RH, marcadas como privadas (RN 11).

### Passos
1. Clicar no submenu 'Feedbacks e Anotações'
   → Listagem de colaboradores é exibida
2. Clicar na linha de um liderado
   → Timeline do liderado é exibida
3. Aguardar o card tipo "Anotação" ser exibido
   → Registro tipo "Anotação" exibido com badge de privado

---
suite: Feedbacks Recebidos — Colaborador
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Colaborador na organização principal
  - Colaborador com registros recebidos dos 4 tipos visíveis e ao menos 1 Anotação escrita sobre ele por um líder
---

# Feedbacks Recebidos — Colaborador

## TC1 — Tabela exibe só registros sobre o próprio colaborador, ordenados por data desc
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 1

### Objetivo
Validar que a aba "Feedbacks recebidos" exibe os registros visíveis sobre o próprio colaborador, ordenados por data decrescente (RN 1).

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard do Colaborador é exibido
2. Clicar na aba 'Feedbacks recebidos'
   → Tabela de feedbacks recebidos é exibida
3. Aguardar a tabela de feedbacks recebidos ser exibida
   → Registro tipo "Reconhecimento" exibido com colunas "Tipo", "De", "Mensagem" e "Data"
4. Aguardar a coluna "Data" ser exibida
   → Registros exibidos em ordem decrescente de data

## TC2 — Anotação nunca aparece para o Colaborador
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 2

### Objetivo
Validar a regra de segurança: registros tipo "Anotação" nunca trafegam para o Colaborador, mesmo havendo Anotações sobre ele (RN 2).

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard do Colaborador é exibido
2. Clicar na aba 'Feedbacks recebidos'
   → Tabela de feedbacks recebidos é exibida
3. Aguardar a tabela de feedbacks recebidos ser exibida
   → Nenhum Registro tipo "Anotação" exibido

## TC3 — Filtros multi-select por tipo e busca por texto/autor
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 5, 6

### Objetivo
Validar os filtros multi-select por tipo e a busca que filtra por texto da mensagem ou nome do autor (RN 5, RN 6).

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard do Colaborador é exibido
2. Clicar na aba 'Feedbacks recebidos'
   → Tabela de feedbacks recebidos é exibida
3. Desmarcar 'Ponto de atenção' no filtro de tipo
   → Nenhum Registro tipo "Ponto de atenção" exibido
4. Preencher o campo 'Busca' com 'Felipe'
   → Registro com autor "Felipe" exibido na tabela

## TC4 — Drawer read-only renderiza Devolutiva com os 4 campos estruturados
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 9

### Objetivo
Validar que clicar numa linha abre o drawer lateral read-only e que a Devolutiva renderiza os 4 campos estruturados (RN 9).

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard do Colaborador é exibido
2. Clicar na aba 'Feedbacks recebidos'
   → Tabela de feedbacks recebidos é exibida
3. Clicar na linha do registro 'Devolutiva'
   → Drawer lateral é exibido
4. Aguardar o corpo do drawer ser exibido
   → Campos "Pontos fortes", "Áreas de desenvolvimento", "Recomendações" e "Comentário" exibidos e nenhum campo editável exibido

## TC5 — Empty state quando colaborador não tem registros visíveis
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 1

### Objetivo
Validar o empty state da aba quando o colaborador não possui registros visíveis (RN 1). REVISAR: PRD#6 tem contradição entre "empty state sem CTA" e "empty state + CTA" — confirmar no Figma.

### Passos
1. Acessar a URL '/o/{orgId}/dashboard'
   → Dashboard do Colaborador é exibido
2. Clicar na aba 'Feedbacks recebidos'
   → Tabela de feedbacks recebidos é exibida
3. Aguardar a área de conteúdo da aba ser exibida
   → Mensagem exibida: "Nenhum feedback recebido ainda" (REVISAR-FIGMA: texto e presença/ausência de CTA)

---
suite: Usuários DHO — Cadastro e Edição
executor: playwright
org: principal
playbooks: [toast-chakra]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin na organização principal
  - Organização principal com ao menos 1 pessoa ativa elegível como líder e 1 pessoa desativada
---

# Usuários DHO — Cadastro e Edição

## TC1 — Email, nome e sobrenome são obrigatórios na criação
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 7

### Objetivo
Validar que salvar uma pessoa sem os obrigatórios é bloqueado e que preenchendo só os obrigatórios o salvamento conclui (RN 7).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar no botão 'Adicionar'
   → Formulário "Novo usuário" é exibido
3. Clicar no botão 'Salvar'
   → Campos "Email", "Nome" e "Sobrenome" exibem mensagem de obrigatoriedade
4. Preencher o campo 'Email' com 'maria.teste@empresa.com'
   → Campo "Email" preenchido
5. Preencher o campo 'Nome' com 'Maria'
   → Campo "Nome" preenchido
6. Preencher o campo 'Sobrenome' com 'Teste'
   → Campo "Sobrenome" preenchido
7. Clicar no botão 'Salvar'
   → Toast exibida: "Usuário salvo com sucesso" (REVISAR-FIGMA: texto exato)

## TC2 — Email duplicado bloqueia o salvamento
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 8

### Objetivo
Validar que um email já cadastrado na organização bloqueia o salvamento (RN 8).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar no botão 'Adicionar'
   → Formulário "Novo usuário" é exibido
3. Preencher o campo 'Email' com email já cadastrado na organização
   → Campo "Email" preenchido
4. Preencher o campo 'Nome' com 'Joao'
   → Campo "Nome" preenchido
5. Preencher o campo 'Sobrenome' com 'Silva'
   → Campo "Sobrenome" preenchido
6. Clicar no botão 'Salvar'
   → Mensagem de erro exibida: "Email já cadastrado"

## TC3 — Pessoa desativada não é selecionável como líder direto
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 3

### Objetivo
Validar que uma pessoa desativada não aparece nas opções de "Líder direto" (RN 3).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar no menu de ações da linha de um colaborador
   → Menu de ações da linha é exibido
3. Clicar na opção 'Editar'
   → Formulário "Editar usuário" é exibido
4. Clicar no dropdown 'Líder direto'
   → Pessoa desativada não é exibida nas opções do dropdown "Líder direto"

## TC4 — Campos DHO persistem e Cargo nível oferece os 7 valores
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [toast-chakra]
**RNs cobertas**: 7

### Objetivo
Validar o preenchimento/persistência dos campos DHO e que o select "Cargo nível" oferece os 7 valores do enum (RN 7).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar no botão 'Adicionar'
   → Formulário "Novo usuário" é exibido
3. Preencher o campo 'Email' com 'carlos.dho@empresa.com'
   → Campo "Email" preenchido
4. Preencher o campo 'Nome' com 'Carlos'
   → Campo "Nome" preenchido
5. Preencher o campo 'Sobrenome' com 'Dho'
   → Campo "Sobrenome" preenchido
6. Preencher o campo 'Data de admissão' com '10/01/2024'
   → Campo "Data de admissão" preenchido
7. Clicar no dropdown 'Cargo nível'
   → Dropdown "Cargo nível" oferece "Júnior", "Pleno", "Sênior", "Especialista", "Coord.", "Gerente" e "Diretor"
8. Selecionar 'Pleno' no dropdown 'Cargo nível'
   → Campo "Cargo nível" exibe "Pleno"
9. Clicar no botão 'Salvar'
   → Toast exibida: "Usuário salvo com sucesso" (REVISAR-FIGMA: texto exato)

## TC5 — "Salvar e novo" persiste e reabre form em branco
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 9

### Objetivo
Validar que "Salvar e novo" persiste a pessoa e reabre o formulário em branco, sem validação cross-data entre admissão e data no cargo (RN 9).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar no botão 'Adicionar'
   → Formulário "Novo usuário" é exibido
3. Preencher o campo 'Email' com 'ana.lote@empresa.com'
   → Campo "Email" preenchido
4. Preencher o campo 'Nome' com 'Ana'
   → Campo "Nome" preenchido
5. Preencher o campo 'Sobrenome' com 'Lote'
   → Campo "Sobrenome" preenchido
6. Preencher o campo 'Data de admissão' com '01/06/2024'
   → Campo "Data de admissão" preenchido
7. Preencher o campo 'Data no cargo atual' com '01/01/2024'
   → Campo "Data no cargo atual" preenchido sem mensagem de erro de validação de data
8. Clicar no botão 'Salvar e novo'
   → Formulário "Novo usuário" é exibido com o campo "Email" vazio

---
suite: Usuários DHO — Importação CSV
executor: playwright
org: principal
playbooks: []
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Usuário logado como Admin na organização principal
  - Arquivos CSV de teste disponíveis (válido com 10 linhas, com 600 linhas, com líder direto inexistente, com email duplicado)
---

# Usuários DHO — Importação CSV

## TC1 — Upload de arquivo .csv válido processa com sucesso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 15, 16

### Objetivo
Validar o upload de um arquivo .csv válido (dentro dos limites) e o processamento bem-sucedido (RN 15, RN 16). REVISAR: gap-01 — handlers de import inativos no protótipo; suíte executável só quando gap-01 estiver FIXED no twyg-app.

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar na aba 'Importação'
   → Dropzone "Arraste o arquivo ou clique para selecionar" é exibida
3. Fazer upload do arquivo 'usuarios-dho-10-linhas.csv' no campo 'Arraste o arquivo ou clique para selecionar'
   → Nome do arquivo "usuarios-dho-10-linhas.csv" exibido na dropzone
4. Clicar no botão 'Importar'
   → Registro com situação "Concluído" exibido no histórico de importações

## TC2 — Arquivo acima de 500 linhas é bloqueado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 15

### Objetivo
Validar que um arquivo com mais de 500 linhas é bloqueado com mensagem de limite (RN 15).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar na aba 'Importação'
   → Dropzone "Arraste o arquivo ou clique para selecionar" é exibida
3. Fazer upload do arquivo 'usuarios-dho-600-linhas.csv' no campo 'Arraste o arquivo ou clique para selecionar'
   → Nome do arquivo "usuarios-dho-600-linhas.csv" exibido na dropzone
4. Clicar no botão 'Importar'
   → Mensagem de erro exibida: "Máximo 500 linhas por importação"

## TC3 — Separador e delimitador configuráveis antes da importação
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 16

### Objetivo
Validar que o Admin pode configurar separador e delimitador antes de importar (RN 16).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar na aba 'Importação'
   → Dropzone "Arraste o arquivo ou clique para selecionar" é exibida
3. Selecionar 'Vírgula' no dropdown 'Separador'
   → Opção "Vírgula" selecionada no dropdown "Separador"
4. Selecionar 'Aspas simples' no dropdown 'Delimitador'
   → Opção "Aspas simples" selecionada no dropdown "Delimitador"

## TC4 — Linha com líder direto inexistente entra como erro
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 17, 19

### Objetivo
Validar que uma linha cujo liderDiretoEmail não é encontrado entra como erro enquanto as demais linhas válidas processam (RN 17, RN 19).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar na aba 'Importação'
   → Dropzone "Arraste o arquivo ou clique para selecionar" é exibida
3. Fazer upload do arquivo 'usuarios-dho-lider-inexistente.csv' no campo 'Arraste o arquivo ou clique para selecionar'
   → Nome do arquivo "usuarios-dho-lider-inexistente.csv" exibido na dropzone
4. Clicar no botão 'Importar'
   → Registro com situação "Com erros" exibido no histórico de importações

## TC5 — Política "Cancelar importação" aborta lote com email duplicado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 18, 20

### Objetivo
Validar que a política "Cancelar importação" aborta o lote inteiro quando há email duplicado e registra a importação no histórico (RN 18, RN 20).

### Passos
1. Clicar no submenu 'Usuários'
   → Aba "Lista de usuários" é exibida
2. Clicar na aba 'Importação'
   → Dropzone "Arraste o arquivo ou clique para selecionar" é exibida
3. Selecionar 'Cancelar importação' no dropdown 'Política para usuários já cadastrados'
   → Opção "Cancelar importação" selecionada
4. Fazer upload do arquivo 'usuarios-dho-email-duplicado.csv' no campo 'Arraste o arquivo ou clique para selecionar'
   → Nome do arquivo "usuarios-dho-email-duplicado.csv" exibido na dropzone
5. Clicar no botão 'Importar'
   → Mensagem de erro exibida: "Importação cancelada" (REVISAR-FIGMA: texto exato do conflito de emails)

---
suite: Permissões e RBAC por Perfil
executor: playwright
org: principal
playbooks: [perfil-switch]
preconditions:
  - Feature flag `performance_module_enabled` ativa
  - Existe ciclo de avaliação ativo com pelo menos 1 líder e seus liderados diretos
  - Existe colaborador fora do time do líder cadastrado na organização
---

# Permissões e RBAC por Perfil

## TC1 — Admin acessa o módulo completo de toda a organização
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 4

### Objetivo
Garantir que o perfil Admin acessa o módulo e enxerga dados de toda a organização sem recorte por time (RN 4).

### Passos
1. Selecionar "Administrador" no popover de perfil
   → Perfil ativo exibe "Administrador"
2. Clicar no submenu "Desenvolvimento"
   → Listagem exibe colaboradores de toda a organização

## TC2 — Líder só acessa liderados diretos e recebe 403 fora do time
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 12

### Objetivo
Garantir que o perfil Líder enxerga apenas seus liderados diretos e que o backend rejeita acesso a colaborador fora do escopo (RN 12).

### Passos
1. Selecionar "Líder" no popover de perfil
   → Listagem "Desenvolvimento" exibe apenas liderados diretos
2. Acessar a URL '/o/{orgId}/desenvolvimento/colaborador/{idForaDoTime}'
   → HTTP 403

## TC3 — Líder só vê autoavaliação após o liderado concluir (sigilo gestor)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 11

### Objetivo
Garantir que com sigilo gestor ativo, o líder só vê a autoavaliação após o liderado concluí-la (RN 11 — gap-06 REVISAR: toggle/filtro ausentes no protótipo).

### Passos
1. Selecionar "Líder" no popover de perfil
   → Perfil ativo exibe "Líder"
2. Clicar no botão 'Abrir avaliação' do liderado que ainda não concluiu a autoavaliação
   → Mensagem exibida: "Aguarde o liderado concluir a autoavaliação"
3. Aguardar o status da autoavaliação do liderado mudar para "Concluída"
   → Conteúdo da autoavaliação do liderado é exibido ao líder

## TC4 — Anotação privada nunca trafega ao Colaborador
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 2, 3

### Objetivo
Garantir que registros tipo "Anotação" são filtrados no backend e nunca aparecem na visão do Colaborador (RN 2, RN 3).

### Passos
1. Selecionar "Colaborador" no popover de perfil
   → Perfil ativo exibe "Colaborador"
2. Clicar na aba 'Feedbacks recebidos'
   → Registro tipo "Anotação" não é exibido

---
suite: Feature Flag (performance_module_enabled)
executor: playwright
org: principal
playbooks: [flipper]
preconditions:
  - Usuário com permissão elevada para alternar a feature flag via Flipper
  - Organização principal de teste identificada
---

# Feature Flag (performance_module_enabled)

## TC1 — Flag OFF torna o módulo inacessível e oculta o menu
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: 

### Objetivo
Garantir que com a flag `performance_module_enabled` desabilitada o módulo é inacessível e o menu não é exibido.

### Passos
1. Acessar a URL '/admin/manage/features/performance_module_enabled'
   → Página da feature flag é exibida
2. Clicar no botão 'Remove' do actor da organização
   → Actor da organização não é exibido na lista da flag
3. Acessar a URL '/o/{orgId}/dashboard'
   → Menu "Desenvolvimento" não é exibido

## TC2 — Flag ON torna o módulo acessível
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: 

### Objetivo
Garantir que com a flag `performance_module_enabled` habilitada o módulo fica acessível.

### Passos
1. Acessar a URL '/admin/manage/features/performance_module_enabled'
   → Página da feature flag é exibida
2. Preencher o campo de actor com a organização de teste
   → Actor da organização é exibido na lista da flag
3. Acessar a URL '/o/{orgId}/dashboard'
   → Menu "Desenvolvimento" é exibido

## TC3 — Desativar a flag após uso degrada o acesso sem erro fatal
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: [flipper]
**RNs cobertas**: 

### Objetivo
Garantir que ao desabilitar a flag após dados existirem, o módulo deixa de ser acessível sem erro fatal.

### Passos
1. Acessar a URL '/admin/manage/features/performance_module_enabled'
   → Página da feature flag é exibida
2. Clicar no botão 'Remove' do actor da organização
   → Actor da organização não é exibido na lista da flag
3. Acessar a URL '/o/{orgId}/dashboard'
   → Menu "Desenvolvimento" não é exibido

---
suite: Ambientes Adicionais — Isolamento
executor: playwright
org: secundario
playbooks: [ambientes-adicionais]
preconditions:
  - Organização principal pareada a uma organização parceira (ambiente adicional)
  - Feature flag `performance_module_enabled` ativa em ambas as organizações
  - Existem ciclos distintos criados em cada organização pareada
---

# Ambientes Adicionais — Isolamento

## TC1 — Módulo acessível no ambiente pareado
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [ambientes-adicionais]
**RNs cobertas**: 

### Objetivo
Garantir que o módulo é acessível na organização parceira (ambiente adicional) com a flag habilitada.

### Passos
1. Acessar a URL '/o/{orgIdParceira}/dashboard'
   → Dashboard admin da organização parceira é exibido
2. Clicar no submenu "Desenvolvimento"
   → Listagem do módulo de Desempenho é exibida

## TC2 — Dados de uma org pareada não aparecem na outra
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: [ambientes-adicionais]
**RNs cobertas**: 

### Objetivo
Garantir o isolamento de dados entre tenants pareados — ciclos de uma org não aparecem na outra.

### Passos
1. Acessar a URL '/o/{orgIdParceira}/desenvolvimento'
   → Listagem de ciclos da organização parceira é exibida
2. Aguardar a listagem de ciclos ser exibida
   → Ciclo criado na organização principal não é exibido na listagem da parceira

## TC3 — Configuração editável só via org principal
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [ambientes-adicionais]
**RNs cobertas**: 

### Objetivo
Garantir que a configuração de subscription do módulo é editável apenas pela organização principal.

### Passos
1. Acessar a URL '/o/{orgIdParceira}/subscription/desenvolvimento'
   → HTTP 403
2. Acessar a URL '/o/{orgId}/subscription/desenvolvimento'
   → Botão "Salvar" da configuração de subscription é exibido

---
suite: Trial — Exclusão de Dados
executor: playwright
org: trial
playbooks: [trial]
preconditions:
  - Organização Trial dedicada (ICP "Outros") com o módulo de Desempenho habilitado
  - Existem ciclos/campanhas/avaliações/registros criados na organização Trial
---

# Trial — Exclusão de Dados

## TC1 — Conta Trial com o módulo habilitado acessa o módulo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [trial]
**RNs cobertas**: 

### Objetivo
Garantir que uma conta Trial com o módulo habilitado consegue acessá-lo durante o período trial.

### Passos
1. Acessar a URL '/o/{orgIdTrial}/dashboard'
   → Dashboard admin da organização Trial é exibido
2. Clicar no submenu "Desenvolvimento"
   → Listagem do módulo de Desempenho é exibida

## TC2 — Exclusão de dados Trial via widget Sophia remove entidades do módulo
**Prioridade**: high
**Tipo**: ui
**Playbooks adicionais**: [trial]
**RNs cobertas**: 

### Objetivo
Garantir que a opção "Excluir informações" do widget Sophia remove as entidades do módulo da org Trial.

### Passos
1. Clicar no ícone 'Sophia' no canto inferior esquerdo
   → Popover do Sophia é exibido
2. Clicar no botão 'Excluir informações'
   → Modal com as opções de exclusão é exibido
3. Selecionar 'Tudo' no modal de exclusão
   → Opção "Tudo" é exibida selecionada
4. Clicar no botão 'Excluir'
   → Listagem do módulo "Desenvolvimento" não exibe ciclos da organização Trial

---
suite: Banco Histórico
executor: playwright
org: principal
playbooks: []
preconditions:
  - Organização com dados do módulo de Desempenho marcada para exclusão
  - Worker HistoricBaseCron configurado para processar a fila de exclusão de organizações
---

# Banco Histórico

## TC1 — HistoricBaseCron remove os dados do módulo na exclusão da organização
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: 

### Objetivo
Garantir que, após o HistoricBaseCron processar a exclusão, as tabelas do módulo não retornam linhas da organização (REVISAR: Dev precisa listar as tabelas impactadas).

### Passos
1. Executar a query que conta linhas de 'performance_cycles' filtrando pela organização excluída
   → Tabela "performance_cycles" não retorna linhas da organização
2. Executar a query que conta linhas de 'performance_entries' filtrando pela organização excluída
   → Tabela "performance_entries" não retorna linhas da organização

## TC2 — Cascata em FKs remove registros dependentes do módulo
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: 

### Objetivo
Garantir que a exclusão cascateia nas FKs do módulo, sem deixar registros órfãos (REVISAR: Dev precisa listar a árvore de FKs).

### Passos
1. Executar a query que busca linhas de 'performance_campaigns' cujo ciclo pertencia à organização excluída
   → Tabela "performance_campaigns" não retorna linhas da organização
2. Executar a query que busca linhas de 'performance_evaluations' cuja campanha pertencia à organização excluída
   → Tabela "performance_evaluations" não retorna linhas da organização

---
suite: Logs / Auditoria
executor: playwright
org: principal
playbooks: []
preconditions:
  - Organização com o módulo de Desempenho habilitado e auditoria (historicoMudancas) ativa
  - Existe um ciclo do módulo que sofrerá criação, edição e exclusão
---

# Logs / Auditoria

## TC1 — Criação de ciclo é auditada em historicoMudancas
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: 

### Objetivo
Garantir que a criação de um ciclo gera registro de auditoria em historicoMudancas (REVISAR: Dev confirma nome da tabela de auditoria).

### Passos
1. Executar a query que busca linhas de 'historico_mudancas' com ação 'create' do ciclo recém-criado
   → Tabela "historico_mudancas" retorna 1 linha com ação "create"

## TC2 — Edição e exclusão de campanha/registro são auditadas
**Prioridade**: high
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: 

### Objetivo
Garantir que edição e exclusão de campanha e registro geram entradas de auditoria.

### Passos
1. Executar a query que busca linhas de 'historico_mudancas' com ação 'update' da campanha editada
   → Tabela "historico_mudancas" retorna 1 linha com ação "update"
2. Executar a query que busca linhas de 'historico_mudancas' com ação 'destroy' do registro excluído
   → Tabela "historico_mudancas" retorna 1 linha com ação "destroy"

## TC3 — Estrutura do registro de auditoria contém autor, timestamp, ação e payload
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []
**RNs cobertas**: 

### Objetivo
Garantir que cada entrada de auditoria armazena autor, data/hora, ação e payload da mudança.

### Passos
1. Executar a query que seleciona a entrada de 'historico_mudancas' mais recente do ciclo
   → Coluna "usuario_id" exibe o id do autor da mudança
2. Executar a query que seleciona a entrada de 'historico_mudancas' mais recente do ciclo
   → Coluna "payload" exibe o diff dos campos alterados

---
suite: Notificações (email + push)
executor: playwright
org: principal
playbooks: []
preconditions:
  - Organização com o módulo de Desempenho habilitado
---

# Notificações (email + push)

## TC1 — Gatilhos de notificação do módulo (PLACEHOLDER)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: 

### Objetivo
ESCOPO A DEFINIR — os PRDs do grupo Desempenho não cobrem notificações (D09 é entrega de Dev sem RNs). Suíte placeholder até o escopo ser definido com Produto.

### Passos
1. Aguardar 'Notificação do módulo de Desempenho' ser exibida (REVISAR: definir gatilhos de email/push com Produto)
   → Notificação do módulo de Desempenho é exibida
