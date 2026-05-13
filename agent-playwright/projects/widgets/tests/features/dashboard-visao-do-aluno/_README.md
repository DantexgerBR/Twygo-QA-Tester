# Dashboard - Visão do aluno

Todos os 8 TCs desta suite estão marcados com `test.fixme(true, '...')` porque
requerem:

1. **Credencial de perfil Aluno** no `config/environment.json` (env
   `staging-widgets`) — atualmente só existem credenciais admin/instrutor.
2. **Painel pré-configurado** vinculado ao Modo de uso Aluno com os 4
   widgets esperados (Resumo de atividades, Conteúdos em andamento,
   Ranking, Meus certificados) e dados de aprendizagem reais associados
   ao user aluno.

**Destinatário do bloqueio**: DevOps / QA Lead — adicionar:
- Env var `TWYGO_STAGING_WIDGETS_STUDENT_EMAIL` + `..._PASSWORD`
- Bloco no `environment.json`: `staging-widgets-student`
- Seed manual de painel "Painel Aluno" com 4 widgets (já existe? confirmar)

Quando o bloqueio for resolvido, remover o `test.fixme` de cada spec e
ajustar a configuração de login (provavelmente novo storageState
secundário pelo `globalSetup` similar a `staging-widgets-disabled`).
