# Requisitos extraídos — Registros de Aprendizagem

> Consolidação de: `Documentação completa - Registros de Aprendizagem.md` (17 histórias h01–h17),
> `[Discovery] Registros de Aprendizagem - v02 25.05.2026.md` (#R1–#R28, RN 1–98),
> `[Spike] Registros de Aprendizagem.md` (S1–S11), `Registros de Aprendizagem.xlsx`
> (22 atividades QA 1.1–1.22), `extract.md`, `spike-mass-download-certificates.md`
> e recon live do protótipo (ver `recon-prototipo.md`).

## Mapa atividade → requisitos (planilha .csv, 22 atividades)

| Atividade | Título | Requisitos | RNs |
|---|---|---|---|
| QA 1.1 | Listagem "Meu histórico" (Aluno), tabela, campo de busca e mobile | #R1, #R3, #R4 | RN 1–5, 13–17 |
| QA 1.2 | Listagem "Aprendizagem > Registros" (Admin/Líder) — colunas, sticky, seleção | #R2, #R3, #R4 | RN 6–12, 13–17 |
| QA 1.3 | KPI cards como filtro de status (Aluno) | #R5, #R6, #R7, #R10 | RN 18–29, 35–37 |
| QA 1.4 | KPI cards como dashboard estático (Admin/Líder) | #R5, #R6, #R8, #R10 | RN 18–25, 30–31, 35–37 |
| QA 1.5 | Atualização de KPIs em tempo real (ações, expiração, batch) | #R9 | RN 32–34 |
| QA 1.6 | Adicionar registro (3 perfis, validações, origem inferida) | #R11 | RN 38–41 |
| QA 1.7 | Editar registro (matriz perfil × origem × status, banners) | #R12 | RN 42–46 |
| QA 1.8 | Visualizar registro (standalone vs form viewing, "Em andamento") | #R13 | RN 47–49 |
| QA 1.9 | Avaliar registro pendente (Aprovar/Recusar + modal justificativa) | #R14 | RN 50–54 |
| QA 1.10 | Excluir registro, Evidências e Histórico (drawers, trilhas) | #R15, #R16, #R17 | RN 55–62 |
| QA 1.11 | Filtros (drawer) + personalização de colunas (DnD) | #R18, #R19 | RN 63–70 |
| QA 1.12 | Ações em massa (elegibilidade, escopos, toasts com ratio) | #R20 | RN 71–75 |
| QA 1.13 | Extração de dados/evidências (assíncrona, modal de atenção) | #R21 | RN 76–80 |
| QA 1.14 | CRUD de Provedores + bloqueio de exclusão com vínculo | #R22, #R23 | RN 81–87 |
| QA 1.15 | Preenchimento com IA + crédito de IA (3 estados, modais por perfil) | #R24, #R25 | RN 88–92 |
| QA 1.16 | Escopo do Líder, pessoas inativadas, "Compartilhado" | #R26, #R27, #R28 | RN 93–98 |
| QA 1.17 | Extração de dados da "Evidência" | (sem regra própria — spike export) | — |
| QA 1.18 | Tabelas do Banco de Dados | tabelas novas/atualizadas | — |
| QA 1.19 | Exclusão do Banco Histórico | banco histórico org | — |
| QA 1.20 | Tabela de Logs | logs novas/atualizadas | — |
| QA 1.21 | Trial | criação/exclusão trial | — |
| QA 1.22 | BETA/Launch | rollout | — |

## Tabelas de banco (QA 1.18–1.20)

- **Novas**: `learning_records`, `learning_providers`, `learning_record_evidences`, `learning_record_histories`.
- **Atualizadas**: `event_participants`, `event_sources`, `filters`, `filter_options`, `active_filters`, `data_exports`, `export_jobs`, `organization_ai_credits`, `ai_consumptions`.
- **Logs novas**: `learning_records_logs`, `learning_providers_logs`.
- **Logs atualizadas**: `event_sources_logs`, `event_participant_logs`, `certificates_logs`, `ai_credit_consumption_breakdowns`.
- Banco histórico: tabelas novas relacionadas à organização devem ter `organization_id`; worker `HistoricBaseCron` exclui registros da organização.

## Trial (QA 1.21)

- Criação de trial via URL `https://stage.twygoead.com/new/register/steps?1` e API `https://stage.twygo.com/api/v2/external_onboarding`.
- Exclusões de trial: todas as informações pré-definidas da SophiaTech + todas as informações (pré-definidas e criadas pelos administradores).

## Domínio essencial

- **Entidade central**: registro de aprendizagem com `origem` (Interno | Externo | Compartilhado) e `status` (Emitido | Expirado | Pendente | Recusado | Substituído | "Em andamento"). "Situação do registro" = Aprovado | Pendente. "Situação do certificado" = status do documento (— para Externo).
- **Perfis**: Aluno (Meu histórico; escopo próprio; KPI clicável-filtro), Admin (org inteira; KPI estático), Líder (liderados diretos; mesmo shell do Admin).
- **Status fixos do KPI**: Emitidos, Expirados, Pendentes, Recusados. Denominador do donut = soma dos 6 status (RN 23).
- **Origem inferida** (RN 41): Aluno cadastra → Externo + Pendente; Admin/Líder cadastra → Externo + Emitido/Aprovado; Interno = gerado pelo LMS; Compartilhado = via SharedEvent.

## Textos literais (consolidado doc + protótipo)

### Toasts — sucesso
- "Registro enviado para aprovação" (aluno, pós Enviar para aprovação)
- "Registro adicionado · entrou como aprovado" (doc) / "Registro adicionado — O registro entrou como aprovado no histórico do colaborador." (protótipo live)
- "Edição salva" (aluno) / "Registro salvo" (admin)
- "Registro aprovado" / "Registro recusado" (avaliação)
- "Registro excluído"
- "X registros aprovados (Y ignorados por não atender aos critérios da ação)" / "X registros recusados (Y ignorados)" / "X registros excluídos (Y ignorados)"
- "Provedor adicionado" / "Provedor salvo" / "Provedor ativado" / "Provedor desativado" / "Provedor excluído"
- "Extração iniciada: CSV com {N} registros (filtro atual · colunas do filtro)." — variações: {CSV|PDF}, {filtro atual|todos}, colunas {do filtro|completas}
- "Extração iniciada: baixando evidências de {comEv} registros ({semEv} sem evidência ignorados)."
- "Sua extração está sendo processada. Você receberá uma notificação quando estiver pronta." (flash)
- "Campos preenchidos pela IA" + "Tipo de experiência e Categorias foram sugeridos com base na evidência. Revise antes de salvar." (3500ms)

### Toasts — erro/aviso
- "Campo obrigatório" (inline sob campo, não é toast)
- "Não foi possível aprovar — registro não encontrado"
- "Sem permissão pra atuar nesse registro" (403)
- "Essa funcionalidade não foi habilitada para esse ambiente. Ative ou consulte o responsável para liberar o acesso a essa funcionalidade no menu de Créditos de IA."
- "Não foi possível preencher com IA. Tente novamente."
- "Em breve" (botão Duplicar filtro / Opções de filtro / Salvar filtro)
- Warning escopo vazio ações em massa: "Marque registros na tabela ou troque pra 'Todos do filtro atual'."

### Empty states
- "Você ainda não tem registros. Adicione o primeiro pelo botão acima." (aluno, base vazia)
- "Nenhum registro encontrado" (filtro sem resultado)
- "Sem evidências anexadas." (drawer Evidências)
- "Em breve — filtros criados pela equipe vão aparecer aqui." / "Em breve — filtros que você criar ou duplicar ficam aqui."

### Banners do form
- Amarelo (avaliar): "Avaliação pendente" + "Edite Tipo de experiência e Categorias, depois clique em Aprovar ou Recusar." (protótipo) / "preencha Tipo de experiência e Categorias antes de aprovar" (doc)
- Vermelho (recusado): "Registro de aprendizagem recusado" + justificativa do evento `recusado`
- Verde (emitido): "Certificado aprovado"
- Banner amarelo ações em massa: "Nenhum registro no escopo atende aos critérios pra essa ação."

### Tooltips
- KPI Aluno: Emitidos "Certificados emitidos e dentro do prazo de validade." · Expirados "Certificados cuja data de validade já passou. Pode ser hora de recertificar." · Pendentes "Registros externos que você enviou aguardando avaliação do Admin." · Recusados "Registros externos que foram recusados pelo Admin. Veja o motivo no detalhe."
- KPI Admin/Líder: Emitidos "Registros aprovados e dentro do prazo de validade na organização." · Expirados "Registros cuja data de validade já passou. Sinaliza necessidade de recertificação." · Pendentes "Registros externos aguardando avaliação. Use o menu de ação ou as ações em massa pra aprovar/recusar." · Recusados "Registros externos recusados na avaliação. Veja o motivo na ficha individual."
- KPI Admin live (protótipo): ver recon-prototipo.md §2.
- "Disponível após a conclusão" (Visualizar disabled em "Em andamento")
- "Marque registros na tabela pra ativar" (radio Selecionados com 0 marcados)
- "Arraste para reordenar" (drag handle colunas)
- "Não é possível excluir — vinculado a N registros" (provedor com vínculo, protótipo)
- Header Provedor: "Instituição responsável pela formação. Pode ser o emissor de um certificado externo ou quem compartilhou o conteúdo." (protótipo live)

## Modais

| Modal | Header | Body | Botões |
|---|---|---|---|
| Recusa (individual) | "Recusar registro" | "Esta ação não pode ser desfeita." + "A justificativa fica visível no histórico do registro pro colaborador." + Justificativa* (placeholder "Explique por que o registro foi recusado") | "Cancelar" / "Recusar registro" (disabled s/ justificativa) |
| Recusa (massa) | "Recusar registros" | Justificativa* (aplica a todo o batch) | "Cancelar" / "Recusar registros" (disabled s/ justificativa) |
| Exclusão registro | "Excluir registro?" | Alert vermelho "Esta ação não pode ser desfeita." + "Você está excluindo o registro: **{conteúdo}**." | "Cancelar" / "Excluir" (vermelho) |
| Exclusão em massa | (vermelho) | Alert + "Você está excluindo **N registros**." | "Cancelar" / confirmar |
| Atenção (extração evidências) | "Atenção" (ícone warning amarelo) | "{N} de {M} registros no escopo não têm evidência anexada. Eles serão ignorados na extração." | "Cancelar" / "Continuar" |
| Provedor sem vínculo | confirmação destrutiva (pattern RN 56) | — | "Cancelar" / "Excluir"; toast "Provedor excluído" |
| Provedor com vínculo | informativo, ícone amarelo | "Provedor não pode ser excluído. Existem N registros vinculados." | "Entendi" (único) |
| Limite de créditos (Admin) | "Limite de créditos atingido" | "Todos os créditos disponíveis foram utilizados. Para continuar, entre em contato com o suporte ou aguarde a renovação." | "Contato" + X |
| Limite de créditos (Aluno) | "Limite de créditos atingido" | "Todos os créditos disponíveis foram utilizados." | "Fechar" + X |

## Campos e validações (form de registro — doc RN 39 + protótipo)

| Campo | Tipo | Obrigatório | Aluno | Admin | Observações |
|---|---|---|---|---|---|
| Pessoa | CreatableSelect (sem criação) | Sim (admin) | não aparece | editável (Líder: só liderados); disabled em admin-editar | placeholder "Selecione o colaborador" |
| Website | input url | Não | editável | editável | placeholder "http://website.com" — campo do protótipo |
| Comprovação de aprendizagem | upload múltiplo | Não (sim p/ IA) | editável | editável | ".pdf, .docx, .xlsx, .csv, .jpg, .jpeg, .png · 10 MB · 5 arquivos" (protótipo; Spike S7) |
| Provedor de aprendizagem | CreatableSelect (criação inline) | Sim | editável | editável | 6 padrão (Alura, Coursera, FGV, LinkedIn Learning, Udemy, USP) + "Criar {nome}" |
| Descrição do conteúdo | RichText | Não | editável | editável | placeholder "Descreva os assuntos abordados" |
| Tipo de experiência | Select single | Sim | editável | editável | 8 opções: Curso, Trilha, Workshop, Mentoria, Palestra, Evento, Aula, Outro |
| Categorias | MultiTagSelect criável | Não | editável | editável | 9 padrão: Liderança, Comunicação, Tecnologia, Gestão, Soft skills, Compliance, Idiomas, Saúde e bem-estar, Diversidade |
| Carga horária | input number | Sim | editável | editável | placeholder "Ex: 40" |
| Data de início | input date | Não | editável | editável | dd/mm/aaaa |
| Data de término | input date | Sim | editável | editável | — |
| Data de aprovação | input date | Não | — | editável | campo do protótipo |
| Data do certificado | input date | Não | editável | editável | — |
| Data de validade | input date | Não | editável | editável | certificados permanentes não têm |
| Nota | input number | Não | editável | editável | placeholder "Ex: 85", sufixo "%" |
| Valor do conteúdo | input moeda | Não | — | editável | placeholder "Informe o valor investido (ex: 1.500,00)" — protótipo |
| Anotações | RichText | Não | editável | editável | placeholder "Adicione suas anotações aqui" — protótipo |
| Provedor (form Provedores): Nome | input | Sim | — | admin | "Campo obrigatório" |
| Provedor: Website | input url | Não | — | admin | placeholder "https://..." |
| Provedor: Descrição | textarea | Não | — | admin | — |
| Provedor: Ativo | switch | — | — | admin | default ligado |
| Justificativa (recusa) | textarea | Sim | — | admin/líder | botão confirmação disabled enquanto vazia |

## Matrizes de permissão (núcleo da feature)

### Editar (RN 42)
| Perfil | Origem | Status | Editar? |
|---|---|---|---|
| Aluno | Externo | Pendente/Recusado/Expirado | Sim |
| Aluno | Externo | Emitido | Não |
| Aluno | Interno/Compartilhado | qualquer | Não |
| Admin/Líder | Externo | Emitido/Recusado/Expirado | Sim |
| Admin/Líder | Externo | Pendente | Não (Avaliar) |
| Admin/Líder | Externo | Substituído | Não |
| Admin/Líder | Interno/Compartilhado | qualquer | Não |

### Excluir (RN 55)
| Perfil | Origem | Status que permite |
|---|---|---|
| Aluno | Externo | Apenas Pendente |
| Aluno | Interno/Compartilhado | Nunca |
| Admin/Líder | Externo | Emitido, Recusado, Expirado |
| Admin/Líder | Externo Pendente / Substituído | Não |
| Admin/Líder | Interno/Compartilhado | Nunca |

### Visualizar (RN 47)
| Origem + Status | Comportamento |
|---|---|
| Interno (≠ Em andamento) | tela standalone nova aba `?cert=ID` |
| Compartilhado | tela standalone |
| Externo (≠ Em andamento) | form em modo viewing |
| qualquer + "Em andamento" | disabled + tooltip "Disponível após a conclusão" |

### Avaliar (RN 50): só Admin/Líder + Externo + Pendente (item primário). Líder: só liderados.
### Evidências (RN 60.1): só Externo. Histórico (RN 62): sempre.
### Ações em massa (RN 73): aprovar/recusar → Externo+Pendente; excluir → Externo+(Emitido|Recusado|Expirado).
### Compartilhado (RN 98): só Visualizar (standalone) + Histórico; sem evidências; API direta → 403.

## Trilhas do histórico (RN 61)
- Externo Emitido: criado → submetido → aprovado
- Externo Pendente: criado → submetido
- Externo Recusado: criado → submetido → recusado (descricao = justificativa)
- Externo Expirado: criado → submetido → aprovado → expirado
- Interno/Compartilhado: apenas criado
- Tipos/ícones: criado (FiPlusCircle azul), submetido (FiSend laranja), aprovado (FiCheckCircle verde), recusado (FiXCircle vermelho), expirado (FiClock cinza), substituido (FiRefreshCw cinza)

## Endpoints (referência — hipóteses do Spike S2/S5, padrão /learning_records)

| Método | URL | Sucesso | Erro |
|---|---|---|---|
| GET | `/learning_records` | 200 lista escopada por perfil | 401 |
| GET | `/learning_records/stats` | 200 contagens KPI | 401 |
| POST | `/learning_records` | 201 | 422 obrigatórios |
| PATCH | `/learning_records/:id` | 200 | 403 fora de escopo / 404 |
| POST | `/learning_records/:id/approve` | 200 | 403 / 404 "registro não encontrado" |
| POST | `/learning_records/:id/reject` | 200 (justificativa obrigatória) | 422 / 403 |
| DELETE | `/learning_records/:id` | 200 soft-delete | 403 |
| POST | `/learning_records/bulk_actions` | 200 ratio X/Y | 403 |
| POST | `/learning_records/export` | 202 assíncrono | 403 |
| CRUD | `/learning_providers` | 200/201 | 422 Nome obrigatório |
| POST | (IA autofill — Spike S9) | 200 {experience_type, categories} | 403 sem funcionalidade/crédito |

## Cores e tokens visuais (asserções de estilo quando aplicável)
- Emitido `#38A169` · Expirado `#F56565` · Pendente `#DD6B20` · Recusado `#718096` · donut vazio `#EDF2F7` · roxo Twygo `#7F27D8` · tab ativa `#9349DE`
- Banner recusado bg `#FED7D7`, ícone `#C53030` · banner aprovado bg `#C6F6D5`, ícone `#22543D` · banner avaliar bg `#FEF3C7`, texto `#92400E`
- Crédito IA: sparkle amarelo `#FFD000` com crédito; roxo `#7223c2` sem

## Spikes abertos que afetam testabilidade
- S1 expiração tempo real (RN 25/33) · S2 modelagem learning_records · S3 pessoas inativadas · S4 liderados diretos · S5 refresh KPI · S6 soft vs hard delete · S7 evidências (formatos/limites/storage) · S8 fila assíncrona extração · S9 IA generation_type · S10 vínculo provedor · S11 SharedEvent/Compartilhado

## Divergências protótipo vs Discovery
Ver `recon-prototipo.md` §7 (12 divergências catalogadas).
