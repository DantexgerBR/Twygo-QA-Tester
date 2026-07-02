# Revalidação — Card Artia 20283 (P2) — ciclo de ordenação 3º clique não limpa

**Origem**: `agent-playwright/projects/registros-externos` (monorepo `twygo-agents-qa`).
**RN**: 11 (`inputs/test-analysis.md`, TC6 da suíte "Aprendizagem > Registros" e TC10 da suíte
"Meu histórico"). Ciclo esperado: 1º clique → asc, 2º clique → desc, 3º clique → limpa
(sem seta ativa + tabela volta à ordem original).

## O que foi testado

Ciclo de 3 cliques no header de uma coluna ordenável, em 4 áreas:

1. **Admin** — Aprendizagem > Registros, header "Pessoa".
2. **Aluno** — Meu Histórico, header "Conteúdo" (1ª coluna ordenável disponível — "Provedor" tinha
   poucos valores distintos e não serviria de prova visual da ordem).
3. **Outra listagem 1** — tab "Provedores" (dentro de Registros), header "Nome".
4. **Outra listagem 2** — "Usuários", header "Usuário".

Para cada área, screenshots antes do sort, após 1º clique (asc), 2º clique (desc) e 3º clique,
mais captura programática de (a) o `path` do SVG do ícone de seta no header e (b) os valores da
coluna nas primeiras linhas — cruzando os dois sinais (ícone x dados reais), conforme a regra
anti-falso-positivo.

## Resultado — reproduzido em TODAS as 4 áreas, de forma consistente

Em nenhuma das 4 áreas o 3º clique restaura a ordem original:

| Área | Ícone volta ao neutro (dupla seta)? | Ordem restaura ao estado inicial? | Direção mudou 1º→2º clique? |
|---|---|---|---|
| Admin / Registros / Pessoa | ✅ sim | ❌ não (mantém a ordem do 2º clique) | ✅ sim |
| Aluno / Meu Histórico / Conteúdo | ✅ sim | ❌ não | ✅ sim |
| Admin / Provedores / Nome | ✅ sim | ❌ não | ✅ sim |
| Admin / Usuários / Usuário | ✅ sim | ❌ não | ✅ sim |

**Achado importante**: o *ícone* do header de fato retorna ao símbolo neutro (dupla seta,
mesmo `path` do SVG do estado inicial) no 3º clique — visualmente pode parecer corrigido.
Mas os **dados da tabela permanecem exatamente na mesma ordem do 2º clique (descendente)** —
a limpeza da ordenação não ocorre de fato. Ou seja: o indicador visual "mente" — ele volta ao
neutro, mas o sort real nunca é desfeito. Confirmado por evidência bruta (path do ícone +
conteúdo das linhas), não por uma tela derivada única — cross-check cumprido.

Evidência visual: comparar
`01-admin-registros-pessoa-02-segundo-clique-desc.png` com
`01-admin-registros-pessoa-03-terceiro-clique.png` — linhas idênticas (só "Vanessa Pereira"),
mesmo com o header "Pessoa" mostrando a seta neutra no 3º clique.

## Reconciliação QA 1.1 / TC10

Confirma-se a suspeita do card: a QA 1.1 (TC10) precisa ser reconciliada — o 3º clique não
limpa a ordenação nem na visão Admin nem na Aluno, então o "PASSOU" anterior não cobriu esse
passo. Não foi alterado o laudo antigo (fora do escopo desta tarefa); reforça-se apenas o
apontamento aqui.

## Veredito

**❌ Falhou** — bug confirmado como global no componente compartilhado "list-control",
reproduzido de forma idêntica em 4 áreas distintas (Admin/Registros, Aluno/Meu Histórico,
Provedores, Usuários), com evidência cruzada (ícone + dados reais). A correção alinhada com a
Angel para ser aplicada globalmente **não está em vigor no ambiente de Stage validado**
(`registrosf2.stage.twygoead.com`, org 37079, 2026-07-02).

## Comentário KQA (pronto pra colar no Artia)

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage (registrosf2.stage.twygoead.com, org 37079)
:: Validação ::
Testado o ciclo de 3 cliques no header de coluna ordenável (RN 11) em 4 áreas: Admin
(Aprendizagem > Registros, coluna "Pessoa"), Aluno (Meu Histórico, coluna "Conteúdo"), e mais
2 listagens que usam o mesmo componente "list-control" — tab Provedores (coluna "Nome") e
Usuários (coluna "Usuário"). Em TODAS as 4 áreas o 3º clique não limpa a ordenação: os dados
permanecem na mesma ordem do 2º clique (descendente), apenas o ícone do header volta
visualmente ao estado neutro (dupla seta) — o indicador é enganoso, o sort real nunca é
desfeito.
:: Obs ::
Confirma-se a suspeita do card: a QA 1.1 (TC10) precisa ser reconciliada, pois o "PASSOU"
anterior não cobriu a checagem do 3º clique nem na visão Admin nem na Aluno. A correção
alinhada com a Angel (global no componente "list-control") não está em vigor neste Stage —
bug reproduzido de forma idêntica e consistente em todas as 4 áreas testadas, com evidência
cruzada entre o ícone do header e os dados reais da tabela (não apenas uma tela derivada).
:: Evidência(s) ::
- 01-admin-registros-pessoa-00-sem-sort.png
- 01-admin-registros-pessoa-01-primeiro-clique-asc.png
- 01-admin-registros-pessoa-02-segundo-clique-desc.png
- 01-admin-registros-pessoa-03-terceiro-clique.png
- 02-aluno-meu-historico-00-sem-sort.png
- 02-aluno-meu-historico-01-primeiro-clique-asc.png
- 02-aluno-meu-historico-02-segundo-clique-desc.png
- 02-aluno-meu-historico-03-terceiro-clique.png
- 03-admin-provedores-nome-00-sem-sort.png
- 03-admin-provedores-nome-01-primeiro-clique-asc.png
- 03-admin-provedores-nome-02-segundo-clique-desc.png
- 03-admin-provedores-nome-03-terceiro-clique.png
- 04-admin-usuarios-usuario-00-sem-sort.png
- 04-admin-usuarios-usuario-01-primeiro-clique-asc.png
- 04-admin-usuarios-usuario-02-segundo-clique-desc.png
- 04-admin-usuarios-usuario-03-terceiro-clique.png
- resultado.json (dados brutos: path do ícone SVG + valores de coluna por clique, por área)
Evidência no link: <preencher com a URL do commit após push>
```
