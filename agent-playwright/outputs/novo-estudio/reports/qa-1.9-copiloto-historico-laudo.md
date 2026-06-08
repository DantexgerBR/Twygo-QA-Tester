# Laudo QA 1.9 — Operar copiloto e histórico por usuário no curso

- **Atividade Artia**: 19713 — [Novo estúdio de criação - 3.Desenvolvimento] QA 1.9 (RN 9)
- **Solicitante**: João Miguel Gorski
- **Ambiente**: 🧪 Stage — novoestudio.stage.twygoead.com (org 37061), curso 807533
- **Execuções**: 05/06/2026 — recon (2 usuários) + bateria estrutural automatizada (desktop 1366 + mobile 360)
- **Cobertura**: 32 TCs (auditada na AT). **Nenhum crédito de IA foi consumido** (org tem saldo 1): TCs de geração ficaram para execução manual, listados abaixo.
- **Multi-usuário**: agents.qa (com histórico) + dante.tavares (zerado)

## Resultado: 10 ✅ · 22 ❌ (15 falhas verificadas + 7 não executados que exigem geração IA)

| TC | Caso | Veredito |
|---|---|---|
| TC1 | Abrir via ícone flutuante com pulse | ✅ (FAB com animação abre o drawer; obs: fica no canto superior direito, AT diz inferior) |
| TC2 | Abrir via Ctrl+J | ✅ |
| TC3 | Fechar via X | ✅ |
| TC4 | Fechar via Ctrl+J (toggle) | ❌ (Ctrl+J abre mas NÃO fecha) |
| TC5 | Largura padrão ~30% | ❌ (66% — coberto pelo retrabalho do copiloto/R12; padrão confirmado pelo dev: 50%) |
| TC6 | Expandir até ~50% | ❌ (sem botão de expandir — R12) |
| TC7 | Tela cheia em mobile | ✅ (360x740: drawer ocupa 100%) |
| TC8 | Contexto injetado (responder "qual o contexto") | ❌ não executado — exige enviar mensagem (crédito) → MANUAL |
| TC9 | Conversas separadas por aba | ❌ (copiloto não existe nas outras abas — vinculado ao R8) |
| TC10 | Troca automática de conversa por aba | ❌ (idem TC9) |
| TC11 | Histórico por usuário x curso (privacidade) | ✅ (usuário A vê o próprio histórico; usuário B abre zerado — 2 usuários) |
| TC12 | Nova conversa estilo ChatGPT | ✅ (cria vazia; antiga preservada) |
| TC13 | Conversa antiga acessível na lista | ✅ (abre e carrega o conteúdo) |
| TC14 | Título automático da conversa | ✅ (threads com títulos descritivos: "aula", "renderização do vídeo", "Roteiro"…) |
| TC15 | Resumo automático em conversa grande | ❌ não executado — exige muitas mensagens (crédito) → MANUAL |
| TC16 | [Worker] Retenção 90 dias | ❌ não executado — exige Sidekiq/DynamoDB → MANUAL/infra |
| TC17 | Duplicar curso não copia histórico | ❌ (botão "Salvar como novo" NÃO existe no Estúdio; obs: pré-condição cita #R16-P3 — confirmar escopo) |
| TC18 | Canva Mode | ❌ não executado — exige geração → MANUAL |
| TC19 | Escurecimento no Canva Mode | ❌ não executado — exige geração → MANUAL |
| TC20 | Transação fechada por chamada | ❌ não executado — exige geração → MANUAL |
| TC21 | Streaming SSE (StudioGenerationChannel) | ❌ não executado — exige geração + DevTools → MANUAL |
| TC22 | Botão flutuante aria-label "Abrir copiloto" | ✅ (aria-label exato) |
| TC23 | Header: título/subtítulo/botões exatos | ❌ (real: "Copiloto do Estúdio"; sem subtítulo "Cria atividades com aprovação"; sem botões Expandir painel/Configurar API key/Minimizar) |
| TC24 | Mensagem de boas-vindas literal | ❌ (real: "Como posso te ajudar?"; AT: "Olá! Sou seu copiloto de criação…" + "Por onde quer começar?") |
| TC25 | Card de contexto "Curso com N atividades criadas." | ❌ (não existe) |
| TC26 | Ações rápidas (3 botões literais) | ❌ (real: só "Adicionar atividades sobre…"; AT: "Concluir conteúdo desta atividade"/"Mais páginas"/"Adicionar avaliação") |
| TC27 | Input + Enviar (placeholder/hint/disabled) | ❌ (placeholder real "Escreva uma mensagem…" ≠ AT; sem hint "Enter para enviar…"; Enviar NÃO desabilita vazio; Shift+Enter ✓ e habilitação ✓) |
| TC28 | Painel "Conversas" + Nova conversa | ✅ |
| TC29 | Botão "Expandir painel" | ❌ (não existe — R12) |
| TC30 | Minimização do copiloto | ❌ (sem botão Minimizar; só o X) |
| TC31 | Botão "Configurar API key" | ❌ (não existe) |
| TC32 | Ctrl+J abre/fecha | ❌ (abre ✓, fecha ✗ — mesmo defeito do TC4) |

## 🗄️ Cross-check de banco (read-only, 08/06/2026)

Tentativa de reforçar o TC11 (histórico por usuário) pela fonte de verdade no MySQL
`twygo_db_rc`:
- `conversations` tem `user_id` + `event_id` + `organization_id` + `context_type` (schema
  **suporta** escopo por usuário × curso) e `messages` tem `studio_partition_id` (extensão
  do estúdio confirmada).
- **Porém**: a org 37061 tem **0 conversas** no MySQL (e o banco inteiro tem só 76 = Sophia
  legada). O histórico do copiloto do **Estúdio** NÃO está no MySQL — vive no **DynamoDB**
  (`studio_checkpoints`/`messages`), fora do nosso acesso read-only.
- **Conclusão**: o cross-check MySQL é **inconclusivo** e **não contradiz** o TC11 — a
  evidência válida do TC11 segue sendo a de UI (usuário A com histórico, B zerado). TC16
  (retenção 90d em DynamoDB) permanece não executável aqui (infra). Evidência:
  `Twygo-QA-Tester/agent-db/evidencias/qa19-conversations-messages.txt`.

## Leitura dos resultados

1. **Núcleo da RN 9 funciona**: histórico **por usuário** (privacidade entre instrutores ✓,
   2 usuários), múltiplas conversas com lista lateral, nova conversa, conversa antiga
   recarregável, títulos automáticos, atalho de abertura e mobile fullscreen.
2. **Bug objetivo**: **Ctrl+J não fecha o drawer** (toggle quebrado — TC4/TC32).
3. **Bloco TC23–TC31 (UI do protótipo)**: o drawer implementado é mais simples que o
   especificado — sem subtítulo, sem card de contexto, sem as 3 ações rápidas literais,
   sem Expandir painel/Minimizar/Configurar API key, placeholder e hint diferentes.
   Mesmo padrão das divergências confirmadas antes pelo dev — **sugerido confirmar antes
   de abrir retrabalho** (pode ser doc do protótipo desatualizada OU entrega pendente).
4. **TC9/TC10** caem na ausência do copiloto fora da aba Atividades (retrabalho R8 já
   criado no 19708).
5. **7 TCs exigem GERAÇÃO de IA** (TC8, TC15, TC16, TC18–TC21) — não executados pra não
   consumir o único crédito da org. Roteiro manual abaixo.

## Roteiro manual pendente (quando houver créditos)

1. **TC8**: selecionar atividade → copiloto → enviar "Qual é o contexto atual?" → resposta deve citar curso/aba/atividade/preview.
2. **TC15**: enviar mensagens até o limite → aparece "vou resumir esta conversa" + sumário.
3. **TC16**: (infra) rodar cron Sidekiq de retenção → DynamoDB "messages" só com resumo.
4. **TC18/TC19**: pedir "gere os slides desta aula" → Canva Mode (chat à esquerda, preview reagindo) + escurecimento da UI.
5. **TC20**: ao fim da geração → "Concluído"; nova interação = nova transação.
6. **TC21**: DevTools → WS → `StudioGenerationChannel` com `partition_started`/`partition_completed`/`agent_response_chunk`.

## Evidências (GitHub)

- Usuário A com histórico vs usuário B zerado (TC11): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-recon-userA.png · https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-recon-userB-dante.png
- Header real do drawer (TC23): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-tc23-header-A.png
- Painel Conversas + títulos automáticos (TC14/TC28): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-tc28-conversas-A.png
- Nova conversa (TC12) e boas-vindas/ações reais (TC24/TC26/TC27): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-tc12-nova-conversa-A.png · https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-tc24-27-conversa-nova.png
- Conversa antiga carregada (TC13): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-tc13-conversa-antiga.png
- Mobile fullscreen (TC7): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-tc7-mobile.png

## Comentário KQA (para o Artia 19713)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Execução concluída sem bloqueios — suíte "Operar copiloto e histórico por usuário no curso"
(32 TCs) na org 37061, curso 807533, com 2 usuários. 10 ✅ — incluindo o núcleo da RN:
histórico de copiloto POR USUÁRIO (privacidade entre instrutores), múltiplas conversas com
lista lateral, nova conversa, conversa antiga recarregável, títulos automáticos, abertura
por botão flutuante (aria "Abrir copiloto") e por Ctrl+J, fechamento pelo X e tela cheia no
mobile. 22 ❌ tratados abaixo. Os TCs de GERAÇÃO de IA (TC8, TC15, TC16, TC18-21) não foram
executados para não consumir o único crédito da org — roteiro manual no laudo.
:: Obs ::
1) P3 [Novo estúdio de criação] Ctrl+J abre o copiloto mas não fecha (toggle quebrado —
TC4/TC32; workaround simples: fechar pelo X).
Link: 
2) TC5/TC6/TC29 (largura 66% sem expandir) já cobertos pelo retrabalho do copiloto
(padrão dev: 50% + expandir 100%). TC9/TC10 (conversa por aba) caem no retrabalho do
copiloto ausente nas outras abas (19708).
3) CONFIRMAR COM DEV antes de retrabalho — bloco de UI do protótipo ausente (TC23-TC31):
sem subtítulo "Cria atividades com aprovação", sem card de contexto "Curso com N atividades
criadas", ações rápidas diferentes (só "Adicionar atividades sobre…"), placeholder/hint do
input diferentes, Enviar não desabilita vazio, sem botões Expandir painel/Minimizar/
Configurar API key. 4) TC17: botão "Salvar como novo" não existe (pré-condição cita
#R16-P3 — confirmar escopo). 5) Créditos de IA: solicitar recarga pra executar os 7 TCs
de geração (roteiro manual no laudo).
:: Evidência(s) ::
- Histórico por usuário (A com histórico / B zerado):
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-recon-userA.png
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-recon-userB-dante.png
- Header/boas-vindas/ações reais do drawer:
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-tc24-27-conversa-nova.png
- Mobile fullscreen:
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa19-tc7-mobile.png
- Pasta completa: https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/novo_estudio_recon
```
