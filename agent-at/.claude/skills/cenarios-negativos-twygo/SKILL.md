---
name: cenarios-negativos-twygo
description: Política de cobertura de cenários negativos na escrita de AT — 8 categorias canônicas (A-H) cobrindo validações de obrigatoriedade, boundary, caracteres, injection, tipo errado, extensões de arquivo, MIME mismatch e tamanho de arquivo. Documenta padrão data-driven (1 TC com Validation matrix em vez de N TCs separados) para evitar explosão de volume. Use ao gerar AT em projetos contract_version 1.1+ — substitui a cobertura assimétrica de "1 TC genérico por aba". Categorias I-K (race/network/estado inválido) reservadas para V2.
disable-model-invocation: true
allowed-tools: Read Write Edit Bash Glob Grep
---

# Cenários Negativos — Política Twygo (CONTRACT.md v1.1)

## Por que esta skill existe

Auditoria pós-execução do projeto Modelos (2026-05-22) revelou que o
**repasse exploratório manual** descobriu bugs reais de validação de
campos que **não foram pegos pela automação**. Causa raiz: ATs anteriores
tinham cobertura assimétrica — 1-2 TCs genéricos de "validar
obrigatórios" para abas com 5-7 campos obrigatórios, sem matriz por
campo nem caracteres especiais ou boundary.

Esta skill estabelece **8 categorias obrigatórias** (A-H) que o agent-at
deve cobrir, com **padrão data-driven** para evitar explosão do volume
de TCs.

Detalhe em [CONTRACT.md §15](../../../../CONTRACT.md).

## Quando usar

Use **sempre** ao gerar AT v1.1+. Aplica a todo campo input/upload da AT
(documentado no catálogo `## Campos e validações`).

## As 8 categorias canônicas (A-H)

| Cat | Nome | Quando aplicar | Custo TC | Risco flaky |
|---|---|---|---|---|
| **A** | Obrigatoriedade | Sempre que campo é obrigatório | Baixo | Baixo |
| **B** | Boundary | Sempre que campo tem limite numérico (chars, range) | Médio | Baixo |
| **C** | Caracteres permitidos | Inputs texto | Médio | Baixo |
| **D** | Injection | Inputs texto persistidos (XSS / SQL) | Médio | Baixo |
| **E** | Tipo errado | Numérico recebendo texto, etc. | Baixo | Baixo |
| **F** | Extensão de arquivo | Sempre em upload | Baixo | Baixo |
| **G** | MIME mismatch | Upload sensível (avatar, doc, mídia) | Médio | Baixo |
| **H** | Tamanho de arquivo | Sempre em upload | Médio | Médio |

### Detalhamento por categoria

#### A — Obrigatoriedade
**Cenários**:
- Campo vazio (`""`)
- Campo só com espaços em branco (`"   "`)
- Combinação: vários campos obrigatórios vazios simultaneamente

**Resultado esperado**: mensagem específica de erro (não genérica), foco
no campo, salvamento bloqueado.

#### B — Boundary
**Cenários** (para campo com limite N):
- 0 chars (`""`)
- 1 char (mínimo válido)
- N-1 chars (limite válido inferior)
- N chars (limite válido superior)
- N+1 chars (estouro)

**Resultado esperado**: contador exibido próximo do limite, erro em N+1.

#### C — Caracteres permitidos
**Cenários** (input texto):
- Emoji (`"🎓 Curso"`)
- Acentos PT-BR (`"Ações"`)
- Caracteres especiais (`"@#$%&*"`)
- Espaços leading/trailing (trim esperado)
- Apenas espaços (deve falhar como vazio — ver A)
- Caracteres de controle (`\n`, `\t`)

**Resultado esperado**: aceitos onde apropriado, rejeitados/sanitizados
onde apropriado. Não quebra encoding.

#### D — Injection
**Cenários** (input texto persistido):
- HTML/script: `"<script>alert(1)</script>"`
- SQL: `"'; DROP TABLE users;--"`
- Template injection: `"${__proto__}"`, `"{{7*7}}"`
- Path traversal em campos que viram path: `"../../etc/passwd"`

**Resultado esperado**: sanitizado (sem alert real, sem efeito SQL,
exibe escapado). Bug se executar.

#### E — Tipo errado
**Cenários**:
- Campo numérico recebendo texto: `"abc"`
- Campo numérico recebendo negativo quando esperado positivo
- Campo data recebendo data inválida: `"32/13/2026"`, `"2026-13-32"`
- Campo URL recebendo string que não é URL

**Resultado esperado**: erro de validação, foco no campo.

#### F — Extensão de arquivo
**Cenários** (upload):
- Extensão fora da lista permitida (ex: `.exe`, `.php` em campo de imagem)
- Extensão dupla (`.png.exe`)
- Sem extensão (`"arquivo_sem_extensao"`)
- Case sensitivity (`.PNG` vs `.png`)

**Resultado esperado**: rejeição com mensagem específica listando
formatos aceitos.

#### G — MIME mismatch
**Cenários**:
- Arquivo `.png` renomeado para `.jpg` (MIME real PNG, extensão JPG)
- Arquivo `.exe` renomeado para `.png` (MIME executável, extensão imagem)
- Arquivo vazio (0 bytes)

**Resultado esperado**: rejeição baseada em MIME real (não apenas
extensão).

#### H — Tamanho de arquivo
**Cenários** (para upload com limite N MB):
- 0 bytes
- 1 byte (mínimo)
- N MB (limite — deve aceitar)
- N+0.1 MB (estouro mínimo)
- N*2 MB (estouro claro)

**Resultado esperado**: mensagem específica indicando o limite. Salvamento
bloqueado em estouro.

## Padrão canônico data-driven

**Crítico**: NÃO criar N TCs separados (1 por cenário). Criar **1 TC por
campo** com **matriz de cenários**. Generator implementa como `test.each`
no Playwright.

### Schema novo em 1.1: `**Validation matrix**`

```markdown
## TC — Validações do campo "Nome" (Identificação)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []
**RNs cobertas**: [8, 15.1]
**Validation matrix**:
| Cenário | Categoria | Input | Esperado |
|---|---|---|---|
| Vazio | A | "" | Erro "Nome é obrigatório" + foco no campo |
| Só espaços | A | "   " | Erro "Nome é obrigatório" |
| 1 char | B | "X" | Aceito; permite salvar |
| 254 chars | B | "X" repetido 254x | Aceito |
| 255 chars (limite) | B | "X" repetido 255x | Aceito |
| 256 chars (estouro) | B | "X" repetido 256x | Truncado a 255 OU erro |
| Emoji | C | "🎓 Curso de IA" | Aceito |
| Acento | C | "Ações estratégicas" | Aceito |
| Script tag | D | "<script>alert(1)</script>" | Sanitizado; nenhum alert |
| SQL injection | D | "'; DROP TABLE--" | Salvo escapado |

### Objetivo
Validar matriz completa de entradas no campo "Nome" — cobertura de
categorias A, B, C, D conforme cenarios-negativos-twygo.

### Passos
1. Acessar a tela de criação de modelo
   → Aba "Identificação" é exibida.
2. Para cada linha da Validation matrix, preencher "Nome" com `<input>` e clicar "Salvar"
   → Comportamento bate com `<esperado>` da matriz.
```

### Como o generator implementa

```typescript
const cases = [
  { name: 'Vazio',         input: '',                       expectError: 'Nome é obrigatório' },
  { name: 'Só espaços',    input: '   ',                    expectError: 'Nome é obrigatório' },
  { name: '1 char',        input: 'X',                      expectSaved: true },
  { name: '254 chars',     input: 'X'.repeat(254),          expectSaved: true },
  { name: '255 chars',     input: 'X'.repeat(255),          expectSaved: true },
  { name: '256 chars',     input: 'X'.repeat(256),          expectTruncated: 255 },
  { name: 'Emoji',         input: '🎓 Curso de IA',          expectSaved: true },
  { name: 'Acento',        input: 'Ações estratégicas',     expectSaved: true },
  { name: 'Script tag',    input: '<script>alert(1)</script>', expectSanitized: true },
  { name: 'SQL injection', input: "'; DROP TABLE--",        expectSavedEscaped: true },
];

for (const c of cases) {
  test(`Nome: ${c.name}`, async ({ page }) => {
    // ... preenche e valida
  });
}
```

Cada cenário vira sub-test do Playwright (visível no reporter), mas a
AT documenta **1 TC só**. Bom de ambos os mundos: granularidade no
report, concisão na AT.

## Matriz mínima por tipo de campo

| Tipo de campo | Categorias obrigatórias |
|---|---|
| Input texto (obrigatório) | A, B, C, D |
| Input texto (opcional) | B, C, D |
| Input numérico | A (se obrigatório), B, E |
| Input data | A (se obrigatório), E (data inválida), valores limites (futuro/passado) |
| Select / dropdown | A (se obrigatório), valor não disponível na lista |
| Switch / toggle | Estado inicial (default), persistência |
| Textarea | Igual a input texto + B (boundary maior) |
| Upload de arquivo (obrigatório) | A, F, G, H |
| Upload de arquivo (opcional) | F, G, H |

## Categorias I-K reservadas para V2

Estas categorias **NÃO** entram na cobertura obrigatória da 1.1:

- **I — Race condition**: double-click, submit duplo, requests
  concorrentes
- **J — Network failure**: offline mid-request, timeout, 5xx do servidor
- **K — Estado inválido**: editar item excluído por outro user,
  permissão revogada durante a sessão

Motivo: são **flaky por natureza**. Exigem infraestrutura de retry
adequada (que ainda não temos). Habilitadas em versão futura via
playbook `cenarios-avancados` (opt-in por suíte crítica).

## Política de cobertura no validador

Em `contract_version: 1.1`, `validate_md_canonical.py` checa
(`check_v11_negative_coverage`):

- Cada campo do catálogo `## Campos e validações` precisa estar coberto
  por pelo menos 1 TC com `**Validation matrix**` que mencione o nome
  do campo
- Categorias obrigatórias (A-H conforme tipo de campo) devem aparecer
  na matriz

Severidade: **warning** em 1.1 (não bloqueia). Pode virar erro em 1.2
após maturidade.

## Anti-patterns proibidos

### A. Cobertura assimétrica

```markdown
## TC — Validar campos obrigatórios
### Passos
1. Tentar salvar sem preencher nada
   → Erros são exibidos.
```

❌ Genérico. 5 campos obrigatórios e 1 TC. Não cobre matriz nem por
campo individual.

### B. N TCs separados por cenário

```markdown
## TC1 — Nome vazio
## TC2 — Nome só espaços
## TC3 — Nome 256 chars
## TC4 — Nome emoji
## TC5 — Nome script tag
... (mais 10 TCs)
```

❌ Explosão de TCs. AT inflada. Difícil revisar.

### C. Matriz sem categoria explícita

```markdown
**Validation matrix**:
| Cenário | Input | Esperado |
|---|---|---|
| Caso 1 | "X" | OK |
| Caso 2 | "" | Erro |
```

⚠️ Faltando coluna `Categoria` (A-H). Sem ela, não dá pra validar
cobertura mínima por tipo de campo.

## Quando NÃO aplicar

- TCs de **fluxo** (navegação, ação que dispara comportamento). Cenários
  negativos cobrem **inputs**, não fluxos.
- TCs de **integração** (API, DB) — esses têm matriz própria.
- Campos hardcoded ou somente leitura — não há entrada do usuário.

## Referências

- [CONTRACT.md §15](../../../../CONTRACT.md) — versão 1.1
- [validate_md_canonical.py — check_v11_negative_coverage](../../../scripts/validate_md_canonical.py)
- Bugs detectados em Modelos (2026-05-22) — motivação desta skill
