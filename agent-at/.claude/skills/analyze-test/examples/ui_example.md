# Exemplo de Caso de Teste - UI/Funcional

## Contexto

Este exemplo mostra como criar um caso de teste detalhado para validação de um campo de texto em uma interface web. Extraído do projeto "Modo de uso - Horário de acesso".

## Código Python

```python
tc("Validar campo Nome do feriado - Limites e caracteres",
   "Verificar se o campo 'Nome' aceita os tipos de caracteres corretos e respeita o limite de 50 caracteres.",
   "Usuário logado como Admin\nAcesso à tela Modo de uso > Feriados\nModal de adicionar feriado aberto",
   [
       step("Digitar um nome válido com até 50 caracteres no campo 'Nome'",
            "Campo aceita o texto. Placeholder exibido antes da digitação: 'Ex: Natal'"),
       step("Digitar um nome com exatamente 50 caracteres",
            "Campo aceita todos os 50 caracteres sem truncar"),
       step("Tentar digitar o 51º caractere",
            "Campo não permite a inserção do 51º caractere"),
       step("Inserir caracteres especiais: acentos (ã, é, ç), números, símbolos (@, #, &)",
            "Campo aceita todos os tipos de caracteres"),
       step("Copiar um texto longo (>50 chars) e colar no campo (Ctrl+V)",
            "Campo aceita apenas os primeiros 50 caracteres do texto colado"),
       step("Limpar o campo e tentar salvar",
            "Borda vermelha no campo. Mensagem de erro: 'Nome é obrigatório'"),
       step("Preencher apenas espaços em branco e tentar salvar",
            "Borda vermelha no campo. Mensagem de erro: 'Nome é obrigatório'"),
   ], priority=1),
```

## Pontos-chave

1. **Objetivo claro**: Descreve exatamente o que será validado
2. **Pré-condições específicas**: Sem referência a Dev, apenas estado da aplicação
3. **Textos literais**: Placeholder "Ex: Natal" e mensagem de erro "Nome é obrigatório"
4. **Cenários positivos e negativos**: Happy path + limites + falhas
5. **Atalhos**: Validação de Ctrl+V
6. **Prioridade**: Alta (priority-1) por ser campo obrigatório
