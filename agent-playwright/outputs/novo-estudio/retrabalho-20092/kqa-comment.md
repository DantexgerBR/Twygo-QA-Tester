⇝ QA ⇜
:: Teste ::
❌ Falhou

:: Ambiente ::
🧪 Stage — novoestudio.stage.twygoead.com · org 37061 · curso 807533 · login devtestes@teste.com

:: Validação ::
Reproduzi o passo a passo em 03/07 na atividade "Aula" (roteiro já pronto, slides pendente),
pelos DOIS caminhos do card. Em nenhum a geração de slides finaliza e o card de
aprovação/regeneração não aparece — o bug persiste, não foi corrigido.

• Copiloto: pedi "Gere Slides", escolhi modelo (Aula expositiva) e "sem base de referência".
  O Copiloto respondeu "Disparei a geração dos slides... um card com o progresso vai aparecer
  aqui na conversa" — mas nenhum card (progresso, erro ou aprovação) apareceu. Atividade
  seguiu "4 pendentes".
• Botão "Concluir geração com IA": modal "Gerar 4 artefatos automaticamente" → Concluir.
  Mesmo resultado: sem card, atividade seguiu "4 pendentes", conteúdo bloqueado.

:: Obs ::
Causa raiz (fonte da verdade = generation_tasks do backend twygo-ai-knowledge-agent):
TODAS as gerações de slides do curso falham (33 histórico + 10 disparadas por mim hoje,
0 concluídas) com error_code "PINECONE_TEMPLATE_DESIGNS_EMPTY":
  "No template_design records found in Pinecone for content_template_id=89 (organization_id=37061)."
Afeta os templates 89 e 90 → não é específico de um template nem de um caminho. Roteiro
gera normalmente (não depende do Pinecone); slides e conteúdo de página nunca geram.
Créditos de IA OK (get_limit_token_ai_generation → 200) — não é bloqueio de saldo.
Frontend engole a falha: o worker aborta mas a UI não exibe nenhum aviso ao usuário, o que
mantém exatamente o sintoma reportado ("a interface não renderiza o card de controle").
→ Reabrir o 20092: geração de slides + card de aprovação ainda não funcionam nesta org.

:: Evidência(s) ::
- 20092-03-popover-pendentes-slides.png (roteiro pronto / slides pendente)
- 20092-06-copiloto-pos-base.png ("Disparei a geração dos slides...")
- 20092-08-poll1.png (sem card após aguardar / Copiloto)
- 20092-09-botao-concluir-clicado.png (modal do botão "Concluir geração com IA")
- 20092-10-botao-pos-30s-sem-card.png (sem card / atividade segue 4 pendentes)
- findings.md (breakdown completo dos generation_tasks + erros do backend)
Evidência no link: <preencher após push>
