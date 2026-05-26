# [inconclusivo] Carga horária exibe 5 opções literais

> _Categoria confiança: **baixa** — Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace_
> _Gerado em 2026-05-25T14:14:53.491Z · commit 83d0916_

## Identificação
- **Suite**: Criação de Modelo - Aba Estrutura do Conteúdo
- **TC**: Carga horária exibe 5 opções literais
- **Spec**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc05-carga-horaria-5-opcoes.spec.ts`
- **Erro em**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-modelo-aba-estrutura-do-conteudo\tc05-carga-horaria-5-opcoes.spec.ts:20:23`
- **Status**: failed (19413ms)

## Ambiente
- **Env**: staging-base-de-conhecimento (`https://basedeconhecimento.stage.twygoead.com/`)
- **OrgId**: 37007
- **Usuário**: agents.qa@claude.com
- **Browser**: chromium
- **Build/commit**: 83d0916

## Reprodução
- **Pré-condições**: storageState pré-logado em `outputs/.auth/storage.json`, perfil Administrador.
- **Passo-a-passo**:
  1. 1. Abrir aba Estrutura — ✅
  2. 2. Ler options de "Carga horária" e validar as 5 esperadas — ❌ **falhou aqui**
- **Taxa**: 1/1 nesta execução `[REVISAR taxa real — rodar 3+ vezes]`

## Comportamento
- **Esperado**: [REVISAR — preencher com expectedresults do XML do step que falhou]
- **Observado**:
  ```
  Error: expect(received).toEqual(expected) // deep equality
  
  Expected: ArrayContaining ["Micro", "Curto", "Médio", "Estendido", "Longo"]
  Received: ["Selecione", "Micro (30 segundos a 5 minutos)", "Curto (5 a 15 minutos)", "Médio (15 a 30 minutos)", "Estendido (30 a 60 minutos)", "Longo (1 a 2 horas)"]
  ```

## Evidência técnica

### Network
_Sem HTTP 4xx/5xx capturados pela fixture exploratória nesta execução._

### Attachments
- ![screenshot](../test-artifacts/projects-modelos-tests-fea-62b2e-ria-exibe-5-opções-literais-chromium/test-failed-1.png)
- [video](../test-artifacts/projects-modelos-tests-fea-62b2e-ria-exibe-5-opções-literais-chromium/video.webm)
- [error-context](../test-artifacts/projects-modelos-tests-fea-62b2e-ria-exibe-5-opções-literais-chromium/error-context.md)
- [trace](../test-artifacts/projects-modelos-tests-fea-62b2e-ria-exibe-5-opções-literais-chromium/trace.zip)

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