# Card 19800 — [P1] Encoding nas mensagens do chat / Atividades gerando com roteiro aprovado

Validado em 11/06/2026 · Trial 37062 (novoestudiotrial.stage) · curso descartável 807902,
atividade Page 9295618 · PRs do fix mergeados em 04/06 (twygo-ai-knowledge-agent#373 +
twyg-app#10544).

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
E2E ao vivo em 11/06 (org 37062): criei curso + atividade Page e disparei a geração
de roteiro via copiloto. (1) ENCODING: varri todo o texto do chat e do card de
validação por escapes unicode crus (\uXXXX) e mojibake (Ã§/â€/ï¿½) — ZERO ocorrências;
acentuação perfeita em todas as mensagens (chat completo salvo em chat-completo.txt).
(2) APROVAÇÃO: a atividade NASCE com Roteiro PENDENTE (badge "3 pendentes" + popover
Roteiro/Conteúdo/Imagem pendentes — narrator_script não vem pré-preenchido) e, após a
geração concluir, o card "VALIDAÇÃO DO COPILOTO" fica AGUARDANDO decisão com os botões
Aprovar/Regerar/Rejeitar; nada é aplicado sem ação do usuário (atividade segue
"Bloqueada" na lista).
:: Obs ::
Cross-check de banco: task de roteiro `completed` em ai_generation_tasks permanece com
approved_by e applied_to_target_at NULOS (evidência da execução da manhã na mesma org —
qa18-ai-generation-tasks-37062-baseline-pre-exclusao-1106.txt); o db-check dedicado da
ec 9295618 ficou pendente por queda da VPN no momento da consulta (script
qa19800_db_check.py pronto pra rodar; não altera o veredito — o comportamento esperado
está comprovado na UI + no dado da manhã). Curso 807902 é descartável na Trial de QA.
:: Evidência(s) ::
- 01-popover-roteiro-pendente.png (atividade nasce com Roteiro pendente)
- 02-chat-pos-disparo.png / chat-completo.txt (encoding íntegro)
- 03-card-validacao.png (card aguardando Aprovar/Regerar/Rejeitar)
- 04-estado-final.png
Evidência no link: (preencher com commit)
```
