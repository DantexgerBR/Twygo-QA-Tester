# PRD — Aluno (Colaborador) > Desenvolvimento > Avaliações a preencher

| Produto | Twygo — DHO — módulo Desenvolvimento |
| --- | --- |
| Escopo desta entrega | Jornada do perfil **Aluno (Colaborador)** na aba **"Avaliações a preencher"** dentro do hub de Desenvolvimento |
| Audiência | Time de dev twyg-app (Rails + React Clean Arch) — dev primário: João |
| Base utilizada | Protótipo (localhost:5173, branch `main`) + componentes `MeusCiclosHub`, `MinhasAvaliacoesColab`, `ResponderAvaliacaoScreen` |
| Fora de escopo | Outras abas do hub (PDI / Feedbacks recebidos / Resultados de Eficácia); fluxos de Admin/Líder |

## 1. Visão geral da jornada

O Aluno (Colaborador) é o **respondedor primário** do processo avaliativo. Diferente do Líder (que avalia outros), o Aluno tipicamente está em **4 papéis simultâneos**:
- **Auto-avaliação** — responde sobre si mesmo.
- **Avaliação do liderado** (sobre o líder dele) — responde sobre o gestor direto.
- **Avaliação de pares** — responde sobre colegas designados.
- *(Quando Aluno também é Líder de outras pessoas, aparece também "Avaliação do líder" — mas isso entra no PRD #3.)*

A jornada do Aluno é **simples e focada**: ver o que tem pra responder, abrir, preencher, salvar rascunho conforme avança, e concluir.

## 2. Mapa do fluxo principal

| Etapa | Ator | Ação | Tela / Local na UI |
|-------|------|------|---------------------|
| 1 | Aluno | Acessa Desempenho/Desenvolvimento | Sidebar > "Desempenho" (ou nome equivalente) > Hub do colaborador |
| 2 | Aluno | Clica na tab "Avaliações a preencher" | Tab dentro de `MeusCiclosHub` |
| 3 | Aluno | Vê lista de avaliações pendentes | Tabela `MinhasAvaliacoesColab` |
| 4 | Aluno | Clica em uma avaliação | Navega pra `ResponderAvaliacaoScreen` |
| 5 | Aluno | Preenche perguntas (escala + texto) por sessão | Form com `SectionNav` |
| 6 | Aluno | Salva rascunho ou Conclui | Botões no footer |
| 7 | Aluno | Volta pra lista (rascunho) ou vê toast (concluído) | Retorno automático |

## 3. Modelo de dados envolvido

Referência: PRD #1 § 3 e PRD #3 § 3. Pontos críticos pro Aluno:

- **AvaliacaoRow** com `relacao: RelacaoAvaliacao` ∈ {Auto-avaliação, Avaliação do liderado, Avaliação de pares} pro Aluno (Avaliação do líder fica em quem é Líder de fato).
- **PapelAvaliacao**: `{tipo: "auto" | "liderado-responde" | "par", ...}` controla banner e contexto da `ResponderAvaliacaoScreen`.
- **Sessões + Perguntas**: form é organizado em sessões (agrupamentos), cada uma com N perguntas escala (obrigatórias) e/ou texto (opcionais).
- **Status**: A iniciar / Iniciado (rascunho salvo) / Concluído.

## 4. Épico

| **Épico** | Permitir que o Aluno (Colaborador) **responda as avaliações que lhe foram atribuídas** com clareza de papel, progresso visível, possibilidade de salvar rascunho e finalizar quando concluído. |
| --- | --- |
| **Valor esperado** | Capturar a perspectiva do colaborador no processo avaliativo de forma fluida — substituir formulários longos não-segmentados por experiência de preenchimento progressivo, com clareza de "quem estou avaliando, em qual papel, e quanto falta". |

## 5. Histórias do Usuário

### HU-01 — Listar avaliações pendentes do colaborador

| **Como** | Aluno (Colaborador), |
| --- | --- |
| **Quero** | ver todas as avaliações que preciso responder, com indicação clara do papel (Auto / Sobre meu líder / Sobre par) e do prazo, |
| **Para** | priorizar e não esquecer nenhuma. |

**Ref no protótipo:** Hub do colaborador > tab **"Avaliações a preencher"** (`MinhasAvaliacoesColab`).

**Fluxo detalhado:**
1. Aluno entra no hub de desempenho/desenvolvimento.
2. Clica na tab "Avaliações a preencher" (tab com indicador de atenção quando tem itens pendentes).
3. Sistema exibe **tabela com colunas**: Ciclo, Campanha, Tipo (Desempenho/Experiência/Pares), **Papel** (chip colorido: Auto / Sobre líder / Sobre par), Avaliado (nome ou "Você" pra Auto), Status, Progresso (%), Prazo, Dias até prazo, Ação.
4. Filtros opcionais: por papel, por status, por ciclo.
5. Click numa linha → `ResponderAvaliacaoScreen` (HU-02).

**Regras de negócio:**

- **RN 1** — Lista inclui **3 papéis** do Aluno (sem ser Líder de outros): Auto-avaliação, Avaliação do liderado (sobre o líder dele), Avaliação de pares.
- **RN 2** — Chips de papel coloridos: Auto-avaliação=verde, Avaliação do liderado=azul, Avaliação de pares=âmbar (alinhado com `relacaoChip` do mock).
- **RN 3** — Avaliações atrasadas (`diasAtePrazo < 0`) recebem badge "Atrasada" + destaque visual.
- **RN 4** — Avaliações concluídas ficam visualmente esmaecidas mas ainda na lista (podem ser abertas em read-only).
- **RN 5** — Ordenação default: prazo crescente.
- **RN 6** — Tab tem **indicador de atenção** (ex: asterisco) quando há pendentes.

**Critérios de aceite:**

- **CA-01** — DADO Aluno entra no hub, ENTÃO tab "Avaliações a preencher" tem indicador de atenção se ele tem pendentes.
- **CA-02** — DADO Aluno tem uma autoavaliação pendente, ENTÃO ela aparece com chip "Auto-avaliação" verde + "Você" como avaliado.
- **CA-03** — DADO Aluno tem avaliação de par sobre "João", ENTÃO chip mostra "Avaliação de pares" âmbar + "João" como avaliado.
- **CA-04** — DADO uma avaliação com prazo vencido, ENTÃO badge "Atrasada" aparece.
- **CA-05** — DADO Aluno filtra por papel="Auto-avaliação", ENTÃO lista mostra apenas autoavaliações.

**Fora de escopo:** ordenação por colunas; salvar preferência de filtro; agrupamento por ciclo.

**Resultado:** Aluno tem clareza do que precisa responder e em qual papel.

---

### HU-02 — Responder avaliação

| **Como** | Aluno, |
| --- | --- |
| **Quero** | preencher a avaliação navegando entre sessões do formulário, com clareza visual do papel, progresso e o que falta, |
| **Para** | concluir corretamente sem perder contexto durante o preenchimento. |

**Ref no protótipo:** `ResponderAvaliacaoScreen`.

**Fluxo detalhado:**
1. Sistema navega pra tela de responder com **banner colorido no topo identificando o papel**:
   - Auto: "Sua auto-avaliação" (verde)
   - Sobre líder: "Como liderado · avaliando seu líder {Nome}" (azul)
   - Sobre par: "Como par · avaliando colega {Nome}" (âmbar)
2. Formulário em **sessões** (agrupamentos). `SectionNav` lateral mostra todas as sessões + progresso individual + total.
3. Cada pergunta tem tipo **escala** (obrigatória) com botões de pontuação OR **texto** (opcional, com placeholder orientativo).
4. Barra de progresso superior mostra % concluído do formulário inteiro.
5. Footer fixo: **"Salvar rascunho"** + **"Concluir avaliação"**.
6. "Concluir avaliação" só habilita quando todas as perguntas escala (obrigatórias) estão preenchidas.
7. Confirm dialog antes de concluir: "Você não poderá editar após concluir. Deseja continuar?"
8. Pós-conclusão: status muda pra "Concluído", redireciona pra HU-01 + toast de sucesso.

**Regras de negócio:**

- **RN 7** — Banner do papel é **mandatório** e visualmente distinto por tipo (cores conforme `relacaoChip`).
- **RN 8** — Perguntas tipo escala são **obrigatórias** pra concluir; perguntas tipo texto são **opcionais**.
- **RN 9** — Salvar rascunho a qualquer momento preserva todas as respostas parciais + posição da sessão atual + tempo de "Última edição".
- **RN 10** — "Concluir avaliação" exige todas as perguntas escala preenchidas. Submit em fluxo incompleto destaca em vermelho as sessões com pendência no `SectionNav`.
- **RN 11** — Após concluir, avaliação fica **read-only definitivamente** — **não há reabertura** (nem pelo Admin). Alinhado ao princípio de estados terminais (decisão 2026-05-27). O Aluno pode **rever** as respostas (HU-03), nunca reabrir/editar.
- **RN 12** — Tela bloqueia perda acidental: tentar sair sem salvar com mudanças não-salvas → confirm dialog "Sair sem salvar?".
- **RN 13** — Sigilo gestor: se ciclo tem sigilo gestor pós-autoavaliação ativo, o líder do Aluno só vê a autoavaliação dele **depois** que o Aluno concluir. (Aluno em si não tem regra especial — ele responde normal.)

**Critérios de aceite:**

- **CA-06** — DADO Aluno abre uma autoavaliação, ENTÃO banner verde no topo mostra "Sua auto-avaliação".
- **CA-07** — DADO Aluno responde avaliação sobre líder "Felipe", ENTÃO banner azul mostra "Como liderado · avaliando seu líder Felipe Souza".
- **CA-08** — DADO Aluno preencheu 3 de 5 sessões parcialmente, QUANDO clica "Salvar rascunho", ENTÃO progresso é preservado E status fica "Iniciado" na lista (HU-01).
- **CA-09** — DADO Aluno tenta concluir com 1 pergunta escala vazia, QUANDO clica "Concluir", ENTÃO botão fica desabilitado + sessão com pergunta faltante fica destacada em vermelho no SectionNav.
- **CA-10** — DADO Aluno tenta sair da tela com respostas não-salvas, ENTÃO confirm dialog aparece "Sair sem salvar?".
- **CA-11** — DADO Aluno concluiu uma avaliação, QUANDO abre ela de novo na lista, ENTÃO tela é read-only.

**Fora de escopo:** edição após conclusão; upload de anexos; @-mention; comentários encadeados.

**Resultado:** avaliação preenchida e concluída pelo colaborador, contribuindo pra `AvaliacaoConsolidada` final.

---

### HU-03 — Rever avaliações concluídas (read-only)

| **Como** | Aluno, |
| --- | --- |
| **Quero** | rever uma avaliação que já concluí (read-only) pra revisar minhas respostas, |
| **Para** | conferir o que respondi antes de uma conversa de feedback ou simplesmente como memória. |

**Ref no protótipo:** Sub-tab ou filtro "Concluídas" dentro da listagem `MinhasAvaliacoesColab`.

**Fluxo detalhado:**
1. Aluno filtra a listagem por status="Concluído" (ou sub-tab "Concluídas" se UI tiver).
2. Sistema mostra avaliações concluídas com data de conclusão.
3. Click numa linha → mesma tela de `ResponderAvaliacaoScreen` em **modo read-only**.
4. Tela mostra respostas como foram registradas. Footer não mostra botões de ação (read-only).

**Regras de negócio:**

- **RN 14** — Avaliações concluídas são **read-only** pro Aluno. Nenhum campo editável.
- **RN 15** — Banner do papel continua aparecendo (mesma cor) com texto adicional "(Concluída em DD/MM/YYYY)".
- **RN 16** — Aluno só vê as **próprias** respostas. Em casos onde ele avaliou outra pessoa (par/liderado-responde), ele vê o que ele escreveu sobre o outro. Em autoavaliação, vê o que escreveu sobre si.
- **RN 17** — Aluno **NÃO vê** o que outras pessoas escreveram sobre ele aqui (isso vive na consolidação, fora deste fluxo).

**Critérios de aceite:**

- **CA-12** — DADO Aluno filtra "Concluídas", ENTÃO lista mostra apenas avaliações com status="Concluído".
- **CA-13** — DADO Aluno abre uma avaliação concluída, ENTÃO tela é read-only com banner indicando data de conclusão.
- **CA-14** — DADO Aluno tenta editar campo na tela read-only, ENTÃO campo é não-interativo.
- **CA-15** — DADO Aluno revê uma autoavaliação concluída, ENTÃO vê apenas as próprias respostas (não vê o que líder/pares disseram).

**Fora de escopo:** comparação visual entre o que Aluno respondeu sobre si vs o que outros responderam (isso vive no fluxo de Devolutiva).

**Resultado:** Aluno tem acesso ao histórico das próprias respostas pra revisão.

## 6. Spike

> **S1 — Política de finalização de avaliação**
>
> **Pergunta**: avaliação concluída é definitivamente read-only ou pode ter janela de "graça" pra correção (ex: 24h)? Política configurável por ciclo?
>
> **Critério de done**: regra confirmada com RH + impacto em UI.

> **S2 — Auto-save vs Save manual**
>
> **Pergunta**: o protótipo tem "Salvar rascunho" manual. No twyg-app real, faz sentido ter auto-save (a cada N segundos ou ao mudar de sessão)?
>
> **Risco**: usuário perder respostas se navegador trava ou aba fecha.
>
> **Critério de done**: estratégia de salvamento definida (manual / auto / híbrido) + comportamento de UI alinhado.

> **S3 — Comportamento offline (mobile/PWA)**
>
> **Pergunta**: Aluno pode responder avaliação parcialmente offline? Sync ao reconectar?
>
> **Critério de done**: decisão sobre suporte offline + impacto em modelagem de dados.

---

## 7. Como testar

### Tags Playwright

- `@aluno @avaliacoes @critical` — preencher Auto-avaliação golden path
- `@aluno @avaliacoes @high` — submit com pendências (RN 10), salvar rascunho
- `@aluno @avaliacoes @medium` — atalhos de teclado, banner por papel
- `@aluno @avaliacoes @skip-proto-gap-05` — depende de [gap-05](../gaps/gap-05-sectionnav-validacao-rn10.md) ser FIXED

### Pré-requisitos

- Aluno/Líder/Multi-papel logado
- Feature flag `performance_module_enabled` ON
- Ciclo ativo com avaliações pendentes pro user

### Rodar local

```bash
cd frontend && yarn dev   # protótipo (login como Maria pra ver multi-papel)
# ou
cd ../twyg-app && make start && yarn playwright test --grep "@aluno @avaliacoes"
```

---

## 8. Cross-references

### HUs com gap aberto no protótipo

- **HU-01** (SectionNav validação): [gap-05](../gaps/gap-05-sectionnav-validacao-rn10.md) — RN 10, sessões não destacam em vermelho
- **HU-02** (Salvar rascunho): [gap-15](../gaps/gap-15-salvar-rascunho-nao-persiste.md) — só toast, sem persistência

### Modelo compartilhado

- **Avaliação** + **Sessão** + **Pergunta**: consumidos por [PRD #1](./prd-admin-desenvolvimento.md) HU-04 (acompanhamento) e [PRD #3](./prd-lider-desenvolvimento.md) HU-01 (Líder também responde via mesma tela)
- **ResponderAvaliacaoScreen**: tela compartilhada Líder + Aluno (reuse via prop `papel`)

### Glossário e regras

- Status canônicos de Avaliação: [`glossary.md § 5`](../glossary.md#avaliação)
- Papéis (Auto/Líder/Par/Liderado): [`glossary.md § 4`](../glossary.md#4-papéis-avaliativos)
- Regras default visibilidade pós-encerramento: [`regras-default-ciclo.md`](../regras-default-ciclo.md)

### Twy plan (twyg-app)

- D04 (Avaliação Responder + Listagens multi-papel) — ver `../../twyg-app/.twy/performance-module/deliverables/D04.md`
