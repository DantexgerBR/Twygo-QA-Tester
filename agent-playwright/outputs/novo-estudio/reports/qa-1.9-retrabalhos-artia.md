# Retrabalhos — QA 1.9 (Operar copiloto e histórico por usuário) — formato Artia

> Ambiente: 🧪 Stage org 37061, curso 807533. Card de execução PASSOU; falhas viram retrabalho.
> Cobertura auditada: 22 ❌ do laudo, todos mapeados.
> ⚠️ CONTEXTO (dev Alexandre, 08/06): o Novo Estúdio **ainda não foi concluído** — vários pontos
> que surgem **não são bug, são partes ainda não implementadas**. Alinhar com Adri/João (via Edu)
> antes de tratar divergência como defeito. Por isso o bloco TC23–31 foi reclassificado (não é bug).
> Evidências: https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/novo_estudio_recon

---

## P3 [Novo estúdio de criação] Ctrl+J abre o copiloto mas não fecha (toggle quebrado)

Cobre: TC4, TC32

:: Incidente identificado ::
O atalho Ctrl+J abre o drawer do copiloto, mas não fecha — não funciona como toggle. Workaround simples: fechar pelo X.

:: Passo a passo para reprodução ::
» Abrir o Estúdio do curso 807533 como administrador
» Pressionar Ctrl+J → o copiloto abre
» Pressionar Ctrl+J novamente → esperado fechar; o drawer permanece aberto

:: Comportamento esperado ::
Ctrl+J deve alternar (abrir e fechar) o drawer do copiloto.

:: Evidência(s) ::
- Pasta de recon: https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/novo_estudio_recon

---

## ~~TC23–TC31 — UI do copiloto diverge do protótipo~~ → NÃO É BUG (confirmado pelo dev)

Cobre: TC23, TC24, TC25, TC26, TC27, TC30, TC31 — **SEM retrabalho**

**Confirmado pelo dev (Alexandre Kumagae, 08/06):** está OK do jeito que está — não era pra
ficar 100% igual ao protótipo; várias coisas eram só ilustrativas. O projeto ainda não foi
concluído, então esses pontos **não são bug** — são partes ainda não implementadas / decisões
de design. Atualizar a AT pra refletir a UI real.

**Acompanhamento (não é bug, é follow-up):** depois que o Jeiel finalizar a implementação,
revalidar as **ações rápidas** (TC26) — hoje só existe "Adicionar atividades sobre…"; se
permanecer só essa após a entrega, aí sim estaria errado. Alinhar com Adri/João (via Edu).

---

## P3 [Novo estúdio de criação] Botão "Salvar como novo" não existe no Estúdio

Cobre: TC17 — CONFIRMAR ESCOPO (#R16-P3)

:: Incidente identificado ::
O TC17 (duplicar curso não copia histórico de chat) não pôde ser executado porque o botão "Salvar como novo" não existe no Estúdio. A pré-condição da AT cita #R16-P3.

:: Passo a passo para reprodução ::
» Abrir o Estúdio do curso 807533
» Procurar o botão "Salvar como novo" → não existe

:: Comportamento esperado ::
Confirmar escopo com produto: se #R16-P3 faz parte desta entrega, o botão deve existir; senão, ajustar a AT (TC17 fora de escopo).

---

## P3 [Novo estúdio de criação] Pendência de execução — TCs de geração de IA não testados (org sem crédito)

Cobre: TC8, TC15, TC18, TC19, TC20, TC21 — NÃO é bug; bloqueio de execução (falta crédito de IA)

:: Incidente identificado ::
6 TCs dependem de gerar conteúdo com IA (contexto injetado, sumarização de conversa, Canva Mode, escurecimento, transação por chamada, streaming SSE). A org 37061 tem saldo 1 de crédito — não foram executados para não consumir o único crédito. Não é defeito de produto.

:: Passo a passo para reprodução ::
» Verificar saldo de créditos de IA da org 37061 (= 1)
» Tentar executar qualquer TC que exija geração → consumiria o saldo

:: Comportamento esperado ::
Recarregar créditos de IA na org de teste e executar os 6 TCs manualmente (roteiro no laudo QA 1.9). Destinatário: PO/QA (provisão de créditos).

---

## P3 [Novo estúdio de criação] Pendência de execução — retenção de 90 dias depende de DynamoDB + worker

Cobre: TC16 — NÃO é bug; exige infra (DynamoDB + Sidekiq)

:: Incidente identificado ::
O TC16 (retenção/sumarização após 90 dias) exige disparar o cron Sidekiq de retenção e inspecionar a tabela DynamoDB "messages" — fora do acesso atual (read-only MySQL).

:: Passo a passo para reprodução ::
» Preparar conversa com last_message_at > 90 dias
» Disparar o worker de retenção e consultar o DynamoDB "messages"

:: Comportamento esperado ::
Após o worker, mensagens individuais descartadas e mantida só a mensagem-resumo. Validar via acesso ao DynamoDB/infra. Destinatário: infra/dev.

---

## Dupes — vincular a cards existentes (NÃO abrir novo)

- **TC5, TC6, TC29** (largura ~66% sem botão Expandir): mesma causa do **retrabalho do copiloto / R12** (padrão dev: 50% + expandir 100%). Vincular.
- **TC9, TC10** (copiloto não existe fora da aba Atividades → conversa por aba): mesma causa do **R8 (card 19708)**. Vincular.
