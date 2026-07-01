# Casos de teste — Registros de Aprendizagem

[← Voltar ao dashboard](index.md)

Lista detalhada por testsuite. Cada caso traz: o que era esperado pelo XML, quais steps foram executados, evidências (screenshots/trace), texto pronto pra registro de bug e — quando houver falha — uma explicação em PT-BR do motivo.

## Extração de dados da Evidência (export em massa de anexos)

_5 caso(s) — 4 aprovado(s) (1 automatizado + 3 por validação manual), 0 falha(s), 1 ignorado(s)_

### ✅ Aprovado · TC1 · Validar estrutura interna do pacote ZIP de evidências · 🔴 Crítico

<a id="validar-estrutura-interna-do-pacote-zip-de-evidencias"></a>_Arquivo:_ `tc1-estrutura-zip-pasta-por-pessoa.spec.ts` · _Duração:_ 16.18s · _Browser:_ chromium

**Sumário (objetivo do caso):** Garantir que o ZIP de evidências organiza os arquivos por pessoa, conforme estrutura do spike de export (pasta por participante).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências variadas (PDF, JPG) anexadas, incluindo volume suficiente para gerar múltiplos pacotes
Conteúdo compartilhado (mirror) com participantes e certificados para o cenário de inclusão de mirrors
Infraestrutura de export assíncrono ativa no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Disparar extração de Evidências como Admin sobre escopo com registros de 2 pessoas diferentes | Toast de "Extração iniciada" exibida. | ✅ | — | 10.40s |
| 2 | Baixar o pacote gerado via notificação do sino (etapa manual) | ZIP contém uma pasta por pessoa (ex: "joao_silva/", "maria_santos/") com os arquivos de evidência/certificado dentro de cada pasta. | ✅ | — | 0.00s |

**Evidências:**

_Sem evidências anexadas._


---

### ⊘ Ignorado · TC2 · Validar registro de falhas parciais no export · 🔴 Crítico

<a id="validar-registro-de-falhas-parciais-no-export"></a>_Arquivo:_ `tc2-log-falhas-parciais.spec.ts` · _Duração:_ 0.00s · _Browser:_ chromium

> **⊘ Por que foi ignorado:** [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario.

**Sumário (objetivo do caso):** Garantir que arquivos com falha não interrompem o export e são informados ao admin (decisão do spike: falha parcial continua).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências variadas (PDF, JPG) anexadas, incluindo volume suficiente para gerar múltiplos pacotes
Conteúdo compartilhado (mirror) com participantes e certificados para o cenário de inclusão de mirrors
Infraestrutura de export assíncrono ativa no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Disparar extração de Evidências sobre escopo contendo arquivo corrompido/removido do storage (condição simulada) | Extração processa sem abortar. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |
| 2 | Baixar o pacote e verificar o conteúdo (etapa manual) | Arquivo de erros (ex: "export_errors.txt") presente no ZIP listando os arquivos que falharam; demais arquivos íntegros. | ⊘ | Step não executado — [REVISAR] Motivo do skip não declarado no spec. Edite o `test.fixme(true, "[Categoria] motivo")` indicando uma das categorias canônicas: xml-desatualizado \| seed-ausente \| dep-externa \| bloqueio-temporario. | — |

**Evidências:**

_Sem evidências anexadas._

#### ⏳ Pendente — execução automatizada não realizada

- **Severidade do caso (XML):** Crítico
- **Categoria:** ⚠️ Não declarada
- **Motivo declarado pelo spec:** _ausente_
- **Próximo passo:** Editar o spec para declarar `test.fixme(true, '[Categoria] motivo')` com uma das categorias canônicas (xml-desatualizado | seed-ausente | dep-externa | bloqueio-temporario). Sem declaração, leitor leigo não sabe quem precisa agir.

**Roteiro do XML (para validação manual):**
1. Pré: Ambiente Stage configurado e acessível
1. Pré: Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
1. Pré: Usuário logado como Admin com acesso à caixa de e-mail de teste
1. Pré: Registros com evidências variadas (PDF, JPG) anexadas, incluindo volume suficiente para gerar múltiplos pacotes
1. Pré: Conteúdo compartilhado (mirror) com participantes e certificados para o cenário de inclusão de mirrors
1. Pré: Infraestrutura de export assíncrono ativa no ambiente
1. 1. Disparar extração de Evidências sobre escopo contendo arquivo corrompido/removido do storage (condição simulada)
1. 2. Baixar o pacote e verificar o conteúdo (etapa manual)

> Esse caso não bloqueia a build, mas precisa de validação manual ou ajuste no agente.


---

### ✅ Aprovado (validação manual) · TC3 · Validar split de export grande em múltiplos pacotes com notificação única · 🟡 Normal

<a id="validar-split-de-export-grande-em-multiplos-pacotes-com-notificacao-unica"></a>_Arquivo:_ `tc3-split-export-grande-notificacao-unica.spec.ts` · _Validação:_ manual (25/06/2026) · _Browser:_ —

> **✅ Validado manualmente:** o QA executou o roteiro manual e o caso foi **aprovado**. O spec permanece `test.fixme` no código porque o passo distintivo (volume acima do threshold de split + inspeção da notificação/links) não é automatizável por Playwright UI.

**Sumário (objetivo do caso):** Garantir que exports muito grandes podem gerar múltiplos ZIPs com uma única notificação contendo todos os links (decisão do spike: auto-split + notificação única).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências variadas (PDF, JPG) anexadas, incluindo volume suficiente para gerar múltiplos pacotes
Conteúdo compartilhado (mirror) com participantes e certificados para o cenário de inclusão de mirrors
Infraestrutura de export assíncrono ativa no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Disparar extração de Evidências sobre escopo de alto volume (acima do threshold de split) | Toast de "Extração iniciada" exibida. | ✅ | Validado manualmente — aprovado. | — |
| 2 | Aguardar a conclusão e abrir a notificação no sino (etapa manual) | Uma única notificação/e-mail é recebida contendo todos os links dos pacotes gerados. | ✅ | Validado manualmente — aprovado. | — |

**Evidências:**

_Sem evidências anexadas._

#### ✅ Validação manual concluída — aprovado

- **Severidade do caso (XML):** Normal
- **Como foi validado:** execução manual do roteiro pelo QA (25/06/2026).
- **Resultado:** aprovado — comportamento conforme o esperado no XML.
- **Nota:** o spec segue `test.fixme` porque o passo distintivo (volume acima do threshold de split + inspeção da notificação única com todos os links) não é automatizável por Playwright UI; o registro de aprovação é manual.


---

### ✅ Aprovado (validação manual) · TC4 · Validar expiração do link de download (TTL) · 🟡 Normal

<a id="validar-expiracao-do-link-de-download-ttl"></a>_Arquivo:_ `tc4-expiracao-link-ttl.spec.ts` · _Validação:_ manual (25/06/2026) · _Browser:_ —

> **✅ Validado manualmente:** o QA executou o roteiro manual e o caso foi **aprovado**. O spec permanece `test.fixme` no código porque exige massa preparada (link de export com TTL já expirado), não reproduzível de forma determinística por Playwright UI.

**Sumário (objetivo do caso):** Garantir que link expirado não permite download e o caminho é gerar nova extração (TTL sugerido: 7 dias — Spike S8).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências variadas (PDF, JPG) anexadas, incluindo volume suficiente para gerar múltiplos pacotes
Conteúdo compartilhado (mirror) com participantes e certificados para o cenário de inclusão de mirrors
Infraestrutura de export assíncrono ativa no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Acessar um link de download de extração com TTL expirado (massa preparada/simulada) | Download é negado (link inválido/expirado). | ✅ | Validado manualmente — aprovado. | — |
| 2 | Disparar nova extração do mesmo escopo | Novo pacote é gerado com link válido. | ✅ | Validado manualmente — aprovado. | — |

**Evidências:**

_Sem evidências anexadas._

#### ✅ Validação manual concluída — aprovado

- **Severidade do caso (XML):** Normal
- **Como foi validado:** execução manual do roteiro pelo QA (25/06/2026).
- **Resultado:** aprovado — link com TTL expirado nega o download e a nova extração gera link válido, conforme o esperado no XML.
- **Nota:** o spec segue `test.fixme` porque exige massa preparada (link com TTL vencido), não reproduzível de forma determinística por Playwright UI; o registro de aprovação é manual.


---

### ✅ Aprovado (validação manual) · TC5 · Validar inclusão de participantes de conteúdos compartilhados (mirror) · 🔴 Crítico

<a id="validar-inclusao-de-participantes-de-conteudos-compartilhados-mirror"></a>_Arquivo:_ `tc5-inclusao-mirrors.spec.ts` · _Validação:_ manual (25/06/2026) · _Browser:_ —

> **✅ Validado manualmente:** o QA executou o roteiro manual e o caso foi **aprovado**. O spec permanece `test.fixme` no código porque o passo distintivo (inspeção do ZIP confirmando os anexos dos participantes do conteúdo espelhado) não é automatizável por Playwright UI.

**Sumário (objetivo do caso):** Garantir que o export inclui anexos de alunos inscritos em eventos espelhados (lição do spike: mirrors precisam de UNION na query).

**Pré-condições:**

```
Ambiente Stage configurado e acessível
Funcionalidade "Registros de Aprendizagem" habilitada no contrato da organização
Usuário logado como Admin com acesso à caixa de e-mail de teste
Registros com evidências variadas (PDF, JPG) anexadas, incluindo volume suficiente para gerar múltiplos pacotes
Conteúdo compartilhado (mirror) com participantes e certificados para o cenário de inclusão de mirrors
Infraestrutura de export assíncrono ativa no ambiente
```

**Passos do caso (XML/TestLink + execução Playwright):**

_Cada linha reproduz um passo do XML; a coluna **Status** traz o resultado da execução (do step Allure correspondente). Linhas com "Pré-condição" são da execução automatizada (login, navegação inicial) — não fazem parte do roteiro do XML._

| # | Ação do passo | Resultado esperado | Status | Notas | Duração |
|---|---|---|:---:|---|---:|
| 1 | Disparar extração de Evidências sobre escopo que inclui conteúdo compartilhado (mirror) com participantes e certificados | Extração processa. | ✅ | Validado manualmente — aprovado. | — |
| 2 | Baixar o pacote e verificar as pastas (etapa manual) | Anexos dos participantes do conteúdo espelhado CONSTAM no pacote (não foram omitidos). | ✅ | Validado manualmente — aprovado. | — |

**Evidências:**

_Sem evidências anexadas._

#### ✅ Validação manual concluída — aprovado

- **Severidade do caso (XML):** Crítico
- **Como foi validado:** execução manual do roteiro pelo QA (25/06/2026).
- **Resultado:** aprovado — os anexos dos participantes do conteúdo espelhado (mirror) CONSTAM no pacote, conforme o esperado no XML.
- **Nota:** o spec segue `test.fixme` porque o passo distintivo (inspeção do ZIP) não é automatizável por Playwright UI; o registro de aprovação é manual.


---
