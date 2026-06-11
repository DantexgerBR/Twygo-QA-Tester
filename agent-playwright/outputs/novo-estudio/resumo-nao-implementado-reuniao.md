# Novo Estúdio de Criação — o que ainda NÃO foi implementado (não é bug)

> Resumo para reunião · 11/06/2026 · base: QAs 1.1–1.18 executados (Dante)
> Projeto em desenvolvimento ativo — itens abaixo são **funcionalidades ausentes ou
> decisões pendentes**, confirmadas em teste; não são defeitos do que já foi entregue.

## Funcionalidades previstas que ainda não existem na entrega

1. **Publicação / renderização assíncrona da versão publicada (RN 12)** — o botão
   "Publicar alterações" não existe no topo do Estúdio; sem ele, todo o fluxo de
   publicar e renderizar de forma assíncrona é inexecutável (12 casos de teste
   bloqueados). No Discovery está como prioridade P2. O logging dessa publicação
   (visibilidade de erros) também não foi implementado.

2. **Duplicar curso a partir do Estúdio / "Salvar como novo" (RN 16)** — o menu
   secundário do topo, de onde sairia a duplicação, não existe (12 casos bloqueados).
   No Discovery está como P3 ("se der tempo"). Mesma ausência estrutural do item 1
   (o topo do Estúdio hoje só tem Voltar, Visualizar como aluno e copiloto).

3. **Abas persistidas do curso (RN 3)** — arrastar abas pra reordenar, ícone de
   arrastar no hover, persistência da ordem e restauração da última aba aberta:
   nada disso está na build testada.

4. **Section "Configurações de IA" na aba Identificação (RN 4)** — os campos de IA
   existem e funcionam, mas sem o agrupamento visual com título e tooltip previstos.

5. **Acabamento do copiloto previsto no protótipo (RN 9)** — confirmado com o dev
   que NÃO é bug, é parte não concluída: subtítulo do header, card de contexto do
   curso ("Curso com N atividades"), ações rápidas adicionais (Jeiel está
   finalizando — revalidar depois), botão de expandir painel e configuração de
   API key.

6. **Controles de layout do Estúdio (RN 2)** — recolher/ocultar o menu lateral e
   layout responsivo abaixo de 1366px (mobile/tablet) ainda não existem.

7. **Card "Curso" ainda abre o formulário antigo (RN 1)** — na página de criação
   por cards, clicar em Curso leva ao form legado de Identificação, não ao Estúdio
   (entrega parcial do fluxo previsto).

## Decisões de produto / alinhamentos pendentes (não é código faltando)

8. **Nomenclatura SCORM para o aluno** — em stand-by desde o CBTD (comitê achou
   "Scorm" ruim para o aluno); aguardando definição de produto.

9. **Exclusão do banco histórico (RN 18)** — testei o ciclo completo de exclusão de
   dados na Trial: o conteúdo do curso é apagado corretamente, mas o **log de
   gerações de IA (`ai_generation_tasks`) é retido** e fica órfão. Precisamos
   definir: é retenção intencional (auditoria/billing) ou deveria entrar na
   cascata? Além disso, o mecanismo de "exclusão de organização" citado no caso de
   teste não está disponível para QA, e 3 tabelas ficam em bancos sem acesso
   (DynamoDB/PostgreSQL).

10. **Feature flag do Estúdio** — o gate real NÃO é a flag `creation_studio` (está
    desligada e o Estúdio funciona mesmo assim). Falta o nome da flag correta para
    reescrever os testes de ativação/desativação e corrigir a documentação de teste.

## Observação

Vários pontos da Análise de Teste (AT) estão desatualizados em relação à
implementação (rotas, tabelas de banco, nomes de flag) — recomendo uma rodada de
reconciliação da AT com o time antes da próxima bateria de QA.
