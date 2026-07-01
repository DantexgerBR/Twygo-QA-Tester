# PRD — Aluno (Colaborador) > Desenvolvimento > Feedbacks recebidos

> 📚 **Naming canônico (atualizado 2026-05-16)**: PRD em pt-BR (Registro / Devolutiva / Anotação / etc). Em **código/DB**, modelo é `PerformanceEntry` com `kind` enum em inglês (`feedback / recognition / concern / note / wrapup / calibration`). Mapping: [`glossary.md § 3.7`](../glossary.md#37-performanceentry-ui-feedbacks-e-anotações).

| Produto | Twygo — DHO — módulo Feedbacks e Anotações (perspectiva do destinatário) |
| --- | --- |
| Escopo desta entrega | Jornada do perfil **Aluno (Colaborador)** na aba **"Feedbacks recebidos"** dentro do hub de Desenvolvimento |
| Audiência | Time de dev twyg-app (Rails + React Clean Arch) — dev primário: João |
| Base utilizada | Protótipo (localhost:5173, branch `main`) + componente `MeusFeedbacks` + PRD #2 (Admin > Feedbacks e Anotações) como referência de modelo |
| Fora de escopo | Outras abas do hub (PDI / Avaliações a preencher / Resultados de Eficácia); fluxos de Admin/Líder; criar registros (Aluno é só destinatário aqui); **solicitar 1:1 com o líder** (decisão Twygo 2026-05-14: fluxo removido — Aluno não tem porta de entrada pra solicitar conversa) |

## 1. Visão geral da jornada

O Aluno é o **destinatário** dos registros do módulo Feedbacks e Anotações. Diferente do Líder e do Admin (que **criam** registros), o Aluno **consome**: vê o que recebeu (visível pra ele), filtra por tipo, busca por texto/autor, e abre o detalhe pra leitura completa quando precisa de mais contexto. **Aluno não cria nada nesta tela** — é jornada puramente de leitura.

A jornada do Aluno é **simples e curta**:
1. Acessar a tab "Feedbacks recebidos".
2. Ver tabela com tudo que recebeu (visível pra ele) — filtros por tipo + busca.
3. Abrir o detalhe pra ler o feedback completo (sem truncamento), em drawer lateral.

**Visibilidade — recap importante:** o Aluno vê **4 dos 5 tipos**: Reconhecimento, Ponto de atenção, Feedback, Devolutiva. **Anotação NÃO aparece** pra ele (privada do Líder + RH). Esta regra é mandatória no backend, não filtragem na UI.

## 2. Mapa do fluxo principal

| Etapa | Ator | Ação | Tela / Local na UI |
|-------|------|------|---------------------|
| 1 | Aluno | Acessa Desempenho/Desenvolvimento | Sidebar > "Desempenho" > Hub do colaborador |
| 2 | Aluno | Clica na tab "Feedbacks recebidos" | Tab dentro de `MeusCiclosHub` |
| 3 | Aluno | Vê tabela com registros recebidos | `MeusFeedbacks` |
| 4 | Aluno | Filtra por tipo (chips) | Menu de filtros multi-select |
| 5 | Aluno | Busca por texto/autor | Campo de busca |
| 6 | Aluno | Abre detalhe pra leitura completa | Click na linha → drawer lateral |

## 3. Modelo de dados envolvido

Referência completa: PRD #2 § 3. Pontos críticos pro Aluno:

- **Entidade `Registro`** — mesma estrutura do PRD #2.
- **Regra de visibilidade** (`registroVisivelPara` no protótipo): Aluno vê registros **sobre si mesmo** (`alvoNome == viewerNome`) E do tipo `visivelColab=true`. Exclui Anotação.
- **Struct `devolutiva`** quando tipo=Devolutiva: contém os 4 campos estruturados que ele pode ler.
- **Sem ciclo de vida de Feedback** — não existem mais os status `solicitado/agendado/realizado` nem os campos `dataSolicitada/dataAgendada/dataRealizada` (decisão 2026-05-14, ver Spike S2). Feedback é registro neutro: texto + autor + data.

## 4. Épico

| **Épico** | Permitir que o Aluno (Colaborador) **acesse e leia integralmente os feedbacks que recebeu** ao longo do tempo, com clareza de quem deu, quando e em que contexto. |
| --- | --- |
| **Valor esperado** | Dar visibilidade ao colaborador da memória de feedback do próprio histórico — substituir feedback efêmero (líder fala em 1:1 e se esquece) por uma jornada onde o colab acompanha sinais ao longo do tempo, consulta devolutivas estruturadas e relê com calma quando precisar. |

## 5. Histórias do Usuário

### HU-01 — Visualizar feedbacks recebidos com filtros

| **Como** | Aluno (Colaborador), |
| --- | --- |
| **Quero** | ver uma tabela dos feedbacks que recebi (Reconhecimento, Ponto de atenção, Feedback, Devolutiva), com tipo, autor, mensagem e data, |
| **Para** | acompanhar como estou sendo percebido e ter acesso ao histórico das devolutivas que recebi. |

**Ref no protótipo:** Hub do colaborador > tab **"Feedbacks recebidos"** (`MeusFeedbacks`).

**Fluxo detalhado:**
1. Aluno entra no hub e clica em "Feedbacks recebidos" (tab com indicador de atenção quando tem novos).
2. Sistema exibe **tabela com colunas**:
   - **Tipo** — chip colorido (Reconhecimento verde / Ponto de atenção âmbar / Feedback azul / Devolutiva roxo)
   - **De** — nome do autor + papel (Líder / Colega / RH / Sistema)
   - **Mensagem** — preview do texto (2 linhas, com `noOfLines`)
   - **Data** — data formatada
   - **(coluna trigger)** — chevron decorativo (`FiChevronRight`) no fim da linha indicando que a linha é clicável pra abrir o detalhe (ver HU-02)
3. Toolbar superior: **campo de busca** + **menu de filtros por tipo** (multi-select com checkbox).
4. Filtros default: Reconhecimento + Ponto de atenção + Feedback + Devolutiva selecionados (todos os tipos visíveis pro Aluno).
5. Click na linha (qualquer parte): abre drawer com detalhe completo do registro — ver HU-02.
6. Empty state quando sem registros: mensagem "Nenhum feedback recebido ainda" (sem CTA — Aluno não tem ação criativa nesta tela).

**Regras de negócio:**

- **RN 1** — Aluno vê apenas registros **sobre si mesmo** (`alvoNome == viewerNome`) E do tipo `visivelColab=true`.
- **RN 2** — Anotação **nunca** aparece pro Aluno (privada do Líder + RH). Filtragem é mandatória no backend.
- **RN 3** — Chips de tipo coloridos conforme `tipoConfigCanonico` (cores idênticas ao PRD #2 § "Tipos de registro" do glossário).
- **RN 4** — Ordenação default: data decrescente (mais recente primeiro). Coluna "Data" é sortable.
- **RN 5** — Filtros por tipo são **multi-select** — Aluno pode desativar tipos que não quer ver. Filtro vazio = mostrar todos.
- **RN 6** — Busca filtra por **texto da mensagem** OR **nome do autor** (case-insensitive, substring).
- **RN 7** — Linha da tabela é clicável (`onRowClick`) — abre drawer de detalhe (HU-02). Chevron decorativo no fim da linha indica essa affordance.

**Critérios de aceite:**

- **CA-01** — DADO Aluno entra na tab, ENTÃO vê tabela com seus feedbacks recebidos (excluindo Anotações), ordenada por data descrescente.
- **CA-02** — DADO o backend tem 2 Anotações que líderes escreveram sobre o Aluno, QUANDO Aluno acessa a tab, ENTÃO essas Anotações NÃO aparecem (filtragem mandatória no backend).
- **CA-03** — DADO Aluno desativa o filtro "Ponto de atenção", ENTÃO tabela esconde registros desse tipo.
- **CA-04** — DADO Aluno digita "Felipe" na busca, ENTÃO tabela filtra para mostrar apenas registros onde autor ou mensagem contém "Felipe".
- **CA-05** — DADO Aluno clica em qualquer ponto de uma linha, ENTÃO drawer de detalhe abre (HU-02).
- **CA-06** — DADO Aluno tem 0 registros visíveis, ENTÃO empty state aparece com mensagem neutra (sem CTA criativo).

**Edge cases / fora de escopo:**

- Aluno sem feedbacks recebidos → empty state + CTA.
- Aluno com >100 registros → paginação ou infinite scroll (decisão do dev).
- Filtros + busca aplicados zerando lista → mensagem "Nenhum feedback atende aos filtros".
- Comentar/reagir num feedback recebido (✅, "obrigado") — **fora de escopo desta entrega**.
- Marcar feedback como lido/não-lido — **fora de escopo desta entrega**.

**Resultado:** Aluno tem visibilidade do feedback que recebe ao longo do tempo, com histórico estruturado das devolutivas.

**Pontos de atenção:**

- A regra "Anotação nunca trafega pra cliente do Aluno" deve ser **filtragem de query no backend**, não da UI. Se ela for client-side, é vulnerabilidade séria de vazamento.
- Devolutiva tem struct interna que precisa ser renderizada com layout específico (4 campos labeled).

---

### HU-02 — Abrir feedback no drawer pra leitura completa

| **Como** | Aluno, |
| --- | --- |
| **Quero** | clicar numa linha da tabela e ver o feedback completo (sem truncamento), com tipo, autor, data e mensagem inteira, |
| **Para** | absorver completamente um feedback longo ou releer com calma, especialmente devolutivas de ciclo. |

**Ref no protótipo:** Click em qualquer ponto de uma linha da tabela `MeusFeedbacks` → drawer lateral direito (`placement="right" size="md"`).

**Fluxo detalhado:**
1. Aluno clica em uma linha da tabela (qualquer ponto da linha — não só no chevron).
2. Sistema abre **drawer lateral direito** com:
   - **Header**: chip do tipo (colorido conforme `tipoConfigCanonico`) + data
   - **Body**: bloco "De" com autor (nome em bold + papel + cargo, se houver); bloco "Mensagem" com texto completo
   - **Se Devolutiva**: bloco "Mensagem" renderiza layout estruturado dos 4 campos (Pontos fortes, Áreas de desenvolvimento, Recomendações, Comentário) + identificação do ciclo de origem
   - **Footer**: botão "Fechar"
3. Drawer fecha ao clicar Fechar, X (close button) ou fora.

**Regras de negócio:**

- **RN 8** — Drawer é **read-only**. Aluno não edita, não responde, não reage.
- **RN 9** — Devolutiva mostra layout estruturado distinto (4 campos rotulados em uppercase + cor roxa de destaque) — não texto único corrido.
- **RN 10** — Drawer guarda **só o `id` do registro aberto** no state (pattern "State derivado por ID" do `patterns.md`) — entidade é derivada via `registros.find(r => r.id === abertoId)` no render.

**Critérios de aceite:**

- **CA-07** — DADO Aluno clica num Reconhecimento, ENTÃO drawer abre com mensagem completa, autor (nome + papel) e data.
- **CA-08** — DADO Aluno clica numa Devolutiva, ENTÃO drawer mostra os 4 campos estruturados (Pontos fortes / Áreas / Recomendações / Comentário) + identificação do ciclo.
- **CA-09** — DADO drawer aberto, QUANDO Aluno clica em "Fechar" ou fora do drawer, ENTÃO drawer fecha e tabela mantém scroll/filtros.

**Fora de escopo:** comentar/reagir/marcar como lido; navegação entre registros dentro do drawer (← anterior / → próximo).

**Resultado:** Aluno tem leitura completa de qualquer feedback, com contexto rico, especialmente devolutivas estruturadas de ciclo.

## 6. Spike

> **S1 — Filtragem de Anotação no backend**
>
> **Pergunta**: como garantir que Anotação **nunca** trafegue pra cliente do Aluno (segurança crítica)? Filtro na query, scope no model, policy no controller?
>
> **Risco**: vazamento de notas privadas do líder.
>
> **Critério de done**: arquitetura confirmada (defesa em profundidade — backend filtra E policy bloqueia).

> **S2 — Fluxo "Solicitar 1:1" do Aluno** — **REMOVIDO**
>
> **Decisão (2026-05-14)**: o fluxo de Aluno solicitar 1:1 com o líder **foi removido do produto inteiro**. Junto saíram: status `solicitado`/`agendado`/`realizado` do tipo Feedback, campos `dataSolicitada`/`dataAgendada`/`dataRealizada`, papel "Auto-solicitado", modal `SolicitarUmAUmModal`, branches relacionadas no `RegistroCard` e em `MeusFeedbacks`. Feedback agora é registro neutro (texto + autor + data), sem ciclo de vida.
>
> **Decisão paralela (mesma data)**: gestão matricial também não existe (cada Pessoa tem 1 `liderDiretoId` único, ver PRD #7 RN 10/12). Como Aluno não solicita mais, a complicação de matricial em 1:1 fica obsoleta de qualquer forma.
>
> **Implicação no twyg-app**: jornada do Aluno em "Feedbacks recebidos" é **puramente de leitura**. Não há criação, não há ação criativa do Aluno nesta tela. Líder pode marcar 1:1 e registrar como Feedback comum — sem ciclo de vida —, mas essa feature é trabalho separado (não cabe neste PRD).

> **S3 — Marcar feedback como lido / contagem de "novos"** — **futuro**
>
> **Pergunta**: vale ter contador/badge na tab "Feedbacks recebidos" indicando registros novos desde a última visita? Marcar como lido individualmente?
>
> **Critério de done**: decisão de produto sobre indicador de "novos" + persistência da marca de leitura. Não bloqueia esta entrega.

---

## 7. Como testar

### Tags Playwright

- `@aluno @feedbacks @critical` — RN 2 (Anotação NUNCA visível ao colab) — security-critical
- `@aluno @feedbacks @high` — RN 9 (Devolutiva uppercase roxo render)
- `@aluno @feedbacks @medium` — drawer lateral, filtros
- `@aluno @feedbacks @visual @gap-09` — Devolutiva render consistente

### Pré-requisitos

- Aluno colaborador logado
- Feature flag `performance_module_enabled` ON
- Registros já existentes sobre o user (de Líder + Admin)

### Rodar local

```bash
cd frontend && yarn dev   # login como Lucas pra ver perspectiva do colab
# ou
cd ../twyg-app && make start && yarn playwright test --grep "@aluno @feedbacks"
```

---

## 8. Cross-references

### HUs com gap aberto no protótipo

- **HU-01** (Devolutiva render): [gap-09](../gaps/gap-09-devolutiva-render-3-superficies.md) — RN 9 inconsistência visual cross-superfícies

### Modelo compartilhado

- **Registro** (5 tipos): visibilidade filtrada por papel — ver [PRD #2](./prd-admin-feedbacks-anotacoes.md) (Admin vê tudo) e [PRD #4](./prd-lider-feedbacks-anotacoes.md) (Líder vê do time)
- **Devolutiva**: gerada por Líder ([PRD #3](./prd-lider-desenvolvimento.md) HU-03) e exibida aqui

### Glossário e regras

- RN 2 (Anotação filtrada do feed): [`glossary.md § 3.7`](../glossary.md#37-registro-ui-feedbacks-e-anotações)
- Estilo Devolutiva canônico: PRD #6 RN 9 + [`glossary.md`](../glossary.md)

### Twy plan (twyg-app)

- D08 (Aluno timeline incluído no escopo) — ver `../../twyg-app/.twy/performance-module/deliverables/D08.md`
