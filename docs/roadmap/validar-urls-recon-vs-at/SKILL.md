---
name: validar-urls-recon-vs-at
description: O AT (agent-at) infere URLs canônicas das prosas dos TCs em PT-BR — frequentemente traduz nome de feature pra slug em inglês (ex.: "Modelos de conteúdo" → `/content_templates`). Quando a inferência diverge do nome real do backend (ex.: `/content_models`), recon retorna 404 e o piloto trava 20-40min até descobrir o nome certo. Skill propõe que recon valide cada URL inferida (HEAD 200) e, se 404, descubra a URL real via navegação no menu admin e emita diff sugerido pro AT canônico. Use ao iniciar suíte nova, especialmente em projetos onde a feature tem termo PT-BR sem mapping óbvio pro slug.
version: 1.0.0
status: design  # design doc — implementação pendente
---

# validar-urls-recon-vs-at

## Status

**Design doc** — a skill descreve o problema e a especificação. Implementação no `recon.ts` ainda pendente. Roda manualmente até lá (ver §Workaround manual).

## Problema

`agent-at` infere URL canônica de cada TC a partir da prosa "Acessar a URL '/o/{orgId}/<resource>'". O AT decide `<resource>` baseado em heurística de tradução PT-BR → slug-EN. Heurística pode errar:

| Feature PT-BR (no AT) | AT infere | Backend real | Resultado |
|---|---|---|---|
| Modelos de conteúdo | `/content_templates` | `/content_models` | 404 |
| Painéis do usuário | `/user_panels` | `/panels` (real) | 404 hipotético |
| Repositórios | `/repositories` | `/organization_datasets` | 404 hipotético |
| Edição de curso (Recertificação 2026-05-27) | `/e/:id/edit` (HAML legacy) | `/o/:org/contents/:id/edit?tab=identification` (facelift React) | rota HAML retorna 404 ou 422 silencioso no save. AT inferiu da prosa "Acessar a edição" sem validar live — pegou rota deprecated. Caso adicional: switch "Habilitar reinscrição" exige `?tab=access` (query param), não inferível só da prosa. |

Quando recon roda com URL errada:
- 0 test-ids capturados
- Heading "The page you were looking for doesn't exist"
- Planner recebe recon vazio → gera plano frágil
- Spec gerado falha live com 404
- QA gasta 20-40min descobrindo o nome real via menu navigation

## Workaround manual (até implementar)

Quando o recon retorna `Page title: The page you were looking for doesn't exist (404)`:

1. **Navegar pra `/o/{orgId}/dashboard`** (admin)
2. **Procurar o item no sidebar** pela tradução do nome PT-BR
3. **Inspecionar o `href`** do `<a>` terminal
4. **Patchar o AT canônico** com o slug correto (ex.: `sed -i 's/content_templates/content_models/g' test-analysis.md`)
5. **Regerar XMind + XML** via `scripts/md_to_xmind.py` + `scripts/md_to_testlink.py`
6. **Re-copiar pra agent-playwright/projects/<slug>/inputs/**
7. **Re-parsear**
8. **Re-rodar recon** — agora retorna 200 com test-ids

## Especificação proposta (implementação futura)

### Em `agent-playwright/.claude/skills/twygo-recon/recon.ts`

Adicionar validação pré-recon:

```ts
async function validateUrlExists(page: Page, url: string): Promise<{ ok: boolean; status: number; finalUrl: string }> {
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
  const status = resp?.status() ?? 0;
  const is404 = (await page.title()).includes("doesn't exist") ||
                await page.getByRole('heading', { name: /doesn.t exist/i }).isVisible().catch(() => false);
  return { ok: !is404 && status < 400, status, finalUrl: page.url() };
}
```

Se URL der 404:

1. Navegar pra `/o/{orgId}/dashboard`
2. Enumerar sidebar items (`#menu a[href]`) com href + texto
3. Fuzzy-match o nome da testsuite com texto dos items
4. Se match com confiança > 0.7 → sugerir URL real
5. Emitir diff sugerido no `inputs/recon-<slug>.md`:

```markdown
> ⚠️ **URL canônica do AT inferida errada**
> AT inferiu: `/o/{orgId}/content_templates` (404)
> URL real descoberta: `/o/{orgId}/content_models` (200) — sidebar match "Modelos de conteúdo"
> Patch sugerido pro AT canônico:
> `sed -i 's|content_templates|content_models|g' agent-at/projects/<slug>/output/test-analysis.md`
> Depois: regerar XMind + XML, recopiar, re-parsear, re-rodar recon.
```

### Em `agent-at/scripts/md_canonical_validator.py`

Validador semântico (já existe) ganha nova check: **`url_resource_dictionary`**:

```python
# scripts/url_resource_dictionary.py
KNOWN_RESOURCES = {
    'modelos de conteúdo': 'content_models',
    'painéis do usuário': 'user_panels',
    'repositórios': 'organization_datasets',
    # ... expandido conforme projetos descobrem
}
```

Validador alerta quando AT escreve URL com slug que NÃO bate com `KNOWN_RESOURCES`.

## Histórico

Caso real (2026-05-20, projeto modelos):
- AT inferiu `/content_templates` em 11 ocorrências (UI prosa + endpoints API).
- Recon retornou 404 em `/o/37007/content_templates`.
- Diagnóstico: 25min gastos investigando feature-flag, permissões admin, encoding, antes de descobrir via menu navigation que era `content_models`.
- Fix: patch nos 11 lugares (AT canônico + cópias derivadas) + regerar XMind/XML.

Skill criada pra que **próximo projeto não pague o mesmo custo**.

## Relacionado

- [[twygo-recon]] — skill principal; receberia a validação
- [[navegar-sidebar-admin-twygo]] — descoberta de URLs via sidebar admin; sidebar tem duplicidade (skill consolidada, ex-`navegar-admin-dashboard-twygo`/`escopar-sidebar-menu-twygo`)
- CONTRACT.md — MD canônico é fonte de verdade; XMind/XML são derivados regeneráveis

## Implementação — quem pega

Roadmap: criar issue em `twygo-agents-qa` com label `skill-implementation`. Owner sugerido: time de QA Tools.
