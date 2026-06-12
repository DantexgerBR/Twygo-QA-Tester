# QA 1.15 (card 19719) — Coexistir com tela antiga via rota nova e feature flag — REVALIDAÇÃO 12/06

Pendência de 10/06 ("qual é o gate real?") RESPONDIDA: a flag é `novo_estudio_criacao` (a AT cita `creation_studio`, que está Disabled e não é o gate). PR validada: 10601.

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Gate real identificado e mecânica de coexistência comprovada: a flag Flipper `novo_estudio_criacao` está "Conditionally enabled" com actors por organização (37061/37062/37063/36675 entre 8). Matriz ON/OFF sem mutação de flag: na org COM flag (37063), a criação de curso exibe as abas "Modelo" e "Atividades" do novo Estúdio; na org SEM flag (36912), essas duas abas NÃO aparecem e o formulário antigo de criação/edição segue funcionando normalmente — coexistência por flag operante nos dois sentidos.
:: Obs ::
Correções de AT: (1) o nome da flag na suíte é `creation_studio` — o gate real é `novo_estudio_criacao`; (2) não existe "rota antiga separada" — a coexistência é por ABAS dentro do mesmo form (com flag: abas Modelo+Atividades; sem flag: form clássico), então os TCs de roteamento-por-URL precisam ser reescritos nesse modelo. PR 10601 cobriu o gating na criação.
:: Evidência(s) ::
- 03-flipper-novo_estudio_criacao.png (flag Conditionally enabled com actors por org)
- 01-flag-on-37063-criacao.png (org com flag: abas Modelo + Atividades presentes)
- 02-flag-off-eduapi-criacao.png (org sem flag: sem as abas; form antigo ok)
- resultado.json (listas de abas por org)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa115
```
