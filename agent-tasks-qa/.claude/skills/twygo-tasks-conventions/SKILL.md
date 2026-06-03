---
name: twygo-tasks-conventions
description: Convenções da Twygo para quebra de atividades de QA — regras de agrupamento/desmembramento, nomenclatura QA [Bloco].[Num], template de descrição (Relacionado a / RNs / Validar), estimativas base, descrições padrão das atividades fixas (Reteste/Documentação/Deploy) e textos padrão dos cenários transversais (Feature flag, Ambientes adicionais, Beta/Launch). Carregada automaticamente quando o agente trabalha com quebra de atividades de QA.
user-invocable: false
---

# Convenções da Twygo — Quebra de Atividades de QA

## 1. Agrupamento e Desmembramento

### Regra geral

| Padrão na atividade de Dev | Atividade de QA gerada |
|---|---|
| Formulário com múltiplas abas | **1 atividade por aba** (ex: Identificação, Estilo, Estrutura, Imagem, Áudio) |
| Dois fluxos distintos | **1 atividade por fluxo** (ex: criação de Aula + criação de Página) |
| Funcionalidade simples e coesa | **1 atividade** (ex: filtros + busca, geração de previews) |
| Atividade transversal | **1 atividade individual e separada** — nunca agrupada |

### Atividades transversais (sempre separadas)

Sempre criar atividades **individuais** para:

1. **Banco Histórico** — exclusão por organização via worker `HistoricBaseCron`
2. **Logs / Auditoria** — registros de operações CRUD
3. **Trial** — comportamento em conta trial (setup/teardown)
4. **Feature flag** — flag on/off + transição entre estados
5. **Ambientes adicionais** — Beta automático/manual, Launch, configurações por env
6. **Permissões** — quando perfis distintos afetam o comportamento (Admin/Gestor/Instrutor/Aluno)

> Mesmo que a planilha de Dev junte tudo em uma única atividade transversal, **a QA quebra em itens separados**.

## 2. Nomenclatura

### Atividades com bloco definido

Formato: `QA [Bloco].[Num] - [Nome da Funcionalidade]`

Exemplos:
- `QA 1.1 - Listagem Básica`
- `QA 1.2 - Filtros da Listagem`
- `QA 2.3 - Indexação de Documentos (Files Ingestor)`
- `QA 3.1 - Criação de Aula`
- `QA 3.2 - Criação de Página`

> O **bloco** da QA deve **espelhar** o bloco da atividade de Dev correspondente. Se Dev 2.5 origina uma QA, ela é `QA 2.X` (X = sequência dentro do bloco 2 de QA).

### Atividades transversais (sem bloco)

Formato: `QA x.x - [Nome]`

Exemplos:
- `QA x.x - Banco Histórico`
- `QA x.x - Logs`
- `QA x.x - Trial`
- `QA x.x - Feature flag`
- `QA x.x - Ambientes adicionais`
- `QA x.x - Beta / Launch`
- `QA x.x - Permissões`

## 3. Template de Descrição (obrigatório)

Toda atividade de QA do tipo `Execução de testes` deve ter descrição neste formato:

```
Relacionado a: [ID(s) do Dev]
RNs: [Lista de RNs cobertas]

Validar:
* [Ponto de validação 1]
* [Ponto de validação 2]
* [...]
```

### Exemplo bem feito

```
Relacionado a: Dev 1.1
RNs: RN 4, RN 5

Validar:
* Campos da aba Identificação (Nome, Descrição) — obrigatórios, limites de caracteres, caracteres especiais
* Toast de sucesso ao salvar
* Validação de campos vazios + mensagens de erro com texto literal
* Persistência ao recarregar a página
* Mobile (responsive via DevTools)
```

### Exemplo ruim (NÃO fazer)

```
Validar:
* Funcionamento geral
* Comportamento esperado
* Testes em geral
```

Os pontos devem ser **específicos** e **derivados das RNs** — nunca genéricos.

## 4. Estimativas Base (com calibração)

Antes de fixar a estimativa, **ler a estrutura de `../agent-playwright/`** para entender o que já existe:

```
Glob: ../agent-playwright/src/**/*.ts                  → page objects, fixtures, helpers
Glob: ../agent-playwright/projects/*/specs/**/*.spec.ts → specs já implementadas
```

Tabela base:

| Tipo de Atividade | Estimativa Base | Critério |
|---|---|---|
| Análise de testes | 8h–16h | Proporcional ao número total de RNs e atividades de Dev |
| Execução — Listagem simples | 2h–4h | Poucos seletores, sem lógica condicional |
| Execução — Formulário/Cadastro | 4h–8h | Múltiplos campos, validações, estados condicionais |
| Execução — Integração/Microserviço | 4h–6h | Mock de fila, banco vetorial ou API externa |
| Execução — Banco Histórico | 2h | Asserções em banco via query helper |
| Execução — Trial | 2h | Setup/teardown de conta trial |
| Execução — Logs | 2h | Asserções em tabelas de log |
| Execução — Feature flag | 2h–4h | Cenários com flag on/off via fixture ou seed |
| Execução — Ambientes adicionais | 4h | Configuração de contexto e variáveis de ambiente |
| Deploy | 1h | Fixo |

### Como ajustar

- **Reduzir** quando: page object já existe / fixture reutilizável já implementada / padrão de teste estabelecido.
- **Aumentar** quando: cenário inédito / múltiplos sistemas envolvidos / regras de negócio com muitas variações.

### Fator de automação por agente

A tabela base acima reflete **escrita manual** de testes Playwright. Neste monorepo a
execução é conduzida por agentes (`agent-playwright` gera specs, `agent-at` gera
análise/XMind/XML). O esforço humano real por atividade é **recon live
(rotas/seletores/comportamentos) + revisar specs gerados + rodar/estabilizar +
diagnosticar bugs reais** — substancialmente menor que codar à mão.

Aplicar **fator ~0,4–0,5×** sobre a tabela base, com **pisos**:

- **Piso ~2h** por atividade real (recon + review + estabilização têm custo fixo).
- **~3–4h** para fluxos com muito estado, integração externa ou alto risco (ex.: lazy
  migration, contrato cross-projeto, query recursiva).
- **Análise de testes**: o `agent-at` automatiza a geração; humano valida →
  reduzir proporcionalmente (ex.: 16h manual → ~10h).

**Não** aplicar o fator quando: cenário 100% inédito sem page object nem fixture (a
primeira atividade que constrói a base reutilizável paga mais), ou validação fora do
E2E (DB/API/manual).

> Caso real (Mapa de Competências, 2026-06-02): quebra de 25 atividades + análise caiu
> de **154h (manual) → 96h (agente)**, ~38% de redução.

> "Buffer de retrabalho" **NÃO existe mais** — nunca incluir.

## 5. Descrições Padrão (atividades fixas)

### Análise de testes

```
- Mapa mental (utilizando estrutura para conversão em .xml, com suítes, casos de testes - título, objetivo, pré-requisitos -, passos e resultado esperado)
- Converter .xmind para .xml
- Preparar estrutura (suítes de testes) e importar casos de testes para Testlink
- Criar plano de testes/baselines
- Adicionar e atribuir casos para execução
```

### Reteste — Repasse

```
Execução desta atividade será apenas se BUG's críticos e/ou muitos retrabalhos | Pode ser cancelada | Validar principalmente fluxos principais / ótimos | Última atividade de teste, alocada após conclusão de todos os testes (execução + retrabalhos)
```

### Documentação — Usabilidade

```
Atividade destinada a criação de documentação de apoio para o time de suporte sobre as funcionalidades, configurações
```

### Documentação — Vídeo

```
Obs.: 5 dias corridos antes da data de entrega (prazo para edição vídeo pelo time de Marketing)
```

### Indiretos - Cerimonias da Equipe — Review

```
Review
```

### Deploy — Gerar versão para Deploy (dd/mm)

```
Gerar versão para deploy
```

## 6. Descrições Padrão (atividades transversais de QA)

### QA x.x - Feature flag

```
Relacionado a: [ID(s) do Dev relacionados]
RNs: [Lista de RNs cobertas, se aplicável]

Validar:
* Feature flag desabilitada — funcionalidade inacessível / submenu não exibido
* Feature flag habilitada — funcionalidade acessível / submenu exibido + utilização completa
* Desabilitar feature flag após uso — comportamento de degradação
```

### QA x.x - Ambientes adicionais

```
Relacionado a: [ID(s) do Dev relacionados]
RNs: [Lista de RNs cobertas, se aplicável]

Validar:
* Impactos, restrições e observações em ambientes adicionais
* Configuração de variáveis específicas por ambiente
* Validação em Beta (automático e manual) quando aplicável
```

### QA x.x - Beta / Launch

```
Relacionado a: [ID(s) do Dev relacionados]
RNs: [Lista de RNs cobertas, se aplicável]

Validar:
* Plano de liberação com Beta automático ou manual
* Comportamento em organizações Beta vs Launch
* Transição Beta → Launch (quando aplicável)
```

### QA x.x - Banco Histórico

```
Relacionado a: [ID(s) do Dev relacionados]
RNs: [Lista de RNs cobertas, se aplicável]

Validar:
* Worker HistoricBaseCron executa exclusão da organização corretamente
* Registros das tabelas impactadas são removidos / arquivados
* Cascata em FKs (quando aplicável)
* Comportamento se a organização for reativada (se aplicável)
```

### QA x.x - Logs

```
Relacionado a: [ID(s) do Dev relacionados]
RNs: [Lista de RNs cobertas, se aplicável]

Validar:
* Criação, edição e exclusão são registradas corretamente
* Estrutura do registro (usuário, timestamp, ação, payload)
* Tabela(s) de log impactada(s) — checar via query helper
```

### QA x.x - Trial

```
Relacionado a: [ID(s) do Dev relacionados]
RNs: [Lista de RNs cobertas, se aplicável]

Validar:
* Setup de conta trial com a funcionalidade
* Comportamento durante o período de trial
* Teardown da conta trial (exclusão pela Sophia/Super Admin)
* Restrições do trial vs conta paga (quando aplicável)
```

## 7. Estrutura Obrigatória das Planilhas

### Colunas (na ordem)

| Coluna | Conteúdo |
|---|---|
| `Tipo da atividade` | Tipo conforme lista de valores válidos |
| `Título da atividade` | Título da atividade |
| `Descrição` | Conforme template |
| `Esforço estimado` | Número em horas (sem `h`) |
| `Início estimado` | Vazio |
| `Término estimado` | Vazio |
| `Responsável` | Vazio |

### Atividades finais obrigatórias (sempre nesta ordem)

1. `Reteste` / Repasse / *(sem estimativa)*
2. `Documentação` / Usabilidade / *(sem estimativa)*
3. `Documentação` / Vídeo / *(sem estimativa)*
4. `Indiretos - Cerimonias da Equipe` / Review / *(sem estimativa)*
5. `Deploy` / Gerar versão para Deploy (dd/mm) / `1`
6. `Total` / *(vazio)* / *(sem estimativa)*

## 8. Casos Especiais (sempre alertar o usuário)

| Caso | Comportamento + alerta |
|---|---|
| Atividade Dev menciona "banco histórico" / "logs" / "trial" sem bloco | Criar QA `x.x` + alertar que o Dev precisa documentar as tabelas impactadas |
| Documento sem RNs numeradas | Inferir + alertar para validação humana |
| Planilha sem aba `produto` ou `account_id` numérico | Deixar em branco + alertar |
| Atividade Dev é só Spike / Teste de mesa | Preservar na Planilha Completa + **não gerar** QA correspondente |

## 9. Regra Fundamental

A quebra de QA deve ser **completa** e **rastreável**:

- Toda atividade de QA tem rastreio para Dev (campo `Relacionado a:`)
- Toda atividade de QA cobre RNs específicas (campo `RNs:`)
- Toda atividade de QA tem pontos de validação concretos (campo `Validar:`)
- Estimativas refletem **reuso real** da estrutura do `agent-playwright`, não chutes arbitrários

Esta é uma quebra de **planejamento** — o detalhamento granular dos cenários acontece depois no `agent-at` (XMind/TestLink). Mas a planilha aqui já precisa ser fiel ao escopo real do projeto.
