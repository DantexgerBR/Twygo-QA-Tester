# PRD — Admin > Usuários (Dados DHO)

| Produto | Twygo — DHO — cadastro de pessoas |
| --- | --- |
| Escopo desta entrega | Cadastro, edição e importação de usuários com **Dados DHO** (campos que alimentam o módulo Desempenho: admissão, cargo nível, líder direto, responsável por desenvolvimento, área, cargo, funções) |
| Audiência | Time de dev twyg-app (Rails + React Clean Arch) — dev primário: João |
| Base utilizada | Protótipo (`UsuariosPage.tsx` + `NovoUsuarioForm.tsx`, branch `main`) + decisões de produto consolidadas em 2026-05-14 |
| Fora de escopo | Endereço; perfis de acesso administrativo (Administrador/Instrutor/Gestor de turma); gamificação (pontuação/progresso); preferências de navegação/notificações/comunidades; ações em massa; visualização em grade; tela de detalhe separada da edição; gestor matricial (decisão Twygo: não existe). Esses campos podem existir no form do protótipo mas são **plataforma Twygo geral**, não específicos do módulo Desempenho. |

## 1. Visão geral da jornada

O Admin/RH é o **dono do cadastro de pessoas** que alimenta o módulo Desempenho. Sem Dados DHO corretos (líder direto, área, cargo), os PRDs #1 (Ciclos/Campanhas) e #3 (jornada do Líder) não funcionam — escala líder→liderado vem de `liderDiretoId`, dashboard do Líder lista equipe direta por essa mesma relação.

> **Nota (decisão 2026-05-26):** o **público-alvo de campanha** (filtro por área/cargo) está **fora de escopo nesta fase** — ver PRD #1 (RN 16). As menções a público-alvo neste PRD descrevem o valor de longo prazo (v2); os Dados DHO seguem essenciais agora pela **hierarquia avaliativa** (`liderDiretoId`) e pelo **dashboard do Líder**, que continuam em escopo.

A jornada do Admin se divide em **3 momentos**:
1. **Listar** — visão da base de pessoas, busca por nome/email, ativar/desativar usuários.
2. **Cadastrar/editar** — criar ou atualizar pessoa, preenchendo Dados Profissionais (cargo, área, funções) e Dados DHO (admissão, cargo nível, líder direto, responsável por desenvolvimento).
3. **Importar em massa** — upload de CSV com Dados DHO inclusos no template, pra organizações com volume alto.

## 2. Mapa do fluxo principal

| Etapa | Ator | Ação | Tela / Local na UI |
|-------|------|------|---------------------|
| 1 | Admin | Acessa o módulo | Sidebar > "Usuários" |
| 2 | Admin | Vê listagem (default) | Tab "Lista de usuários" |
| 3 | Admin | Cria usuário novo | Botão "Adicionar" → form "Novo usuário" |
| 4 | Admin | Edita usuário | Linha → menu "…" → "Editar" (ou "Ver detalhe") → form "Editar usuário" |
| 5 | Admin | Ativa/desativa | Switch na coluna "Ativo" da listagem (ou menu "…" → "Ativar"/"Desativar") |
| 6 | Admin | Importa em massa | Tab "Importação" → dropzone CSV |

## 3. Modelo de dados envolvido

**Entidade central:**

- **Pessoa** (subset relevante ao Desempenho — outros campos da Pessoa pertencem à plataforma geral):
  - **Identificação**: `nome`, `sobrenome`, `email`, `cpf` (opcional)
  - **Dados Profissionais**: `cargo` (texto livre), `area` (enum), `funcoes` (lista de strings, múltipla escolha)
  - **Dados DHO**:
    - `dataAdmissao` (ISO date, opcional)
    - `dataCargoAtual` (ISO date, opcional)
    - `liderDiretoId` (ref a Pessoa, opcional — null em quem é topo de hierarquia)
    - `cargoNivel` (enum, opcional)
    - `responsavelDesenvolvimentoId` (ref a Pessoa, opcional — campo independente de líder direto)
  - **Status**: `ativo` (boolean), `isLider` (boolean — derivado de quem aparece como `liderDiretoId` de pelo menos 1 pessoa **OU** flag explícita; ver RN 7)

**Enums:**

- **`cargoNivel`** — `Júnior` | `Pleno` | `Sênior` | `Especialista` | `Coord.` | `Gerente` | `Diretor`
- **`area`** (Nível 1) — `Engenharia` | `Design` | `Produto` | `Dados` | `Gente` | `Comercial` | `Marketing`
  *(set sugerido no protótipo; organização real pode customizar — decisão de catálogo fica pro twyg-app)*

**Princípios:**

- **Sem gestor matricial** — cada Pessoa tem **no máximo 1 `liderDiretoId`**. Decisão Twygo (review 2026-05-08): "gestor matricial removido, não existe na realidade". Múltiplos líderes não é cenário suportado nesta entrega.
- **Responsável por desenvolvimento é campo independente** — `responsavelDesenvolvimentoId` NÃO é "segundo líder". É um papel separado (ex: mentor/coach), opcional, sem dependência automática do líder direto. Pode ser preenchido livremente, inclusive apontando pra alguém que não é líder de equipe.
- **Sem derivação automática nesta entrega** — campos calculados (ex: tempo na empresa, próximo aniversário de admissão) **NÃO entram como RN do backend**. Se o protótipo mostra chip derivado na UI, é decisão de apresentação local (frontend pode calcular se quiser, sem persistência).
- **Sem dependências cross-campo automáticas** — `responsavelDesenvolvimentoId` não é defaulted pro `liderDiretoId`; "líder direto" pode ser qualquer pessoa cadastrada, sem precisar ter flag `isLider=true`. Validações ficam restritas a tipos e formatos (email válido, datas válidas).

## 4. Épico

| **Épico** | Permitir que o Admin/RH **cadastre, mantenha e importe em massa** a base de pessoas com os Dados DHO necessários pra alimentar o módulo Desempenho — sem retrabalho de matching, sem ambiguidade de hierarquia (um líder por pessoa), e com fluxo de importação que escala pra organizações com 500+ colaboradores. |
| --- | --- |
| **Valor esperado** | A qualidade dos Dados DHO determina o sucesso do módulo Desempenho inteiro: público-alvo de campanha (filtro por área/cargo), hierarquia avaliativa (Líder avalia liderado direto), dashboard do Líder (equipe), e segmentação analítica do 9-box (por área/cargo/líder). PRD que destrava os outros 6. |

## 5. Histórias do Usuário

### HU-01 — Listar usuários, buscar e ativar/desativar

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | ver a base completa de pessoas com busca rápida e ativar/desativar inline, |
| **Para** | manter cadastros saudáveis sem precisar entrar em cada usuário individualmente. |

**Ref no protótipo:** Sidebar > "Usuários" → tab **"Lista de usuários"** (default).

**Fluxo detalhado:**
1. Admin entra em Usuários e vê tab "Lista de usuários" ativa.
2. Sistema exibe **tabela de pessoas** com colunas: Usuário (avatar + nome + email), Último acesso, Perfil (chips do perfil de acesso — fora do escopo deste PRD, ver "Fora de escopo" no header), Pontuação (gamificação, fora de escopo), Progresso (gamificação, fora de escopo), **Ativo** (switch).
3. Toolbar superior: botão **"Adicionar"** (entra HU-02), busca por nome ou email, filtro (a estrutura do filtro fica pro time do twyg-app; sugerido: área, cargo, líder direto, status ativo/inativo).
4. Cada linha tem **menu "…"** com: Ver detalhe (abre form em modo edição — ver HU-02), Editar (idem), Ativar / Desativar (toggle), Excluir.

**Regras de negócio:**

- **RN 1** — Busca é case-insensitive, substring sobre `nome + sobrenome` ou `email`.
- **RN 2** — Switch da coluna "Ativo" alterna o estado `ativo` da Pessoa imediatamente (sem dialog de confirmação no caso simples).
- **RN 3** — Pessoa desativada **não pode** ser selecionada como `liderDiretoId` ou `responsavelDesenvolvimentoId` de outra pessoa em criação/edição futura. Pessoas que já a referenciavam mantêm a referência (não há cascata automática); cabe ao Admin corrigir manualmente.
- **RN 4** — Pessoa desativada **não aparece** em público-alvo de Campanhas futuras (ver PRD #1, HU sobre Campanhas) nem como avaliadora em Avaliações.
- **RN 5** — Excluir (delete) é hard-delete apenas se a pessoa **nunca** foi referenciada em Ciclo/Campanha/Avaliação/Registro. Caso contrário, sistema bloqueia exclusão e sugere desativação. *(Critério de "nunca referenciado" fica pro time twyg-app — escopo do PRD é o comportamento esperado.)*
- **RN 6** — Ordenação default: por `nome` ascendente.

**Critérios de aceite:**

- **CA-01** — DADO o Admin entra em Usuários, ENTÃO vê a tab "Lista de usuários" ativa por default com a tabela carregada.
- **CA-02** — DADO uma pessoa ativa, QUANDO o Admin clica no switch da coluna "Ativo", ENTÃO o estado muda pra inativo e a linha permanece visível na listagem.
- **CA-03** — DADO uma pessoa desativada, QUANDO o Admin entra em outra pessoa pra editar e abre o select "Líder direto", ENTÃO a pessoa desativada **não aparece** na lista.
- **CA-04** — DADO uma pessoa que tem 2 Avaliações respondidas no histórico, QUANDO o Admin clica em "Excluir" na linha dela, ENTÃO sistema bloqueia com mensagem orientando a desativar.
- **CA-05** — DADO o Admin digita "ana" na busca, ENTÃO listagem filtra mostrando pessoas cujo nome/sobrenome/email contém "ana" (case-insensitive).

**Edge cases / fora de escopo:**
- Visualização em grade (toggle lista/grid no toolbar do protótipo) — **fora de escopo**.
- Toolbar "Ações em massa" e "Extrair dados" — **fora de escopo** (placeholder no protótipo).
- Bulk delete/activate via seleção múltipla — **fora de escopo**.

**Resultado:** Admin vê base completa, encontra pessoas rapidamente e mantém o estado ativo/inativo coerente com a realidade da organização.

---

### HU-02 — Cadastrar e editar usuário com Dados DHO

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | criar uma pessoa nova ou atualizar uma existente com Dados Profissionais e Dados DHO completos, |
| **Para** | que essa pessoa esteja apta a entrar em campanhas avaliativas, ser avaliada pelo líder direto, e participar dos relatórios segmentados do módulo Desempenho. |

**Ref no protótipo:** Botão "Adicionar" da listagem (HU-01) → form "Novo usuário" (`NovoUsuarioForm`). Edição via menu "…" → "Editar" da linha, abrindo o mesmo form pré-preenchido.

**Fluxo detalhado:**
1. Admin clica em "Adicionar" (ou em "Editar" numa linha existente).
2. Sistema abre form com SectionNav lateral e sections rolando no main. Sections do PRD (em escopo Desempenho):
   - **Dados** — Email, Nome, Sobrenome (obrigatórios). CPF, telefones (opcionais).
   - **Dados Profissionais** — Cargo, Área (select), Funções (múltipla escolha).
   - **Dados DHO** — Data de admissão, Data no cargo atual, Líder direto, Cargo nível, Responsável por desenvolvimento.
3. Footer fixo com botões: **Cancelar** / **Salvar e novo** / **Salvar**.
4. Em edição: form pré-preenchido com valores atuais; salvar persiste mudanças.

**Regras de negócio:**

- **RN 7** — Campos obrigatórios na criação: `email`, `nome`, `sobrenome`. Todos os demais (Dados Profissionais + Dados DHO) são **opcionais** no nível do cadastro — o "vazio" é estado válido. *(A campanha avaliativa pode bloquear pessoas com Dados DHO incompletos no momento de selecionar público-alvo; isso fica no PRD #1, não aqui.)*
- **RN 8** — `email` deve ser único na organização e validado pelo regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- **RN 9** — `dataAdmissao` e `dataCargoAtual` são datas independentes. `dataCargoAtual` **pode ser igual ou posterior** a `dataAdmissao` (caso da pessoa que entrou já no cargo atual); sistema **não valida** essa relação nesta entrega (decisão de evitar retrabalho — pode entrar como validação futura).
- **RN 10** — `liderDiretoId` aceita qualquer Pessoa **ativa** da organização (exceto a própria — não é possível ser líder de si mesmo).
- **RN 11** — `cargoNivel` é select com 7 valores fixos: `Júnior`, `Pleno`, `Sênior`, `Especialista`, `Coord.`, `Gerente`, `Diretor`. Sem valor customizado nesta entrega.
- **RN 12** — `responsavelDesenvolvimentoId` é campo **opcional e independente** de `liderDiretoId`. Aceita qualquer Pessoa ativa (exceto a própria). **Sem default automático**, **sem dependência** de a pessoa-alvo ter flag de líder.
- **RN 13** — `funcoes` é múltipla escolha sobre um catálogo de strings. Catálogo fica pro twyg-app (no protótipo: lista mock de 8). Sem limite máximo de funções por pessoa.
- **RN 14** — Após Salvar, sistema retorna pra listagem (HU-01) e a pessoa aparece atualizada. "Salvar e novo" mantém o Admin no form com Dados/CPF zerados e demais campos preservados (acelera cadastro em lote manual).

**Critérios de aceite:**

- **CA-06** — DADO o Admin clica em "Adicionar" e preenche só Email, Nome, Sobrenome, ENTÃO Salvar conclui sem erro e a pessoa aparece na listagem com Dados DHO em branco.
- **CA-07** — DADO o Admin preenche um email já existente na organização, QUANDO clica em Salvar, ENTÃO sistema bloqueia com mensagem "Email já cadastrado".
- **CA-08** — DADO o Admin abre o select "Líder direto" no form de edição da pessoa Maria, ENTÃO a própria Maria **não aparece** na lista de opções.
- **CA-09** — DADO o Admin preenche "Responsável por desenvolvimento" com a Carolina Marques (que **não** é líder de equipe), QUANDO Salva, ENTÃO sistema aceita normalmente (sem validação de "tem que ser líder").
- **CA-10** — DADO uma pessoa edita seu próprio cadastro via outra tela (cenário hipotético — fora deste PRD), QUANDO o Admin abre o form pra editar a mesma pessoa, ENTÃO vê os valores atualizados.
- **CA-11** — DADO o Admin clica em "Salvar e novo", ENTÃO sistema persiste a pessoa atual e abre form em branco (Dados/CPF zerados), mantendo Admin no mesmo fluxo.

**Edge cases / fora de escopo:**
- Sections "Endereço", "Perfil · Notificações · Liderança", "Perfil de acesso", "Navegação e preferências" — **fora de escopo deste PRD** (plataforma Twygo geral, não específico do módulo Desempenho). Se o time do twyg-app implementar essas sections, segue PRDs de plataforma.
- Chip "Tempo na empresa" / "Mês de aniversário de admissão" no protótipo — **decisão de UI local**, não persistido. Pode ser calculado no frontend a partir de `dataAdmissao` se desejado, mas **não é RN** desta entrega.
- Upload de foto/avatar — **fora de escopo**.
- Histórico de mudanças nos Dados DHO (audit log) — **fora de escopo** desta entrega, pode ser tema futuro.

**Resultado:** Pessoa cadastrada/atualizada com Dados DHO suficientes pra entrar em campanhas avaliativas. Se Dados DHO estão incompletos, a pessoa existe na base mas as próprias features do módulo Desempenho (PRD #1) decidem o que fazer.

---

### HU-03 — Importar usuários em massa via CSV

| **Como** | Admin/RH, |
| --- | --- |
| **Quero** | importar uma planilha CSV com várias pessoas de uma vez, incluindo Dados DHO, |
| **Para** | onboardar organizações grandes (centenas de colaboradores) sem cadastro manual um a um. |

**Ref no protótipo:** Sidebar > "Usuários" → tab **"Importação"** → dropzone CSV + opções (separador, delimitador, política pra duplicados).

**Fluxo detalhado:**
1. Admin acessa tab "Importação".
2. Sistema oferece link **"esse arquivo Modelo"** (template CSV pra download — colunas obrigatórias + opcionais documentadas).
3. Admin arrasta arquivo .csv no dropzone (ou clica pra selecionar).
4. Configura: **Separador** (default `;`; alternativas: `,`, tab), **Delimitador** (default `"`; alternativa: `'`), **Política pra usuários já cadastrados** (default "Cancelar importação"; alternativas: "Atualizar registro", "Ignorar linha").
5. Clica em **Importar**. Sistema processa e devolve resultado.
6. Sistema mostra histórico abaixo: código da importação, data, usuário que importou, situação (Concluído / Em andamento / Com erros), nº de erros.

**Regras de negócio:**

- **RN 15** — Limites: arquivo `.csv` até **5 MB**, máximo **500 linhas** por importação. Arquivos maiores devem ser quebrados.
- **RN 16** — **Colunas do template CSV** (em escopo Desempenho):
  - Obrigatórias: `email`, `nome`, `sobrenome`.
  - Opcionais (Dados Profissionais + DHO): `cpf`, `cargo`, `area`, `funcoes` (separadas por `|` na célula), `dataAdmissao` (ISO `YYYY-MM-DD`), `dataCargoAtual` (ISO), `cargoNivel` (literal de enum), `liderDiretoEmail` (busca por email; resolve pra ID), `responsavelDesenvolvimentoEmail` (idem).
  - *(Demais colunas da Pessoa — endereço, perfis de acesso etc. — ficam pro PRD de plataforma; este PRD só normatiza as colunas do escopo Desempenho.)*
- **RN 17** — Resolução de referências por email: `liderDiretoEmail` e `responsavelDesenvolvimentoEmail` são **buscados pela coluna `email`** na própria importação ou na base existente. Se não encontrado, linha entra como erro (não cria placeholder).
- **RN 18** — Política pra duplicados (email já existe):
  - **"Cancelar importação"** — qualquer email duplicado aborta o lote inteiro antes de persistir nada.
  - **"Atualizar registro"** — atualiza Pessoa existente com os valores do CSV (campos vazios no CSV **não sobrescrevem** valores existentes — preserva o que já tinha).
  - **"Ignorar linha"** — pula linha do duplicado, prossegue com as demais.
- **RN 19** — Validação por linha: email válido, datas ISO, `cargoNivel` dentro do enum, `area` dentro do enum (se enum for fechado no twyg-app). Linhas inválidas geram erro listado no relatório final; linhas válidas seguem.
- **RN 20** — Cada importação fica registrada no histórico com `código` único, timestamp, usuário que disparou, situação final, contagem de erros. Detalhes do erro (linha + motivo) acessíveis ao clicar na linha do histórico — UX do detalhe fica pro twyg-app.

**Critérios de aceite:**

- **CA-12** — DADO o Admin baixa o "arquivo Modelo", ENTÃO recebe CSV com cabeçalhos das colunas obrigatórias e opcionais, e exemplo na primeira linha.
- **CA-13** — DADO um CSV com 600 linhas, QUANDO o Admin tenta importar, ENTÃO sistema bloqueia com mensagem "Máximo 500 linhas por importação".
- **CA-14** — DADO um CSV com `liderDiretoEmail = "naoexiste@empresa.com"`, QUANDO importa, ENTÃO essa linha entra como erro no relatório, demais linhas válidas são processadas.
- **CA-15** — DADO política "Atualizar registro" + CSV com pessoa existente onde a célula `cargo` está vazia mas `cargoNivel = "Pleno"`, QUANDO importa, ENTÃO `cargo` permanece inalterado e `cargoNivel` é atualizado pra "Pleno".
- **CA-16** — DADO política "Cancelar importação" + CSV com qualquer email duplicado, QUANDO importa, ENTÃO **nenhuma linha** é persistida e sistema retorna erro com lista dos emails em conflito.
- **CA-17** — DADO uma importação concluída, ENTÃO aparece no histórico com código, data, situação e contagem de erros.

**Edge cases / fora de escopo:**
- Importação assíncrona com webhook — fica como decisão de implementação; PRD descreve só o comportamento esperado.
- Rollback parcial após erros — **fora de escopo** (granularidade do rollback fica pro twyg-app).
- Edição inline do CSV antes de confirmar — **fora de escopo**.
- Detalhe de erros por linha (modal/drawer ao clicar no histórico) — UX **fora de escopo** desta entrega; PRD garante só que o detalhe seja acessível.

**Resultado:** Admin importa centenas de pessoas em minutos, com Dados DHO já populados, prontas pra entrar em campanhas avaliativas sem retrabalho manual.

---

## 6. Spike

> **S1 — Catálogo de `area` (Nível 1) — fixo ou customizável por organização?**
>
> **Pergunta**: o set de áreas (Engenharia / Design / Produto / Dados / Gente / Comercial / Marketing) é fixo na plataforma ou cada organização customiza o próprio catálogo?
>
> **Risco**: se for fixo, organizações com estruturas diferentes (ex: indústria) ficam sem opção adequada. Se for customizável, vira tela de admin nova ("Catálogo de áreas") fora do escopo deste PRD.
>
> **Critério de done**: decisão de produto sobre fixo vs custom. Se custom, abrir PRD complementar de "Catálogos da organização".

> **S2 — Catálogo de `funcoes` — fixo ou customizável?**
>
> **Pergunta**: mesma dúvida da `area`. No protótipo, lista mock de 8 funções (Desenvolvimento, Arquitetura, UX/UI, etc).
>
> **Critério de done**: decisão paralela à S1.

> **S3 — Reativação de Pessoa**
>
> **Pergunta**: quando o Admin reativa uma Pessoa anteriormente desativada, os campos Dados DHO (líder direto, responsável) que referenciavam **outras Pessoas que também foram desativadas no intervalo** ficam como? Mantêm referência quebrada? Limpam automaticamente?
>
> **Critério de done**: comportamento esperado de reativação consensado. Sugestão: manter referência (não limpar) e sinalizar visualmente na edição que o líder/responsável está inativo, deixando o Admin corrigir.

> **S4 — Derivação automática nos Dados DHO (não entrou nesta entrega)**
>
> **Contexto**: o protótipo mostra na section "Dados DHO" dois chips derivados a partir de `dataAdmissao` — *"Tempo na empresa"* (`X dias · Y anos e Z meses`) e *"Mês de aniversário de admissão"* (próxima data + dias restantes até lá). Nesta entrega, decisão (2026-05-14): **não documentar como RN** pra evitar retrabalho — chip fica como UI local opcional no frontend, sem persistência nem cálculo no backend.
>
> **Pergunta futura**: faz sentido o backend expor esses derivados (ex: `tempoEmpresaDias`, `proximaDataAniversario`) pra alimentar outros pontos do produto (notificações de aniversário de admissão, filtros de "pessoas com >5 anos de casa", segmentações analíticas)? Ou continua como puro cálculo de apresentação?
>
> **Critério de done**: decisão de produto sobre se algum derivado vira RN persistido/exposto via API. Se sim, abrir RN específica em entrega futura (não bloqueia esta).

> **S5 — Dependências cross-campo nos Dados DHO (não entraram nesta entrega)**
>
> **Contexto**: nesta entrega, decisão (2026-05-14) foi **manter os campos DHO independentes entre si** pra evitar retrabalho — sem regra automática "responsável default = líder direto", sem validação "`dataCargoAtual` ≥ `dataAdmissao`" (RN 9 deixa explícito), sem restrição "responsável tem que ser líder de equipe", etc.
>
> **Pergunta futura**: alguma dessas dependências vira regra de negócio em entrega posterior? Candidatas que já apareceram em conversa:
> - `dataCargoAtual` ≥ `dataAdmissao` — validação simples, evita data inconsistente
> - `liderDiretoId` ≠ `responsavelDesenvolvimentoId` — força papéis distintos (ou permite mesma pessoa nos dois?)
> - Default automático de `responsavelDesenvolvimentoId` ← `liderDiretoId` quando não preenchido — economiza setup mas pode confundir
> - `liderDiretoId` precisa ter `cargoNivel` ≥ Coord. — força hierarquia consistente
>
> **Critério de done**: cada dependência avaliada individualmente em entrega futura. Decisão por dependência: vira RN, vira warning UX (não bloqueia), ou fica fora. Nada disso bloqueia a entrega atual.

---

## 7. Como testar

### Fixtures necessárias

- Usuários com DHO completo (variar `liderDiretoId`, `cargoNivel`, `dataAdmissao`) — fixture a criar (sugestão: `usuarios-dho-mix.md`)
- CSV template canônico (`csv-modelo-dho.csv`) com cabeçalhos esperados pra HU-02
- CSVs de teste:
  - válido com 10 linhas (golden path)
  - válido com duplicados (testar política RN 20)
  - inválido com colunas faltando (testar error reporting)

### Tags Playwright

- `@admin @dho-users @critical` — CRUD básico, importação CSV golden path
- `@admin @dho-users @high` — validação de duplicados, histórico
- `@admin @dho-users @medium` — toolbar (extrair, filtro)
- `@admin @dho-users @skip-proto-gap-01` — depende de [gap-01](../gaps/gap-01-csv-import-handlers-mortos.md) ser FIXED no protótipo
- `@admin @dho-users @skip-proto-gap-04` — depende de [gap-04](../gaps/gap-04-funcoes-isLider-secao-dho.md) ser FIXED

### Pré-requisitos

- Admin/RH logado
- Feature flag `performance_module_enabled` ON (Pessoas DHO destrava as outras features)

### Rodar local

```bash
cd frontend && yarn dev   # protótipo (mas CSV import morto — gap-01)
# ou
cd ../twyg-app && make start && yarn playwright test --grep "@admin @dho-users"
```

---

## 8. Cross-references

### HUs com gap aberto no protótipo

- **HU-01** (Form Dados DHO): [gap-04](../gaps/gap-04-funcoes-isLider-secao-dho.md) — `funcoes` e `isLider` na seção errada
- **HU-02** (Importação CSV): [gap-01](../gaps/gap-01-csv-import-handlers-mortos.md) — handlers mortos, fluxo completamente bloqueado
- **Toolbar** (Ações em massa / Extrair / Filtro): mencionado em [gap-15](../gaps/gap-15-salvar-rascunho-nao-persiste.md) categoria UI mortos

### Modelo compartilhado

- **`liderDiretoId`** (FK pessoa-líder): destrava filtros de [PRD #1](./prd-admin-desenvolvimento.md) (público-alvo de Campanha) e [PRD #3](./prd-lider-desenvolvimento.md) (dashboard do Líder)
- **`responsavelDesenvolvimentoId`**: campo independente, sem default — sem cascata
- **`isLider`** flag: usado por [PRD #3](./prd-lider-desenvolvimento.md) (atribuição como Líder no fluxo de avaliações)

### Glossário e regras

- Sem "gestor matricial" (max 1 líder direto): [`glossary.md § 4`](../glossary.md#4-papéis-avaliativos)

### Twy plan (twyg-app)

- Sem deliverable formal ainda — PRD #7 foi adicionado em 2026-05-14 (pós-freeze do twy plan). Candidato a **D11** se o módulo continuar. Sem dependências forte com D01..D10 — pode rodar paralelo.
