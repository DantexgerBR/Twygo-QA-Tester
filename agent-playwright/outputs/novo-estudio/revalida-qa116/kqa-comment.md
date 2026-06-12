# QA 1.16 (card 19720) — Duplicar curso a partir do Estúdio — REVALIDAÇÃO 12/06

> Veredito ajustado após alinhamento (12/06): execução CONCLUÍDA → card ✅;
> a ausência da funcionalidade vira RETRABALHO (descrição pronta abaixo),
> mesmo tratamento dado ao QA 1.18.

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Execução concluída em 12/06 (org 37061, curso 807533, re-varredura também à tarde): a suíte (12 TCs) parte do botão "Salvar como novo" no menu secundário do topo do Estúdio. A varredura completa de botões/links/menuitems retornou 0 ocorrências de "Salvar como novo", "Duplicar" ou do menu "Salvar como" — o topo tem só Voltar/Visualizar como aluno/Abrir copiloto + ações por atividade. A duplicação de curso a partir do Estúdio NÃO está implementada; os 12 TCs ficam documentados como bloqueados por funcionalidade ausente, e a ausência segue como retrabalho.
:: Obs ::
Conforme alinhamento de 12/06, o que não passou vira retrabalho — descrição pronta no card linkado abaixo. Nenhuma PR de duplicação no Estúdio existe no twyg-app até a data (a PR aberta 10683 "Clone completo de organização" é outra feature). No Discovery o item era P3 "se der tempo".
Link do retrabalho: <COLAR_LINK_DO_CARD_DE_RETRABALHO>
:: Evidência(s) ::
- 01-topo-estudio.png (topo do Estúdio sem menu de duplicação)
- recon.json (varredura de botões: matches = [])
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa116
```

---

## Retrabalho proposto (pronto pra abrir no Artia)

**Título**: P3 [Novo estúdio de criação] Duplicar curso pelo Estúdio ("Salvar como novo") não está implementado

**Descrição**:

    :: Incidente identificado ::
O Estúdio de Criação não oferece nenhum caminho para duplicar um curso. O botão "Salvar como novo" (previsto no menu secundário do topo, junto das demais ações de salvamento) não existe na interface — varredura completa por "Salvar como novo", "Duplicar" e pelo menu "Salvar como" retorna zero ocorrências. Sem esse gatilho, todo o fluxo de duplicação fica indisponível: criação da cópia em job assíncrono, novo curso com sufixo "(cópia)", cópia de atividades/assets/questionários/banner/certificado/modelo de marca, exclusão do que não deve ser copiado (histórico de chat do copiloto, inscrições, pagamentos, métricas) e redirect para o Estúdio do novo curso ao concluir.

    :: Passo a passo para reprodução ::
» Logar como administrador e abrir o Estúdio de um curso já criado (curso 807533, aba "Atividades").
» Procurar no topo do Estúdio o menu secundário com a ação "Salvar como novo" (ou qualquer ação de "Duplicar").
» Observar: não existe menu secundário nem ação de duplicação — o topo tem apenas "Voltar", "Visualizar como aluno", "Abrir copiloto" e as ações por atividade.

    :: Comportamento esperado ::
O topo do Estúdio deve oferecer a ação "Salvar como novo" (em cursos já criados; oculta em curso novo em branco), que dispara a duplicação integral do curso em job assíncrono: novo curso criado com sufixo "(cópia)", copiando atividades, assets, questionários, banner, certificado e modelo de marca; SEM copiar histórico de chat do copiloto, inscrições, pagamentos e métricas; redirecionando para o Estúdio do novo curso ao concluir, com comportamento consistente em caso de falha no meio (rollback ou estado consistente).

    :: Informações ::
url: https://novoestudio.stage.twygoead.com/o/37061/contents/807533/edit?tab=studio
login: agents.qa@claude.com
senha: 123456
org_id: 37061
Obs: no Discovery este item era prioridade P3 ("se der tempo") — confirmar com o PO se entra neste release ou fica para a v2. A PR 10683 ("Clone completo de organização"), aberta no twyg-app, é outra funcionalidade (clone de org inteira) e não cobre este caso.

    :: Evidência(s) ::
Topo do Estúdio em 12/06 sem o menu de duplicação + varredura de botões (matches vazios):
https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa116
