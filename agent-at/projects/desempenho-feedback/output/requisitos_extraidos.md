# Requisitos Extraídos — Desempenho e Feedback

> Intermediário da Fase 2 (read-docs) do agent-at. Consolida os 8 PRDs +
> status-x-acoes + planilha QA-Only + recon estático do protótipo
> (`claude-twygo-prototype`, branch `poc-revisao-desempenho`). Insumo do
> `generate-md-canonical`. **Não é o canônico** — o `test-analysis.md` é.
>
> Recon: estático (glossary, glossario-rh, data-models, design-system, 15 gaps,
> regras-default-ciclo, lidos direto do clone) + live pendente nas telas
> críticas (dev server sobe em `localhost:5173`).

## 1. Domínio e hierarquia

Módulo **Desempenho** (gestão de avaliações + feedback contínuo). Hierarquia:

```
Ciclo (container temporal/estratégico)
  └── Campanha (rodada/público; N tipos de avaliação)
        └── Avaliação individual (self/leader/peer/subordinate)
              └── Resposta (escala/texto/múltipla escolha)
        → Consolidação (por método) → Devolutiva → 9-box (calibração)
Registros / "Feedbacks e Anotações" (contínuo, fora de ciclo — 5 tipos visíveis)
Usuários DHO (cadastro + importação CSV — alimenta todo o módulo)
```

3 personas: **Admin/RH** · **Líder** · **Colaborador**. Copy de menu: "Gestão de
time(s)" (Admin/Líder) / "Performance" (Colaborador). Sidebar atual: "Gestão de
Time(s) > Desenvolvimento" (gap-10: PRD diz "Desempenho", UI diz "Desenvolvimento").

## 2. Plano de suítes (24 + Notificações placeholder)

Ver tabela no histórico da sessão. Resumo executor/playbooks:

| # | Suíte | Executor | Playbooks |
|---|---|---|---|
| 1 | Ciclos — Listagem e Filtros | playwright | filtro-drawer, toast-chakra |
| 2 | Ciclos — Criação e Estados | playwright | switch-chakra, beforeunload, toast-chakra |
| 3 | Campanhas — Config, Tipos e Pesos | playwright | switch-chakra, toast-chakra |
| 4 | Campanhas — Aprovação de Pares | playwright | — |
| 5 | Formulários — Catálogo e Custom | playwright | filtro-drawer |
| 6 | Avaliações — Responder (Colaborador) | playwright | perfil-switch |
| 7 | Avaliações — Pendências e Responder (Líder) | playwright | perfil-switch |
| 8 | Dashboard de Acompanhamento (Admin/RH) | playwright | filtro-drawer |
| 9 | Status do Time (Líder) | playwright | perfil-switch |
| 10 | Encerramento e Consolidação | playwright | toast-chakra |
| 11 | Devolutiva Pós-Avaliação | playwright | toast-chakra |
| 12 | Calibração 9-box | playwright | — (drag-and-drop) |
| 13 | Visão 9-box Standalone | playwright | — |
| 14 | Feedbacks e Anotações — Admin | playwright | toast-chakra |
| 15 | Feedbacks e Anotações — Líder | playwright | perfil-switch |
| 16 | Feedbacks Recebidos — Colaborador | playwright | perfil-switch |
| 17 | Usuários DHO — Cadastro e Edição | playwright | toast-chakra |
| 18 | Usuários DHO — Importação CSV | playwright | (upload) |
| 19 | Permissões e RBAC por Perfil | playwright | perfil-switch |
| 20 | Feature Flag (`performance_module_enabled`) | playwright | flipper |
| 21 | Ambientes Adicionais — Isolamento | playwright | ambientes-adicionais |
| 22 | Trial — Exclusão de Dados | playwright | trial |
| 23 | Banco Histórico | db | — |
| 24 | Logs / Auditoria | db / mixed | — |
| 25 | Notificações (email + push) | — | **PLACEHOLDER — escopo a definir** |

## 3. Inventário de RNs por PRD (origem do escopo)

| PRD | HUs | RNs | CAs | Núcleo |
|---|---|---|---|---|
| #1 admin-desenvolvimento | 7 | ~47 (RN 1–38 + subs) | CA-01..29 | Ciclo/Campanha/Dashboard/Consolidação/9-box |
| #2 admin-feedbacks-anotacoes | 5 | ~37 | CA-01..32 | Registros + Devolutiva (Admin) |
| #3 lider-desenvolvimento | 5 | 21 | CA-01..18 | Avaliar/acompanhar (Líder) + sigilo gestor RN 11 |
| #4 lider-feedbacks-anotacoes | 4 | 13 | CA-01..14 | Registros (Líder, escopo liderados, 403) |
| #5 aluno-avaliacoes | 3 | 17 | CA-01..15 | Responder/rever (Colaborador) |
| #6 aluno-feedbacks-recebidos | 2 | 10 | CA-01..09 | Ver feedbacks (Colaborador, read-only) |
| #7 admin-usuarios-dho | 3 | 20 | CA-01..17 | Cadastro + CSV import |
| **Total** | **~29** | **~165** | **~134** | |

## 4. Catálogo — Vocabulário canônico (naming)

| Termo UI | Interno / código | Observação |
|---|---|---|
| "Feedbacks e Anotações" | `PerformanceEntry` (`performance_entries`); legado "Registro" | UI desde 2026-05-13 |
| "Desenvolvimento" (sidebar) | "Desempenho" (PRD); slug `performance-module` | gap-10 — divergência |
| "Reconhecimento" | `kind=recognition` | |
| "Ponto de atenção" | `kind=concern` | |
| "Feedback" (ex-"1:1") | `kind=feedback` | rename 2026-05-11 |
| "Devolutiva" | `kind=wrapup` | tipo próprio desde 2026-05-11 |
| "Anotação" (ex-"Outro") | `kind=note` | privada |
| Calibração (log 9-box) | `kind=calibration` | 6º tipo interno, não user-facing |

Papéis avaliativos: **Auto** (self), **Líder** (leader), **Pares** (peer),
**Liderado** (subordinate). **Gestor matricial DEPRECADO** (cada Pessoa tem no
máx. 1 `liderDiretoId`). **Buddy** = papel na Av. de Experiência (não é perfil).

## 5. Catálogo — Tipos de Registro (5 visíveis)

| Tipo | `kind` | Visível ao colab? | Cor (bg/texto) | Ícone | Criável no modal? |
|---|---|---|---|---|---|
| Reconhecimento | recognition | Sim | `#C6F6D5`/`#22543D` | MdStar | Sim |
| Ponto de atenção | concern | Sim | `#FEEBC8`/`#9C4221` | MdWarningAmber | Sim |
| Feedback | feedback | Sim | `#BEE3F8`/`#2B6CB0` | MdChatBubbleOutline | Sim |
| Devolutiva | wrapup | Sim (contrato) | `#E9D8FD`/`#6B46C1` | MdAssignment | **NÃO** (só via RegistrarFeedbackLider) |
| Anotação | note | **NUNCA** (Líder+RH) | `#E2E8F0`/`#4A5568` | MdLockOutline | Sim |

- Buckets da listagem Admin: **"Feedbacks"** (Reconhecimento+Feedback+Devolutiva+**Ponto de atenção**) e **"Anotações"** (só Anotação). *Gotcha: Ponto de atenção cai em "Feedbacks".*
- Classificação Pos/Neg/Neutro e Gravidade foram **removidas** (refactor 2026-05-11).

## 6. Catálogo — Status / máquinas de estado (labels exatos p/ chip)

- **Ciclo**: "Rascunho" → "Programado" → "Em andamento" → "Finalizado" (terminal). *(glossario-rh fala em reversibilidade/"Encerrado" — CONTRADIÇÃO a resolver, §10.)*
- **Campanha**: "Rascunho" → "Aguardando pares" / "Agendada" → "Em andamento" → "Encerrada" (terminal).
- **Avaliação**: "A iniciar" / "Iniciado" / "Início em atraso" / "Aguardando feedback" / "Feedback em atraso" / "Concluída" (label genérico "Atrasada").
- **Sessão de Calibração**: "Programada" / "Em andamento" / "Concluída".
- Cores dos chips (status-x-acoes.md): Rascunho `#EDF2F7`/`#718096`; Programado/Agendada `#FEEBC8`/`#9C4221`; Aguardando pares `#FED7AA`/`#9A3412`; Em andamento `#C6F6D5`/`#22543D`; Finalizado/Encerrada `#BEE3F8`/`#2C5282`.
- Ações por status (menu 3-pontos): tabela completa em `status-x-acoes.md` (Ciclo e Campanha). Prorrogar prazo em Campanha Encerrada só se ≤5 dias úteis → volta a "Em andamento".

## 7. Catálogo — Campos e validações (do modelo de dados proposto)

Enums (modelo Híbrido v2 do protótipo — alvo de testes de validação):
- `cycle_status`: rascunho/ativo/finalizado/arquivado
- `campaign_type`: desempenho/experiencia/perfil/pdi/feedback
- `campaign_status`: rascunho/agendada/em_andamento/finalizada
- `evaluation_relationship_kind`: self/leader/peer/subordinate/matrix_manager (matrix deprecado)
- `evaluation_status`: pendente/em_andamento/concluida/atrasada
- `cargoNivel` (DHO): Júnior/Pleno/Sênior/Especialista/Coord./Gerente/Diretor (7)
- `AvaliacaoKey`: desempenho/competencia/pdi (+ experiencia invisível — gap-13)
- `BoxMatrix`: 9-box(default)/4-box/16-box/6-box/3-box (só 9-box tem labels — gap-14)

Validações-chave:
- Ciclo: nome/datas obrigatórios; `cycle_type` derivado das datas (Mensal 25–35d / Trimestral 80–100 / Semestral 170–200 / Anual 330–400 / Personalizado); bloqueio de período sobreposto a outro ciclo Em andamento (RN 13).
- Campanha: `question_list_id` obrigatório; soma de pesos por tipo = 100%; `dataFim` campanha ≤ `dataFim` ciclo.
- DHO: obrigatórios email/nome/sobrenome; email único + regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`; pessoa desativada não selecionável como líder/responsável; sem validação cross-data (decidido NÃO validar).
- CSV import: ≤5MB, ≤500 linhas; separador `;`(default)/`,`/tab; colunas obrigatórias email/nome/sobrenome; validação por linha; política duplicados Cancelar/Atualizar/Ignorar; ref email não achada → linha erro.
- Uniques (testes de duplicidade): participante `(campaign,user)`, avaliação `(campaign,evaluator,evaluatee,kind)`, resposta `(evaluation,question)`, 9-box `(cycle,user)`.

## 8. Catálogo — Textos literais confirmados (recon estático)

- **Upload (CSV)**: "Arraste o arquivo ou clique para selecionar"; "Clique para selecionar o arquivo"; erros "Formato do arquivo não suportado. Tente novamente.", "Arquivo acima do tamanho máximo suportado. Tente novamente."
- **Tabela (empty states)**: "Sem dados para exibir tabela desktop." e variantes mobile/card.
- **Filtro (drawer)**: botões "Aplicar", "Cancelar"; switch "salvar na lista de filtros".
- **Stepper**: "anterior", "próximo", "salvar", "cancelar".
- **Toast**: sem ponto final; canto inferior direito (desktop); `.chakra-toast` acumula → usar `.first()`.
- **Devolutiva (estilo)**: rótulos uppercase 10px roxo `#6B46C1` peso 700 (gap-09).
- **Labels de negócio citados (a confirmar literal no live)**: "Salvar rascunho"/"Rascunho salvo", "Ativar ciclo", "Importar", "esse arquivo Modelo", "Histórico de importações", "Nova sessão"(tooltip "em breve"), baldes do Copiloto, campos da devolutiva "Pontos fortes"/"Áreas de desenvolvimento"/"Recomendações".

## 9. Catálogo — Modais relevantes (⚠ literais pendentes de live recon)

Os dumps de Figma NÃO trazem os textos literais dos modais de negócio. Capturar no live recon:
- Confirmar exclusão (Ciclo/Campanha Rascunho)
- "Descartar rascunho?" (RegistroModal / forms dirty)
- Confirmar concluir avaliação (read-only após)
- Duplicar ciclo; Prorrogar prazo
- "Nova sessão" (Calibração) — Tipo (radio matrizes) / Campanha / Time / data
- Regra Chakra: modais NÃO fecham por click-fora (só X ou ESC)
- Modal Beta / Modal Launch (componentes de liberação)

**Seletores estáveis**: o único componente com `data-test-id` documentado é o **People Selector** (`people-selector-input`, `-chip-{id}`, `-confirm-button`, etc.) — usado no público-alvo/participantes.

## 10. Inconsistências e decisões em aberto (resolver na geração do MD)

1. **Reversibilidade de Ciclo Finalizado**: `glossary.md` (terminal) vs `glossario-rh.md` (reabrível, princípio Rovina "sempre tem que poder voltar atrás"). → confirmar com PO. AT escreve terminal (glossary é source of truth declarado), nota a divergência.
2. **CA-15 duplicado** no PRD#1 (HU-03 e HU-04).
3. **"Salvar e Programar" vs "Salvar e Ativar"** — termo divergente no PRD#1.
4. **Naming Registro vs PerformanceEntry / 5 vs 6 tipos** (calibration interno).
5. **Spikes S1–S5** (def. de "time do líder", sigilo gestor toggle, catálogo área/funções) — afetam testabilidade.
6. **D09 Notificações**: sem RNs nos PRDs → suíte 25 placeholder.
7. **Público-alvo da Campanha**: FORA DE ESCOPO nesta fase (glossary §3.2) — apesar de o PRD#1 descrever filtros. Confirmar.
8. **Itens REMOVIDO ainda no texto** (PRD#2 RN 13/CA-10).

## 11. Gaps do protótipo (15) — impacto QA

Bloqueiam E2E no protótipo (marcar `@skip-proto` / validar só no twyg-app portado):
- **gap-01** CSV import (handlers mortos) → bloqueia PRD#7 HU-03
- **gap-02** Consolidação sem branching por método → bloqueia PRD#1 HU-05
- **gap-06** Sigilo gestor (RN 11) ausente → bloqueia PRD#3
- **gap-07** Calibração "em breve" (já coberta no port via D10)
- **gap-03** Copiloto 3 baldes vs 4 (parcial)

Não bloqueiam (validar comportamento esperado no port): gap-04 (funcoes/isLider seção), gap-05 (SectionNav sem vermelho), gap-09 (render Devolutiva read-only Líder), gap-10 (naming), gap-11 (threshold só Auto×Líder), gap-12 (9-box timeline/heatmap), gap-13 (experiencia invisível), gap-14 (labels matrizes), gap-15 (salvar rascunho não persiste). **gap-08** (status enums) RESOLVIDO — enums do protótipo são canônicos.

## 12. Endpoints (referência)

Não há rotas REST/eventos definidos nos docs do protótipo (só modelagem de dados e front com mocks). Endpoints reais derivam do twyg-app quando portado → **[a definir]**. Suítes API: nenhuma identificada nesta fase (PRDs descrevem UI; o que houver de API vira TC `Tipo: api` quando o twyg-app expor).

## 13. Ambiente

- env principal: `staging-desempenho`; adicional: `staging-desempenho-aditional`; trial: `staging-desempenho-trial` (placeholders em `environment.json`, valores reais a preencher).
- Feature flag: `performance_module_enabled` (pré-req de todas as suítes — playbook `flipper`).
- Protótipo (referência de comportamento/textos): clone local, `npm run dev` → `localhost:5173`.
