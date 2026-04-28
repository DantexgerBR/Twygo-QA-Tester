# Exemplo de Caso de Teste - Bloqueio/Contrato

## Contexto

Este exemplo mostra como criar um caso de teste detalhado para validação de modal de bloqueio quando uma funcionalidade não está habilitada no contrato. Extraído do projeto "Bloqueio - Clientes empresariais".

## Código Python

```python
tc("Validar modal de bloqueio ao acessar menu Empresas sem permissão",
   "Verificar se ao acessar o menu 'Empresas' sem a funcionalidade habilitada no contrato, o modal de bloqueio é exibido com os textos corretos.",
   "Usuário logado como Admin\nFuncionalidade 'Clientes empresariais' NÃO habilitada no contrato",
   [
       step("Acessar o menu 'Empresas' no painel administrativo",
            "Modal de bloqueio é exibido sobrepondo a tela"),
       step("Verificar o título do modal",
            "Título exibido: 'Ops! Essa opção não está disponível no seu plano'"),
       step("Verificar o corpo do modal",
            "Texto exibido: 'Mude suas opções de assinatura entrando em contato com a nossa equipe!'"),
       step("Verificar o botão do modal",
            "Botão exibido com texto: 'Contato'"),
       step("Clicar no botão 'Contato'",
            "Chat com suporte é aberto"),
       step("Fechar o modal (clicar no X ou fora do modal)",
            "Modal é fechado. Usuário permanece na tela anterior"),
   ], priority=1),

tc("Validar comportamento pós-downgrade - Empresas cadastradas ficam ocultas",
   "Verificar se após o downgrade (remoção da funcionalidade do contrato), as empresas previamente cadastradas ficam ocultas mas não são excluídas.",
   "Usuário logado como Admin\nFuncionalidade 'Clientes empresariais' previamente habilitada\nEmpresas já cadastradas no ambiente\nFuncionalidade removida do contrato (downgrade realizado)",
   [
       step("Acessar o menu 'Empresas' no painel administrativo",
            "Modal de bloqueio é exibido (funcionalidade não disponível no plano)"),
       step("Reabilitar a funcionalidade no contrato via Super Admin",
            "Funcionalidade habilitada novamente"),
       step("Acessar o menu 'Empresas' novamente",
            "Lista de empresas é exibida com todas as empresas previamente cadastradas (dados preservados)"),
   ], priority=1),
```

## Pontos-chave

1. **Textos literais do modal**: Título, corpo e botão com textos exatos
2. **Comportamento do modal**: Abertura, interação com botão, fechamento
3. **Cenário de downgrade**: Validar que dados não são perdidos
4. **Cenário de reabilitação**: Validar que dados voltam a aparecer
5. **Pré-condições detalhadas**: Estado do contrato claramente definido
