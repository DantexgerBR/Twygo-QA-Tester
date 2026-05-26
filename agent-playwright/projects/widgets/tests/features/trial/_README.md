# Trial

4 TCs validam criação/exclusão de Trial com painéis pré-definidos:

1. **Criação via URL** — wizard `/new/register/steps`, valida painéis SophiaTech + cópia da base.
2. **Criação via API** — out-of-scope Playwright (cobertura por teste de API).
3. **Exclusão remove dados pré-definidos** (SophiaTech).
4. **Exclusão remove dados criados pelo Admin** (junto com pré-definidos).

## Estratégia de isolamento (resolvida em 2026-05-15)

Cada projeto Twygo provisiona **sua própria Trial** (ICP "Outros" / coluna
`icp5` da `organization_icps`) via skill
[`provisionar-trial-projeto-twygo`](../../../../../.claude/skills/provisionar-trial-projeto-twygo/SKILL.md).
URL/credenciais ficam em `projects/widgets/data/trial-env.json`.

**Widgets — atalho de primeira execução**: para este projeto, reutilizamos o
env legacy `trial-agentsqa-other` (orgId 36981) porque sua exclusão ainda
não rodou — equivale a "passos 1-7 já feitos pelo executor". Documentado
no campo `_provisionedFrom: 'legacy-env-reuse'` do `trial-env.json`.
**Após primeira run, dados serão zerados** e o env precisará ser
re-provisionado via skill (passos 1-8 completos).

## Specs

| Spec | TC do XML | Status |
|---|---|---|
| `criacao-trial-url-paineis-predefinidos.spec.ts` | TC1 | `fixme` — **coberto pelo playbook** `provisionar-trial-projeto-twygo` (manual+Claude). As asserções do TC ("Trial criado", "painéis pré-definidos aparecem", "menu aluno") são side-effects validados pelo executor durante os passos 5/7 do playbook |
| `criacao-trial-api-paineis-predefinidos.spec.ts` | TC2 | `fixme` permanente — **override do XML 2026-05-15**: criação via API descartada, cobertura via wizard `/new/register/steps` (TC1 + playbook). API endpoint `external_onboarding` out-of-scope Playwright |
| `exclusao-trial-dados-sophiatech.spec.ts` | TC3 | ✅ ativo — marca opção "Todas as informações pré-definidas da SophiaTech", asserta delta na contagem de painéis (timeout 60s p/ job async) |
| `exclusao-trial-dados-admin.spec.ts` | TC4 | ✅ ativo — cria "Painel do Admin Trial", marca "Todas informações (pré + admin)", asserta painel removido (timeout 60s p/ job async) |

## Ordem de execução

TC3 e TC4 são **mutuamente destrutivos no mesmo tenant**: o que rodar
primeiro consome a Trial. TC3 usa `test.skip` se a Trial estiver
drenada — se executados nessa ordem (alfabética: TC4 `admin` antes de
TC3 `sophiatech`), o TC3 será skipped após o TC4 zerar tudo.

**Recomendação**: rodar individual (`--grep`) ou aceitar 1 deles skipped.
Para validar ambos numa mesma run, re-provisionar entre eles (intervenção
manual via skill).

## Re-execução após exclusão

Trial consumida → re-provisionar antes da próxima run. Fluxo canônico:

```bash
# Sessão Claude Code interativa — siga os 8 passos da skill.
# (rotina manual no executor: atualizar organization_icps.icp5,
#  desbloquear email, conferir flags/contrato, atualizar .env com senha)
```

Skills relacionadas: [`provisionar-trial-projeto-twygo`](../../../../../.claude/skills/provisionar-trial-projeto-twygo/SKILL.md),
[`testar-exclusao-dados-trial-twygo`](../../../../../.claude/skills/testar-exclusao-dados-trial-twygo/SKILL.md).
