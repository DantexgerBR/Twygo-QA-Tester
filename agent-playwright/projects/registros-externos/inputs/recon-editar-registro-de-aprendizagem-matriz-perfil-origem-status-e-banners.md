# Reconnaissance — Editar registro de aprendizagem (matriz perfil × origem × status e banners)

> Recon interativo (login via storageState + abertura de menus 3-pontos + form de edição
> + troca de perfil), capturado 2026-06-22. Substitui o stub automático (que só varreu o dashboard).
> **Leia antes de planejar/gerar/healear esta suíte.** As divergências abaixo são o achado central.

## Rotas

| Visão | Rota | Observado |
|---|---|---|
| Aluno ("Meu histórico") | `/o/37079/records?in_use_mode_layout=true` | tabela escopada ao usuário logado |
| Admin ("Aprendizagem > Registros") | `/o/37079/records` | tabela de todos os registros da org |
| Form de edição | `/o/37079/records/{recordId}/edit` | **só renderiza via navegação SPA (kebab → Editar)**; goto direto na rota NÃO bootstrapa o form |

## Test IDs estáveis (lista de registros)

| testId | uso |
|---|---|
| `records-{recordId}-actions-kebab` | botão 3-pontos da linha (recordId numérico) |
| `record-origin-badge-external` / `record-origin-badge-internal` | badge de origem na linha |
| `record-situation-badge-{recordId}` / `record-certificate-situation-badge-{recordId}` | badges de situação |
| `records-list-evaluate-action` / `-evidences-action` / `-history-action` / `-view-action` | itens do menu (Avaliar/Evidências/Histórico/Visualizar) — **"Editar" e "Excluir" NÃO têm testId**, só texto |
| `records-kpi-card-*` / `records-kpi-count-*` / `records-total-workload` | faixa KPI |
| `tab-records-tab` / `tab-event-sources-tab` | abas Registros / Provedores |

## Test IDs estáveis (form de edição)

| testId | uso |
|---|---|
| `record-form-save-button` | botão Salvar do rodapé |
| `record-form-cancel-button` | botão Cancelar do rodapé |
| `people-selector-input` / `people-selector-hidden-input` / `people-selector-input-icon` | campo "Pessoas*" |

Campos do form (por `label`): Website · Evidência de aprendizagem (upload) · **Pessoas*** · Provedor* ·
Conteúdo* · Descrição (editor rich) · Tipo de experiência* · Categorias* · Carga horária* · Desempenho ·
Valor do conteúdo · Data de início · Data de término* · Data de aprovação · Data do certificado · Data de validade.
Rodapé: **Voltar** (topo) · **more_horiz** (sem itens) · **Salvar** · **Cancelar**. Breadcrumb topo: "Registros > Editar".

## Inventário de SEED (org 37079) — 2026-06-22

Admin (`/records`, 25 linhas):
- **20× Externo + Pendente** — dono `dante.tavares@twygo.com` (QA Tester). Ex.: `QA11-F2-Alura-Python`.
- **1× Externo + Emitido** — dono `richard.sebold@twygo.com` (= usuário logado), provedor **Nocode**, 2 evidências, `recordId=44279361`.
- **4× Interno + Pendente** — donos Carla Silva / Vanessa Pereira (`record-origin-badge-internal`).

Aluno (`?in_use_mode_layout=true`, escopado ao logado): **1 linha** — o próprio Externo Emitido (44279361).

**Faltando no env** (precondições da suíte NÃO atendidas):
- Externo **Recusado** (com justificativa), Externo **Expirado**, Externo **Substituído**
- **Compartilhado** (qualquer status), **Interno Emitido**, **Interno "Em andamento"**
- Registros Externos próprios do Aluno em Pendente/Recusado/Expirado (o aluno logado só possui 1 Emitido)
- Provedor fora da lista padrão "**UFSC**" (provedores presentes: Alura, USP, Udemy, FGV, Coursera, LinkedIn Learning, Nocode)

## Perfil (RN42)

Troca de perfil funciona (popover canto sup. dir.: Administrador / Gestor de turma / Instrutor / Colaborador).
**Porém o menu 3-pontos NÃO muda com o perfil ativo** — Colaborador vê o mesmo menu que Administrador para o mesmo registro.

## DIVERGÊNCIAS produto × AT (achado central — Registros está em BETA)

| TC | AT espera | Produto (Stage, 2026-06-22) | Veredito |
|---|---|---|---|
| TC1.4 | Aluno: Externo Emitido **sem** "Editar" | menu Colaborador do Emitido = `[Editar, Excluir, Visualizar, Evidências, Histórico]` | ❌ "Editar" presente |
| TC2.4 | Admin: Externo Pendente "Avaliar", **sem** "Editar" | `[Avaliar, Editar, Excluir, Visualizar, Evidências, Histórico]` | ❌ "Editar" presente junto de "Avaliar" |
| TC2.6 | Admin: Interno **sem** "Editar" | Interno Pendente = `[Editar, Excluir, Visualizar, Evidências, Histórico]` | ❌ "Editar" presente |
| TC2.1 | Admin: Externo Emitido **com** "Editar" (sem Avaliar) | `[Editar, Excluir, Visualizar, Evidências, Histórico]` | ✅ confere |
| TC3 | Header "Editar registro de aprendizagem" (Aluno) / "Editar registro" (Admin) | breadcrumb "Registros > Editar" + título do conteúdo ("Minicurso"); **sem** literal "Editar registro" | ❌ header divergente |
| TC4 | Form pré-populado, datas no formato, provedor extra pré-selecionado | **pré-população OK** (Website, Provedor=Nocode, datas dd/mm/aaaa, carga, desempenho, valor, categorias) | ✅ (parte UFSC não testável — sem seed) |
| TC5 | Campo "Pessoa" **desabilitado** | campo "Pessoas*" (plural, obrigatório) exibe a pessoa mas o input **não está disabled** | ❌ provável divergência |
| TC7 (admin) | Botão "Salvar" + toast "Registro salvo" | rodapé tem "Salvar" | ⏳ testável (admin) |
| TC8 | Rodapé Admin Emitido **com** "Excluir" | rodapé = só Salvar + Cancelar (+Voltar/more_horiz vazio); **sem** "Excluir" | ❌ "Excluir" ausente |
| TC10 | Banner verde "Certificado aprovado" + "Histórico" no form Emitido | **nenhum banner** no form de edição; sem botão "Histórico" | ❌ banner ausente |
| TC9 | Banner vermelho "Registro de aprendizagem recusado" + justificativa | sem seed Recusado → não reproduzível | ⊘ seed ausente |

## Conclusão para planejamento

1. **RN42/RN45/RN46 (gating de menu por origem×status×perfil, header contextual, banners, "Excluir" condicional) NÃO estão implementados** neste build BETA — o form de edição é genérico e o menu é invariante a perfil/status (exceto "Avaliar", que aparece só em Externo Pendente).
2. **Metade da matriz não tem seed.** TCs que exigem Recusado/Expirado/Substituído/Compartilhado/Interno-Emitido/UFSC ou registros próprios do aluno em vários status → `test.fixme("seed ausente: …")` (destinatário QA Lead).
3. O que é testável hoje: matriz de menu nos casos com seed (Externo Pendente/Emitido + Interno Pendente — todos surfam divergência), pré-população (TC4, parte), validação de obrigatórios (TC6), label/toast de Salvar no admin (TC7 admin).
