# PRD — POC Desempenho

> Regras de negócio, estados e fluxos por entidade/tela do módulo Desempenho. **Fonte da verdade** antes de codar qualquer regra. Consultar `docs/glossario-rh.md` pra termos.

> Escopo: VERDE apenas (ver `CLAUDE.md`). Módulos fora do escopo podem aparecer como input/output, nunca como tela própria.

## Princípios

1. **Simplicidade > completude.** POC vive de mostrar, não de cobrir edge cases.
2. **Participantes entram na Campanha, não no Ciclo.** Ciclo é só temporal/estratégico.
3. **Tipo de ciclo é derivado do período**, não escolhido.
4. **Módulo Registros (contínuo, fora de ciclo) ≠ Feedback da avaliação (dentro do ciclo).** Nomes sempre distintos na UI e no código. Ver `docs/glossario-rh.md` seção "Tipos de registro" pra nomenclatura canônica.
5. **Registros são suporte, não núcleo.** Líder registra; consulta na hora de avaliar. Nunca vira imã da navegação.

## Navegação

### Estrutura proposta (a validar)

```
Equipe (Time)                       ← menu primário master
├── Organograma                     [grupo 3 — externo]
├── Competências                    [grupo 3 — externo]
├── Desenvolvimento                 [grupo 1 — nosso]
│   ├── Avaliações
│   │   ├── Ciclos                  (listagem topo da hierarquia)
│   │   ├── Campanhas               (filtrável por ciclo)
│   │   ├── Avaliações de Experiência
│   │   ├── Avaliações de Desempenho
│   │   └── 9-box                   (calibração pós-Desempenho)
│   └── Registros                   (contínuo, fora de ciclo — unifica ex-"Notas & Feedbacks" + ex-"Ocorrências")
```

**Menus externos** (outros grupos, só referenciados):
- Planos e Metas [grupo 2]
- Mapa de Transições [grupo 4]
- PDI [módulo externo]

**Copy contextual do menu primário (por perfil):**
- Admin, Líder → **"Gestão de time(s)"**
- Colaborador → **"Performance"**

**Perfis no dropdown do topbar:** Admin · Líder · Colaborador

## Entidades

### Ciclo

> Container temporal/estratégico. Define **quando** e **o quê** (tipos de avaliação). Participantes entram na Campanha, não aqui.

#### Modelo de dados (extraído de `CicloConfigForm.tsx`)
| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| `nome` | string | sim | Placeholder: "Ex.: Ciclo Anual 2026" |
| `descricao` | string | não | Textarea — propósito, público, etc. |
| `dataInicio` | date | sim | Input type="date" |
| `dataFim` | date | sim | Input type="date" |
| `avaliacoes` | AvaliacaoKey[] | não (default `["desempenho"]`) | Multi-select. **Chaves**: `experiencia`, `desempenho`, `analise-perfis`, `9-box`. Devolutiva pós-avaliação deixou de ser chave em 2026-04-21 (virou atalho no fluxo do líder). |
| `feedbackDeadline` | date | não | Prazo dos feedbacks (dentro do ciclo) |
| `fechamento` | date | não | Data de fechamento do ciclo |
| `status` | "Ativo" \| "Rascunho" \| "Finalizado" | sim (estado) | Não está no form — vem da persistência |
| `tipo` | "Mensal" \| "Trimestral" \| "Semestral" \| "Anual" \| "Personalizado" | **derivado** | Calculado via `detectTipoByRange(dataInicio, dataFim)` |

#### Tipos de avaliação do Ciclo (proposta revisada — a aprovar)

Após a conversa sobre o mapa-grupos e o glossário, proposta de rename das 5 chaves originais do João:

| Chave proposta | Label | Mudança vs form atual do João | Tipo |
|---------------|-------|-------------------------------|------|
| `experiencia` | Avaliação de Experiência | ✓ manter | Questionário |
| `desempenho` | Avaliação de Desempenho | ✓ manter | Questionário (recebe inputs opcionais de Competências e Metas) |
| `analise-perfis` | Análise de perfis | renomear `perfil` | **Não-questionário** (análise + calibração em grupo) |
| `9-box` | 9-box | **adicionar** (não estava como chave no form) | Matriz (calibração pós-Desempenho) |

> **Removido em 2026-04-21**: `feedbacks-avaliacao` não é mais tipo próprio. Devolutiva pós-avaliação virou atalho no fluxo do líder (`RegistrarFeedbackLider`). **Atualização 2026-05-11**: grava como Registro tipo **"Devolutiva"** (tipo próprio na lista canônica de 5 tipos), **visível ao colaborador** (contrato do processo — colab precisa ver a devolutiva do líder). Ver seção "Devolutiva pós-avaliação (atalho)" abaixo.

> **Forms Complementares não é tipo independente.** Vive **dentro** da Avaliação de Desempenho **regular** (colab com histórico). A **Avaliação de Experiência inicial** é variante da Av. de Desempenho pra novatos — e justamente por ser inicial **não inclui** Forms Complementares. Ver regra detalhada em "Avaliação de Desempenho".

**Removidos da lista do João:**
- ❌ `pdi` → **PDI não é tipo de avaliação.** É doc vivo (aberto sempre), do grupo 2 (Planos & Metas). Nosso protótipo terá **tela placeholder** "em construção por outro grupo" quando alguém tentar acessar PDI. Alternativa: mover link/entrada pro menu Planos & Metas.
- ❌ `feedback` (genérico) e ❌ `feedbacks-avaliacao` → **removidos em 2026-04-21**. A devolutiva pós-avaliação é atalho no fluxo do líder (não tipo de avaliação), grava como Registro tipo "Devolutiva" no módulo **Feedbacks e Anotações** (label da UI; conceito interno "Registros"). Feedback (ex-"1:1") também vive lá como tipo próprio.

#### Tipo derivado do período
```
diffDays = |dataFim - dataInicio| em dias
- 25..35    → Mensal
- 80..100   → Trimestral
- 170..200  → Semestral
- 330..400  → Anual
- qualquer outro (inclui datas vazias ou fim < início) → Personalizado
```
- Campo de tipo é **read-only** na UI.
- Hint: "detectado pelo período — caso não bata com um padrão, cai em Personalizado".
- Se "Personalizado" + datas preenchidas, mostra aviso: "período não bate com Mensal/Trimestral/Semestral/Anual".

#### Estados e visual
| Estado | Chip (bg / texto) |
|--------|-------------------|
| Rascunho | `#FEEBC8` / `#9C4221` (bege) |
| Ativo | `#C6F6D5` / `#22543D` (verde) |
| Finalizado | `#E2E8F0` / `#4A5568` (cinza) |

**Fluxo de transição (decidido):**
- Ao criar → nasce em **Rascunho**
- Botão explícito **"Ativar ciclo"** promove pra **Ativo**
- Encerramento → **Finalizado** (regras de transição a detalhar)

Terminologia UI: usar **"Salvar rascunho"** e **"Ativar ciclo"** — nunca só "Criar ciclo" (ambíguo sobre publicar ou não).

#### Relações
- **Ciclo 1 → N Campanhas.** Cada avaliação escolhida no Ciclo gera uma Campanha correspondente (um "ciclinho" — etapa do ciclo maior). Mesmo ciclo de avaliação única tem 1 Campanha.
- **Ciclo → Tipos de avaliação:** o multi-select `avaliacoes` no Ciclo define **quais tipos ocorrem** no período. Cada tipo escolhido vira uma Campanha.
- **Ciclo → Participantes:** **nenhuma direta.** Participantes entram **na Campanha**. Ciclo é só container/agregador.
- **Visão Geral do Ciclo** (requisito): mostrar quais colaboradores **já estão** em alguma campanha do ciclo e quais **ainda não estão** (cobertura do público-alvo esperado).

#### Ações disponíveis (row actions)
Menu 3-pontinhos sem condicional por perfil:
- Gerenciar (abre mesmo form de criação — UI não distingue create vs edit)
- Duplicar
- Campanhas (navega pra lista de campanhas do ciclo)
- Acompanhamento
- Excluir (danger)

#### Fluxo de criação
Tela única com 4 seções empilhadas (sem wizard):
1. Identificação — nome, descrição
2. Data do ciclo — início, fim, tipo auto
3. Avaliações do ciclo — multi-select
4. Agendamento — prazo dos feedbacks, fechamento

Botões do form de criação: **Cancelar** · **Salvar rascunho** · **Ativar ciclo** (primário). Código atual tem só "Criar ciclo" → precisa ser substituído na implementação.

#### Regras de edição

**Em Rascunho:** tudo editável.

**Em Ativo (decisão aberta entre 2 abordagens):**

**Decidido em 2026-04-17: Abordagem B.**

- Data do Ciclo e Campanhas ficam **imutáveis** depois de ativar.
- Líder pode **preencher avaliação fora do prazo** (flag de "atraso" visível).
- Motivação: preservar compromisso original + visibilidade de atrasos como sinal de processo.

_Abordagem A (editar data-fim pra estender) foi descartada — ver log de decisões._

**Em Finalizado:** read-only total (a confirmar).

**Demais campos (nome, descrição, avaliações) em Ativo/Finalizado:** a definir.

#### Perfis — ações permitidas
**Não detectado no código.** Assumir default: Admin full, Líder e Colaborador sem acesso até decisão explícita.

### Campanha

> ⚠️ **Modelo corrigido 2026-04-17 (tarde) pós-feedback do RH**. Decisão anterior (Campanha = 1 Tipo de avaliação) foi revertida. Agora: **1 Campanha → N Tipos de avaliação** (rodada/pacote aplicado a um público que aplica vários tipos de avaliação ao mesmo tempo).

> Uma Campanha é uma rodada/pacote dentro de um Ciclo. Aplica-se a um público específico e contém **N tipos de avaliação** (Desempenho, Experiência, 9-box, etc), cada um com sua própria configuração de tipos de coleta (auto/líder/pares/liderado/matricial), pesos, anonimato, obrigatoriedade e datas.

#### Modelo de dados (corrigido 2026-04-17)

| Campo | Tipo | Obrigatório | Observação |
|-------|------|-------------|------------|
| `cicloId` | ref(Ciclo) | sim | Mora dentro de um Ciclo |
| `nome` | string | sim | Ex.: "Q1 — Time de Engenharia" |
| `tiposAvaliacao` | AvaliacaoKey[] | sim | **Multi**: Desempenho, Experiência, 9-box, Análise de perfis. (Devolutiva pós-avaliação removida em 2026-04-21 — virou atalho.) |
| `avaliacaoConfig` | Record<AvaliacaoKey, AvaliacaoConfig> | sim | Config **por tipo de avaliação** — ver abaixo |
| `participantes` | Pessoa[] | sim | Quem responde — entram AQUI, não no Ciclo |
| `publicoAlvo` | PublicoFiltros | não | Filtra a lista de participantes — ver seção Público-alvo |
| `feedbacksAposAvaliacao` | boolean | não (default false) | Puxar/solicitar feedbacks pós-avaliação — toggle no nível da campanha (feedback RH 2026-04-17 item 2.2) |
| `feedbackDeadline` | date | não | Prazo pro feedback pós-avaliação da campanha |
| `fechamento` | date | não | Data de fechamento macro |

##### `AvaliacaoConfig` (por tipo de avaliação dentro da Campanha)

| Campo | Tipo | Observação |
|-------|------|------------|
| `formularioId` | ref(Formulário) | Escolhido de um catálogo; só pra tipos-questionário |
| `tiposColeta` | TipoColeta[] | Auto / Líder / Pares / Liderado / Gestor matricial |
| `coletaConfig` | Record<TipoColeta, ColetaConfig> | Peso (soma 100% por tipo de avaliação), anonimato, obrigatoriedade, dataInicio, dataFim |
| `dependeDe` | AvaliacaoKey \| null | **Novo (feedback RH 4.3)**: tipo precedente. Se preenchido, este tipo só libera após o anterior fechar; datas são auto-sugeridas a partir do fim do precedente |
| `habilitarFormComplementar` | boolean | Só faz sentido em Av. de Desempenho quando avaliado é novo (Av. de Experiência inicial) |

#### Validação de pesos
- Soma de `pesos[tipoColeta]` deve ser **100%**.
- UI: mostrar progresso em tempo real (ex: "Pesos: 80% · falta 20%").
- Submit bloqueado se ≠ 100.

#### Público-alvo (filtros combinados, AND)
- Tempo no cargo (≥ X dias)
- Tempo na empresa (≥ X dias)
- Aniversário de empresa (range de mês/dia)
- Nome (contém)
- Área (multi-select)
- Função (multi-select)

#### Formulário
- **Entidade separada em catálogo** (não criada dentro da Campanha).
- Sistema traz um **modelo padrão ("standard")** pra empresas que não sabem por onde começar.
- Empresa pode criar os próprios.
- Na Campanha, é só escolher do dropdown/modal de seleção.
- CRUD de Formulários vive em tela dedicada (a propor nas próximas fatias).

### Avaliação individual

> Unidade atômica: um colaborador respondendo um tipo de avaliação dentro de uma Campanha. Não é nível de menu — vive dentro da Campanha.

#### Visões por perfil

**Admin/RH:** vê todas as avaliações individuais da campanha (dashboard de acompanhamento — ver HU-02).

**Líder:** vê **só as avaliações dos seus liderados** — tela "Minhas avaliações pendentes" (ver seção Perfil Líder).

**Colaborador:** vê suas próprias (placeholder por enquanto — Colaborador tem StudentSidebar).

#### Estados
- `Não iniciada` · `Em andamento` · `Concluída` · `Atrasada` (quando passa da data mas config permite preencher — abordagem B do Ciclo)

#### Regras
- Líder só avalia colaboradores sob sua responsabilidade (árvore do Organograma).
- Perguntas obrigatórias bloqueiam submit.
- Salvar rascunho permitido (N vezes).
- Edição pós-finalização depende da config do Ciclo/Campanha.
- Anonimato (pares/liderado) respeitado nos comentários exibidos.

### Avaliação de Experiência

> Tipo de avaliação especial pra **início da jornada** do liderado na empresa. Tem o papel do **Buddy**.

#### Buddy
- **Não é um perfil novo** no dropdown — é um papel flexível atribuído pontualmente.
- **Nome neutro em gênero** (ex-"Padrinho", ex-"Madrinha"). Usar sempre "Buddy".
- Atribuição: feita pelo RH ao iniciar a Av. de Experiência pra aquele liderado.
- **Visibilidade pra quem recebe** (o liderado): aparece dentro da Av. de Experiência inicial — "Seu Buddy é Fulano".
- **Visibilidade pra quem é Buddy**: sistema cria uma **Ocorrência automática** no Timeline do Buddy: "Você é Buddy de Fulano" — pra ele lembrar do papel quando consultar ocorrências no momento da avaliação.
- **Ao fim da Av. de Experiência**: liderado dá um **feedback sobre a tutela do Buddy**. Esse feedback cai no módulo **Notas & Feedbacks** (nova origem, automática).

#### Tipos de coleta disponíveis
- Auto, Líder, **Buddy** (novo, só nessa avaliação), Pares — conforme config da Campanha.

### Avaliação de Desempenho
**Inputs opcionais (de outros grupos):**
- Competências (grupo 3) — marcador/flag de integração, sem tela nossa
- Metas estratégicas / OKRs (grupo 2) — marcador/flag de integração, sem tela nossa

#### Forms Complementares (seção condicional)
- **Não é tipo independente** — é uma seção interna do formulário de Desempenho.
- **Aparece quando**: é uma **Av. de Desempenho regular** (colab com histórico).
- **Não aparece quando**: é uma **Av. de Experiência inicial** (variante de Desempenho pra novatos, sem esse bloco porque ainda não há histórico pra informar os 8 itens).
- Conteúdo atual (8 perguntas fixas): Manutenção de equipe, Potencial, Mapa de Transições, Encaminhamento, Impacto, Risco de Perda, Observações gerais, Mapa de Transições (líder).
- Implementação: componente `FormsComplementares` renderizado como sub-seção do formulário quando `tipoEfetivo === "desempenho"` (ou seja, fora do fluxo de Experiência inicial).

#### Gráfico comparativo (consolidação pré-feedback)
Gráfico na tela de consolidação do líder com curvas:
- Auto (nota do próprio colaborador)
- Líder (nota do líder direto)
- Pares (média)
- Liderado (média — se houver)
- Matricial (se houver)
- **Ideal de mercado** (benchmark externo)
- **Empresa** (média corporativa)
- **Equipe** (média do time)

**Fonte dos benchmarks**: indefinida. No protótipo, mostrar **overlay explicativo** sobre o bloco do gráfico alertando que a fonte de dado precisa ser definida (decisão do CEO).

#### "Forças/fraquezas escondidas"
Lógica automática: quando a nota Auto e a nota Líder divergem acima de um threshold (a definir), destacar como "força escondida" (líder vê > auto) ou "fraqueza escondida" (auto vê > líder).

### 9-box (e matrizes alternativas)

> Calibração de talentos pós-Avaliação de Desempenho. **9-box é o default**, mas o Ciclo pode escolher outras matrizes.

#### Matrizes disponíveis
- **9-box** (default) — 3×3 (Performance × Potencial)
- **16-box** — 4×4 (granularidade maior)
- **6-box** — 3×2 (simplificado)
- **3-box** — 1×3 (muito simples)

#### Eixos configuráveis
No Ciclo, escolhe-se como cada eixo é calculado:
- **Média final** (nota consolidada)
- **Resultado por sessão** (ex: eixo X = nota da sessão "Performance", eixo Y = nota da sessão "Potencial")

#### Calibração (HU-03)
- **Disponível apenas quando Ciclo = Finalizado.**
- Posicionamento automático com base nos resultados.
- Ajuste manual via **drag-and-drop** dos colaboradores entre quadrantes.
- **Comentário obrigatório** em movimentações manuais (justificativa).
- **Histórico antes/depois** salvo automaticamente — visualizável em tela separada.

### Devolutiva pós-avaliação (atalho)

> Feedback textual que o líder registra ao fim do ciclo do liderado. **Não é tipo de avaliação próprio** (era `feedbacks-avaliacao`, removido em 2026-04-21) — é atalho no fluxo do líder via `RegistrarFeedbackLider`. **Atualização 2026-05-11**: grava como Registro tipo **"Devolutiva"** (tipo próprio, antes gravava como "Outro" privado) na timeline do colaborador, **visível ao colab + líder + RH** (contrato do processo — devolutiva pós-avaliação só faz sentido se o colab vê).

#### Modelo de dados
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `avaliacaoIndividualId` | ref | sim |
| `pontosFortes` | text | sim |
| `areasDesenvolvimento` | text | sim |
| `recomendacoes` | text | não |
| `comentarioGeral` | text | não |
| `enviarParaPDI` | flag | não (default false) |

#### Painel IA (pós-MVP)
- Sugere conteúdo pra cada campo com base na consolidação.
- Detecta "forças/fraquezas escondidas" automaticamente.
- Líder aceita / edita / ignora.
- **No protótipo atual**: mostrar apenas **selo/ícone** indicando "IA disponível em plano X" (sem fluxo real). Mocks leves se precisar simular.

#### Flag "enviar para PDI"
- Checkbox simples no form.
- **Nosso escopo**: só registrar a flag.
- Fluxo real de PDI vive no módulo PDI (grupo 2). Nossa tela de PDI fica como placeholder/stub.

### Registros (módulo)

> Módulo contínuo, fora de ciclo. Líder e Admin acompanham apontamentos sobre colaboradores. Renomeado de "Notas & Feedbacks" em 2026-04-20 e unificado com o ex-"Ocorrências". Label da UI atual: **"Feedbacks e Anotações"** (conceito interno em código/docs continua sendo "Registros" / entidade `Registro`). Ver `docs/glossario-rh.md` seção "Tipos de registro" pra nomenclatura canônica.

#### Estrutura flat (sem grupos)

**5 tipos** sem agrupamento (modelo canon desde refactor 2026-05-11). Renames recentes pra alinhar vocabulário: `1:1` → **Feedback** (2026-05-04); `Outro` → **Anotação** (2026-05-11, mesma data que Devolutiva virou tipo próprio). `Feedback da avaliação` continua sendo entidade separada (do módulo Avaliações, dentro do Ciclo).

| Tipo | Classificação | Visível pro colab? | Cor (bg / texto) | Ícone |
|------|---------------|---------------------|------------------|-------|
| **Reconhecimento** | Não (positivo por def) | ✅ Sim | `#C6F6D5` / `#22543D` | `MdStar` |
| **Ponto de atenção** | Não (negativo por def) | ✅ Sim | `#FEEBC8` / `#9C4221` | `MdWarningAmber` |
| **Feedback** (ex-1:1) | Sim (Positivo/Negativo/Neutro) | ✅ Sim | `#E9D8FD` / `#6B46C1` | `MdChatBubbleOutline` |
| **Devolutiva** | Sim (Positivo/Negativo/Neutro) | ✅ Sim | (TBD — tom intermediário) | (TBD — sugestão `MdReviews`) |
| **Anotação** (ex-Outro) | Sim (Positivo/Negativo/Neutro) | 🔒 Só líder + RH | `#EDF2F7` / `#4A5568` | `MdNoteAlt` |

#### Regra de visibilidade
- **Líder vendo um liderado**: vê todos os 5 tipos. `Anotação` ganha badge/cadeado "só você + RH".
- **Colab vendo a si mesmo**: timeline filtra `Anotação` fora; vê os outros 4 (Reconhecimento, Ponto de atenção, Feedback, **Devolutiva**).

#### Devolutiva como tipo próprio (refactor 2026-05-11)
A Devolutiva pós-avaliação era gravada como `Outro` (privado) — incoerente com o contrato do processo, em que o colab precisa receber a devolutiva do líder. Promovida a tipo próprio em 2026-05-11, visível ao colab. Continua sendo registrada pelo atalho `RegistrarFeedbackLider` ao fim do ciclo (não é entrada manual no form de Registro padrão).

#### Saída pragmática do "neutro-visível"
Com `Anotação` privada, o líder tem 4 caixas públicas (Reconhecimento, Ponto de atenção, Feedback, Devolutiva). Pra registrar algo neutro visível que não foi encontro formal nem devolutiva, usa `Feedback` mesmo. Trade-off aceito em 2026-04-20, reafirmado no refactor de 2026-05-11.

#### Sub-tipo automático (gerado pelo sistema)
- **Ocorrência automática** — gerada em gatilhos do sistema (ex: "Você é Buddy de Fulano" quando Av. de Experiência é iniciada).
- Aparece na timeline diferenciada visualmente (ícone ou chip indicando "do sistema").
- _Outros gatilhos a definir quando aparecerem._

#### Já implementado (mock)
- `RegistroModal.tsx` — form com os 5 tipos.
- `NotasFeedbacks.tsx` + `ColaboradorTimeline.tsx` + `RegistrosColabList.tsx` + `RegistrosPreviewModal.tsx` — listagem por colab e timeline unificada.

#### Pendências
- **Rename do módulo na UI** `[implementado]` — `91fe788` (2026-04-21) renomeou `Sidebar.tsx`/`App.tsx`/`DashboardLider` de `notas-feedbacks` pra `registros` + label "Registros". Label atual da Sidebar: **"Feedbacks e Anotações"** (Admin/Líder > Gestão de Time(s)).
- **Filtro de visibilidade na timeline do colab** `[implementado]` — `540611e` (2026-04-22) introduziu `registroVisivelPara()` + `registrosVisiveisPara()` em `mocks/registros.ts`. Consumidores canon: `NotasFeedbacks` + `MeusFeedbacks` filtram por `viewerRole`/`viewerNome`. Devolutiva entrou no canjunto de tipos visíveis ao colab no refactor de 2026-05-11.
- **Badge "só você vê" pro tipo `Anotação` quando líder visualiza** `[implementado — parcial]` — ícone de cadeado (`MdLockOutline`) em `RegistroCard.tsx:28` cobre o sinal visual no card listado, e `RegistroModal.tsx:367` mostra "Anotação privada — só você + RH" no form de criação. Falta apenas o badge textual explícito ("só você vê") no card listado quando `viewerRole === "Líder"` — feature original do `OcorrenciaCard` (deletado em 2026-04-23 com os legados) que não foi reportada pro `RegistroCard`. Acionável como Menor solta no backlog quando virar prioridade.
- **Regenerar mocks no modelo flat** `[implementado]` — `540611e` (2026-04-22) canonizou `mocks/registros.ts` com 18 entries no modelo flat. Devolutiva (5º tipo) adicionada em `5edafe9` no mesmo dia mas como subtipo de "Outro" privado — promovida a tipo próprio em **refactor 2026-05-11** (5 tipos atuais: Reconhecimento / Ponto de atenção / Feedback / Devolutiva / Anotação). Sucessão merged em 2026-04-22; modelo consumido pelos componentes ativos do módulo desde então. Os mocks legados foram deletados (próxima pendência).
- **Componentes legados** `[implementado — deletados]` — `d8bd949` + `bdab82b` (2026-04-23) deletaram `FeedbacksList`, `EquipeOcorrencias`, `FeedbackForm`, `OcorrenciaForm`, `RegistroForm`, `feedbacksMock`, `ocorrenciasMock`. Standby virou ação direta — campos extras do legado (Classificação Pos/Neg/Neutro, Gravidade, Status) eram simplificação intencional do canon flat, não placeholder futuro; se RH pedir granularidade, a estrutura de `Registro` comporta campos opcionais.

### Formulário (catálogo)

> Entidade reutilizável. Campanha referencia um Formulário do catálogo.

#### Modelo padrão ("standard")
- Sistema entrega **1 formulário padrão** por tipo de avaliação (Desempenho, Experiência, etc.).
- Empresa que não sabe por onde começar → usa o standard direto.

#### Empresa cria os próprios
- CRUD dedicado (tela a propor nas próximas fatias).
- Formulário tem sessões (Performance, Potencial, Comportamento, etc.) e perguntas (escala, texto, múltipla escolha).

### Perfil Líder — telas necessárias (HU-01/02/03 do Líder)

> Hoje zerado no protótipo — perfil Líder no dropdown renderiza mesma tela que Admin. Precisa diferenciar.

#### Minhas avaliações pendentes
- Lista por Ciclo (expandível).
- Colunas: liderado, tipo de avaliação, status, prazo.
- Entry point principal do Líder.

#### Responder avaliação (formulário)
- Formulário em sessões (renderizado a partir do `formularioId` da Campanha).
- Salvar rascunho N vezes.
- Validação de obrigatórios antes do submit.

#### Ver consolidação (pré-feedback)
- Resumo do liderado com notas por tipo.
- Gráfico comparativo (ver Av. de Desempenho).
- Drill-down por sessão do formulário.

#### Registrar feedback
- Resumo contextual no topo (foto, cargo, nota final, destaque de discrepâncias).
- Campos estruturados (ver "Devolutiva pós-avaliação (atalho)").
- Painel IA lateral (selo por ora).
- Flag "enviar para PDI".

#### Dashboard Líder
- Widgets de "avaliações pendentes" e "feedbacks pendentes".
- Acesso rápido pros fluxos acima.

### Dashboard Admin/RH (HU-02)

#### Cards de status
- A iniciar · No prazo · % concluído · Em andamento · Rascunho · Em atraso

#### Filtros
- Ciclo, Campanha, Área, Líder, Tipo de avaliação, Status

#### Drill-down
- Por colaborador → abre consolidação parcial (mesmo layout do líder, mas sem permissão de editar feedback).

#### Lembretes
- Botão "Enviar lembrete" em avaliações em atraso/no prazo se aproximando.
- Notificações saem via canal a definir (não é nosso escopo — grupo de notificações).

## Pontes com outros grupos

### Recebemos
| De (grupo) | Entidade origem | Vai pra nossa entidade | Finalidade |
|------------|-----------------|------------------------|------------|
| 2 | Meta estratégica | Avaliação de Desempenho | Input opcional (execução estratégica) |
| 3 | Competência | Avaliação de Desempenho | Input opcional (desenvolvimento técnico/comportamental) |

### Entregamos
| Pra (grupo) | Nossa entidade origem | Vai pra entidade | Finalidade |
|-------------|-----------------------|------------------|------------|
| PDI (externo) | Avaliação de Desempenho | PDI | Alimenta plano individual |
| 4 | Resultado 9-box | Plano de Resposta / Mobilidade | Informa Mapa de Transições |

## Log de decisões

> Decisões marcadas `[implementado]` viraram código real e estão refletidas nas seções acima — manter aqui só pelo registro histórico. Decisões `[meta]` foram contexto/discussão sem regra de negócio direta — preservadas pra reconstruir o "porquê" mas sem peso operacional. Demais entries são pendências/precedentes ativos.

| Data | Decisão | Por |
|------|---------|-----|
| 2026-04-16 | Escopo verde apenas: Equipe + Avaliações + Ocorrências `[meta — CLAUDE.md já formaliza]` | João |
| 2026-04-16 | Nav primária Equipe > [Organograma, Competências, Desenvolvimento, Ocorrências] `[implementado]` | Caio |
| 2026-04-16 | Dropdown de perfis: Admin · Líder · Colaborador `[implementado]` | Caio |
| 2026-04-16 | Copy contextual menu: "Gestão de time(s)" (Admin/Líder) vs "Performance" (Colaborador) — depois confirmado em 2026-04-17 que "Gestão de Time(s)" vale pra todos os perfis | Caio |
| 2026-04-16 | Feedback 1:1 ≠ Feedback da avaliação (entidades distintas) `[implementado — Registros vs RegistrarFeedbackLider]` | João |
| 2026-04-16 | Tipo de ciclo derivado do período `[implementado]` | João |
| 2026-04-16 | 9-box entra na POC (fase 1) `[implementado]` | Caio |
| 2026-04-16 | Feedback 1:1 com lista contínua + agendamento (lapidar conforme avança) | Caio |
| 2026-04-16 | Admin/RH de Feedback 1:1 fica como esboço mínimo | Caio |
| 2026-04-16 | Notificações (gatilhos e central) ficam fora do nosso grupo | Caio |
| 2026-04-16 | Ciclo nasce em **Rascunho**, botão "Ativar ciclo" promove `[implementado]` | Caio |
| 2026-04-16 | Botões do form de Ciclo: "Salvar rascunho" + "Ativar ciclo" `[implementado]` | Caio |
| 2026-04-16 | Ciclo contém 1+N Campanhas (cada tipo de avaliação vira uma campanha) `[modelo revertido em 2026-04-17 tarde — ver abaixo]` | Caio |
| 2026-04-16 | Visão Geral do Ciclo mostra colabs já em campanhas vs não | Caio |
| 2026-04-16 | Tipo "Personalizado" é só label (sem regra de negócio) `[implementado]` | Caio |
| 2026-04-16 | PDI vira tela placeholder "em construção por outro grupo" `[implementado]` | Caio |
| 2026-04-16 | Av. de Competências (azul) e Mapa de Transições (laranja) = só navegação macro, sem tela própria `[implementado]` | Caio |
| 2026-04-21 | **Devolutiva pós-avaliação simplificada**: removida como tipo próprio (`feedbacks-avaliacao`). Virou atalho no `RegistrarFeedbackLider`, grava como Registro tipo "Outro" (líder + RH, colab não vê). Impacto: 10 arquivos / 37 ocorrências no refactor. `[implementado]` | Caio |
| 2026-04-16 | Formulário é catálogo reutilizável (standard + empresa cria os próprios) `[implementado em parte — catálogo existe; criação custom pendente]` | RH via Caio |
| 2026-04-16 | Matrizes: 9-box default + 16-box / 6-box / 3-box. Eixos configuráveis (média OU por sessão) `[implementado]` | RH via Caio |
| 2026-04-16 | Padrinho → **Buddy** (papel, não perfil). Pra quem recebe: info na Av. de Experiência; pra quem é Buddy: Ocorrência automática. Fim da Experiência: liderado dá feedback sobre a tutela → Registros. | RH via Caio |
| 2026-04-16 | IA no feedback = pós-MVP (só selo/ícone) `[implementado]` | RH via Caio |
| 2026-04-16 | PDI e Competências como "etapas do ciclo" via marcadores/flags. Fluxo real vive nos outros grupos. | Caio |
| 2026-04-16 | Benchmark "ideal de mercado / empresa / equipe" — fonte indefinida; overlay explicativo no protótipo pra CEO decidir | RH via Caio |
| 2026-04-16 | Menu "Competências" agrupa sub-tabs Visão geral / Cargos / Trilhas de Carreira `[implementado]` | Caio |
| 2026-04-16 | Perfil Líder com telas próprias (pendências, responder, consolidação, registrar feedback, dashboard) `[implementado]` | HUs RH+Líder |
| 2026-04-16 | Dashboard Admin (HU-02): cards status + filtros + drill-down + lembretes `[implementado]` | HU-02 RH |
| 2026-04-16 | **Forms Complementares não é tipo independente** — seção interna da Av. de Desempenho `[invertido em 2026-04-21 — ver abaixo]` | Caio |
| 2026-04-16 | Mock de Competências do grupo 3 com 3 tabs `[implementado]` | Caio |
| 2026-04-17 | **Todas as matrizes entram no protótipo** (9/16/6/3-box), com 9-box como default. Seleção abre em **página dedicada** com breadcrumb pra não perder contexto. | Caio |
| 2026-04-17 | **Edição em Ciclo Ativo: Abordagem B confirmada** — datas imutáveis depois de ativar; líder preenche com atraso (flag visível). Abordagem A descartada. | Caio |
| 2026-04-17 | **Menu "Gestão de Time(s)"** confirmado pra todos os perfis. "Performance" (citado pelo Rovina) descartado. | Caio |
| 2026-04-17 | **"Gestor" renomeado pra "Líder"** em todo o protótipo/docs. "Gestor matricial" (método de coleta específico) mantido como termo composto distinto. | Caio |
| 2026-04-17 (tarde) | **Modelo Campanha revertido**: decisão de 2026-04-16 ("Campanha = 1 Tipo de avaliação") revertida após esclarecimento do RH. Agora **1 Campanha → N Tipos de avaliação**, cada um com sua config própria (tiposColeta, pesos, anonimato, datas). Exemplo: "Campanha Q1 — Engenharia" aplica Av. de Desempenho + 9-box no mesmo público. | RH via Caio |
| 2026-04-17 (tarde) | **Feedbacks pós-avaliação** vira toggle da Campanha (não atrelado só a Desempenho). Similar ao `habilitarFormComplementar`, mas no nível da Campanha. | RH via Caio (feedback 2.2) |
| 2026-04-17 (tarde) | **Opções de Formulário** abrem em **Drawer** (não em Modal) — consistência com pattern do CicloDrawer. | RH via Caio (feedback 4.1) |
| 2026-04-17 (tarde) | **Precedência entre tipos de avaliação**: cada `AvaliacaoConfig` tem `dependeDe?: AvaliacaoKey` opcional. Se preenchido, a avaliação só libera após o precedente fechar, e as datas início/fim são auto-sugeridas a partir do fim do precedente. | RH via Caio (feedback 4.3) |
| 2026-04-17 (tarde) | **Nova feature a projetar**: visualização "Pessoas × Ciclos ativos" pra RH comparar quem já está alocado antes de criar novo ciclo. | RH via Caio (feedback 5) |
| 2026-04-21 | **Forms Complementares invertido** — seção é da Av. de Desempenho **regular** (colab com histórico). A Av. de Experiência inicial é variante de Desempenho pra novatos que **NÃO** inclui o bloco. Reverte a leitura da decisão 2026-04-16 (linha 466). | Caio |
| 2026-04-28 | **Formulário ficou genérico** — entidade unificada que abriga prova/pesquisa/avaliação. Não vincula competência diretamente na pergunta. Detalhe em `docs/poc-desempenho/proposta-ux-2026-04-29/README.md` § 2 + `glossario-rh.md` § "Decisões da reunião 28/04". | Comitê de Competências (Adriana, Angelica, Alexandre, Max, Caio) |
| 2026-04-28 | **Vínculo competência ↔ formulário acontece no cadastro da competência** (campo "Como será avaliada", não na pergunta). Ação em massa permite atualizar várias competências com mesmo formulário. | Comitê de Competências |
| 2026-04-28 | **3 tipos de questionário**: Prova (com nota), Pesquisa (coleta opinião sem nota), Avaliação (de competência ou desempenho — sem caráter avaliativo individual mas estrutural). Tudo unifica em formulário base genérico. **Nomenclatura final ainda em aberto** (Angelica achou "prova" e "avaliação" ambíguos; "desempenho" foi candidato). | Comitê de Competências |
| 2026-04-28 | **Disparo de avaliação de competências** via Piloto Automático: ação "Criar avaliação" puxa competências vinculadas ao formulário base, todas marcadas por padrão; RH pode desmarcar. | Comitê de Competências |
| 2026-04-28 | **Ação "Manual"** canonizada no Piloto Automático (não "Pontual"). Antônimo: Ação Recorrente (com gatilho). Resolve pergunta aberta antiga do backlog. Detalhe em `docs/poc-desempenho/notas-pro-alexandre-cross-port-consolidado-2026-05-04.md` § P.1 (consolidado em 2026-05-04; histórico em `git show 215a281^:docs/poc-desempenho/notas-pro-alexandre-piloto-2026-04-28.md` § 2.2). | Alexandre canonizou no commit `66c8f89` (24/04); confirmado na reunião 28/04 |
| 2026-04-28 | **Pré-requisito (formulário com fonte de nota vinda de conteúdo)** — quando formulário tem nota baseada em curso/prova, aluno só pode responder após concluir o conteúdo. Trade-off: "mais chato pra usuário, mais fácil pra gente" (Caio na reunião). | Comitê de Competências |
| 2026-04-28 | **Sessão oculta** no formulário — sem paginação obrigatória, scroll vertical único. Pesquisas existentes ganham conversão lazy (na hora de editar). | Comitê de Competências |
| 2026-04-28 | **Sigilo gestor pós-autoavaliação** — toggle no AvaliacaoForm: gestor só vê autoavaliação do colaborador depois que ele mesmo concluir a própria avaliação. Atende ata 2026-04-22 (D4 + D9). Implementado nas Fatias 3+4 do D9 (commits `118f0a4` `7c5b8f0`). | Caio (gap §2.3 do relatório D9 fechado no port) |
| 2026-04-28 | **Iconização padrão do projeto Jornadas** — usar como referência em todas as novas telas pra manter consistência cross-módulo. Aprovado pelo Rovina no projeto Jornadas. | Angelica via reunião 28/04 |
| 2026-04-28 | **Feature flag obrigatório** pra toda funcionalidade nova que coexiste com legado. Princípio reforçado: "não pode esquecer do feature flag, a gente está envolvendo coisa que já existe". | Adriana via reunião 28/04 |
| 2026-04-28 | **Toggle "Atual / Proposta UX 28/04"** no `CompetenciasHub` (tab Visão geral) — permite alternar ao vivo entre versão atual e proposta papel-de-pão durante apresentações. Setup técnico em commit `58b222d`. Origem: encomenda da Adriana na reunião pra Caio + agente Claude montarem alternativa de UX. | Caio + Claude |
| 2026-04-28 | **Perfil novo "RH (versão Ale)"** no `ProfileMenu` — espelho fiel do protótipo do Alexandre Kumagae pra comparação ipsis literis com nossa proposta. Tradução incremental por janelas paralelas, com decision records prós/contras pro Alexandre conseguir reconstruir o "furacão". Setup em commit `dea5c1b`. | Caio (estratégia "Opção 2" sobre Opção 4 — sidebar refletida + toda complexidade do RH dele exposta) |
