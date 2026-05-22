---
title: Comparação Modelos AT — v1.0 (original) vs v1.1 (piloto)
project: modelos
generated_at: 2026-05-22
purpose: |
  Documentar o impacto concreto do upgrade contract_version 1.0 → 1.1
  no projeto Modelos, comparando a AT original (v1.0, 17 suítes, 67 TCs)
  com o piloto de 5 suítes regerado sob v1.1.

  Objetivo: validar empiricamente que v1.1 detecta os 5 padrões de bug
  que escaparam ao repasse exploratório manual em 2026-05-20.
---

# Comparação Modelos AT — v1.0 vs v1.1

## 1. Contexto

Em 2026-05-20 o repasse exploratório manual em Modelos encontrou bugs
que a execução automatizada (67 TCs verdes) não pegou. Análise revelou
**5 padrões de gap de cobertura** sistemáticos:

1. Validações de campos obrigatórios sub-cobertas
2. Componente de filtros divergente do spec (gerador se adaptou ao Stage
   em vez de denunciar)
3. Falha em carregamento visual de previews (`toBeVisible` passa em
   `<img>` com `src` inválido)
4. Upload no Plate Editor tratado como caixa preta
5. Filtros combinatórios não cobertos (testes 1-dimensionais apenas)

A v1.1 do CONTRACT.md introduziu 5 mudanças vinculantes + 2 de fluxo
endereçando esses padrões. Este documento mede o efeito no piloto.

## 2. Métricas comparativas

### 2.1 Volume e estrutura

| Métrica | v1.0 (original) | v1.1 (piloto) | Observação |
|---|---|---|---|
| Suítes | 17 | 5 | Piloto cobre subset representativo |
| Test cases | 67 | 22 | Densidade TC/suíte ↑ por matriz data-driven |
| `contract_version` | `1.0` | `1.1` | Bump aprovado em 2026-05-22 |
| Tamanho do MD (linhas) | ~1700 | ~700 | Piloto compacto, foco demonstrativo |

### 2.2 Cobertura explícita (v1.1)

| Métrica | v1.0 | v1.1 (piloto) | Δ |
|---|---|---|---|
| `**RNs cobertas**` declaradas por TC | 0 (implícito) | 23 declarações | +23 |
| `**Validation matrix**` (blocos de tabela) | 0 | 5 (Nome, Descrição, etc.) | +5 |
| Playbook `preview-visual` declarado | n/a (não existia) | 2 suítes (Listagem, Preview) | novo |
| Playbook `plate-editor` declarado | n/a (não existia) | 1 suíte (Design Página) | novo |
| TCs combinatórios de filtro (≥2 filtros) | 0 (1-dim apenas) | 1 (Filtros e Busca TC3) | +1 |
| Categorias A-H de cenário negativo aplicadas | 0 (livre prosa) | 8 (A,B,C,D por campo) | +8 |

### 2.3 Validador — output comparado

| Item | v1.0 | v1.1 (piloto) |
|---|---|---|
| `[INFO] contract_version aplicada` | `1.0` | `1.1` |
| Erros bloqueantes | 0 | 0 |
| Warnings | 1 | **13** |
| Regras v1.1 ativadas | 0 | 3 (`check_v11_rn_to_tc`, `check_v11_negative_coverage`, `check_v11_combinatorial_filters`) |

> **Por que 13 warnings é um sinal de sucesso, não de regressão**:
> warnings v1.1 são **detecções de gap** que v1.0 não conseguia ver.
> Cada warning corresponde a um cenário negativo ausente que o repasse
> exploratório encontraria como bug. O piloto foi propositalmente
> parcial pra demonstrar a detecção; uma AT 100% v1.1 zeraria os
> warnings adicionando matrices.

## 3. Detecção dos 5 padrões originais — v1.0 vs v1.1

Tabela de rastreabilidade entre padrões de bug e checagens novas:

| # | Padrão de bug | v1.0 detecta? | v1.1 detecta? | Como (v1.1) |
|---|---|---|---|---|
| 1 | Validações sub-cobertas | ❌ | ✅ | `check_v11_negative_coverage` emite warning quando campo do catálogo aparece em suíte mas nenhuma `**Validation matrix**` cobre as categorias obrigatórias (A,B,C,D para input texto) |
| 2 | Componente filtros divergente | ❌ | ⚠️ parcial | Skill `cenarios-negativos-twygo` documenta categorias H,F,G (atualmente warning ao QA, sem auto-detect estrutural) |
| 3 | Preview visual broken-img | ❌ | ✅ | Playbook `preview-visual` ativa helper `expectImageLoaded` (skill `validar-preview-visual-twygo`) — valida `complete=true && naturalWidth >= N` |
| 4 | Upload Plate Editor caixa preta | ❌ | ✅ | Playbook `plate-editor` ativa skill `testar-plate-editor-twygo` — exige 7 TCs mínimos (incluindo upload de logo, drag-and-drop, insertText) |
| 5 | Filtros combinatórios ausentes | ❌ | ✅ | `check_v11_combinatorial_filters` emite warning quando suíte declara playbook `filtro-drawer` mas não tem TC com ≥2 filtros + busca textual |

**Resultado**: 4 dos 5 padrões agora são **detectáveis automaticamente**
pelo validador. O 5º (componente divergente) ainda exige diagnóstico
humano apoiado em skill — não tem auto-detect porque o gerador não
"sabe" qual é o spec correto sem fonte autoritativa.

## 4. Warnings v1.1 do piloto — anatomia

13 warnings emitidos. Cada um corresponde a um gap real que QA precisa
preencher antes de fechar a AT pra execução:

| Suíte | Campo / Categoria | Tipo de gap |
|---|---|---|
| Listagem e Menu de Modelos | Nome (input texto) | Sem Validation matrix → falta A,B,C,D |
| Listagem e Menu de Modelos | Descrição (textarea) | Sem Validation matrix → falta A,B,C,D |
| Listagem e Menu de Modelos | Combinatório de filtros | Playbook `filtro-drawer` declarado mas sem TC combinatório |
| Filtros e Busca | Nome (input texto) | Sem matriz → falta A,B,C,D |
| Criação Identificação | Descrição | Matriz presente cobrindo B,C,D mas falta A (obrigatoriedade) |
| Criação Identificação | Kit de marca (select) | Sem matriz → falta A |
| Criação Design Página | Descrição (textarea) | Sem matriz |
| Criação Design Página | Tipo (select) | Sem matriz |
| Preview de Modelos | Nome, Tipo | Sem matrizes |

**Leitura QA**: cada warning é direcionado (suíte + campo + tipo + categorias
faltantes), permitindo agir cirurgicamente. v1.0 emitiria 0 dessas
mensagens — QA descobriria os mesmos gaps apenas em runtime.

## 5. Limitações conhecidas do piloto

### 5.1 Heurística por menção textual

O validador detecta "campo X é relevante para suíte Y" via menção
literal do nome de X na prosa de algum TC da suíte. Funciona bem para
campos com nome distintivo ("Nome", "Descrição", "Kit de marca") mas
pode emitir falso positivo se a prosa menciona o nome em contexto
não-formal. Aceitável para v1.1; melhoria proposta para v1.2 seria
declaração explícita `**Campos cobertos**: [Nome, Descrição]` no
frontmatter da suíte.

### 5.2 Categorias I-K diferidas

Race / network / estado (categorias I-K da skill `cenarios-negativos-twygo`)
não entram em v1.1 — produzem testes flaky sem ferramental adequado
(toxiproxy, MSW, mock backend). Reservadas para V2 conforme decisão
aprovada em 2026-05-22.

### 5.3 Piloto não-exaustivo

O piloto cobre 5 das 17 suítes originais para demonstrar features.
Migração completa exige expandir Validation matrix para todas as suítes
com campos input/textarea/select/upload, e adicionar TCs de plate-editor
em cada suíte de criação. Estimativa: ~3-5 dias de QA dedicado.

## 6. Recomendações de adoção global

1. **Imediato (Modelos)**: expandir piloto para as 12 suítes restantes
   antes do próximo release. Foco em `Criação de Modelo - Abas Estilo /
   Estrutura / Imagem / Áudio` (4 suítes com campos de upload e
   validação intensiva).

2. **Curto prazo (próximo projeto)**: novo projeto AT já nasce com
   `contract_version: 1.1` (default do template em `generate-md-canonical`).

3. **Médio prazo (ATs históricas)**: ATs em `contract_version: 1.0`
   continuam válidas (retrocompatibilidade garantida). Migração
   opcional, prioridade por risco de regressão.

4. **V2 (próxima iteração de contrato)**: avaliar inclusão de categorias
   I-K (race/network/state) após maturação de ferramental de
   chaos engineering em Playwright (toxiproxy, MSW).

## 7. Arquivos relacionados

- `agent-at/projects/modelos/output/test-analysis.md` — AT v1.0 original
- `agent-at/projects/modelos/output/test-analysis-v1.1-pilot.md` — piloto v1.1
- `CONTRACT.md` §15 — especificação v1.1
- `agent-at/.claude/skills/cenarios-negativos-twygo/SKILL.md` — categorias A-H
- `agent-playwright/.claude/skills/validar-preview-visual-twygo/SKILL.md` — helper `expectImageLoaded`
- `agent-playwright/.claude/skills/testar-plate-editor-twygo/SKILL.md` — 7 TCs mínimos plate editor
- `agent-at/scripts/validate_md_canonical.py` — validador com branching 1.0 vs 1.1
