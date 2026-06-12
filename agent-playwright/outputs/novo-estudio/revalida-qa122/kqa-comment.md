# QA 1.22 (card 19726) — Repasse SEM a Feature Flag e impactos dos retrabalhos — 12/06

Execução justificada: o projeto acumulou muitos retrabalhos (R1–R11 + rodadas de 11–12/06) com PRs
tocando componentes COMPARTILHADOS (form de conteúdo, desktop-tabs, user_course_preferences,
processamento). Repasse feito na org SEM a flag `novo_estudio_criacao` (EDUAPI, org 36912).

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Fluxos principais da experiência CLÁSSICA validados na org sem a flag (36912), sem nenhuma regressão dos retrabalhos do Novo Estúdio: (1) login e listagem de Conteúdos ok; (2) criação de curso completa pelo fluxo clássico — form com as abas clássicas (Identificação…Compartilhar), SEM vazamento das abas "Modelo"/"Atividades" do Estúdio, preenchimento de Nome + Tipo de experiência + Descrição (CKEditor) e save criando o curso (807991); (3) edição do curso: abas clássicas íntegras, SEM ícone/atributo de drag nas abas (a PR 10676 de preferências de abas não vazou pra quem não tem a flag), navegação entre abas e re-save da Identificação ok; (4) SEM scroll horizontal em 1440x900 (scrollWidth = clientWidth — o estouro do desktop-tabs reportado no Estúdio não afeta orgs sem as abas extras); (5) zero erros HTTP 5xx nas jornadas percorridas.
:: Obs ::
Achados informativos (não-regressões): (a) o endpoint /api/v1/o/36912/beta_test/get_active_beta_test_notification responde 400 (inclusive com feature_name=estudio_de_criacao) — ruído pré-existente do host, sem efeito na UI; (b) o host eduapi tem CSP que bloqueia CDNs de terceiros (facebook/select2/recaptcha/cdn.ckeditor.com) — config do ambiente, o CKEditor carrega pelo fallback e o fluxo funciona. Não cobertos por automação (recomendo verificação manual de 1 clique): builder legado de "Atividades" via kebab e visão do aluno — o item "Atividades"/"Excluir" do kebab da listagem resiste a cliques headless (mesma limitação já registrada no curso 807659). ⚠ PENDÊNCIA MANUAL: excluir o curso de teste "QA122-repasse-1206-excluir" (id 807991) da org 36912 — a exclusão via kebab não respondeu à automação.
:: Evidência(s) ::
- 01-listagem.png · 02a-form-preenchido.png · 02-curso-criado.png (criação clássica completa)
- 03-edicao-abas-classicas.png (abas sem vazamento e sem drag) · 04-resave.png
- 05-kebab-menu.png (menu da listagem com as ações clássicas, incluindo Atividades/Duplicar/Excluir)
- resultado.json (tabs por tela, overflow, console/HTTP)
- revalidar-qa122.mjs + qa122-parte2.mjs + qa122-parte3.mjs (scripts)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa122
```
