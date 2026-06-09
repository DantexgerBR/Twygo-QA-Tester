# PRD — Líder > Gestão de Time(s) > Desenvolvimento

| Produto | Twygo — DHO — módulo Desenvolvimento |
| --- | --- |
| Escopo desta entrega | Jornada do perfil **Líder** no módulo Desenvolvimento — preencher avaliações, acompanhar time, calibrar 9-box do time, consolidar feedback dos liderados |
| Audiência | Time de dev twyg-app (Rails + React Clean Arch) — dev primário: João |
| Base utilizada | Protótipo (localhost:5173, branch `main`) + `docs/glossario-rh.md` + PRD #1 (Admin > Desenvolvimento) como referência de modelo de dados |
| Fora de escopo | Configuração de ciclo/campanha (Admin only — PRD #1); Eficácia; PDI/Sucessão; perfil Aluno |

## 1. Visão geral da jornada

O Líder é **avaliador ativo + acompanhador do time**. Diferente do Admin (que orquestra o processo), o Líder **opera dentro** das campanhas configuradas: responde avaliações como Líder, Auto, Par ou Liderado; acompanha quem do time dele tá em dia; vê a calibração 9-box recortada pelo time; e dá devolutiva pós-avaliação aos liderados.

A jornada do Líder se divide em **4 momentos**:
1. **Preencher avaliações pendentes** — listagem das avaliações que ele tem que responder (em qualquer papel: Auto/Líder/Par/Liderado).
2. **Acompanhar o time** — dashboard de progresso das avaliações dos liderados.
3. **Ver 9-box do time** — visão da calibração recortada por escopo dele.
4. **Consolidar feedback de liderado** — após fim da campanha, fechar a avaliação consolidada + dar devolutiva.

## 2. Mapa do fluxo principal

| Etapa | Ator | Ação | Tela / Local na UI |
|-------|------|------|---------------------|
| 1 | Líder | Acessa o módulo | Sidebar > "Gestão de Time(s)" > "Desenvolvimento" |
| 2 | Líder | Vê suas avaliações pendentes (default) | Tab "Avaliações a preencher" |
| 3 | Líder | Responde uma avaliação | Clica em linha → `ResponderAvaliacaoScreen` |
| 4 | Líder | Acompanha progresso do time | Tab "Status do time" |
| 5 | Líder | Vê 9-box do time | Tab "Visão 9-box" |
| 6 | Líder | Consolida feedback de liderado pós-avaliação | A partir do drill-down ou da listagem → `ConsolidarFeedbackPage` |

## 3. Modelo de dados envolvido

Referência: PRD #1 § 3 (modelo completo Ciclo / Campanha / Avaliação individual / AvaliacaoConsolidada). Pontos críticos pro Líder:

- **AvaliacaoRow** com `relacao: RelacaoAvaliacao` ∈ {Auto-avaliação, Avaliação do líder, Avaliação de pares, Avaliação do liderado} — indica o **papel** do Líder em cada item da lista.
- **PapelAvaliacao** dentro do `ResponderAvaliacaoScreen`: `{tipo: "lider"|"auto"|"liderado-responde"|"par", ...}` — controla qual banner aparece e qual liderado/colega/líder ele tá avaliando.
- **Escopo do "time do líder"** — visibilidade no twyg-app provavelmente via relação `Manager → Subordinates` no domínio de Usuários. Backend filtra automaticamente; UI só consome.

## 4. Épico

| **Épico** | Permitir que o Líder **responda avaliações que lhe foram atribuídas e acompanhe o desempenho coletivo do time** durante e após cada ciclo. |
| --- | --- |
| **Valor esperado** | Distribuir a operação do processo avaliativo do RH pros líderes diretos — quem conhece o time é quem avalia, calibra e dá devolutiva, com o RH como orquestrador, não executor. |

## 5. Histórias do Usuário

### HU-01 — Listar avaliações pendentes (multi-papel)

| **Como** | Líder, |
| --- | --- |
| **Quero** | ver todas as avaliações que preciso responder, com indicação clara de qual papel estou exercendo em cada (Auto, Líder, Par, Liderado), |
| **Para** | priorizar quais responder primeiro e não esquecer nenhuma. |

**Ref no protótipo:** Sidebar > "Gestão de Time(s)" > "Desenvolvimento" → tab **"Avaliações a preencher"** (default do Líder).

**Fluxo detalhado:**
1. Líder entra no módulo e vê tab "Avaliações a preencher" ativa por default.
2. Sistema exibe **tabela de avaliações** onde o líder é avaliador, com colunas: Tipo (Desempenho/Experiência/Pares/etc), **Papel** (chip colorido: Auto/Líder/Par/Liderado), Avaliado (nome ou "Você" pra Auto), Campanha, Ciclo, Status (A iniciar / Iniciado / Concluído), Progresso (%), Prazo, Dias até prazo, Ação.
3. Filtros: por papel, por status, por ciclo.
4. Click na linha → `ResponderAvaliacaoScreen` (HU-02).

**Regras de negócio:**

- **RN 1** — A listagem inclui avaliações de **4 papéis** do Líder: Auto (sobre si), Líder (sobre liderados diretos), Par (sobre colegas de mesmo nível), Liderado (sobre o próprio líder).
- **RN 2** — Cada papel tem chip colorido distinto na coluna "Papel": Auto-avaliação=verde, Avaliação do líder=roxo, Avaliação de pares=âmbar, Avaliação do liderado=violeta (alinhado com `relacaoChip` do mock).
- **RN 3** — Avaliações com `diasAtePrazo < 0` recebem badge "Atrasada" + destaque visual.
- **RN 4** — Ordenação default: prazo crescente (próximas do vencimento primeiro).
- **RN 5** — Avaliações com status="Concluído" ficam visualmente esmaecidas (já feitas).

**Critérios de aceite:**

- **CA-01** — DADO o Líder entra em Desenvolvimento, ENTÃO vê tab "Avaliações a preencher" ativa com lista das avaliações dele.
- **CA-02** — DADO uma avaliação onde Líder avalia "Paula" (liderada dele), ENTÃO chip de papel mostra "Avaliação do líder" em roxo.
- **CA-03** — DADO uma avaliação atrasada (dias até prazo = -2), ENTÃO linha exibe badge "Atrasada".
- **CA-04** — DADO o Líder filtra por papel="Avaliação de pares", ENTÃO lista mostra apenas avaliações onde ele é par.

**Fora de escopo:** ordenar/agrupar por campanha; salvar preferências de filtro.

**Resultado:** Líder tem clareza do que precisa responder, em qual papel e até quando.

---

### HU-02 — Responder avaliação

| **Como** | Líder, |
| --- | --- |
| **Quero** | preencher os campos da avaliação com escalas e textos abertos, navegando entre sessões do formulário, podendo salvar rascunho e concluir, |
| **Para** | registrar minha avaliação completa de um avaliado (ou de mim mesmo). |

**Ref no protótipo:** Click em linha da HU-01 → `ResponderAvaliacaoScreen`.

**Fluxo detalhado:**
1. Sistema navega pra tela de responder com **banner de papel** colorido no topo identificando claramente qual papel o Líder está exercendo (ex: "Como líder · avaliando Paula Carvalho").
2. Formulário organizado em **sessões** (agrupamentos de perguntas). Navegação lateral via `SectionNav` mostra todas as sessões + progresso.
3. Cada pergunta é de tipo **escala** (obrigatória) ou **texto** (opcional, com placeholder orientativo).
4. Barra de progresso superior mostra % concluído.
5. Footer: botões **"Salvar rascunho"** (a qualquer momento) + **"Concluir avaliação"** (libera apenas com todas as obrigatórias preenchidas).
6. Confirm dialog antes de concluir: "Você não poderá editar após concluir. Deseja continuar?" *(política de finalização — pode ser configurável por ciclo).*
7. Após concluir: status muda pra "Concluído", redireciona pra HU-01 com toast de sucesso.

**Regras de negócio:**

- **RN 6** — Banner do papel é mandatório e visualmente distinto por tipo (cores alinhadas com `relacaoChip`).
- **RN 7** — Perguntas escala são **obrigatórias** pra concluir; perguntas texto são **opcionais**.
- **RN 8** — Salvar rascunho preserva todas as respostas parciais + posição da sessão atual.
- **RN 9** — Concluir avaliação aciona confirm dialog. Após confirmar, status vira "Concluído" e tela vira read-only.
- **RN 10** — Avaliações concluídas (status="Concluído") na HU-01 abrem em **modo read-only** — não permitem edição (reflete o RN 9).
- **RN 11** — Se o líder tem **sigilo gestor pós-autoavaliação** ativo no ciclo, ele só vê a autoavaliação do liderado **depois** que o liderado tiver concluído a própria.

**Critérios de aceite:**

- **CA-05** — DADO o Líder responde uma avaliação tipo Líder sobre "Paula", ENTÃO banner azul/roxo no topo mostra "Como líder · avaliando Paula Carvalho".
- **CA-06** — DADO o Líder respondendo, QUANDO clica "Salvar rascunho", ENTÃO progresso e respostas são preservados (sem mudar status).
- **CA-07** — DADO uma pergunta escala obrigatória sem resposta, QUANDO Líder clica "Concluir", ENTÃO botão fica desabilitado E sessão correspondente fica destacada em vermelho no SectionNav.
- **CA-08** — DADO o Líder concluiu uma avaliação, QUANDO abre ela de novo na lista, ENTÃO tela é read-only.
- **CA-09** — DADO ciclo com sigilo gestor ativo + liderado ainda não concluiu auto, QUANDO Líder tenta abrir avaliação Líder→Liderado, ENTÃO sistema mostra warning "Aguarde o liderado concluir a autoavaliação".

**Fora de escopo:** edição pós-conclusão — avaliação concluída é **read-only definitiva, sem reabertura** (nem pelo Admin; decisão 2026-05-27, princípio de estados terminais); upload de anexo; @-mention.

**Resultado:** avaliação preenchida e concluída, contribuindo pra `AvaliacaoConsolidada` do avaliado.

---

### HU-03 — Acompanhar status do time

| **Como** | Líder, |
| --- | --- |
| **Quero** | dashboard do progresso de avaliações dos meus liderados nas campanhas ativas, |
| **Para** | identificar quem tá atrasado, cobrar liderados que ainda não responderam, e ter visão geral do time. |

**Ref no protótipo:** Tab **"Status do time"** dentro de Desenvolvimento (Líder).

**Fluxo detalhado:**
1. Líder clica na tab "Status do time".
2. Sistema mostra dashboard com escopo automaticamente filtrado pelo time do líder.
3. KPIs no topo: % do time com avaliações concluídas, % iniciado, % pendente.
4. Tabela de liderados com: nome, cargo, área, contadores de avaliações pendentes/concluídas, próximo prazo, ação ("Ver detalhes").
5. Drill-down individual: ver todas as avaliações em curso pra aquele liderado, em qualquer papel/campanha.

**Regras de negócio:**

- **RN 12** — Escopo é **automaticamente recortado pelo time do líder** (subordinados diretos). Backend aplica o filtro — UI consome sem precisar passar filtro.
- **RN 13** — KPIs e contadores consideram **todas as campanhas ativas** do escopo do líder.
- **RN 14** — Drill-down do liderado mostra avaliações em todos os papéis (líder e pares avaliando esse liderado, autoavaliação do liderado, liderado-responde do líder).

**Critérios de aceite:**

- **CA-10** — DADO Líder com 5 liderados, ENTÃO a tabela mostra apenas esses 5.
- **CA-11** — DADO uma liderada sem avaliações pendentes, ENTÃO contador "Pendentes" da linha dela mostra 0.
- **CA-12** — DADO Líder clica em drill-down de "Paula", ENTÃO vê detalhes de avaliações em curso pra Paula (auto + líder + pares + liderada-responde).

**Fora de escopo:** envio de lembrete diretamente da tela; export.

**Resultado:** Líder tem panorama do time e pode agir individualmente.

---

### HU-04 — Visão 9-box do time

| **Como** | Líder, |
| --- | --- |
| **Quero** | ver a matriz 9-box recortada pelos meus liderados, com posicionamento baseado nas avaliações consolidadas, |
| **Para** | direcionar conversas de plano de carreira, indicar pra calibração macro do RH, e identificar talentos/riscos. |

**Ref no protótipo:** Tab **"Visão 9-box"** dentro de Desenvolvimento (Líder).

**Fluxo detalhado:**
1. Líder clica em "Visão 9-box".
2. Sistema mostra matriz 3×3 (ou outra configuração definida no Ciclo ativo) **recortada pelos liderados** do líder.
3. Cada chip = um liderado, posicionado conforme avaliação consolidada do ciclo vigente (ou snapshot mais recente).
4. **Modo read-only** — Líder não move chips. Calibração oficial é operação do Admin (PRD #1 HU-06).
5. Filtros: por ciclo, por área (se o time é multi-área), por período.
6. Click no chip → side panel com info do liderado e botão "Ir pra avaliação" (entra na timeline ou consolidação se disponível).

**Regras de negócio:**

- **RN 15** — Visão é **read-only pro Líder**. Movimentação é apenas no fluxo de Calibração do Admin (PRD #1).
- **RN 16** — Escopo é automaticamente o time do líder (mesmo critério de RN 12).
- **RN 17** — Posicionamento vem do snapshot mais recente do filtro ativo.
- **RN 18** — Side panel mostra dados resumidos do liderado + botão pra navegação útil (avaliação consolidada / timeline de registros).

**Critérios de aceite:**

- **CA-13** — DADO o Líder abre "Visão 9-box", ENTÃO matriz é renderizada com seus liderados posicionados.
- **CA-14** — DADO o Líder tenta arrastar um chip, ENTÃO nada acontece (read-only).
- **CA-15** — DADO o Líder clica no chip de "Paula", ENTÃO side panel abre com info dela + opção pra ir pra Consolidação se ciclo concluído.

**Fora de escopo:** sugestões automáticas de plano de carreira; comparação histórica entre ciclos.

**Resultado:** Líder tem leitura do time num quadrante de performance×potencial, insumo pra decisões de gestão.

---

### HU-05 — Consolidar feedback do liderado

| **Como** | Líder, |
| --- | --- |
| **Quero** | abrir a consolidação de avaliações de um liderado meu após a campanha concluir, e registrar a devolutiva, |
| **Para** | fechar formalmente o ciclo daquele liderado e entregar o resultado em conversa estruturada. |

**Ref no protótipo:** A partir da listagem (drill-down da HU-03) ou da timeline do liderado (PRD #4) → `ConsolidarFeedbackPage`.

> **Nota:** O fluxo de Consolidação + Devolutiva é o **mesmo do PRD #1 HU-05 e PRD #2 HU-05**. Aqui o ator é o Líder direto do liderado (não Admin/RH como observador). Comportamento é idêntico — banner indica papel "Líder direto".

**Fluxo detalhado:** ver PRD #1 § HU-05 (Consolidar feedback pós-avaliação) — mesmas 2 tabs (Consolidação + Feedback), mesmo método de finalização aplicado conforme Ciclo, mesma estrutura de Copiloto IA.

**Regras de negócio:**

- **RN 19** — Apenas Líder direto pode acessar este fluxo pra seus liderados (regra de visibilidade do RBAC). Admin tem acesso amplo (PRD #1).
- **RN 20** — `autorPapel` do Registro tipo Devolutiva criado = **"Líder"** quando Líder aciona (diferente de **"RH"** quando Admin aciona).
- **RN 21** — Demais regras vêm de PRD #1 § HU-05 + PRD #2 § HU-05.

**Critérios de aceite:**

- **CA-16** — DADO Líder direto de "Paula" abre Consolidação dela, ENTÃO acessa o fluxo completo (Consolidação + Devolutiva).
- **CA-17** — DADO Líder NÃO direto de "Paula" tenta acessar Consolidação dela, ENTÃO sistema bloqueia (403).
- **CA-18** — DADO Líder salva Devolutiva, ENTÃO Registro tipo Devolutiva é criado com `autorPapel="Líder"`.

**Fora de escopo:** delegação de consolidação (substitutos / férias) — operacional fora deste PRD.

**Resultado:** ciclo do liderado fechado com nota final + devolutiva entregue.

## 6. Spike

> **S1 — Definição do "time do líder" no twyg-app**
>
> **Pergunta**: como o backend resolve "liderados diretos do Líder"? Relação User → Manager direta? Hierarquia recursiva? Includes substitutos/cargo interino?
>
> **Critério de done**: regra de RBAC + relação no domínio User confirmada.

> **S2 — Política de sigilo gestor pós-autoavaliação**
>
> **Pergunta**: regra RN 11 é toggle no Ciclo? Default ligado/desligado? Como expressar no backend?
>
> **Critério de done**: campo `sigiloGestorPosAuto` (ou similar) definido no Ciclo, com default e propagação pra fluxo de UI.

> **S3 — Read-only de avaliação concluída** *(resolvido 2026-05-27)*
>
> **Decisão**: avaliação concluída é **terminal / read-only** — **não há reabertura**, nem via Admin. Alinhado ao princípio de estados terminais (Ciclo Finalizado, Campanha Encerrada e avaliação concluída não reabrem). Sem "janela de graça". O Aluno/Líder pode apenas **rever** (read-only), nunca reabrir.

---

## 7. Como testar

### Tags Playwright

- `@lider @desenvolvimento @critical` — RN 11 sigilo gestor (segurança), consolidação + devolutiva
- `@lider @desenvolvimento @high` — 9-box do time read-only, filtros
- `@lider @desenvolvimento @skip-proto-gap-06` — RN 11 ainda não implementada (gap-06)

### Pré-requisitos

- Usuário Líder logado (`is_leader: true`, com liderados diretos)
- Feature flag `performance_module_enabled` ON
- Ciclo ativo com avaliações distribuídas

### Rodar local

```bash
cd frontend && yarn dev   # login como Pedro Líder
# ou
cd ../twyg-app && make start && yarn playwright test --grep "@lider @desenvolvimento"
```

---

## 8. Cross-references

### HUs com gap aberto no protótipo

- **HU-02** (Sigilo gestor RN 11): [gap-06](../gaps/gap-06-sigilo-gestor-rn11.md) — toggle e filtro ausentes (security-critical)
- **HU-03** (Devolutiva render): [gap-09](../gaps/gap-09-devolutiva-render-3-superficies.md) — modo read-only divergente

### Modelo compartilhado

- **Ciclo / Campanha / Avaliação / 9-box**: configurados em [PRD #1](./prd-admin-desenvolvimento.md) (Admin) — Líder consome read-only do escopo do time
- **Devolutiva**: criada aqui (HU-03) → consumida em [PRD #6](./prd-aluno-feedbacks-recebidos.md) (Aluno recebida)
- **Registro**: criado/visto em paralelo via [PRD #4](./prd-lider-feedbacks-anotacoes.md)

### Glossário e regras

- Papéis avaliativos: [`glossary.md § 4`](../glossary.md#4-papéis-avaliativos)
- RBAC "time do Líder": derivado de `User.liderDiretoId` (sem matricial) — ver [PRD #7 RN 10/12](./prd-admin-usuarios-dho.md)
- Regras default anti-viés vs RN 11: [`regras-default-ciclo.md`](../regras-default-ciclo.md) (anti-viés é regra default; RN 11 é toggle adicional)

### Twy plan (twyg-app)

- D04 (Avaliação Responder + Listagens multi-papel) cobre HU-01
- D06 (Encerramento + Consolidação + Devolutiva) cobre HU-03
- D07 (9-box) cobre HU-04
- Visual-audit identifica leader hub (`/o/1/performance_evaluations`) com 404 — gap de port — ver `../../twyg-app/.twy/performance-module/visual-audit-2026-05-16.md`
