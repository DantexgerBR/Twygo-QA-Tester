# Card 20092 — Falha na geração de slides (Novo Estúdio) — findings

Ambiente: novoestudio.stage.twygoead.com · org 37061 · curso 807533
("Construindo times de alta performance") · login devtestes@teste.com
Data: 2026-07-03

## O que foi testado (caminho Copiloto)
1. Selecionada atividade Aula "Atividade do tipo aula" (id 9289484) — 4 pendentes.
   Popover: Roteiro=pronto; Slides/Imagem/Áudio/Vídeo=pendente. Cenário exato do card
   ("atividade com etapa de slides pendente").
2. Clique em "Slides — clique para gerar com o copiloto" → abriu Copiloto do Estúdio.
3. Copiloto conduziu o fluxo: escolha de modelo ("Aula expositiva") + base de
   conhecimento ("Gerar sem base de referência").
4. Copiloto respondeu: "Disparei a geração dos slides com o modelo 'Aula expositiva'!
   Em alguns instantes um card com o progresso vai aparecer aqui na conversa..."

## Resultado observado
- NENHUM card de progresso nem de aprovação apareceu na conversa (aguardado > 1,5 min,
  polling do generation_tasks).
- Atividade permaneceu "4 pendentes" (slides não gerado).
- Frontend NÃO exibiu nenhuma mensagem de erro — falha silenciosa.

## Fonte da verdade (backend generation_tasks)
GET /api/v1/o/37061/copilot/generation_tasks?scope_resource_id=807533 → 200

Breakdown de status (109 tasks): completed 41 · approved 16 · skipped 10 · **failed 42**

As 5 tasks MAIS RECENTES (created 2026-07-03T10:25:26-03:00 = meu disparo), kind=slides:
  status = **failed**
  error  = "No template_design records found in Pinecone for
            content_template_id=89 (organization_id=37061)."

Falhas antigas (2026-06-16) tinham erro DIFERENTE:
  "replacements must contain at least one placeholder"
→ indício de que o erro original mudou pós-fix, mas slides ainda falham.

## Rede (sem 4xx/5xx no front)
- POST /copilot/conversations/.../messages → 200 (dispatch aceito)
- GET  /contents/get_limit_token_ai_generation → 200 (créditos OK, não bloqueado)
- A falha é 100% no worker de geração (backend IA), reportada só via status "failed"
  do generation_task — nunca chega ao usuário.

## Breakdown definitivo (course 807533, 109 generation_tasks)
artifact_type | status:
- roteiro       | completed 41 · approved 16 · skipped 10   → FUNCIONA (sem dep. Pinecone)
- conteudo_pagina | failed 9                                 → nunca gerou
- slides        | **failed 33 · completed 0 · approved 0**    → NUNCA gerou

Slides — 33/33 falharam, TODAS com error_code **PINECONE_TEMPLATE_DESIGNS_EMPTY**:
- content_template_id=89 (Aula expositiva): 5 falhas (hoje, 2026-07-03)
- content_template_id=90:                   28 falhas (2026-06-16)
- 1ª tentativa 2026-06-16 · última 2026-07-03 → ~2,5 semanas sem 1 slide gerado.

→ NÃO é específico de template nem de caminho: dois templates (89 e 90) falham igual.
  É gap sistêmico de dado/config: Pinecone sem `template_design` para a org 37061.
  Roteiro gera porque não depende do Pinecone; slides e conteudo_pagina dependem e falham.

## Diagnóstico
Bug REPRODUZIDO. Geração de slides não finaliza e o card de aprovação não aparece —
sintoma idêntico ao card 20092. Causa raiz (fonte da verdade = generation_tasks do
backend twygo-ai-knowledge-agent): worker de slides aborta com
`PINECONE_TEMPLATE_DESIGNS_EMPTY` porque não há `template_design` no Pinecone para os
content templates da org 37061. Frontend engole a falha (nenhum card de progresso, erro
ou aprovação). Nota: falhas de 2026-06-16 tinham erro diferente ("replacements must
contain at least one placeholder") — o erro mudou pós-fix, mas slides continuam sem gerar.

Veredito: ❌ FALHOU.

## Caminho do botão "Concluir geração com IA" (2ª via do card) — também falha
- Botão abre modal "Gerar 4 artefatos de 1 atividades automaticamente? O conteúdo
  será aceito sem revisão." → Confirmar.
- Resultado: 5 novas tasks slides criadas 2026-07-03T10:37:00, TODAS failed /
  PINECONE_TEMPLATE_DESIGNS_EMPTY (total 109→114). Atividade seguiu "4 pendentes",
  conteúdo bloqueado, nenhum card.
- Ou seja: os DOIS caminhos do card (Copiloto + botão) reproduzem a falha identicamente.

## Duas leituras possíveis (a confirmar com Dante / requisitante antes de fechar)
1. "Bug 20092 não corrigido" — reabre o card.
2. "Bug original corrigido, novo bloqueador surgiu" — o erro mudou de
   'replacements must contain at least one placeholder' (16/06) para
   'PINECONE_TEMPLATE_DESIGNS_EMPTY' (03/07), org-scoped → indica gap de
   provisionamento de dado (template_design no Pinecone p/ org 37061), não
   necessariamente regressão no código dos PRs. Spawna ticket novo.

Achado atribuível independente da causa Pinecone (frontend, twyg-app #10944):
falha silenciosa — Copiloto promete "um card com o progresso vai aparecer" e NADA
aparece (nem progresso, nem erro, nem aprovação). É literalmente a queixa do 20092.
