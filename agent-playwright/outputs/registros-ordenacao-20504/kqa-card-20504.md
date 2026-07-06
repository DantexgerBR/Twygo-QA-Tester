# Revalidação — Card Artia 20504 (P2) — ordenação incorreta em colunas numéricas e de data (Registros)

**Origem**: `agent-playwright/scripts-adhoc/ordenacao-registros-20504.mjs`,
`interromper-beta-20504.mjs`, `pos-beta-explorar-e-ordenar-20504.mjs`
(monorepo `twygo-agents-qa`, branch `project/registros-sort-revalidacao`).
**PR a validar**: [twyg-app#10991](https://github.com/Twygo/twyg-app/pull/10991).
**Evidência original do bug**: [jam.dev/c/982369c3-e554-4acf-b0dd-b4cecce21b3a](https://jam.dev/c/982369c3-e554-4acf-b0dd-b4cecce21b3a) (gravado 03/07/2026 por Richard Sebold, URL `/o/37079/records?tab=records-tab`).

## Rodada 1 (sem ação stateful) — recapitulação

Validação anterior (ver histórico do arquivo/commits `13fb580`..`eda78bd`) confirmou
que a listagem de Registros em modo BETA mostra apenas 8 colunas (Pessoa,
Conteúdo, Origem, Criado por, Provedor, Situação, Certificado, Carga horária),
sem as colunas do card (Valor do conteúdo, Progresso, Desempenho, 5 colunas de
data). A única coluna numérica testável, **Carga horária**, ordenou
corretamente (matemático, não lexicográfico) em asc e desc.

## Rodada 2 (AUTORIZADA pelo Dante) — "Interromper BETA teste"

**Hipótese testada**: interromper o BETA teste revelaria a listagem ANTIGA de
Registros, com todas as colunas do card, permitindo validar a ordenação nelas.

### (a) Interromper BETA: modal ou direto? Reversível?

**Não foi um simples confirmar/cancelar.** O clique em
`#beta-testing-end-beta-test-button` abriu uma **pesquisa de satisfação NPS
obrigatória** (5 perguntas com `*`), intitulada "Antes de **cancelar** o BETA
teste, conta pra gente como foi sua experiência". O modal não avisa se a ação
é reversível. Preenchemos os campos deixando explícito que era ação de QA
(não feedback real de usuário) e enviamos — resultado: "Pesquisa enviada com
sucesso! Obrigado pelo seu feedback."

**Reversibilidade: NÃO conseguimos reverter.** Ver seção (e).

### (b) Headers pós-interrupção — as colunas do card apareceram?

**NÃO.** E o acesso à funcionalidade parou de funcionar para o usuário
testado (escopo: apenas 1 credencial — `devtestes@teste.com` — ver nota de
escopo abaixo):

- **Detalhe temporal importante**: imediatamente após enviar a pesquisa e
  fechar o modal, **na mesma sessão/aba**, a listagem de Registros **ainda
  funcionou normalmente** — `13-listagem-pos-interromper.png` mostra banner e
  badge BETA já removidos, mas a tabela com as mesmas 8 colunas carregando
  normalmente (headers extraídos com sucesso). O bloqueio só apareceu em
  verificações **seguintes**, em sessões de login novas. Isso sugere que a
  mudança de permissão levou um instante para propagar no backend — reforça
  a leitura de "downgrade de acesso pós-opt-out" em vez de um crash
  imediato.
- Nessas sessões novas (mesmo usuário, login do zero): o item "Registros"
  **desapareceu do menu lateral** (confirmado via dump de todos os links do
  sidebar — antes existia sob "Aprendizagem" junto com Conteúdos,
  Compartilhamentos, Certificados, Base de conhecimento; agora não existe em
  lugar nenhum). Acesso direto via URL (`/o/37079/records` e
  `/o/37079/records?tab=records-tab`) retorna **HTTP 200** mas renderiza a
  página de erro **"Você não tem permissão para acessar esta página."** —
  reproduzido em 3 verificações independentes.
- **Escopo da observação**: testado com **1 único usuário/credencial**. Não
  confirmamos com uma 2ª conta se o bloqueio é por organização inteira (mais
  provável, já que enrollment de BETA no Twygo costuma ser por org) ou algo
  mais restrito à sessão/usuário testado — isso fica como inferência, não
  fato confirmado.
- Antes de interromper, a tela mostrava 82 certificados emitidos, 61
  registros aguardando confirmação, 27 recusados, 230 inscrições — não há
  evidência de que esse dado tenha sido **apagado**, apenas que a **tela**
  que os exibia ficou bloqueada para o usuário testado. É perda de
  **acesso/rota** observada, não confirmação de perda de **dado**.

### (c) Resultado por coluna e direção

**Nenhuma ordenação pôde ser exercitada nesta rodada** — a listagem ficou
bloqueada imediatamente após a ação autorizada, antes de qualquer teste de
ordenação pós-interrupção. As colunas do card (Valor do conteúdo, Progresso,
Desempenho, Data de início/término/aprovação/certificado/validade) **nunca
apareceram em nenhum momento da validação** (nem antes, nem depois de
interromper o BETA).

A coluna "Carga horária" (única numérica presente na listagem em modo BETA)
já tinha sido validada como correta (asc/desc, matemática) na Rodada 1,
**antes** desta ação stateful — não foi repetida aqui porque a tela ficou
bloqueada logo após a ação.

**Crux para o dev, mais importante que a reversibilidade do BETA**: mesmo
**com o BETA ligado** (Rodada 1), a listagem só tinha 8 colunas — nenhuma
delas do card. Ou seja, em **nenhum dos dois estados** que conseguimos
alcançar neste stage (BETA ligado ou opt-out) as colunas do card existiram.
Isso levanta a pergunta real que bloqueia a validação: **o PR 10991 está
de fato implantado neste stage? E em qual tela/rota as colunas Valor do
conteúdo/Progresso/Desempenho/datas deveriam aparecer?** Sem responder
isso, simplesmente restaurar o acesso ao BETA e tentar de novo **não vai
destravar a validação** — só devolve exatamente o estado de 8 colunas já
testado na Rodada 1.

### (d) Veredito

**❌ Falhou — BLOQUEIO, não resultado de ordenação.**

Não foi possível validar a correção de ordenação do card 20504 (PR 10991).
A hipótese de que interromper o BETA revelaria a listagem antiga com as
colunas do card foi **refutada**: em vez disso, o acesso à funcionalidade
Registros parou de funcionar para o usuário testado.

Isso **não comprova nem refuta** o bug de ordenação do card 20504 nas
colunas Valor do conteúdo/Progresso/Desempenho/datas — elas nunca puderam
ser exercitadas, em nenhum momento da validação.

**Sobre a perda de acesso ao optar por saída do BETA (achado secundário)**:
não sabemos se é esperado ou não — é genuinamente incerto. Por um lado, "a
org perde o módulo até reingressar" é um padrão comum de programa BETA. Por
outro, o vídeo original do bug (03/07/2026) mostra essas colunas existindo
em algum momento para o mesmo dataset, o que não permite descartar que
devesse haver um caminho de "downgrade" (perder benefícios do BETA sem
perder o módulo inteiro). Pedimos ao dev para **confirmar** qual dos dois é
o comportamento correto — não estamos afirmando bug aqui, é um ponto
secundário frente ao crux acima.

**Anti-falso-positivo aplicado**: não afirmamos "dado destruído/perdido" —
só a tela/rota ficou inacessível para o usuário testado; os contadores (82
certificados, 61 pendentes, etc.) foram vistos na última tela antes da
ação, não confirmados como perdidos no backend. Também não generalizamos
para "toda a organização perdeu acesso" — testamos com 1 única credencial;
é provável que seja org-wide (enrollment de BETA costuma ser por
organização), mas isso é inferência, não fato confirmado com 2º usuário.

### (e) Tentativas de reverter

| Tentativa | Resultado |
|---|---|
| Badge/opção de reativar BETA no próprio menu Registros | Impossível — item não existe mais no menu |
| Dropdown do perfil (topo direito, "Administrador") — procurar "Novidades"/"Beta" | Não encontrado |
| Configurações > Organização e demais itens (Navegação, Integrações, Piloto automático, Regras do Jogo, Comunicação, Cobrança de inscrição, Plano e assinatura, Segurança, Controle de IA, Aparência) | Nenhuma opção de re-habilitar Registros/BETA. A aba "Registros de alterações" em Organização é só audit log de config, sem relação |
| Acesso Super Admin (`/admin`) com `devtestes@teste.com` | HTTP 404 — conta não tem acesso Super Admin; sem via Flipper/contrato disponível nesta validação |

**Conclusão de reversibilidade**: **não é autorreparável** pelo perfil
Administrador da org (não há botão/rota de re-opt-in visível para esse
perfil) — mas **não é irreversível**: a rota provável de restauração é via
Super Admin (Flipper actor `Organization;37079` ou configuração de
contrato — ver skills `testar-feature-flag-twygo` /
`alterar-funcionalidade-contrato-twygo` do `agent-playwright`), que está
**fora do escopo de acesso desta validação**.

**Atenção — restaurar o BETA NÃO destrava a validação por si só** (ver
crux em (c)): com o BETA ligado a listagem já tinha só 8 colunas, sem
nenhuma do card. Recomenda-se, em ordem: (1) confirmar com o dev/produto
**onde** as colunas do card deveriam aparecer neste stage (o PR 10991 está
implantado aqui? há outra rota/modo?) — essa é a pergunta que efetivamente
destrava a revalidação; (2) separadamente, confirmar se a perda de acesso
ao optar por saída do BETA é esperada; (3) só then, se fizer sentido,
restaurar o acesso via Super Admin para uma nova tentativa.

## Comentário KQA (pronto pra colar no Artia)

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage (registrosf2.stage.twygoead.com, org 37079)
:: Validação ::
Não foi possível validar a correção de ordenação do card 20504 (PR 10991).
Ação autorizada: cliquei em "Interromper BETA teste"
(#beta-testing-end-beta-test-button) na listagem de Registros, testando a
hipótese de que isso revelaria a listagem antiga com as colunas do card
(Valor do conteúdo, Progresso, Desempenho, datas). A ação abriu uma
pesquisa de satisfação NPS obrigatória (não um simples confirmar/cancelar)
— preenchida e enviada. Resultado: a hipótese foi refutada — as colunas do
card nunca apareceram (nem antes, nem depois). Em vez disso, o acesso à
listagem de Registros parou de funcionar para o usuário testado
(devtestes@teste.com): o item some do menu lateral e /o/37079/records passa
a retornar "Você não tem permissão para acessar esta página" (HTTP 200),
reproduzido em 3 sessões novas. Nenhuma ordenação pôde ser exercitada.
:: Obs ::
Isso NÃO comprova nem refuta o bug de ordenação nas colunas do card — elas
nunca puderam ser exercitadas (bloqueio, não resultado de sort). A coluna
"Carga horária" (única numérica presente em modo BETA) ordenou correto —
MAS isso NÃO valida a correção do PR 10991: o campo "workload" já estava
mapeado ANTES deste PR. O PR adiciona o mapeamento de content_value,
progress_score, final_score (Desempenho) e as 5 datas — exatamente as
colunas que não conseguimos exercitar.
Análise do PR 10991 (estado: MERGED, base feature/registros-externos): a
ordenação da grid é BACKEND (header → order_by na API →
RecordRepository#apply_ordering; o react-table fica inerte). O fix mapeia
cada campo do card para a coluna SQL real e o dev validou via rails runner
(ex.: content_value ASC → 2,2,7,7,10,10,70,300,999...). Como o sort é
backend por order_by, a validação definitiva NÃO depende de a coluna estar
visível na grid: basta chamar o endpoint de registros com
order_by=content_value (e os demais campos) + order_direction e conferir a
ordem da resposta, com registros de valores variados. Esse é o caminho que
destrava a revalidação de verdade.
CRUX pro dev: em nenhum dos 2 estados alcançados neste stage (BETA ligado
ou opt-out) as colunas do card aparecem na grid — logo, pela UI não há
header pra disparar o sort dessas colunas. Provável que o redesenho BETA
"Registros de avaliação" tenha removido essas colunas da listagem (o vídeo
de 03/07, pré/BETA, mostra elas presentes). Preciso confirmar: (1) essas
colunas devem voltar à grid, ou a revalidação deve ser via API (order_by)?
(2) o PR está implantado neste stage registrosf2?
Achado secundário (incerto, não é alegação de bug): a perda de acesso ao
optar por saída do BETA pode ser esperada (padrão comum de programa BETA)
ou não (o vídeo original mostra as colunas existindo em algum momento
para o mesmo dataset) — peço confirmação do dev.
Escopo: testei com 1 única credencial/perfil Administrador; não confirmei
com 2º usuário se o bloqueio de acesso é por organização inteira (mais
provável, enrollment de BETA costuma ser por org) ou mais restrito — fica
como inferência. Não há evidência de perda de DADO (certificados,
registros) — só de perda de ACESSO à tela/rota para o usuário testado.
Tentei reverter por múltiplos caminhos (menu Registros, dropdown de
perfil, todas as páginas de Configurações, acesso Super Admin) e não
consegui — a conta de teste não tem acesso Super Admin (/admin retorna
404). NÃO é irreversível, mas não é autorreparável por esse perfil: a
restauração provável é via Super Admin (Flipper actor
"Organization;37079" ou contrato) — e mesmo restaurando, isso só volta ao
estado de 8 colunas, não resolve o crux acima.
:: Evidência(s) ::
- 12-antes-interromper-beta.png (estado BETA antes da ação)
- 12c-modal-confirmacao.png (pesquisa NPS obrigatória, não simples confirm)
- 12c2-modal-preenchido.png (campos preenchidos para QA)
- 12d-apos-confirmar-interromper.png ("Pesquisa enviada com sucesso!")
- 13-listagem-pos-interromper.png (mesma sessão, imediatamente após: banner/badge BETA já removidos, listagem AINDA funcionando, colunas do card ainda ausentes)
- diag-01.png / diag-05-records-sem-query.png (bloqueio "Você não tem permissão" em sessões novas subsequentes)
- diag-02-menu.png (dashboard, badges BETA restantes em Skills/Planos e Metas)
- sidebar dump (via script) confirmando ausência do item "Registros" no menu em sessão nova
- diag-06-admin-access.png (HTTP 404 em /admin — sem Super Admin)
- diag-07-dropdown-admin.png / diag-08-config-organizacao.png (nenhuma opção de reverter encontrada)
- resultado-interromper-beta.json / resultado-pos-beta.json (dados consolidados)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/commit/240275e362344f7c74441c479505a23013a92e65
```
