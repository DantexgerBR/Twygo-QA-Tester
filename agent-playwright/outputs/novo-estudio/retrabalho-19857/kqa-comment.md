# Retrabalho 19857 — P1 [Novo estúdio de criação] Scorm não funciona corretamente

PR validada: https://github.com/Twygo/twyg-app/pull/10670 "status e disparo de processamento de SCORM no Estúdio" (merged 2026-06-11)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533
Data da validação: 2026-06-12 (pacote SCORM 1.2 mínimo gerado pra teste: scorm-qa19857.zip)

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
E2E completo com pacote SCORM real: o NÚCLEO do bug está corrigido — upload ok, durante o processamento o preview mostra status amigável "O conteúdo ainda está em processamento" com botão Recarregar (não mais a tela de erro "página não existe"), após ~80s o preview do admin renderiza o SCORM, e na visão do aluno o pacote carrega e reproduz perfeitamente (inclusive a comunicação SCORM funcionou: o pacote reportou lesson_status=completed e a atividade ficou com check de concluída). O que reprova o card: o erro visual das extensões NÃO foi corrigido — o modal "Enviar arquivo" segue exibindo "Formato aceito: .zip, .zip." (duplicado), que é um dos dois comportamentos esperados explícitos do card.
:: Obs ::
A PR 10670 cobriu só o processamento/status do SCORM; o texto duplicado de extensões ficou de fora. Item restante é cosmético — sugiro rebote pequeno só para o ".zip .zip" (ou desmembrar em card P4), já que carregamento no preview e na visão do aluno estão validados e funcionais. A atividade SCORM criada para o teste foi excluída ao final.
:: Evidência(s) ::
- 01-modal-upload-extensoes.png (".zip, .zip." duplicado — pendente)
- 04-preview-admin.png (status "em processamento" no lugar da tela de erro)
- 06-preview-admin-pos-processamento.png (SCORM renderizado no preview do admin)
- 05-visao-aluno.png (aluno vê o SCORM carregado e atividade concluída)
- resultado.json + resultado-preview.json (medições e timeline do processamento)
- scorm-qa19857.zip (pacote SCORM 1.2 mínimo usado)
- validar-retrabalho-19857.mjs + probe-19857-preview.mjs (scripts)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19857
```
