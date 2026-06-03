# [inconclusivo] TC1 — Após emitir novo certificado, anteriores são marcados em lote como REPLACED

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-06-01T14:04:44.598Z · commit 88f26da_

## Identificação
- **Suite**: Ciclo de Vida do Certificado Substituído
- **TC**: TC1 — Após emitir novo certificado, anteriores são marcados em lote como REPLACED
- **Spec**: `projects/recertificacao/tests/features/ciclo-de-vida-do-certificado-substituido/tc1-novo-certificado-anteriores-replaced.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\ciclo-de-vida-do-certificado-substituido\tc1-novo-certificado-anteriores-replaced.spec.ts:54:40`
- **Status**: failed (28268ms)

## Ambiente
- **Env**: staging-recertificacao (`https://recertificacao-testeqa.stage.twygoead.com/`)
- **OrgId**: 37048
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 88f26da

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Pré-condição: aluno aprovado com recertification_number = 0 e certificado VALID emitido → acessar lista de aprendizagem do curso seed e verificar que a página carrega — ✅
  2. 2. Localizar linha do aluno com badge "Substituído" → RN 20/21: certificado mais antigo (recert_num=0) foi marcado REPLACED (situation=4) em lote pelo replace_previous_certificates_bulk ao emitir o cert novo — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(locator).toBeVisible() failed
  
  Locator: locator('tbody tr').filter({ hasText: 'richard.sebold@twygo.com' }).filter({ hasText: /Substituído/i }).first()
  Expected: visible
  Timeout: 15000ms
  Error: element(s) not found
  
  Call log:
  ```

## Evidência técnica

### Network
| Método | URL | Status | In-scope | Body |
|---|---|---|---|---|
| POST | `https://ad.doubleclick.net/ccm/s/collect?auid=1926417111.1780322202&gtm=45He65r2v78814578za200zd78814578xea` | **400** | não | — |

### Attachments
- ![screenshot](../test-artifacts/projects-recertificacao-te-87ef1-cados-em-lote-como-REPLACED-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-recertificacao-te-87ef1-cados-em-lote-como-REPLACED-chromium/video-1.webm)
- [video](../test-artifacts/projects-recertificacao-te-87ef1-cados-em-lote-como-REPLACED-chromium/video.webm)
- [error-context](../test-artifacts/projects-recertificacao-te-87ef1-cados-em-lote-como-REPLACED-chromium/error-context.md)
- [trace](../test-artifacts/projects-recertificacao-te-87ef1-cados-em-lote-como-REPLACED-chromium/trace.zip)

### IDs envolvidos
- orgId: 37048

## Escopo
- **Reproduz em outro usuário?** `[REVISAR isolamento]`
- **Reproduz em outro env?** `[REVISAR isolamento]`
- **Regressão?** desconhecida `[REVISAR regressão]`
- **Workaround**: nenhum identificado `[REVISAR workaround]`

## Impacto
- **Severity sugerida**: **media** `[REVISAR severity]`
- **Impacto qualitativo**: desconhecido `[REVISAR impacto]`

---

> _Gerado por `gerar-bug-report-de-tc-red` v1.0.0. Campos `[REVISAR]` exigem validação humana antes de abrir task._