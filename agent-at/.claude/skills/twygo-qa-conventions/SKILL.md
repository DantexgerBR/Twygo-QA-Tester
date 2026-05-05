---
name: twygo-qa-conventions
description: Convenções de QA da Twygo para criação de casos de teste. Contém regras de hierarquia do XMind, formato de notas, pré-condições, marcadores de prioridade, nível de detalhamento e cenários obrigatórios por tipo de projeto. Carregado automaticamente quando o agente trabalha com análise de teste.
user-invocable: false
---

# Convenções de QA - Twygo

## 1. Hierarquia Obrigatória no XMind

```
Tópico Central (Nome do Projeto - Análise de Teste)
└── Suíte de Teste (título descritivo)
    └── Caso de Teste (com NOTE + MARKER de prioridade)
        └── Passo: Ação executada pelo testador
            └── Resultado Esperado (com textos literais)
```

## 2. Notas (Notes)

- **Posição**: NO TÓPICO DO CASO DE TESTE. NUNCA nos subtópicos de passos.
- **Formato**:

```
Objetivo claro e específico do caso de teste.
[PRECONDITIONS]
Pré-condição 1
Pré-condição 2
```

## 3. Pré-condições

Incluir APENAS:
- Configurações de ambiente (ex: "Ambiente Stage configurado")
- Massa de dados (ex: "Usuário de teste cadastrado na base")
- Feature flags (ex: "Feature flag X habilitada")
- Funcionalidades habilitadas em contrato (ex: "Funcionalidade 'Clientes empresariais' habilitada no contrato")
- Perfil de acesso (ex: "Usuário logado como Admin")
- Estado da aplicação (ex: "Modal de adicionar feriado aberto")

NUNCA incluir:
- Referências a atividades de desenvolvimento (ex: "Dev 1.2 concluído")
- Referências a outros casos de teste como dependência

## 4. Marcadores de Prioridade

Obrigatórios em TODOS os casos de teste:

| Marcador | Nível | Quando usar |
|----------|-------|-------------|
| `priority-1` | Alto | Fluxos críticos, happy path, bloqueadores, funcionalidades core |
| `priority-2` | Médio | Validações complementares, cenários alternativos, campos opcionais |
| `priority-3` | Baixo | Cenários de borda, performance, usabilidade, cosméticos |

## 5. Nível de Detalhamento dos Passos

Os casos de teste serão usados para **automação** (Playwright para UI, Pytest+Requests para API). Cada passo deve ser:

- **Ação**: Descrever EXATAMENTE o que fazer
  - UI: "Clicar no botão 'Salvar'" / "Preencher o campo 'Nome' com 'João Silva'"
  - API: "Enviar POST /api/v2/users com payload: {\"first_name\": \"João\", \"email\": \"joao@teste.com\"}"
- **Resultado Esperado**: Incluir TEXTOS LITERAIS exatos da documentação
  - UI: "Toast message exibida: 'Alterações salvas com sucesso.'" / "Placeholder exibido: 'Ex: Natal'"
  - API: "Status code 201 Created. Body contém: {\"user_id\": int, \"situation\": \"active\"}"

## 6. Textos Literais Obrigatórios nos Resultados Esperados

Extrair da documentação e incluir:
- Textos de tooltips
- Placeholders de campos
- Labels de campos e botões
- Mensagens de toast (sucesso e erro)
- Títulos e corpos de modais
- Mensagens de validação de campos
- Status codes e mensagens de resposta de API

## 7. Cenários Obrigatórios por Tipo de Projeto

### 7.1 Projetos UI/Funcional

1. **Navegação e acesso** à funcionalidade
2. **Validação de campos**:
   - Tipos de caracteres aceitos (letras, números, especiais, acentos)
   - Limites de caracteres (mínimo e máximo)
   - Atalhos (Ctrl+C, Ctrl+V em campos)
   - Máscaras e formatos
   - Campo obrigatório vazio → mensagem de erro com texto exato
   - Valor inválido → mensagem de erro com texto exato
   - Espaços em branco → tratamento
3. **Validação de componentes**:
   - Tabelas: colunas existentes, valores exibidos, alinhamento, ordenação por coluna
   - Modais: título, corpo, botões, comportamento ao fechar (X e clique fora)
   - Drawers: abertura, fechamento, conteúdo
   - Switches: estados ON/OFF, persistência após salvar
   - Selects/Dropdowns: opções disponíveis, seleção, limpeza
4. **Cenários de sucesso** (happy path completo)
5. **Cenários de falha**:
   - Salvar sem campos obrigatórios
   - Inserir valores inválidos
   - Ultrapassar limites de caracteres
   - Bordas vermelhas em campos com erro
6. **Toast messages**: Sucesso e erro com textos exatos
7. **Persistência**: Salvar, recarregar página, verificar dados mantidos
8. **Mobile**: Validação via DevTools (responsive)
9. **Logs**: Criação, edição, exclusão registrados corretamente
10. **Banco histórico**: Worker HistoricBaseCron exclui registros da organização corretamente
11. **Feature flag**: Habilitada (funcionalidade acessível), desabilitada (funcionalidade inacessível), transição entre estados
12. **Compartilhamento**: Cópia livre, cópia controlada (espelho), preservação de configurações
13. **Duplicar conteúdos**: Preservação de configurações ao duplicar
14. **Permissões**: Validar acesso por Admin, Gestor, Instrutor, Aluno (quando aplicável)
15. **Retrocompatibilidade**: Dados/funcionalidades existentes antes da feature continuam funcionando

### 7.2 Projetos de API

1. **Sucesso** com dados mínimos obrigatórios
2. **Sucesso** com todos os campos opcionais preenchidos
3. **Erro**: Campos obrigatórios faltantes (400/422)
4. **Erro**: Dados inválidos - email, CPF, formato incorreto (400/422)
5. **Erro**: Token inválido ou ausente (401)
6. **Erro**: Recurso não encontrado (404)
7. **Erro**: Conflito/duplicidade (409)
8. **Comparação V1 vs V2** (se migração): Mensagens de erro, status codes, formato de resposta
9. **Compatibilidade**: Endpoints antigos continuam funcionando
10. **Feature flag**: Habilitada/desabilitada
11. **Logs**: Cada operação CRUD registrada
12. **Criação em massa** (se aplicável): Limite de registros, rollback, validação prévia
13. **Paginação**: Navegar entre páginas, limites por página
14. **Filtros**: Cada filtro disponível, combinações, filtros inválidos
15. **Caracteres especiais**: Acentos, emojis, caracteres Unicode
16. **Limites de caracteres**: Campos no limite máximo

### 7.3 Projetos com Bloqueio/Contrato

1. **Modal de bloqueio**: Textos exatos (título, corpo, botão)
2. **Comportamento pós-downgrade**: O que acontece quando funcionalidade é removida do contrato
3. **Super Admin**: Tabela de preço, contrato, habilitação/desabilitação
4. **Facelift**: Com e sem (quando aplicável)

### 7.4 Projetos com SSO/Integração

1. **Redirecionamento**: Fluxo de login SSO completo
2. **Criação automática de usuário**: Primeiro login via SSO
3. **Sincronização**: Worker (criação, atualização, inativação, deleção)
4. **Banco de dados**: Novas tabelas, relacionamentos, constraints
5. **Coexistência**: Operações manuais + SSO ativo simultaneamente

## 8. Compatibilidade com o Agente de Execução (agent-playwright)

Os casos de teste gerados aqui **serão executados automaticamente** pelo `agent-playwright` (pipeline: XMind → XML TestLink → planner/generator/healer Playwright). A prosa em PT-BR é interpretada pelo planner segundo padrões canônicos. Para evitar perdas no pipeline, escrever os passos seguindo as regras abaixo.

### 8.1 Verbos canônicos no início de cada AÇÃO

| Tipo | Use exatamente | Evite |
|------|----------------|-------|
| Navegação direta | "Acessar a URL '/o/{org}/...'" | "Ir até", "Abrir a página de" |
| Navegação via UI | "Acessar o menu 'Modos de uso'" / "Clicar no submenu 'Painéis'" | "Navegar para" |
| Click botão | **"Clicar no botão 'X'"** | "Pressionar X", "Acionar X" |
| Click link | **"Clicar no link 'X'"** | "Selecionar link X" |
| Click aba | **"Clicar na aba 'X'"** | "Mudar para X" |
| Input texto | **"Preencher o campo 'X' com '<valor>'"** | "Digitar X em" |
| Select | **"Selecionar '<opção>' no dropdown 'X'"** | "Escolher X" |
| Checkbox/radio | **"Marcar / Desmarcar '<X>'"** | "Habilitar X" |
| Switch | **"Ativar / Desativar o switch 'X'"** | "Ligar X" |
| Upload | **"Fazer upload do arquivo '<nome>' no campo 'X'"** | "Anexar arquivo" |
| Espera | **"Aguardar '<elemento>' ser exibido"** | "Aguardar 3 segundos" / `waitForTimeout` é proibido |

### 8.2 Identificar elementos pelo NOME LITERAL (entre aspas duplas)

- Bom: `Clicar no botão "Salvar layout"`
- Ruim: `Clicar no botão de salvar`

O nome do elemento entre aspas vira `getByRole(..., { name: 'Salvar layout' })`. Se não houver nome único, descrever um seletor estável (label, placeholder, test-id se conhecido).

### 8.3 Resultado Esperado precisa ser ASSERTÁVEL

Cada resultado esperado é convertido em `await expect(...)`. Use objetos verificáveis:

| ✅ Use | ❌ Evite |
|------|---------|
| Toast exibida: **"Aba renomeada com sucesso"** | "Sistema confirma a alteração" |
| Modal **"Renomear aba"** é exibido | "Modal aparece" |
| URL contém `/paineis` | "Vai para a tela correta" |
| Botão **"Adicionar"** está desabilitado | "Botão fica indisponível" |
| Tabela exibe N linhas | "Tabela atualizada" |
| Tooltip exibida: **"Edição disponível apenas no modo Desktop"** | "Tooltip informativo aparece" |

Sempre incluir o **texto literal** quando houver, e o **elemento alvo** (botão, modal, toast, coluna, URL).

### 8.4 Pré-condições no formato esperado pelo agente de execução

- **NÃO** incluir "Realizar login" como passo. O `storageState` global do agent-playwright cuida disso. Uso correto: pré-condição **"Usuário logado como Admin"** (perfil) e/ou **"Acessar a URL `/o/{org}/...`"** como primeiro passo.
- **Feature flag**: declarar na pré-condição (ex: "Feature flag `habilitar_paineis_do_usuario` ativa"). Não criar passo que ative/desative a flag durante o teste — separar em caso próprio quando for o objetivo.
- **Estado inicial**: descrever explicitamente (ex: "Painel 'X' previamente cadastrado", "Modal 'Renomear aba' aberto").

### 8.5 Cada passo é AUTOCONTIDO

O agent-playwright envolve cada passo em `allure.step('<n>. <texto-da-ação>')`. Portanto:

- **NUNCA** escrever "Repetir o passo 3", "Idem caso anterior", "Conforme item X".
- **Replicar** a ação por extenso, mesmo que repetitiva.
- Não combinar 2 ações no mesmo passo (ex: "Preencher Nome com 'X' e clicar em 'Salvar'" → quebrar em dois passos).

### 8.6 Cenários multi-viewport (Desktop/Tablet/Mobile)

- Tratar tablet/mobile como **caso de teste separado**, com pré-condição clara: **"Viewport Tablet (768x1024)"** ou **"Viewport Mobile (360x740)"**.
- O agente mapeia para `test.use({ viewport: { width, height } })`.
- Não combinar verificações de múltiplos viewports no mesmo caso.

### 8.7 Cenários fora do escopo Playwright puro

| Cenário | Como tratar na AT |
|--------|-------------------|
| Validação de **API** sem UI | Caso de teste separado, marcado como API (mesma suíte ok). Idealmente em projeto API. |
| Verificação de **e-mail/SMS/push** | Asserir no estado da UI imediatamente após o trigger. Se precisa abrir caixa de e-mail, marcar pré-condição "Validação manual de e-mail" e separar caso. |
| **Worker / job assíncrono** (banco histórico, sync) | Pré-condição "Worker `HistoricBaseCron` executado para a organização". Asserir resultado via UI (ex: registro ausente). |
| **Banco de dados direto** | Não automatizável via Playwright. Marcar caso como "[Validação Manual]" no título. |

### 8.8 Anti-padrões que QUEBRAM o pipeline

- Ações vagas: "validar", "conferir", "verificar comportamento", "testar fluxo".
- Resultados sem objeto: "Sistema funciona", "Tudo certo", "OK".
- Aspas não consistentes em torno de textos literais (sempre usar aspas).
- Passos sem ordem clara (lista de bullets dentro de um passo).
- Asserções "negativas" sem objeto: "Não exibe erro" → preferir "Mensagem de erro NÃO é exibida" + identificar o seletor.

## 9. Regra Fundamental

A análise de teste deve ser **COMPLETA**, **ROBUSTA** e cobrir **TODOS** os cenários possíveis. NÃO se limitar apenas ao que está na coluna "descrição" da planilha de quebra de atividades. Aqueles cenários são apenas uma análise rápida para estimativa de tempo. O agente deve ir além, identificando cenários de falha, cenários de borda e validações de componentes que não estão explicitamente documentados.
