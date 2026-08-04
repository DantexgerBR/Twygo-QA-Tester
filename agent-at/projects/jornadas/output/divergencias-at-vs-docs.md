---
projeto: jornadas
gerado_em: 2026-08-03
fonte_de_verdade: docs/especificacao.docx, docs/discovery.md, docs/regras.txt
---

# Divergências AT × Docs e pendências de caracterização — Jornadas

Registro do que a **Análise de Teste divergiu da especificação** e do que **o produto faz diferente do
que a AT esperava**, tudo medido no stage (org 36675) em 03/08/2026 durante a automação das suítes.

Serve a dois leitores:

1. **Quem revisa/gera AT deste projeto** — as linhas abaixo já estão corrigidas no `test-analysis.md`,
   mas aqui fica o porquê, com citação do documento.
2. **Quem melhora o gerador de AT** — a seção *Regras para a próxima AT* generaliza os erros em
   instruções, para não se repetirem em outro módulo.

---

## A. A AT contradisse a especificação

Erro de leitura do documento. A AT precisava ser corrigida, o produto estava certo (ou o defeito é outro).

| Onde | A AT dizia | A especificação diz | Situação |
|---|---|---|---|
| TC9 — recálculo de duração | "corresponde ao **maior período** configurado nas tarefas" | §4.1.2: "calculado automaticamente **somando os períodos** das tarefas configuradas no cronograma" | AT corrigida. Com uma tarefa só os dois números coincidem — foi assim que passou sem ser notado. O teste passou a usar duas tarefas (5 e 3) para distinguir soma de máximo |

> **Como isso passou:** o caso de teste usava um único exemplo, e o exemplo não discriminava as duas
> regras. Matriz com um caso só não valida a regra, valida o exemplo.

---

## B. O produto faz diferente do que a AT esperava

A AT descrevia comportamento que o produto não tem. Nenhum destes é defeito — é expectativa mal
formada. Os quatro primeiros compartilham a mesma raiz — semântica de validação; os três
últimos são literais de interface presumidos em vez de observados.

| Onde | A AT esperava | Medido no stage |
|---|---|---|
| TC8 — Duração (Identificação) | `0` e `abc` → estado de validação inválida | Campo **sanitiza**: vira `1`. Nunca recebe `aria-invalid` |
| TC27 — Dia de início (fase) | `0` → inválido **e "Salvar" desabilitado** | **Sanitiza** para `1`; "Salvar" permanece **habilitado** |
| TC30 — Progresso (tarefa) | `0` → inválido | **Sanitiza** para `1` |
| TC8 — Nome da jornada | "Salvar" permanece **desabilitado** com nome vazio | "Salvar" fica **habilitado**; o clique bloqueia o envio e exibe `O nome da jornada é obrigatório` |
| TC4 — coluna da listagem | "Progresso médio" | Coluna real é **"Progresso"** |
| TC5 — campo de busca | campo "Buscar" | Placeholder real é **"Pesquise pelo nome da jornada"** (`#play-interest-search`, componente compartilhado com o Play). Procurar por "Buscar" dá timeout |
| TC4 — extração | "Extração oferece CSV e PDF" | **Nenhum botão "Extrair dados"** na listagem (0 ocorrências). Confirmar se entra nesta fase |

**O padrão, confirmado em três campos independentes:** campo numérico da Twygo **sanitiza a entrada em
vez de invalidar**, e o botão **"Salvar" nunca é desabilitado** — a validação acontece **no submit**, com
mensagem no formulário (`.chakra-form__error-message`).


---

## C. Cenários impossíveis na UI

A AT pedia um estado que o produto não permite alcançar.

| Onde | Cenário | Por que é impossível |
|---|---|---|
| TC8 | "Situação vazia", "Visibilidade vazia", "Unidade vazia" | Os três controles são `<select>` **nativos** que abrem com opção pré-selecionada (`Em desenvolvimento`, `Inscritos`, `Dias`). Não existe estado vazio pela interface |

Removidos da matriz. A matriz negativa tinha sido escrita como se fossem campos de texto.

---

## D. Fora de escopo da Fase 1

Não são defeitos nem erros de AT — são funcionalidades que não entram nesta entrega. Decisão do time em
03/08/2026.

| Onde | Situação |
|---|---|
| Suíte "Ações automáticas" (RN 3.4) | Aba `tab-automatic_actions` permanentemente `disabled`. **Fase 2** |
| Aba "Aprendizagem" do formulário | Aba `tab-learning` permanentemente `disabled`. **Fase 2**. Atenção: o **tipo de tarefa** "Aprendizagem" funciona no formulário de tarefa — são coisas diferentes |

Testado em cinco estados (jornada nova, com tarefa Manual, com tarefa Aprendizagem, com tarefa Mensagem,
após reload): as duas abas nunca habilitam. Não abrir retrabalho por isso.

---

## E. Pendente de caracterização — precisa de decisão do time

Automatizado como `test.fixme`, para a lacuna ficar visível no relatório (⊘) em vez de desaparecer.
Cada item é uma **pergunta de produto**, não um bug.

| Teste | Pergunta em aberto |
|---|---|
| `TC8b` | Qual é a regra de sanitização do campo **Duração**? Três medições deram três resultados conforme o modo de edição (`fill()` concatena por causa do sanitizador; select-all + digitar esvazia). `0` e `abc` devem ser corrigidos em silêncio ou recusados com mensagem? |
| `TC26b` | Qual é o **literal do texto auxiliar de intervalo** da fase? A AT documenta "Esta fase será executada do 2º dia ao 4º dia da jornada." e ele não apareceu, embora o "Dia de término" calcule corretamente e a variante de dia único ("no 2º dia") apareça |
| `TC30b` | Existe **limite** para "Quantidade de conteúdos"? A AT esperava `1000` inválido; o campo aceita sem `aria-invalid` e sem mensagem |
| `TC12` | Onde estão os **controles de período permitido** que devem habilitar ao ativar "Restringir acesso fora do horário"? O checkbox alterna, mas nenhum campo de horário apareceu. O passo 2 do TC exige jornada publicada + visão do aluno (massa de Fase 2) |
| `TC9b` | **É o único defeito de produto.** Ver laudo em `Twygo/Evidencias` → `Jornadas/bugs-retrabalhos/2026-08-03-duracao-nao-recalcula/` |

---

## Regras para a próxima AT

Generalização dos erros acima. Vale para qualquer módulo Twygo, não só Jornadas.

1. **Antes de escrever expectativa de campo numérico, medir.** O padrão da Twygo é **sanitizar**, não
   invalidar. Escrever "campo exibe estado inválido" para entrada numérica fora de faixa é errado por
   default neste produto.
2. **Nunca escrever "e o botão Salvar permanece desabilitado".** A Twygo valida **no submit**: o botão
   fica habilitado e o clique exibe a mensagem. Isso apareceu em todos os formulários testados.
3. **Categoria A (obrigatório vazio) exige checar o tipo do controle.** `<select>` com opção
   pré-selecionada **não tem** estado vazio — o cenário é impossível e não deve entrar na matriz.
4. **Matriz precisa de dois valores que discriminem a regra.** Um único exemplo pode satisfazer duas
   regras diferentes ao mesmo tempo (foi o caso de "soma dos períodos" × "maior período") e a divergência
   passa invisível.
5. **Citar documento e seção na expectativa** (ex.: `§4.1.2`). Sem a citação, ninguém consegue decidir,
   quando o teste falha, se o errado é o produto ou a AT — foi o que resolveu o caso do TC9b.
6. **Texto literal de interface só entra na AT se foi observado**, não se foi presumido a partir de outro
   texto parecido. O caso do TC26b nasceu de assumir que o helper de intervalo seguia o de dia único.
