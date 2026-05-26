# [inconclusivo] Default "Sem imagens, somente textos"

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-21T21:07:44.597Z · commit f90ba01_

## Identificação
- **Suite**: Criação de Modelo - Aba Imagem
- **TC**: Default "Sem imagens, somente textos"
- **Spec**: `projects/modelos/tests/features/criacao-de-modelo-aba-imagem/tc03-default-sem-imagens.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-modelo-aba-imagem\tc03-default-sem-imagens.spec.ts:19:62`
- **Status**: failed (14129ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: f90ba01

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir aba Imagem em modelo seedado — ✅
  2. 2. Validar radio-0 ("Sem imagens, somente textos") marcado por padrão — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(received).toBe(expected) // Object.is equality
  
  Expected: true
  Received: false
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium/trace.zip)

### IDs envolvidos
- orgId: 37007

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