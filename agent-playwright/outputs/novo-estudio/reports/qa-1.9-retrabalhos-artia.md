# Retrabalhos — QA 1.9 (Operar copiloto e histórico por usuário) — formato Artia

> Ambiente: 🧪 Stage org 37061, curso 807533. Card de execução PASSOU; falhas viram retrabalho.
> Agrupados por causa raiz; dupes referenciam cards existentes. Pasta de evidências:
> https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/novo_estudio_recon

---

## P3 [Novo estúdio de criação] Ctrl+J abre o copiloto mas não fecha (toggle quebrado) — cobre TC4, TC32

:: Incidente identificado ::
O atalho Ctrl+J abre o drawer do copiloto, mas não fecha (não funciona como toggle). Workaround simples: fechar pelo X.

:: Passo a passo para reprodução ::
» Abrir o Estúdio do curso 807533 como administrador
» Pressionar Ctrl+J → o copiloto abre
» Pressionar Ctrl+J de novo → esperado fechar; o drawer continua aberto

:: Comportamento esperado ::
Ctrl+J deve alternar (abrir e fechar) o drawer do copiloto.

---

## P3 [Novo estúdio de criação] UI do copiloto diverge do protótipo (header, boas-vindas, ações rápidas, input, sem Expandir/Minimizar/Configurar API key) — cobre TC23–TC27, TC30, TC31 — CONFIRMAR COM DEV

:: Incidente identificado ::
O drawer implementado é mais simples que o especificado: header "Copiloto do Estúdio" sem subtítulo "Cria atividades com aprovação"; boas-vindas "Como posso te ajudar?" (AT esperava outro texto); só a ação rápida "Adicionar atividades sobre…" (AT esperava 3 ações específicas); placeholder/hint do input diferentes e Enviar não desabilita com vazio; sem card de contexto "Curso com N atividades criadas."; sem botões Expandir painel / Minimizar / Configurar API key. Mesmo padrão de divergências que o dev já confirmou antes em outras RNs — pode ser doc do protótipo desatualizada OU entrega pendente.

:: Passo a passo para reprodução ::
» Abrir o copiloto no Estúdio do curso 807533
» Comparar header, mensagem de boas-vindas, ações rápidas, input e botões com a AT (TC23–TC31)

:: Comportamento esperado ::
Confirmar com o dev/produto qual é a fonte da verdade: se a UI atual é a correta, atualizar a AT; se o protótipo é o alvo, implementar os elementos faltantes.

---

## P3 [Novo estúdio de criação] Botão "Salvar como novo" não existe no Estúdio (TC17) — confirmar escopo

:: Incidente identificado ::
O TC17 (duplicar curso não copia histórico de chat) não pôde ser executado porque o botão "Salvar como novo" não existe no Estúdio. A pré-condição da AT cita #R16-P3 — confirmar se está no escopo desta entrega.

:: Passo a passo para reprodução ::
» Abrir o Estúdio do curso 807533
» Procurar o botão "Salvar como novo" → não existe

:: Comportamento esperado ::
Confirmar escopo com produto: se #R16-P3 faz parte desta entrega, o botão deve existir; senão, ajustar a AT (TC17 fora de escopo).

---

## Dupes — vincular a cards existentes (não abrir novo)

- **TC5, TC6, TC29** (largura ~66% sem botão Expandir): mesma causa do **retrabalho do copiloto / R12** (padrão dev: 50% + expandir 100%). Vincular.
- **TC9, TC10** (copiloto não existe fora da aba Atividades → conversas por aba): mesma causa do **R8 (card 19708)**. Vincular.

## Pendências de execução (NÃO são bug — bloqueio externo)

- **Créditos de IA** (a org tem saldo 1): TC8, TC15, TC18, TC19, TC20, TC21 não executados pra não consumir o crédito. Roteiro manual no laudo. → solicitar recarga e executar manual.
- **DynamoDB/worker**: TC16 (retenção 90 dias) exige Sidekiq cron + DynamoDB. → infra/manual.
