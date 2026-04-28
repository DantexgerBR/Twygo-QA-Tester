# Exemplo de Caso de Teste - API

## Contexto

Este exemplo mostra como criar um caso de teste detalhado para validação de um endpoint de API REST. Extraído do projeto "Migrar endpoints de usuários da API V1 para API V2".

## Código Python

```python
tc("Criar usuário com dados mínimos obrigatórios",
   "Verificar se o endpoint POST /api/v2/users cria um usuário com sucesso ao enviar apenas os campos obrigatórios (first_name, last_name, email, enterprise).",
   "Feature flag da API V2 de usuários habilitada\nToken de acesso válido gerado via OAuth\nOrganização configurada no ambiente de testes\nE-mail de teste não cadastrado na base",
   [
       step("Enviar requisição POST /api/v2/users com body: {\"first_name\": \"João\", \"last_name\": \"Silva\", \"email\": \"joao.silva@teste.com\", \"enterprise\": \"Empresa Teste\"}",
            "Status code 201 Created"),
       step("Verificar o body da resposta",
            "Resposta contém os dados do usuário criado: user_id (inteiro positivo), name, email, enterprise, created_at"),
       step("Verificar que o campo 'name' retorna o nome completo concatenado",
            "name = 'João Silva'"),
       step("Verificar que o campo 'situation' retorna 'active'",
            "situation = 'active'"),
       step("Buscar o usuário criado via GET /api/v2/users/:id para confirmar persistência",
            "Status 200 OK. Usuário é encontrado com todos os dados corretos"),
       step("Verificar que campos opcionais não enviados estão nulos ou com valor default",
            "Campos como cpf, phone, external_id retornam null ou vazio"),
   ], priority=1),

tc("Criar usuário com e-mail duplicado",
   "Verificar se o endpoint retorna erro 409 ao tentar criar um usuário com e-mail já existente na base.",
   "Feature flag da API V2 de usuários habilitada\nToken de acesso válido\nUsuário com e-mail 'existente@teste.com' já cadastrado na base",
   [
       step("Enviar requisição POST /api/v2/users com body: {\"first_name\": \"Maria\", \"last_name\": \"Santos\", \"email\": \"existente@teste.com\", \"enterprise\": \"Empresa Teste\"}",
            "Status code 409 Conflict"),
       step("Verificar a mensagem de erro no body da resposta",
            "message: 'E-mail já cadastrado na base de dados.'"),
       step("Comparar com comportamento da API V1: POST /api/v1/students com mesmo e-mail duplicado",
            "API V1 retornava status 201 (comportamento incorreto que foi corrigido na V2)"),
   ], priority=1),

tc("Criar usuário sem token de autenticação",
   "Verificar se o endpoint retorna erro 401 quando a requisição é enviada sem token de autenticação.",
   "Feature flag da API V2 de usuários habilitada\nRequisição sem header Authorization",
   [
       step("Enviar requisição POST /api/v2/users sem header Authorization",
            "Status code 401 Unauthorized"),
       step("Verificar o body da resposta",
            "message: 'Token de acesso inválido ou ausente.'"),
   ], priority=1),
```

## Pontos-chave

1. **Payloads explícitos**: JSON completo no passo para reprodutibilidade
2. **Status codes exatos**: 201, 409, 401 conforme documentação
3. **Mensagens literais**: Textos exatos das respostas de erro
4. **Comparação V1 vs V2**: Quando aplicável, documentar a diferença de comportamento
5. **Persistência**: Verificar via GET que o dado foi realmente salvo
6. **Cenários de erro**: Token ausente, e-mail duplicado, campos faltantes
