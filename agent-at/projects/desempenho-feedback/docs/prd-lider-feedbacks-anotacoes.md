# PRD — Líder > Gestão de Time(s) > Feedbacks e Anotações

> 📚 **Naming canônico (atualizado 2026-05-16)**: PRD em pt-BR (Registro / Devolutiva / Anotação / etc). Em **código/DB**, modelo é `PerformanceEntry` com `kind` enum em inglês. Mapping: [`glossary.md § 3.7`](../glossary.md#37-performanceentry-ui-feedbacks-e-anotações).

| Produto | Twygo — DHO — módulo Feedbacks e Anotações |
| --- | --- |
| Escopo desta entrega | Jornada do perfil **Líder** no módulo de registros contínuos sobre **seus liderados diretos** |
| Audiência | Time de dev twyg-app (Rails + React Clean Arch) — dev primário: João |
| Base utilizada | Protótipo (localhost:5173, branch `main`) + **PRD #2 (Admin > Feedbacks e Anotações)** como referência de modelo + `docs/glossario-rh.md` |
| Fora de escopo | Eficácia; PDI/Competências/Sucessão; perfis Admin (PRD #2) e Aluno (PRD #5/#6) |

## 1. Visão geral da jornada

O Líder é o **dono cotidiano** do módulo Feedbacks e Anotações. É ele que registra a maioria dos sinais sobre os liderados — reconhecimentos, pontos de atenção, conversas de feedback, anotações privadas — e é ele quem dá a devolutiva pós-avaliação ao fim de cada ciclo.

A diferença vs Admin (PRD #2) é **escopo**: o Líder vê **apenas seus liderados diretos**. A UI e ações são quase idênticas, mas a regra de visibilidade no backend filtra automaticamente.

A jornada do Líder se divide em **4 momentos**:
1. **Acompanhamento do time** — visão consolidada dos liderados com contagens de registros.
2. **Drill-down individual** — abrir a timeline de um liderado pra contextualizar.
3. **Registro pontual** — registrar feedback/reconhecimento/ponto de atenção/anotação cotidiana.
4. **Devolutiva pós-avaliação** — formalizar o fechamento do ciclo com o liderado.

## 2. Mapa do fluxo principal

Idêntico ao do Admin (PRD #2 § 2), com a diferença de que **a listagem mostra apenas liderados diretos** do líder logado.

| Etapa | Ator | Ação | Tela / Local na UI |
|-------|------|------|---------------------|
| 1 | Líder | Acessa o módulo | Sidebar > "Gestão de Time(s)" > "Feedbacks e Anotações" |
| 2 | Líder | Vê lista de **liderados** com contagens agregadas | Listagem padrão (tabela) |
| 3 | Líder | Filtra/busca liderado específico | Campo de busca + Drawer de filtros |
| 4a | Líder | Cria registro ad-hoc | Botão "Novo registro" → Modal |
| 4b | Líder | Pré-visualiza registros por bucket | Clica em chip "Feedbacks" ou "Anotações" da linha |
| 4c | Líder | Entra na timeline completa do liderado | Clica em linha do liderado |
| 5 | Líder | (Na timeline) Adiciona registro ou aciona devolutiva | Botão "Adicionar registro" / "Dar devolutiva" |
| 6 | Líder | (Devolutiva) Preenche formulário consolidado de fim de ciclo | Tela `RegistrarFeedbackLider` |

## 3. Modelo de dados envolvido

**Referência completa:** PRD #2 § 3.

Diferenças críticas pro Líder:
- **Regra de visibilidade** (`registroVisivelPara`): Líder vê tudo do **seu time**. Backend filtra automaticamente; UI consome.
- **`autorPapel`** dos registros criados pelo Líder = "Líder" (vs "RH" pro Admin).
- Anotações que o Líder cria são privadas dele + RH (Admin RH continua vendo tudo).

## 4. Épico

| **Épico** | Permitir que o Líder **registre cotidianamente sinais sobre seus liderados e formalize devolutivas pós-avaliação**, mantendo histórico contínuo do desenvolvimento individual. |
| --- | --- |
| **Valor esperado** | Centralizar a memória do Líder sobre o time — substituir blocos de notas pessoais por um repositório estruturado, visível ao RH, com tipagem clara (reconhecimento × ponto de atenção × feedback × devolutiva × anotação privada). |

## 5. Histórias do Usuário

### HU-01 — Visualizar e filtrar lista dos liderados com agregados

> **Comportamento idêntico ao PRD #2 HU-01**, com escopo restrito ao time do líder.

| **Como** | Líder, |
| --- | --- |
| **Quero** | ver lista dos meus liderados diretos com contagem de Feedbacks e Anotações de cada, |
| **Para** | identificar quem está sem movimento recente e onde meu acompanhamento é mais necessário. |

**Ref no protótipo:** Sidebar > "Gestão de Time(s)" > "Feedbacks e Anotações".

**Regras de negócio (delta vs PRD #2 HU-01):**

- **RN 1** — Lista mostra **apenas liderados diretos** do Líder logado, conforme RBAC do twyg-app.
- **RN 2** — Buckets "Feedbacks" e "Anotações" agregam mesmos tipos do PRD #2 (RN 2 e RN 3 daquele PRD).
- **RN 3** — Filtros e ordenação idênticos ao PRD #2 (RN 4–8).

**Critérios de aceite:**

- **CA-01** — DADO Líder com 5 liderados, ENTÃO listagem mostra apenas esses 5 (nenhum outro colaborador).
- **CA-02** — DADO Líder na listagem, ENTÃO comportamento de busca/filtros/ordenação idêntico ao PRD #2 (CA-02 a CA-06 daquele PRD).

**Fora de escopo:** ver registros de outros líderes / colaboradores não-liderados; ações que dependem de visão de organização inteira (Admin only).

**Resultado:** Líder tem visão do time e prioriza onde agir.

**Pontos de atenção:** filtragem por liderados diretos vira **query no backend**, não filtragem na UI. UI nem deve receber dados de fora do escopo.

---

### HU-02 — Criar registro ad-hoc sobre liderado

> **Comportamento idêntico ao PRD #2 HU-02**, com diferença de `autorPapel`.

**Delta vs PRD #2 HU-02:**

- **RN 4** — Campo "Para" (combobox) é restrito a **liderados diretos** do Líder logado. Não permite buscar/selecionar pessoa fora do time.
- **RN 5** — `autorPapel` do registro criado = **"Líder"** (vs "RH" no PRD #2 RN 14).
- **RN 6** — Demais comportamentos (4 tipos criáveis, validação, chip de visibilidade, hint por tipo, confirm dialog descartar) seguem PRD #2 HU-02 RN 9–17.

**Critérios de aceite:**

- **CA-03** — DADO Líder no modal de criar registro, QUANDO busca colaborador "Paula" (liderada dele), ENTÃO sistema permite selecionar.
- **CA-04** — DADO Líder no modal, QUANDO busca colaborador fora do time, ENTÃO sistema mostra "Nenhum colaborador encontrado".
- **CA-05** — DADO Líder salva um Feedback, ENTÃO registro é criado com `autorPapel="Líder"`.
- **CA-06** — Demais validações/comportamentos seguem PRD #2 CA-07 a CA-14.

**Resultado:** registro criado sobre liderado direto, com Líder como autor.

---

### HU-03 — Drill-down: timeline do liderado + pré-visualização

> **Comportamento idêntico ao PRD #2 HU-03 + HU-04**, consolidados aqui pelo escopo menor.

**Delta vs PRD #2 HU-03 e HU-04:**

- **RN 7** — Timeline é acessível apenas pra **liderados diretos**. Tentativa de acessar timeline de não-liderado retorna 403.
- **RN 8** — Anotações exibidas na timeline são **as do próprio Líder + as do Admin/RH**. O Líder não vê Anotações de outros líderes (se houver casos de pessoa que mudou de líder, regra do twyg-app define visibilidade do histórico).
- **RN 9** — Botão "Dar devolutiva" aparece com mesmas regras do PRD #2 HU-03 RN 21 (apenas se `AvaliacaoConsolidada` existe).
- **RN 10** — Modal de preview por bucket (PRD #2 HU-04) idêntico — apenas escopo de visibilidade é diferente.

**Critérios de aceite:**

- **CA-07** — DADO Líder direto de "Paula", QUANDO clica em "Paula" na lista, ENTÃO timeline abre.
- **CA-08** — DADO Líder NÃO direto de "Paula" tenta acessar timeline dela via URL, ENTÃO 403.
- **CA-09** — DADO Líder vê uma Anotação de outro líder no histórico (pessoa que mudou de gestor), ENTÃO Anotação aparece OU é filtrada conforme regra do twyg-app (decisão do Spike S2).
- **CA-10** — Demais comportamentos seguem PRD #2 CA-15 a CA-26.

**Fora de escopo:** ações sobre registros de outros autores (não pode editar/excluir o que outra pessoa criou).

**Resultado:** Líder tem histórico do liderado pra contextualizar conversas e decisões.

---

### HU-04 — Dar devolutiva pós-avaliação

> **Idêntico ao PRD #2 HU-05** (descrição completa lá), com diferenças mínimas.

**Delta vs PRD #2 HU-05:**

- **RN 11** — Apenas Líder **direto** do liderado pode acessar este fluxo (não qualquer Líder).
- **RN 12** — `autorPapel` do registro tipo Devolutiva = **"Líder"** (vs "RH" pro Admin no PRD #2 RN 38).
- **RN 13** — Demais regras (campos obrigatórios, Copiloto IA, edição de devolutiva existente, visibilidade ao colab) seguem PRD #2 HU-05 RN 30–37.

**Critérios de aceite:**

- **CA-11** — DADO Líder direto de "Paula" com `AvaliacaoConsolidada` disponível, QUANDO clica "Dar devolutiva", ENTÃO entra no form completo (4 campos + Copiloto IA).
- **CA-12** — DADO Líder NÃO direto tenta acessar devolutiva, ENTÃO 403.
- **CA-13** — DADO Líder direto salva devolutiva, ENTÃO Registro tipo Devolutiva é criado com `autorPapel="Líder"`.
- **CA-14** — Demais comportamentos seguem PRD #2 CA-27 a CA-32.

**Fora de escopo:** delegação de devolutiva (líder de férias / substituto) — operacional fora deste PRD.

**Resultado:** ciclo do liderado fechado com devolutiva formal entregue.

## 6. Spike

> **S1 — Definição de "liderado direto" no twyg-app**
>
> Mesma pergunta do Spike S1 do PRD #3 — resolve juntos.

> **S2 — Histórico de registros quando colaborador muda de líder**
>
> **Pergunta**: quando "Paula" muda do Líder A pro Líder B, o Líder B vê todos os registros antigos (de quando Paula era liderada do A)? Inclusive Anotações privadas que o A escreveu? Ou só registros visíveis ao colab?
>
> **Risco**: vazamento de Anotações privadas entre líderes; alternativamente, perda de contexto histórico no acompanhamento.
>
> **Critério de done**: regra clara — segue colaborador ou segue líder? Privacidade de Anotação considerada.

> **S3 — Visibilidade de Anotações criadas por Admin/RH**
>
> **Pergunta**: Anotações criadas pelo Admin (RH) sobre um liderado aparecem na timeline do Líder direto, ou ficam visíveis só pro RH e pro Admin que criou?
>
> **Critério de done**: regra de visibilidade refinada na granularidade de autor + papel.

---

## 7. Como testar

### Tags Playwright

- `@lider @feedbacks @critical` — RBAC (Líder NÃO vê registros fora do time), Anotação privada
- `@lider @feedbacks @high` — criar Registro ad-hoc, timeline filtrada
- `@lider @feedbacks @medium` — filtros por tipo, busca

### Pré-requisitos

- Usuário Líder logado (`is_leader: true`)
- Feature flag `performance_module_enabled` ON
- Liderados diretos cadastrados com registros existentes

### Rodar local

```bash
cd frontend && yarn dev   # login como Ana Líder
# ou
cd ../twyg-app && make start && yarn playwright test --grep "@lider @feedbacks"
```

---

## 8. Cross-references

### HUs com gap aberto no protótipo

- **HU-01** (escopo do time): depende de `liderDiretoId` correto — ver Spike S1 e [PRD #7](./prd-admin-usuarios-dho.md)
- **HU-02** (criar Feedback/Anotação): genérico, sem gap específico

### Modelo compartilhado

- **Registro** (5 tipos): mesmo modelo que [PRD #2](./prd-admin-feedbacks-anotacoes.md) (Admin) e [PRD #6](./prd-aluno-feedbacks-recebidos.md) (Aluno) — diferença é o **scope** no repository (RBAC por papel)

### Glossário e regras

- Visibilidade por papel (Admin/Líder/Colab × 5 tipos): [`glossary.md § 3.7`](../glossary.md#37-registro-ui-feedbacks-e-anotações)
- Anotação sempre privada (sem toggle): hardcoded — não confundir com Ponto de Atenção (que tem toggle `visivelColab`)

### Spikes abertos cross-PRDs

- Spike S2 (histórico ao mudar de líder): também relevante pra PRD #3 (registro do antigo líder migra com o liderado ou fica?)
- Spike S3 (Anotação do Admin/RH visível ao Líder?): depende de decisão de produto

### Twy plan (twyg-app)

- D08 (Feedbacks e Anotações + Aluno timeline) cobre escopo Líder via scope no repository — ver `../../twyg-app/.twy/performance-module/deliverables/D08.md`
