# Agente Genérico de Execução de Testes Playwright para Twygo
## Recomendações Finais e Guia de Implementação

**Autor:** Manus AI
**Data:** 23 de Abril de 2026
**Versão:** 1.0

---

## Sumário Executivo

Este documento apresenta uma estratégia completa para a criação de um **agente genérico de execução de testes frontend** utilizando Playwright e Claude Code. O agente será capaz de ler análises de teste em formato XML (geradas a partir do XMind), interpretar casos de teste complexos e executar automaticamente os scripts de teste correspondentes, gerando relatórios detalhados.

A solução proposta integra as melhores práticas de automação de testes com a arquitetura moderna de agentes de IA, garantindo escalabilidade, manutenibilidade e reutilização em múltiplos projetos da Twygo.

---

## 1. Visão Geral da Solução

### 1.1. Objetivo Principal

Criar um agente Claude Code que funcione como um **orquestrador inteligente de testes**, capaz de:

1. Ler e interpretar arquivos XML de análise de teste (com casos de teste detalhados)
2. Mapear automaticamente os passos de teste para ações do Playwright
3. Gerar scripts de teste seguindo o padrão Page Object Model (POM)
4. Executar os testes e capturar resultados
5. Gerar relatórios em HTML com screenshots de falhas

### 1.2. Escopo do Projeto

O agente será **genérico** (reutilizável em múltiplos projetos), mas cada projeto terá seu próprio arquivo XML de entrada, permitindo que a lógica do agente permaneça constante enquanto os dados de teste variam.

---

## 2. Avaliação das Skills Sugeridas

A tabela abaixo resume a avaliação de cada skill proposta, indicando seu nível de recomendação e o papel específico no projeto:

| Skill | Recomendação | Nível | Propósito | Observações |
|-------|--------------|-------|----------|------------|
| **Playwright CLI** | ✅ Essencial | Crítico | Execução de testes e automação de navegador | Núcleo da solução; eficiente em tokens; daemon persistente |
| **Playwright Frontend Testing** | ✅ Recomendada | Estratégico | Orientação metodológica para testes robustos | Fornece framework de pensamento; evita testes flaky |
| **Chrome DevTools MCP** | ✅ Recomendada | Suporte | Depuração avançada e análise de performance | Use apenas para falhas complexas; consome mais tokens |
| **k6-docs** | ⚠️ Opcional | Futuro | Testes de carga e performance | Adicionar apenas se validação de carga for requisito |

### 2.1. Recomendações Detalhadas

#### Playwright CLI Skill (Essencial)

O Playwright CLI é a ferramenta principal de execução. Suas características fundamentais incluem:

- **Arquitetura de Daemon:** Mantém um processo de navegador persistente, eliminando custos de inicialização
- **Eficiência de Tokens:** Saída concisa do CLI com skills carregadas sob demanda
- **Ref-based Interaction:** Snapshots de acessibilidade com referências de elementos para interação determinística
- **Multi-browser Support:** Chrome, Firefox, WebKit e Edge

**Recomendação:** Integre como a ferramenta principal de execução. Configure o agente para usar o Playwright CLI para todos os comandos de navegação, interação e captura de estado.

#### Playwright Frontend Testing Skill (Recomendada)

Esta skill fornece um framework metodológico baseado na filosofia de **"Confiança por Minuto"**, priorizando determinismo sobre retries.

**Princípios Chave:**
- Testes falham por duas razões: produto quebrado OU teste mentindo
- Maximizar signal, minimizar "test is lying"
- Evitar testes instáveis através de determinismo

**Recomendação:** Incorpore os princípios desta skill no arquivo `claude.md` do agente. Instruir o agente a gerar testes que:
- Usem esperas explícitas em vez de sleeps
- Controlem RNG, tempo e rede
- Isolem testes completamente
- Usem localizadores resilientes (role, text, test-id)

#### Chrome DevTools MCP (Recomendada para Depuração)

O Chrome DevTools MCP fornece acesso profundo às ferramentas de debugging do navegador.

**Quando Usar:**
- Falhas de teste complexas que exigem inspeção de rede
- Análise de console messages com source maps
- Rastreamento de performance
- Debugging de Chrome Extensions

**Recomendação:** Configure como ferramenta de suporte, não como padrão. Instruir o agente a usar Chrome DevTools MCP apenas quando:
1. Um teste falhar
2. O motivo da falha não for óbvio
3. Análise profunda de rede/console for necessária

#### k6-docs Skill (Opcional)

O k6 é uma ferramenta de teste de carga moderna, não adequada para testes funcionais puros.

**Recomendação:** **Não incluir no escopo inicial**. Adicionar apenas se requisitos futuros exigirem validação de performance sob carga.

---

## 3. Arquitetura Proposta do Agente

### 3.1. Estrutura de Diretórios

A estrutura abaixo garante separação clara de responsabilidades e facilita a reutilização do agente em múltiplos projetos:

```
twygo-test-agent/
├── claude.md                          # Configuração e instruções do agente
├── SKILL.md                           # Metadata da skill principal
├── package.json                       # Dependências Node.js
├── playwright.config.ts               # Configuração base do Playwright
│
├── config/
│   ├── environment.json               # URLs, credenciais (por ambiente)
│   ├── project.config.json            # Configuração específica do projeto
│   └── playwright.config.ts           # Config avançada (se necessário)
│
├── inputs/
│   ├── test-analysis.xml              # Arquivo XML de análise de teste
│   ├── spike.md                       # Documentação de spike
│   ├── discovery.md                   # Descoberta de requisitos
│   └── activities-breakdown.md        # Quebra de atividades
│
├── src/
│   ├── pages/                         # Page Objects (POM)
│   │   ├── BasePage.ts                # Classe base com métodos comuns
│   │   ├── LoginPage.ts               # Exemplo: página de login
│   │   └── [DynamicPages].ts          # Geradas dinamicamente pelo agente
│   │
│   ├── fixtures/
│   │   ├── test-data.ts               # Dados de teste
│   │   └── custom-fixtures.ts         # Fixtures customizadas
│   │
│   └── utils/
│       ├── helpers.ts                 # Funções auxiliares
│       ├── constants.ts               # Constantes
│       └── logger.ts                  # Logging
│
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts              # Testes de autenticação
│   │   └── logout.spec.ts
│   │
│   ├── features/
│   │   └── [DynamicTests].spec.ts     # Gerados dinamicamente pelo agente
│   │
│   └── setup/
│       └── global-setup.ts            # Setup global (se necessário)
│
├── outputs/
│   ├── test-results.json              # Resultados em JSON
│   ├── test-report.html               # Relatório HTML
│   ├── screenshots/                   # Screenshots de falhas
│   └── traces/                        # Traces do Playwright
│
├── skills/
│   ├── twygo-xml-parser/              # Skill personalizada para parsear XML
│   │   ├── SKILL.md
│   │   ├── parser.ts
│   │   └── schema.xsd
│   │
│   ├── twygo-report-generator/        # Skill personalizada para gerar relatórios
│   │   ├── SKILL.md
│   │   ├── generator.ts
│   │   └── templates/
│   │
│   └── twygo-test-executor/           # Skill personalizada para executar testes
│       ├── SKILL.md
│       └── executor.ts
│
└── templates/
    ├── test-template.ts               # Template de teste Playwright
    ├── page-object-template.ts        # Template de Page Object
    ├── xml-schema.xsd                 # Schema para validar XMLs
    └── report-template.html           # Template de relatório
```

### 3.2. Fluxo de Execução

O agente deve seguir o seguinte fluxo de trabalho:

```
1. INICIALIZAÇÃO
   ├─ Ler arquivo de configuração (environment.json)
   ├─ Ler arquivo de configuração do projeto (project.config.json)
   └─ Validar estrutura de diretórios

2. ANÁLISE DE ENTRADA
   ├─ Ler arquivo XML de análise de teste (inputs/test-analysis.xml)
   ├─ Validar XML contra schema (XSD)
   ├─ Parsear casos de teste
   └─ Extrair passos e resultados esperados

3. GERAÇÃO DE CÓDIGO
   ├─ Identificar páginas/componentes únicos
   ├─ Gerar Page Objects (src/pages/)
   ├─ Gerar scripts de teste (tests/)
   └─ Atualizar fixtures e dados de teste

4. EXECUÇÃO DE TESTES
   ├─ Compilar/transpile TypeScript
   ├─ Executar testes com Playwright
   ├─ Capturar resultados e screenshots
   └─ Gerar traces (se habilitado)

5. RELATÓRIO E SAÍDA
   ├─ Processar resultados
   ├─ Gerar relatório HTML
   ├─ Salvar outputs em outputs/
   └─ Retornar sumário ao usuário
```

---

## 4. Processamento de Arquivos XML

### 4.1. Estrutura Esperada do XML

O arquivo XML de análise de teste deve seguir uma estrutura bem definida. Exemplo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<test-analysis>
  <metadata>
    <project>Twygo Frontend - Módulo de Autenticação</project>
    <version>1.0</version>
    <date>2026-04-24</date>
    <author>QA Team</author>
  </metadata>
  
  <test-scenarios>
    <scenario id="SC001" name="Autenticação de Usuários">
      <description>Validar fluxo de login com credenciais válidas e inválidas</description>
      
      <test-case id="TC001" name="Login com credenciais válidas">
        <preconditions>
          <condition>Usuário não autenticado</condition>
          <condition>Navegador em estado limpo</condition>
        </preconditions>
        
        <steps>
          <step id="S001" action="navigate" target="login_page">
            Navegar para página de login
          </step>
          <step id="S002" action="fill" locator="email_input" value="user@example.com">
            Preencher campo de email com "user@example.com"
          </step>
          <step id="S003" action="fill" locator="password_input" value="SecurePassword123">
            Preencher campo de senha com "SecurePassword123"
          </step>
          <step id="S004" action="click" locator="login_button">
            Clicar no botão "Entrar"
          </step>
          <step id="S005" action="wait_for_navigation">
            Aguardar redirecionamento para dashboard
          </step>
        </steps>
        
        <expected-results>
          <result id="R001" assertion="url_contains" value="/dashboard">
            URL deve conter "/dashboard"
          </result>
          <result id="R002" assertion="element_visible" locator="user_profile_menu">
            Menu de perfil do usuário deve estar visível
          </result>
          <result id="R003" assertion="text_equals" locator="welcome_message" value="Bem-vindo, User">
            Mensagem de boas-vindas deve exibir "Bem-vindo, User"
          </result>
        </expected-results>
      </test-case>
      
      <test-case id="TC002" name="Login com credenciais inválidas">
        <!-- Similar structure -->
      </test-case>
    </scenario>
  </test-scenarios>
</test-analysis>
```

### 4.2. Skill Personalizada: twygo-xml-parser

Recomenda-se criar uma skill personalizada responsável por parsear o XML e converter para um formato JSON amigável:

```typescript
// Exemplo de saída do parser
{
  "project": "Twygo Frontend - Módulo de Autenticação",
  "scenarios": [
    {
      "id": "SC001",
      "name": "Autenticação de Usuários",
      "testCases": [
        {
          "id": "TC001",
          "name": "Login com credenciais válidas",
          "steps": [
            {
              "id": "S001",
              "action": "navigate",
              "target": "login_page"
            },
            // ... mais passos
          ],
          "assertions": [
            {
              "id": "R001",
              "type": "url_contains",
              "value": "/dashboard"
            },
            // ... mais assertions
          ]
        }
      ]
    }
  ]
}
```

---

## 5. Implementação do Agente (claude.md)

O arquivo `claude.md` deve conter as instruções completas para o agente. Abaixo está um template estruturado:

```markdown
# Agente de Testes Playwright - Twygo

## Visão Geral
Você é um agente especializado em automação de testes frontend para a plataforma Twygo.
Seu objetivo é ler análises de teste em XML e gerar/executar automaticamente scripts de teste.

## Princípios Fundamentais

### 1. Confiança por Minuto
- Testes devem ser determinísticos, não flaky
- Maximizar signal, minimizar "test is lying"
- Usar esperas explícitas, não sleeps
- Controlar RNG, tempo e rede

### 2. Isolamento de Testes
- Cada teste é completamente independente
- Limpar estado entre testes
- Usar fixtures para dados compartilhados

### 3. Page Object Model (POM)
- Encapsular seletores em classes Page Object
- Criar métodos reutilizáveis para ações comuns
- Manter testes limpos e legíveis

## Fluxo de Trabalho

1. **Leitura de Contexto**
   - Ler environment.json e project.config.json
   - Validar estrutura de diretórios

2. **Análise de Entrada**
   - Ler XML de análise de teste
   - Usar skill twygo-xml-parser para converter em JSON
   - Validar estrutura

3. **Geração de Código**
   - Identificar páginas/componentes
   - Gerar Page Objects
   - Gerar scripts de teste

4. **Execução**
   - Executar testes com Playwright CLI
   - Capturar screenshots e traces
   - Processar resultados

5. **Relatório**
   - Gerar relatório HTML
   - Salvar em outputs/

## Skills Utilizadas

- **Playwright CLI**: Execução de testes e automação
- **Playwright Frontend Testing**: Orientação metodológica
- **Chrome DevTools MCP**: Depuração avançada (quando necessário)
- **twygo-xml-parser**: Parsing de XML
- **twygo-report-generator**: Geração de relatórios

## Convenções

- TypeScript com strict mode
- Nomes em camelCase para variáveis/funções
- Nomes em PascalCase para classes
- Comentários em português
```

---

## 6. Boas Práticas de Implementação

### 6.1. Page Object Model (POM)

Exemplo de implementação de um Page Object:

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Senha');
    this.loginButton = page.getByRole('button', { name: 'Entrar' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
```

### 6.2. Testes Robustos

Exemplo de teste bem estruturado:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Autenticação', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('login com credenciais válidas', async ({ page }) => {
    await loginPage.login('user@example.com', 'SecurePassword123');
    
    // Usar esperas explícitas, não sleeps
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('button', { name: 'Perfil' })).toBeVisible();
  });

  test('login com credenciais inválidas', async () => {
    await loginPage.login('user@example.com', 'WrongPassword');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Credenciais inválidas');
  });
});
```

---

## 7. Configuração do Ambiente

### 7.1. environment.json

```json
{
  "staging": {
    "baseUrl": "https://staging.twygo.com",
    "credentials": {
      "email": "test@twygo.com",
      "password": "${TEST_PASSWORD}"
    },
    "timeout": 30000
  },
  "production": {
    "baseUrl": "https://app.twygo.com",
    "credentials": {
      "email": "test@twygo.com",
      "password": "${TEST_PASSWORD}"
    },
    "timeout": 30000
  }
}
```

### 7.2. project.config.json

```json
{
  "testAnalysisFile": "inputs/test-analysis.xml",
  "environment": "staging",
  "browsers": ["chromium", "firefox"],
  "headless": true,
  "reporting": {
    "format": "html",
    "outputDir": "outputs",
    "screenshotsOnFailure": true
  },
  "performance": {
    "enableTracing": true,
    "enableVideo": false
  }
}
```

---

## 8. Próximos Passos para Implementação

### Fase 1: Estrutura Base (Semana 1)
1. Criar estrutura de diretórios
2. Configurar `claude.md` com instruções do agente
3. Criar `package.json` e `playwright.config.ts`
4. Implementar skill `twygo-xml-parser`

### Fase 2: Geração de Código (Semana 2)
1. Implementar gerador de Page Objects
2. Implementar gerador de scripts de teste
3. Criar templates base

### Fase 3: Execução e Relatório (Semana 3)
1. Integrar Playwright CLI
2. Implementar skill `twygo-report-generator`
3. Testar com projeto de referência

### Fase 4: Otimização e Documentação (Semana 4)
1. Integrar Chrome DevTools MCP para depuração
2. Criar documentação completa
3. Validar com múltiplos projetos Twygo

---

## 9. Prompt para Iniciar no Claude Code

Para iniciar o projeto no Claude Code, use o seguinte prompt:

```
Você atuará como um Engenheiro de Qualidade Sênior e Arquiteto de Automação de Testes. 
Nosso objetivo é criar um Agente Genérico de Execução de Testes Frontend com Playwright 
para a plataforma Twygo.

Este agente será reutilizável em múltiplos projetos. Ele deve ler um arquivo XML de análise 
de teste (gerado a partir do XMind) contendo cenários e casos de teste detalhados, interpretá-lo 
e gerar/executar automaticamente os scripts de teste no Playwright.

Por favor, inicialize a estrutura do projeto seguindo estas diretrizes:

[Incluir as seções de architecture_and_structure, skills_configuration e execution_flow 
do arquivo prompt_claude_code.md fornecido]
```

---

## 10. Referências e Recursos

- **Playwright Docs:** https://playwright.dev/docs/best-practices
- **Playwright CLI:** https://playwright.dev/agent-cli/introduction
- **Page Object Model:** https://playwright.dev/docs/pom
- **Claude Skills:** https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- **Prompting Best Practices:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- **Chrome DevTools MCP:** https://github.com/ChromeDevTools/chrome-devtools-mcp

---

## Conclusão

Este documento fornece uma base sólida para a criação de um agente genérico de testes Playwright para a Twygo. A arquitetura proposta garante escalabilidade, reutilização e manutenibilidade, permitindo que novos projetos sejam integrados rapidamente com mínima configuração.

O agente será capaz de transformar análises de teste complexas em suítes de testes automatizadas robustas, reduzindo significativamente o tempo de implementação e aumentando a confiabilidade dos testes.

**Próximo Passo:** Copie o prompt fornecido na Seção 9 e cole-o no Claude Code para iniciar a implementação do projeto.
