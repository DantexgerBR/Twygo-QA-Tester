"""
Gera o arquivo XMind de Análise de Teste para o projeto "Painéis dos usuários (Widgets)".
Usa template/template.xmind como base e substitui o content.json.
"""

import json, zipfile, os, shutil, uuid


# =====================================================================
# FUNÇÕES UTILITÁRIAS
# =====================================================================

def gid():
    return str(uuid.uuid4()).replace('-', '')[:24]


def topic(title, note=None, children=None, markers=None):
    t = {
        "id": gid(),
        "class": "topic",
        "title": title,
        "structureClass": "org.xmind.ui.map.unbalanced",
        "titleUnedited": True
    }
    if note:
        t["notes"] = {"plain": {"content": note}}
    if markers:
        t["markers"] = markers
    if children:
        t["children"] = {"attached": children}
    return t


def step(action, expected):
    return topic(action, children=[topic(expected)])


def tc(title, objective, preconditions, steps, priority=2):
    note = f"{objective}\n[PRECONDITIONS]\n{preconditions}"
    markers = [{"markerId": f"priority-{priority}"}]
    return topic(title, note=note, children=steps, markers=markers)


# =====================================================================
# SUÍTES DE TESTE
# =====================================================================

# ---------------------------------------------------------------------
# Suíte 1 — Feature flag e exibição do módulo de Painéis
# ---------------------------------------------------------------------
suite_feature_flag = topic(
    "Feature flag e exibição do módulo de Painéis",
    children=[
        tc("Validar exibição do menu com feature flag habilitar_paineis_do_usuario ativa",
           "Verificar se, com a feature flag ativa, o módulo de Painéis é exibido corretamente no menu renomeado e com breadcrumb ajustado.",
           "Ambiente Stage configurado\nUsuário logado como Admin\nFeature flag habilitar_paineis_do_usuario habilitada",
           [
               step("Acessar o painel administrativo",
                    "Menu lateral exibido com label 'Menu' (renomeado de 'Navegação')"),
               step("Acessar 'Menu > Modos de uso'",
                    "Breadcrumb exibe: 'Navegação > Modos de uso'"),
               step("Localizar a aba 'Painéis' dentro do Menu",
                    "Aba 'Painéis' é exibida entre as demais abas do menu"),
               step("Clicar na aba 'Painéis'",
                    "Módulo de Painéis é carregado e apresenta a listagem de painéis"),
           ], priority=1),

        tc("Validar ocultação do módulo com feature flag desativada",
           "Verificar se, com a feature flag desativada, o módulo de Painéis não é exibido e acesso direto via URL é bloqueado.",
           "Ambiente Stage configurado\nUsuário logado como Admin\nFeature flag habilitar_paineis_do_usuario desabilitada",
           [
               step("Acessar 'Menu > Modos de uso'",
                    "Aba 'Painéis' NÃO é exibida no Menu"),
               step("Tentar acessar a rota direta do módulo de Painéis via URL",
                    "Acesso bloqueado (rota inacessível ou redirecionado para tela padrão)"),
           ], priority=1),

        tc("Validar transição de feature flag desativada para ativada",
           "Verificar se, ao ativar a feature flag durante a sessão, o módulo passa a ser exibido após recarregar a página.",
           "Ambiente Stage configurado\nUsuário logado como Admin\nFeature flag habilitar_paineis_do_usuario inicialmente desabilitada",
           [
               step("Confirmar que a aba 'Painéis' não é exibida no Menu",
                    "Aba 'Painéis' ausente"),
               step("Habilitar a feature flag habilitar_paineis_do_usuario",
                    "Feature flag ativada"),
               step("Recarregar a página",
                    "Aba 'Painéis' passa a ser exibida no Menu"),
           ], priority=2),

        tc("Validar transição de feature flag ativada para desativada",
           "Verificar se, ao desativar a feature flag, o módulo deixa de ser exibido após recarregar.",
           "Feature flag habilitar_paineis_do_usuario inicialmente habilitada\nUsuário logado como Admin",
           [
               step("Confirmar que a aba 'Painéis' é exibida no Menu",
                    "Aba visível"),
               step("Desativar a feature flag habilitar_paineis_do_usuario",
                    "Feature flag desativada"),
               step("Recarregar a página",
                    "Aba 'Painéis' deixa de ser exibida"),
           ], priority=2),

        tc("Validar renomeação de 'Navegação' para 'Menu' na retrocompatibilidade",
           "Verificar se a renomeação do item de menu não quebra acessos prévios e a navegação continua funcional.",
           "Feature flag habilitar_paineis_do_usuario habilitada\nUsuário logado como Admin",
           [
               step("Acessar o painel administrativo",
                    "Item de menu exibido com label 'Menu' (não mais 'Navegação')"),
               step("Acessar itens filhos do 'Menu' (ex: Modos de uso)",
                    "Navegação para telas existentes continua funcionando normalmente"),
               step("Verificar breadcrumb em telas antigas",
                    "Breadcrumbs antigos ('Navegação > Modo de uso') foram substituídos por 'Navegação > Modos de uso' onde aplicável"),
           ], priority=2),
    ]
)


# ---------------------------------------------------------------------
# Suíte 2 — Listagem de painéis
# ---------------------------------------------------------------------
suite_listagem = topic(
    "Listagem de painéis",
    children=[
        tc("Validar componente list-control e estrutura da listagem",
           "Verificar se a listagem utiliza o componente padrão list-control e exibe os elementos obrigatórios (botão adicionar, pesquisa, visualizações).",
           "Feature flag habilitar_paineis_do_usuario habilitada\nUsuário logado como Admin\nAcesso à tela 'Menu > Modos de uso > Painéis'",
           [
               step("Observar o topo da tela de Painéis",
                    "Botão '+ Adicionar' exibido"),
               step("Observar a estrutura de listagem",
                    "Componente padrão list-control é utilizado"),
               step("Observar campo de pesquisa",
                    "Campo de pesquisa exibido"),
               step("Observar os modos de visualização disponíveis",
                    "Opções 'Lista' e 'Cards' disponíveis"),
               step("Verificar a visualização padrão exibida ao entrar na tela",
                    "Visualização padrão: Lista"),
           ], priority=1),

        tc("Validar colunas da visualização em lista",
           "Verificar se a visualização em lista exibe todas as colunas obrigatórias na ordem correta.",
           "Feature flag habilitar_paineis_do_usuario habilitada\nUsuário logado como Admin\nAcesso à tela 'Painéis'\nAo menos um painel cadastrado",
           [
               step("Acessar a visualização em lista",
                    "Listagem em formato tabular é exibida"),
               step("Validar a existência das colunas",
                    "Colunas exibidas: Nome, Descrição, Provedora, Data de criação, Ativo?, Ações"),
               step("Validar o conteúdo de cada coluna para um painel cadastrado",
                    "Nome, Descrição, Provedora e Data de criação exibem os valores cadastrados; 'Ativo?' exibe switch; 'Ações' exibe ícones"),
           ], priority=1),

        tc("Validar alternância entre visualizações Lista e Cards",
           "Verificar se a alternância entre os modos Lista e Cards funciona corretamente e mantém os dados do painel.",
           "Feature flag habilitar_paineis_do_usuario habilitada\nPainéis cadastrados na base",
           [
               step("Com visualização em Lista, clicar no toggle para alternar para 'Cards'",
                    "Listagem é renderizada em formato de cards"),
               step("Verificar o conteúdo dos cards",
                    "Cards exibem os mesmos dados da lista (Nome, Descrição, Provedora, Data de criação, Ativo, Ações)"),
               step("Clicar no toggle para voltar à visualização 'Lista'",
                    "Listagem volta ao formato tabular com todas as colunas"),
               step("Recarregar a página",
                    "Visualização padrão (Lista) é aplicada novamente"),
           ], priority=2),

        tc("Validar ordenação ao clicar nos cabeçalhos das colunas",
           "Verificar se é possível ordenar a listagem clicando nos cabeçalhos das colunas (ordenação ascendente/descendente).",
           "Painéis cadastrados com nomes e datas variados",
           [
               step("Clicar no cabeçalho da coluna 'Nome'",
                    "Registros ordenados alfabeticamente (A → Z)"),
               step("Clicar novamente no cabeçalho 'Nome'",
                    "Ordem invertida (Z → A)"),
               step("Clicar no cabeçalho 'Data de criação'",
                    "Registros ordenados cronologicamente (mais antigo → mais recente ou vice-versa)"),
               step("Clicar no cabeçalho 'Provedora'",
                    "Registros ordenados alfabeticamente pela provedora"),
           ], priority=3),

        tc("Validar ativação de painel via switch 'Ativo?'",
           "Verificar se o switch 'Ativo?' muda o estado do painel para ativo corretamente.",
           "Painel inativo cadastrado na base\nPainel não associado a nenhum modo de uso",
           [
               step("Localizar um painel com switch 'Ativo?' em estado desligado",
                    "Switch exibido como inativo"),
               step("Clicar no switch",
                    "Switch muda para ativo"),
               step("Recarregar a página",
                    "Estado ativo é persistido"),
           ], priority=1),

        tc("Validar modal de bloqueio ao desativar painel associado a modo de uso",
           "Verificar se, ao tentar desativar um painel associado a um ou mais menus de modo de uso, o sistema exibe modal informativo e não permite a desativação.",
           "Painel ativo associado a um ou mais menus de modo de uso",
           [
               step("Localizar o painel associado e clicar no switch 'Ativo?'",
                    "Modal informativo é exibido (similar ao modal de créditos)"),
               step("Verificar o conteúdo do modal",
                    "Modal lista os menus que utilizam o painel e informa que ele não pode ser desativado enquanto houver associações ativas"),
               step("Fechar o modal",
                    "Switch permanece ATIVO (desativação não aplicada)"),
               step("Remover a associação do painel em todos os menus de modo de uso",
                    "Painel não possui mais associações"),
               step("Clicar novamente no switch 'Ativo?'",
                    "Switch muda para inativo sem exibir o modal"),
           ], priority=1),

        tc("Validar ícones de ações disponíveis na coluna 'Ações'",
           "Verificar se a coluna 'Ações' exibe os ícones Editar, Duplicar e Excluir para painéis próprios.",
           "Painel próprio cadastrado na base",
           [
               step("Localizar a coluna 'Ações' de um painel próprio",
                    "Ícones exibidos: Editar, Duplicar, Excluir"),
               step("Passar o cursor sobre o ícone Editar",
                    "Tooltip 'Editar' (ou equivalente) exibido"),
               step("Passar o cursor sobre o ícone Duplicar",
                    "Tooltip 'Duplicar' exibido"),
               step("Passar o cursor sobre o ícone Excluir",
                    "Tooltip 'Excluir' exibido"),
           ], priority=2),

        tc("Validar bloqueio de edição e exclusão em painéis compartilhados",
           "Verificar que painéis compartilhados (provedora externa) não podem ser editados nem excluídos.",
           "Painel compartilhado (provedora externa) presente na listagem",
           [
               step("Localizar o painel compartilhado na listagem",
                    "Painel exibido com indicação de que é compartilhado (provedora preenchida)"),
               step("Verificar as ações disponíveis para o painel compartilhado",
                    "Ações Editar e Excluir estão desabilitadas ou ocultas; Duplicar permanece disponível"),
               step("Tentar acionar Editar via atalho ou URL direta",
                    "Sistema bloqueia a edição"),
               step("Tentar acionar Excluir via atalho ou URL direta",
                    "Sistema bloqueia a exclusão"),
           ], priority=1),

        tc("Validar exclusão de painel próprio",
           "Verificar se a exclusão de um painel próprio funciona e se o sistema solicita confirmação.",
           "Painel próprio inativo cadastrado na base",
           [
               step("Clicar no ícone Excluir na linha do painel",
                    "Modal de confirmação exibido com textos padrão da plataforma (ex: título, corpo, botões Cancelar e Excluir)"),
               step("Clicar em Cancelar",
                    "Modal fechado, painel permanece na lista"),
               step("Clicar novamente em Excluir e confirmar",
                    "Painel é removido da listagem; toast de sucesso exibido"),
               step("Recarregar a página",
                    "Painel não aparece mais na listagem (exclusão persistida)"),
           ], priority=1),

        tc("Validar exibição da tela de listagem no modo Mobile",
           "Verificar se a listagem se adapta corretamente na visualização Mobile via DevTools.",
           "Acesso à tela 'Painéis'\nDevTools aberto em modo responsivo",
           [
               step("Selecionar resolução Mobile (ex: 360x640)",
                    "Tela se adapta ao tamanho mobile sem quebras de layout"),
               step("Observar componente list-control e ações",
                    "Listagem acessível, com scroll horizontal ou colunas adaptadas; ações permanecem acionáveis"),
           ], priority=3),
    ]
)


# ---------------------------------------------------------------------
# Suíte 3 — Filtros e pesquisa de painéis
# ---------------------------------------------------------------------
suite_filtros = topic(
    "Filtros e pesquisa de painéis",
    children=[
        tc("Validar aplicação dos filtros padrão da listagem",
           "Verificar se os filtros padrão (próprios, compartilhados, ativos, inativos) funcionam corretamente.",
           "Feature flag habilitar_paineis_do_usuario habilitada\nBase contendo painéis próprios e compartilhados, ativos e inativos",
           [
               step("Aplicar filtro 'Painéis próprios'",
                    "Listagem exibe apenas painéis próprios (sem provedora externa)"),
               step("Aplicar filtro 'Painéis compartilhados'",
                    "Listagem exibe apenas painéis compartilhados (com provedora externa)"),
               step("Aplicar filtro 'Painéis ativos'",
                    "Listagem exibe apenas painéis com switch 'Ativo?' ligado"),
               step("Aplicar filtro 'Painéis inativos'",
                    "Listagem exibe apenas painéis com switch 'Ativo?' desligado"),
               step("Limpar todos os filtros",
                    "Listagem retorna ao estado inicial com todos os painéis visíveis"),
           ], priority=1),

        tc("Validar combinação de filtros padrão",
           "Verificar se é possível combinar filtros e se o resultado é coerente.",
           "Base com variedade de painéis",
           [
               step("Aplicar filtros 'Painéis próprios' + 'Painéis ativos'",
                    "Listagem exibe apenas painéis próprios e ativos"),
               step("Aplicar filtros 'Painéis compartilhados' + 'Painéis inativos'",
                    "Listagem exibe apenas painéis compartilhados e inativos"),
               step("Aplicar simultaneamente 'Painéis ativos' + 'Painéis inativos'",
                    "Sistema exibe todos os painéis (ambos os estados) ou bloqueia a combinação, conforme comportamento padrão"),
           ], priority=2),

        tc("Validar filtros individuais por coluna",
           "Verificar se cada coluna da listagem permite aplicação de filtro.",
           "Base com painéis variados",
           [
               step("Abrir o filtro da coluna 'Nome' e digitar um valor existente",
                    "Listagem exibe apenas os painéis que correspondem ao valor"),
               step("Abrir o filtro da coluna 'Descrição' e digitar um valor existente",
                    "Listagem filtra corretamente"),
               step("Abrir o filtro da coluna 'Provedora'",
                    "Opções de provedoras disponíveis; seleção filtra a lista"),
               step("Abrir o filtro da coluna 'Data de criação'",
                    "Permite filtrar por intervalo de datas ou valor específico"),
               step("Abrir o filtro da coluna 'Ativo?'",
                    "Permite filtrar por ativo/inativo"),
           ], priority=2),

        tc("Validar pesquisa por Nome",
           "Verificar se a pesquisa funciona considerando o campo 'Nome'.",
           "Painel cadastrado com nome 'Dashboard Vendas'",
           [
               step("Digitar 'Dashboard' no campo de pesquisa",
                    "Listagem exibe o painel 'Dashboard Vendas' e demais que contenham 'Dashboard' no nome"),
               step("Digitar o nome completo 'Dashboard Vendas'",
                    "Apenas o painel exato é exibido"),
               step("Limpar o campo de pesquisa",
                    "Listagem volta a exibir todos os painéis"),
           ], priority=1),

        tc("Validar pesquisa por Descrição",
           "Verificar se a pesquisa também considera o campo 'Descrição'.",
           "Painel cadastrado com descrição 'Painel para gestão operacional'",
           [
               step("Digitar 'operacional' no campo de pesquisa",
                    "Listagem exibe o painel cuja descrição contém 'operacional'"),
           ], priority=2),

        tc("Validar pesquisa com texto inexistente",
           "Verificar o comportamento da pesquisa quando nenhum painel corresponde.",
           "Base com painéis cadastrados",
           [
               step("Digitar 'xyzinexistente123' no campo de pesquisa",
                    "Listagem exibe mensagem ou estado vazio indicando que nenhum painel foi encontrado"),
               step("Limpar o campo",
                    "Listagem volta ao normal"),
           ], priority=3),

        tc("Validar pesquisa com caracteres especiais e acentos",
           "Verificar se a pesquisa trata corretamente acentos e caracteres especiais.",
           "Painel cadastrado com nome 'Gestão & Controle' e descrição com acentos",
           [
               step("Digitar 'Gestão' no campo de pesquisa",
                    "Painel 'Gestão & Controle' é localizado"),
               step("Digitar 'Gestao' (sem acento)",
                    "Painel é localizado (pesquisa tolerante a acentos) ou não é localizado conforme comportamento documentado"),
               step("Digitar '&' no campo",
                    "Painel com '&' é localizado"),
           ], priority=3),
    ]
)


# ---------------------------------------------------------------------
# Suíte 4 — Duplicação de painéis
# ---------------------------------------------------------------------
suite_duplicacao = topic(
    "Duplicação de painéis",
    children=[
        tc("Duplicar painel próprio com abas e widgets",
           "Verificar se a duplicação cria uma cópia preservando abas, widgets e configurações.",
           "Feature flag habilitar_paineis_do_usuario habilitada\nPainel 'Dashboard Operacional' cadastrado com 3 abas e widgets configurados",
           [
               step("Clicar no ícone Duplicar na linha do painel 'Dashboard Operacional'",
                    "Sistema executa a duplicação"),
               step("Observar o final da lista",
                    "Novo painel aparece com o nome '[Cópia] Dashboard Operacional'"),
               step("Abrir o painel duplicado",
                    "Painel possui as mesmas 3 abas na mesma ordem"),
               step("Verificar os widgets em cada aba",
                    "Cada aba contém os mesmos widgets com as mesmas configurações (título, ícone, posicionamento) do painel original"),
               step("Verificar campos de Identificação do painel duplicado",
                    "Descrição também é copiada do original"),
           ], priority=1),

        tc("Validar padrão de nomenclatura em duplicações sucessivas",
           "Verificar se ao duplicar o painel várias vezes o nome recebe o prefixo '[Cópia]' repetidamente.",
           "Painel 'Meu Painel' cadastrado",
           [
               step("Duplicar o painel 'Meu Painel'",
                    "Novo painel criado com nome '[Cópia] Meu Painel'"),
               step("Duplicar o painel '[Cópia] Meu Painel'",
                    "Novo painel criado com nome '[Cópia] [Cópia] Meu Painel'"),
           ], priority=2),

        tc("Duplicar painel compartilhado",
           "Verificar se é possível duplicar um painel compartilhado, gerando um painel próprio copiado.",
           "Painel compartilhado (provedora externa) presente na listagem",
           [
               step("Clicar no ícone Duplicar na linha do painel compartilhado",
                    "Duplicação executada"),
               step("Verificar o novo painel",
                    "Novo painel aparece no final da lista como '[Cópia] [Nome Original]' e agora é próprio (sem provedora externa)"),
               step("Verificar se abas e widgets foram copiados",
                    "Todas as abas, widgets e configurações do painel compartilhado foram replicados no painel duplicado"),
           ], priority=1),

        tc("Duplicar painel inativo",
           "Verificar se a duplicação de um painel inativo cria uma cópia também inativa ou no estado padrão.",
           "Painel 'Arquivo' inativo cadastrado",
           [
               step("Duplicar o painel 'Arquivo'",
                    "Novo painel '[Cópia] Arquivo' criado no final da listagem"),
               step("Observar o estado do switch 'Ativo?' do novo painel",
                    "Estado do switch é coerente com o comportamento padrão da plataforma (inativo por herança, conforme especificação)"),
           ], priority=3),
    ]
)


# ---------------------------------------------------------------------
# Suíte 5 — Criação de painel - aba Identificação
# ---------------------------------------------------------------------
suite_criacao_identificacao = topic(
    "Criação de painel - aba Identificação",
    children=[
        tc("Validar acesso à tela de criação via botão '+ Adicionar'",
           "Verificar se o clique no botão '+ Adicionar' direciona para a tela de criação de painel.",
           "Feature flag habilitar_paineis_do_usuario habilitada\nUsuário logado como Admin\nAcesso à tela 'Painéis'",
           [
               step("Clicar no botão '+ Adicionar'",
                    "Usuário é direcionado para a tela de criação de painel"),
               step("Verificar as abas da tela",
                    "Duas abas exibidas: 'Identificação' e 'Layouts'"),
               step("Verificar a aba ativa ao abrir a tela",
                    "Aba 'Identificação' está ativa por padrão"),
           ], priority=1),

        tc("Criar painel com dados mínimos obrigatórios",
           "Verificar se é possível criar um painel preenchendo apenas o campo obrigatório Nome.",
           "Usuário logado como Admin\nTela de criação de painel aberta na aba 'Identificação'",
           [
               step("Preencher o campo 'Nome' com 'Painel Teste'",
                    "Campo aceita o texto"),
               step("Deixar o campo 'Descrição' vazio",
                    "Campo opcional, não exige preenchimento"),
               step("Salvar o painel",
                    "Painel criado com sucesso; usuário é direcionado para a listagem ou aba 'Layouts' conforme fluxo"),
               step("Localizar o painel 'Painel Teste' na listagem",
                    "Painel aparece na listagem com Nome = 'Painel Teste', Descrição vazia, Provedora vazia/própria e Data de criação igual à data atual"),
           ], priority=1),

        tc("Validar campo Nome - limites e caracteres",
           "Verificar se o campo 'Nome' aceita os tipos de caracteres corretos e respeita o limite de 255 caracteres.",
           "Tela de criação de painel aberta na aba 'Identificação'",
           [
               step("Digitar um nome válido com até 255 caracteres",
                    "Campo aceita o texto"),
               step("Digitar exatamente 255 caracteres",
                    "Campo aceita todos os 255 caracteres sem truncar"),
               step("Tentar digitar o 256º caractere",
                    "Campo não permite a inserção do 256º caractere"),
               step("Inserir caracteres especiais: acentos (ã, é, ç), números, símbolos (@, #, &)",
                    "Campo aceita todos os tipos de caracteres"),
               step("Copiar um texto longo (>255 chars) e colar no campo (Ctrl+V)",
                    "Campo aceita apenas os primeiros 255 caracteres do texto colado"),
               step("Limpar o campo e tentar salvar",
                    "Borda vermelha no campo 'Nome' e mensagem de erro indicando obrigatoriedade"),
               step("Preencher apenas espaços em branco e tentar salvar",
                    "Sistema trata como campo vazio e exibe erro de obrigatoriedade"),
           ], priority=1),

        tc("Validar campo Descrição - limites e caracteres",
           "Verificar se o campo 'Descrição' aceita até 500 caracteres, é opcional e respeita caracteres especiais.",
           "Tela de criação de painel aberta na aba 'Identificação'",
           [
               step("Digitar uma descrição válida com até 500 caracteres",
                    "Campo aceita o texto"),
               step("Digitar exatamente 500 caracteres",
                    "Campo aceita todos os 500 caracteres"),
               step("Tentar digitar o 501º caractere",
                    "Campo não permite a inserção do 501º caractere"),
               step("Deixar o campo em branco e salvar",
                    "Painel é salvo sem erros (campo opcional)"),
               step("Inserir quebras de linha, acentos e símbolos",
                    "Campo aceita todos os tipos de caracteres"),
               step("Colar um texto longo (>500 caracteres)",
                    "Apenas os primeiros 500 caracteres são aceitos"),
           ], priority=2),

        tc("Editar painel existente e persistir alterações",
           "Verificar se é possível editar os campos de Identificação de um painel existente.",
           "Painel 'Painel Teste' previamente cadastrado\nUsuário logado como Admin",
           [
               step("Clicar no ícone Editar na linha do painel 'Painel Teste'",
                    "Tela de edição aberta na aba 'Identificação' com os campos preenchidos"),
               step("Alterar o campo 'Nome' para 'Painel Teste Atualizado'",
                    "Campo aceita a alteração"),
               step("Preencher o campo 'Descrição' com 'Descrição atualizada'",
                    "Campo aceita o texto"),
               step("Salvar as alterações",
                    "Painel salvo; toast de sucesso exibido (conforme padrão da plataforma)"),
               step("Recarregar a página e verificar na listagem",
                    "Painel exibido com Nome 'Painel Teste Atualizado' e Descrição 'Descrição atualizada'"),
           ], priority=1),

        tc("Validar navegação entre abas Identificação e Layouts",
           "Verificar se a navegação entre as duas abas preserva os dados não salvos.",
           "Tela de criação de painel aberta",
           [
               step("Na aba 'Identificação', preencher Nome 'Painel Nav' e Descrição 'Teste'",
                    "Campos preenchidos"),
               step("Clicar na aba 'Layouts'",
                    "Sistema troca para a aba Layouts exibindo a aba inicial 'Nova aba'"),
               step("Voltar para a aba 'Identificação'",
                    "Campos 'Nome' e 'Descrição' preservam os valores 'Painel Nav' e 'Teste' (não resetam)"),
           ], priority=2),
    ]
)


# ---------------------------------------------------------------------
# Suíte 6 — Gerenciamento de abas do painel
# ---------------------------------------------------------------------
suite_abas = topic(
    "Gerenciamento de abas do painel",
    children=[
        tc("Validar aba inicial criada automaticamente ao acessar Layouts",
           "Verificar se, ao acessar a aba Layouts pela primeira vez, o sistema cria automaticamente a aba 'Nova aba'.",
           "Tela de criação de painel aberta\nPainel novo (sem abas prévias)",
           [
               step("Clicar na aba 'Layouts' da tela de criação/edição do painel",
                    "Aba inicial é exibida com o nome 'Nova aba'"),
               step("Observar as ações disponíveis na aba inicial",
                    "Apenas a ação 'Renomear' (ícone de lápis) está disponível; ação 'Excluir' está desabilitada ou oculta"),
               step("Observar o layout da aba",
                    "Estado vazio é exibido com o botão '+ Adicionar Widget'"),
           ], priority=1),

        tc("Validar modal de renomear aba - estrutura e textos literais",
           "Verificar se o modal de renomear aba exibe todos os textos conforme especificação.",
           "Aba 'Nova aba' disponível na aba Layouts",
           [
               step("Clicar no ícone de lápis ao lado do nome da aba",
                    "Modal é exibido"),
               step("Verificar o título do modal",
                    "Título exibido: 'Renomear aba'"),
               step("Verificar o subtítulo do modal",
                    "Subtítulo exibido: 'Altere o nome da aba selecionada'"),
               step("Verificar o campo do modal",
                    "Campo 'Nome da aba' exibido (input, até 255 caracteres) com valor atual 'Nova aba'"),
               step("Verificar as ações do modal",
                    "Botões exibidos: 'Cancelar' e 'Renomear'"),
               step("Fechar o modal clicando no X ou fora do modal",
                    "Modal fechado, aba permanece com o nome original"),
           ], priority=1),

        tc("Renomear aba com sucesso",
           "Verificar se ao confirmar a renomeação o nome é atualizado e toast de sucesso é exibido.",
           "Modal 'Renomear aba' aberto com aba 'Nova aba'",
           [
               step("Limpar o campo 'Nome da aba' e digitar 'Resumo'",
                    "Campo aceita o texto"),
               step("Clicar no botão 'Renomear'",
                    "Modal é fechado"),
               step("Verificar o estado da aba",
                    "Aba exibida com o nome 'Resumo'"),
               step("Verificar o toast",
                    "Toast de sucesso exibido com o texto: 'Aba renomeada com sucesso'"),
               step("Salvar o painel e recarregar",
                    "Aba permanece com o nome 'Resumo' (persistência)"),
           ], priority=1),

        tc("Validar limites do campo Nome da aba no modal de renomeação",
           "Verificar limites e caracteres aceitos no campo de renomeação.",
           "Modal 'Renomear aba' aberto",
           [
               step("Digitar exatamente 255 caracteres",
                    "Campo aceita todos os 255 caracteres"),
               step("Tentar digitar o 256º caractere",
                    "Campo não permite a inserção do 256º caractere"),
               step("Limpar o campo e clicar em 'Renomear'",
                    "Sistema impede a renomeação e exibe erro de obrigatoriedade"),
               step("Preencher apenas espaços e clicar em 'Renomear'",
                    "Sistema impede a renomeação (trata como vazio)"),
               step("Inserir acentos e caracteres especiais",
                    "Campo aceita normalmente"),
           ], priority=2),

        tc("Validar modal 'Adicionar nova aba' - step de seleção de tipo",
           "Verificar se o modal de seleção de tipo exibe os textos literais e as duas opções corretamente.",
           "Tela de Layouts com pelo menos uma aba existente",
           [
               step("Clicar no botão 'Adicionar aba' ao lado direito da última aba",
                    "Modal é exibido"),
               step("Verificar o título do modal",
                    "Título: 'Adicionar nova aba'"),
               step("Verificar o subtítulo",
                    "Subtítulo: 'Escolha como deseja criar a nova aba'"),
               step("Verificar a opção 'Criar nova aba'",
                    "Opção exibida com ícone de adição e descrição: 'Crie uma nova aba vazia e adicione widgets manualmente'"),
               step("Verificar a opção 'Importar de outro painel'",
                    "Opção exibida com ícone de download e descrição: 'Reutilize uma aba existente de outro painel'"),
               step("Fechar o modal (X ou clique fora)",
                    "Modal fechado sem criar aba"),
           ], priority=1),

        tc("Criar nova aba vazia - fluxo completo",
           "Verificar o fluxo completo de criação de uma nova aba vazia e seus textos.",
           "Modal 'Adicionar nova aba' (seleção de tipo) aberto",
           [
               step("Selecionar a opção 'Criar nova aba'",
                    "Novo step do modal é exibido"),
               step("Verificar o título do novo step",
                    "Título: 'Adicionar nova aba'"),
               step("Verificar o subtítulo",
                    "Subtítulo: 'Crie uma nova aba vazia'"),
               step("Verificar os campos disponíveis",
                    "Campo 'Nome da aba' (input, até 255 caracteres) e campo 'Categoria' (select)"),
               step("Verificar as opções do campo 'Categoria'",
                    "Opção exibida: 'Aprendizagem'"),
               step("Verificar as ações disponíveis",
                    "Botões: 'Voltar', 'Cancelar', 'Criar aba'"),
               step("Preencher 'Nome da aba' com 'Métricas' e selecionar Categoria 'Aprendizagem'",
                    "Campos preenchidos"),
               step("Clicar em 'Criar aba'",
                    "Modal fechado; nova aba 'Métricas' adicionada ao painel e disponível para edição no layout"),
           ], priority=1),

        tc("Validar ação 'Voltar' no modal 'Criar nova aba'",
           "Verificar se a ação 'Voltar' retorna ao step de seleção de tipo.",
           "Modal 'Adicionar nova aba' (criar vazia) aberto",
           [
               step("Preencher 'Nome da aba' com 'Teste'",
                    "Campo preenchido"),
               step("Clicar em 'Voltar'",
                    "Modal retorna ao step de seleção de tipo ('Criar nova aba' / 'Importar de outro painel')"),
               step("Selecionar novamente 'Criar nova aba'",
                    "Step exibido; ao retornar, o valor de 'Nome da aba' pode estar limpo ou preservado conforme especificação"),
           ], priority=2),

        tc("Validar ação 'Cancelar' no modal 'Criar nova aba'",
           "Verificar se a ação 'Cancelar' fecha o modal sem criar a aba.",
           "Modal 'Adicionar nova aba' (criar vazia) aberto",
           [
               step("Preencher 'Nome da aba' com 'Não criada'",
                    "Campo preenchido"),
               step("Clicar em 'Cancelar'",
                    "Modal é fechado"),
               step("Verificar a listagem de abas do painel",
                    "Aba 'Não criada' NÃO é adicionada ao painel"),
           ], priority=2),

        tc("Validar campos obrigatórios ao criar nova aba",
           "Verificar se os campos obrigatórios são validados ao tentar criar a aba.",
           "Modal 'Adicionar nova aba' (criar vazia) aberto",
           [
               step("Deixar 'Nome da aba' vazio e 'Categoria' selecionada, clicar em 'Criar aba'",
                    "Sistema bloqueia a criação e sinaliza o campo 'Nome da aba' com erro de obrigatoriedade"),
               step("Preencher 'Nome da aba' e deixar 'Categoria' sem seleção, clicar em 'Criar aba'",
                    "Sistema bloqueia a criação e sinaliza o campo 'Categoria' com erro"),
               step("Preencher apenas espaços no 'Nome da aba' e clicar em 'Criar aba'",
                    "Sistema trata como vazio e bloqueia a criação"),
           ], priority=1),

        tc("Validar regras de exclusão de abas (aba única vs múltiplas)",
           "Verificar se a ação de excluir aba é habilitada/desabilitada conforme a quantidade de abas.",
           "Painel com aba única 'Nova aba' no Layouts",
           [
               step("Observar as ações disponíveis na aba única",
                    "Apenas 'Renomear' disponível; 'Excluir' desabilitada ou oculta"),
               step("Adicionar uma segunda aba chamada 'Métricas'",
                    "Duas abas no painel: 'Nova aba' e 'Métricas'"),
               step("Observar as ações de ambas as abas",
                    "Ambas passam a ter 'Renomear' E 'Excluir' disponíveis"),
               step("Excluir a aba 'Métricas'",
                    "Aba removida; restante fica com apenas 'Nova aba'"),
               step("Observar as ações da aba 'Nova aba'",
                    "Ação 'Excluir' volta a ser desabilitada/oculta"),
           ], priority=1),

        tc("Validar garantia de pelo menos uma aba ativa no painel",
           "Verificar se o sistema impede a existência de um painel sem abas.",
           "Painel com duas abas: 'A' e 'B'",
           [
               step("Excluir a aba 'B'",
                    "Aba excluída; painel fica apenas com aba 'A'"),
               step("Tentar excluir a aba 'A' (via URL ou força)",
                    "Sistema bloqueia a exclusão pois sempre deve haver pelo menos uma aba ativa no painel"),
           ], priority=1),

        tc("Validar exclusão de aba com widgets associados",
           "Verificar o comportamento ao excluir uma aba que possui widgets configurados.",
           "Painel com duas abas; aba 'Resumo' contém 3 widgets configurados",
           [
               step("Clicar na ação de excluir da aba 'Resumo'",
                    "Sistema solicita confirmação da exclusão (modal de confirmação)"),
               step("Confirmar a exclusão",
                    "Aba 'Resumo' é removida junto com seus widgets"),
               step("Salvar o painel e recarregar",
                    "Aba não retorna após o reload (exclusão persistida)"),
           ], priority=1),
    ]
)


# ---------------------------------------------------------------------
# Suíte 7 — Importação de abas de outro painel
# ---------------------------------------------------------------------
suite_importacao = topic(
    "Importação de abas de outro painel",
    children=[
        tc("Validar step de importação - estrutura inicial",
           "Verificar se, ao selecionar 'Importar de outro painel', o novo step é exibido com os textos corretos.",
           "Modal 'Adicionar nova aba' (seleção de tipo) aberto",
           [
               step("Selecionar a opção 'Importar de outro painel'",
                    "Novo step do modal é exibido"),
               step("Verificar o título",
                    "Título: 'Adicionar nova aba'"),
               step("Verificar o subtítulo",
                    "Subtítulo: 'Importar de outro painel'"),
               step("Verificar o campo inicial exibido",
                    "Campo obrigatório 'Painel de origem' exibido em formato de select buscável"),
               step("Verificar as ações",
                    "Botões: 'Voltar', 'Cancelar', 'Importar aba'"),
           ], priority=1),

        tc("Selecionar painel de origem e buscar painel via texto",
           "Verificar se o select 'Painel de origem' é buscável e lista corretamente os painéis do usuário.",
           "Usuário com múltiplos painéis cadastrados\nStep de importação aberto",
           [
               step("Clicar no campo 'Painel de origem'",
                    "Dropdown exibido com a lista de painéis disponíveis, mostrando o nome de cada painel"),
               step("Digitar parte do nome de um painel existente no campo de busca",
                    "Dropdown filtra os painéis conforme o texto digitado"),
               step("Selecionar um painel (ex: 'Dashboard Vendas')",
                    "Painel é selecionado e novo campo 'Aba disponível' é exibido abaixo"),
           ], priority=1),

        tc("Validar campo 'Aba disponível' e exibição de quantidade de widgets",
           "Verificar se o campo 'Aba disponível' lista corretamente as abas do painel selecionado com a quantidade de widgets.",
           "Step de importação com 'Painel de origem' selecionado (painel com 3 abas de 1, 2 e 3 widgets respectivamente)",
           [
               step("Clicar no campo 'Aba disponível'",
                    "Dropdown exibe as 3 abas com: Nome da aba e Quantidade de widgets (ex: '1 widget', '2 widgets', '3 widgets')"),
               step("Selecionar uma aba (ex: 'Ranking' com 2 widgets)",
                    "Preview da aba é exibido contendo: Nome da aba, Quantidade de widgets e Lista de widgets inclusos"),
           ], priority=1),

        tc("Validar preenchimento automático do campo 'Nome da nova aba'",
           "Verificar se o campo 'Nome da nova aba' é preenchido automaticamente com o nome da aba original.",
           "Step de importação com aba 'Ranking' selecionada",
           [
               step("Observar o campo 'Nome da nova aba' após a seleção da aba",
                    "Campo exibido com valor pré-preenchido 'Ranking'"),
               step("Alterar o valor para 'Ranking Importado'",
                    "Campo aceita a alteração"),
               step("Limpar o campo completamente e tentar confirmar",
                    "Sistema impede a importação e sinaliza o campo como obrigatório"),
               step("Digitar 256 caracteres",
                    "Campo não permite o 256º caractere (limite de 255)"),
           ], priority=1),

        tc("Validar campo 'Categoria' no step de importação",
           "Verificar se o campo 'Categoria' apresenta as opções corretas no step de importação.",
           "Step de importação com painel e aba selecionados",
           [
               step("Clicar no campo 'Categoria'",
                    "Dropdown exibe a opção: 'Aprendizagem'"),
               step("Selecionar 'Aprendizagem'",
                    "Opção selecionada"),
               step("Deixar o campo sem seleção e tentar importar",
                    "Sistema sinaliza obrigatoriedade (se aplicável) ou permite importação conforme especificação"),
           ], priority=2),

        tc("Confirmar importação de aba e validar resultados",
           "Verificar se ao confirmar a importação todos os resultados especificados ocorrem corretamente.",
           "Step de importação totalmente preenchido (Painel 'Dashboard Vendas', aba 'Ranking', Nome nova aba 'Ranking Importado', Categoria 'Aprendizagem')",
           [
               step("Clicar em 'Importar aba'",
                    "Modal fechado"),
               step("Observar o painel após a importação",
                    "Nova aba 'Ranking Importado' criada e definida como aba ativa"),
               step("Verificar os widgets da aba",
                    "Widgets copiados da aba original 'Ranking' (mesmos widgets com mesmas configurações e posicionamentos)"),
               step("Verificar o toast",
                    "Toast de sucesso exibido com o texto: 'Aba importada com sucesso'"),
               step("Salvar o painel e recarregar",
                    "Aba 'Ranking Importado' e seus widgets são persistidos"),
           ], priority=1),

        tc("Validar ação 'Voltar' no step de importação",
           "Verificar se 'Voltar' retorna ao step de seleção de tipo sem importar.",
           "Step de importação preenchido com painel e aba",
           [
               step("Clicar em 'Voltar'",
                    "Modal retorna ao step de seleção de tipo ('Criar nova aba' / 'Importar de outro painel')"),
               step("Verificar o painel",
                    "Nenhuma aba foi adicionada ao painel (importação não efetivada)"),
           ], priority=2),

        tc("Validar ação 'Cancelar' no step de importação",
           "Verificar se 'Cancelar' fecha o modal sem importar.",
           "Step de importação preenchido",
           [
               step("Clicar em 'Cancelar'",
                    "Modal é fechado"),
               step("Verificar o painel",
                    "Nenhuma aba foi adicionada"),
           ], priority=2),

        tc("Importar aba com muitos widgets",
           "Verificar se a importação de uma aba com muitos widgets (ex: 10+) é bem-sucedida e performa corretamente.",
           "Painel 'Dashboard Completo' com aba 'Resumo Geral' contendo 10+ widgets",
           [
               step("Executar fluxo de importação selecionando 'Dashboard Completo' > 'Resumo Geral'",
                    "Aba listada com quantidade correta de widgets (ex: '10 widgets')"),
               step("Confirmar a importação",
                    "Toast 'Aba importada com sucesso' exibido"),
               step("Verificar a nova aba",
                    "Todos os 10 widgets copiados corretamente com mesmas configurações e posicionamentos"),
           ], priority=2),

        tc("Validar importação de aba vazia (sem widgets)",
           "Verificar o comportamento ao importar uma aba que não possui widgets.",
           "Painel de origem com aba vazia (0 widgets)",
           [
               step("Selecionar o painel de origem",
                    "Painel selecionado"),
               step("Selecionar a aba vazia",
                    "Aba listada com '0 widgets'; preview exibe lista de widgets vazia"),
               step("Confirmar a importação",
                    "Aba vazia importada; estado vazio exibido no layout da nova aba ('Nenhum widget adicionado')"),
           ], priority=2),
    ]
)


# ---------------------------------------------------------------------
# Suíte 8 — Visualização e interação com o layout
# ---------------------------------------------------------------------
suite_layout = topic(
    "Visualização e interação com o layout",
    children=[
        tc("Validar barra de ferramentas do topo",
           "Verificar se a barra de ferramentas fixa no topo exibe todos os elementos especificados.",
           "Painel aberto com aba 'Resumo' selecionada",
           [
               step("Observar o topo da área de layout",
                    "Barra de ferramentas fixa exibida"),
               step("Verificar o lado esquerdo da barra",
                    "Botão '+ Adicionar widget' exibido"),
               step("Verificar o lado direito da barra",
                    "Controle de visualização com opções 'Visualização: Desktop', 'Visualização: Tablet' e 'Visualização: Mobile' exibido"),
               step("Verificar ao lado do controle de visualização",
                    "Switch 'Permitir reorganizar widgets' exibido"),
               step("Fazer scroll na área de conteúdo",
                    "Barra de ferramentas permanece fixa no topo"),
           ], priority=1),

        tc("Alternar visualização para Tablet e validar alertas",
           "Verificar se ao selecionar visualização Tablet o layout se adapta e os alertas/tooltips são exibidos.",
           "Painel aberto com aba contendo widgets\nVisualização inicial 'Desktop'",
           [
               step("Selecionar 'Visualização: Tablet' no controle de visualização",
                    "Layout da aba é renderizado com largura de 768px"),
               step("Verificar o alerta exibido",
                    "Alerta exibido: 'Visualização (Tablet) — edição disponível no Desktop'"),
               step("Verificar o switch 'Permitir reorganizar widgets'",
                    "Switch está desabilitado"),
               step("Passar o cursor sobre o switch desabilitado",
                    "Tooltip exibido: 'Edição disponível apenas no modo Desktop'"),
               step("Tentar arrastar um widget",
                    "Reorganização não é permitida (o widget não se move)"),
           ], priority=1),

        tc("Alternar visualização para Mobile e validar alertas",
           "Verificar se ao selecionar visualização Mobile o layout se adapta a 360px e os alertas são exibidos.",
           "Painel aberto com aba contendo widgets",
           [
               step("Selecionar 'Visualização: Mobile'",
                    "Layout da aba é renderizado com largura de 360px"),
               step("Verificar o alerta exibido",
                    "Alerta exibido: 'Visualização (Mobile) — edição disponível no Desktop'"),
               step("Verificar o switch 'Permitir reorganizar widgets'",
                    "Switch está desabilitado"),
               step("Passar o cursor sobre o switch desabilitado",
                    "Tooltip: 'Edição disponível apenas no modo Desktop'"),
               step("Tentar arrastar um widget",
                    "Reorganização não é permitida"),
           ], priority=1),

        tc("Voltar para visualização Desktop e validar habilitação do switch",
           "Verificar se ao voltar para Desktop o switch de reorganização é reabilitado.",
           "Painel com visualização inicial 'Mobile' ou 'Tablet'",
           [
               step("Selecionar 'Visualização: Desktop'",
                    "Layout retorna ao tamanho padrão desktop"),
               step("Verificar o alerta de dispositivo",
                    "Alerta de dispositivo não é exibido"),
               step("Verificar o switch 'Permitir reorganizar widgets'",
                    "Switch é habilitado"),
           ], priority=1),

        tc("Ativar switch 'Permitir reorganizar widgets' e reorganizar",
           "Verificar se com o switch ativo o usuário consegue reorganizar widgets no layout.",
           "Painel aberto no modo Desktop com múltiplos widgets",
           [
               step("Ativar o switch 'Permitir reorganizar widgets'",
                    "Switch em estado ativo"),
               step("Arrastar um widget da posição 1 para a posição 3",
                    "Widget é movido e ocupa a nova posição"),
               step("Desativar o switch",
                    "Switch em estado inativo"),
               step("Tentar arrastar o widget novamente",
                    "Reorganização é bloqueada"),
               step("Salvar o layout",
                    "Nova posição persistida"),
               step("Recarregar a página e reabrir o painel",
                    "Widget mantém a nova posição"),
           ], priority=1),

        tc("Validar estado vazio da aba (sem widgets)",
           "Verificar se, ao acessar uma aba sem widgets, o estado vazio é exibido com textos literais corretos.",
           "Painel com aba nova sem widgets adicionados",
           [
               step("Acessar a aba sem widgets",
                    "Estado vazio é renderizado"),
               step("Verificar o ícone ilustrativo",
                    "Ícone centralizado exibido"),
               step("Verificar o título",
                    "Título exibido: 'Nenhum widget adicionado'"),
               step("Verificar a descrição",
                    'Descrição exibida: Clique no botão "Adicionar Widget" para começar a montar sua tela personalizada'),
               step("Verificar o botão de ação primária",
                    "Botão '+ Adicionar Widget' exibido"),
               step("Clicar no botão '+ Adicionar Widget' do estado vazio",
                    "Drawer 'Widgets disponíveis' é aberto (mesma ação do botão da barra de ferramentas)"),
           ], priority=1),

        tc("Validar barra de ferramentas do rodapé - Cancelar",
           "Verificar se a ação Cancelar descarta alterações e retorna à listagem.",
           "Painel aberto em edição com alterações não salvas (ex: widget adicionado)",
           [
               step("Observar o rodapé da tela",
                    "Barra de ferramentas fixa no rodapé exibida com botões 'Cancelar' e 'Salvar layout'"),
               step("Clicar em 'Cancelar'",
                    "Sistema solicita confirmação do descarte (modal de alterações não salvas) ou descarta diretamente conforme especificação"),
               step("Confirmar o descarte",
                    "Usuário é retornado à listagem de painéis"),
               step("Reabrir o painel e a aba editada",
                    "Alterações não salvas NÃO foram persistidas"),
           ], priority=1),

        tc("Validar barra de ferramentas do rodapé - Salvar layout",
           "Verificar se a ação Salvar layout persiste as alterações.",
           "Painel aberto com alterações (widgets adicionados, reorganizados, configurados)",
           [
               step("Clicar em 'Salvar layout'",
                    "Sistema persiste as alterações; toast de sucesso exibido conforme padrão da plataforma"),
               step("Recarregar a página e reabrir o painel",
                    "Todas as alterações salvas permanecem aplicadas"),
           ], priority=1),

        tc("Validar adaptação responsiva Mobile/Tablet via DevTools",
           "Verificar se, ao abrir o painel em um navegador real em resoluções Tablet/Mobile, a visualização se adapta automaticamente.",
           "Painel publicado disponibilizado via modo de uso\nDevTools com emulação de dispositivo ativa",
           [
               step("Emular dispositivo Tablet (768x1024) no DevTools",
                    "Layout do painel se adapta automaticamente à resolução tablet"),
               step("Emular dispositivo Mobile (360x640)",
                    "Layout se adapta à resolução mobile"),
               step("Verificar a disposição dos widgets",
                    "Widgets se reposicionam verticalmente conforme resolução, sem sobreposição"),
           ], priority=2),
    ]
)


# ---------------------------------------------------------------------
# Suíte 9 — Adição de widgets ao layout
# ---------------------------------------------------------------------
suite_widgets_add = topic(
    "Adição de widgets ao layout",
    children=[
        tc("Validar abertura do drawer 'Widgets disponíveis'",
           "Verificar se ao clicar em '+ Adicionar widget' o drawer lateral é exibido com todos os elementos especificados.",
           "Painel aberto em modo Desktop",
           [
               step("Clicar no botão '+ Adicionar widget' na barra de ferramentas",
                    "Drawer lateral é aberto"),
               step("Verificar o título do drawer",
                    "Título exibido: 'Widgets disponíveis'"),
               step("Verificar a estrutura logo abaixo do título",
                    "Campo de filtros exibido em estado colapsado"),
               step("Verificar a listagem exibida",
                    "Listagem de widgets organizada por categorias exibida abaixo dos filtros"),
               step("Fechar o drawer (X ou clique fora)",
                    "Drawer fechado; layout da aba permanece inalterado"),
           ], priority=1),

        tc("Expandir filtros e validar opções",
           "Verificar se o campo de filtros expande corretamente e exibe as opções especificadas.",
           "Drawer 'Widgets disponíveis' aberto com filtros colapsados",
           [
               step("Clicar no campo de filtros",
                    "Conteúdo expande exibindo as opções disponíveis"),
               step("Verificar o campo de categorias",
                    "Campo de categorias exibido em formato multi select"),
               step("Clicar no campo de categorias",
                    "Opções exibidas: 'Todos' e 'Aprendizagem'"),
               step("Selecionar 'Aprendizagem'",
                    "Filtro aplicado; listagem exibe apenas widgets da categoria Aprendizagem"),
               step("Selecionar 'Todos'",
                    "Listagem exibe widgets de todas as categorias"),
               step("Desmarcar as opções",
                    "Listagem volta ao estado padrão (todas as categorias)"),
           ], priority=1),

        tc("Validar campo 'Buscar' e placeholder",
           "Verificar se o campo 'Buscar' funciona corretamente, exibe placeholder e filtra widgets.",
           "Drawer 'Widgets disponíveis' aberto",
           [
               step("Localizar o campo 'Buscar' abaixo dos filtros",
                    "Campo de texto exibido com placeholder 'Digite o nome do widget...'"),
               step("Digitar 'Ranking'",
                    "Listagem filtra e exibe apenas o widget 'Ranking'"),
               step("Limpar o campo",
                    "Listagem volta a exibir todos os widgets"),
               step("Digitar 'resumo'",
                    "Listagem exibe 'Resumo das atividades' (busca case-insensitive)"),
               step("Digitar texto inexistente 'xyz123'",
                    "Listagem exibe mensagem ou estado vazio indicando que nenhum widget foi encontrado"),
           ], priority=1),

        tc("Validar exibição dos widgets da categoria Aprendizagem",
           "Verificar se todos os widgets da categoria Aprendizagem são exibidos com as informações corretas.",
           "Drawer 'Widgets disponíveis' aberto com categoria Aprendizagem expandida",
           [
               step("Observar a listagem de widgets na categoria 'Aprendizagem'",
                    "Widgets listados: 'Resumo das atividades', 'Conteúdos em andamento', 'Ranking', 'Meus certificados'"),
               step("Verificar o widget 'Resumo das atividades'",
                    "Exibe nome 'Resumo das atividades', descrição 'Exibe um resumo completo das atividades de aprendizagem do usuário', badge de perfil 'Usuário' e tag da categoria"),
               step("Verificar o widget 'Conteúdos em andamento'",
                    "Exibe nome 'Conteúdos em andamento', descrição 'Exibe os conteúdos que o usuário está cursando atualmente', badge 'Usuário' e tag"),
               step("Verificar o widget 'Ranking'",
                    "Exibe nome 'Ranking', descrição 'Exibe para o usuário a sua posição do ranking e o top 5 do ambiente', badge 'Usuário' e tag"),
               step("Verificar o widget 'Meus certificados'",
                    "Exibe nome 'Meus certificados', descrição 'Exibe todos os certificados que o usuário conquistou', badge 'Usuário' e tag"),
               step("Passar o cursor sobre um widget",
                    "Tooltip com a descrição completa do widget é exibido (quando aplicável)"),
           ], priority=1),

        tc("Adicionar widget à aba e validar toast de sucesso",
           "Verificar se o clique em um widget adiciona-o à aba ativa e exibe toast.",
           "Drawer 'Widgets disponíveis' aberto\nAba ativa 'Nova aba' sem widgets",
           [
               step("Clicar no widget 'Meus certificados' na listagem",
                    "Widget é adicionado ao conteúdo da aba atualmente selecionada"),
               step("Verificar o toast",
                    "Toast exibido com o texto: 'Widget adicionado com sucesso'"),
               step("Verificar a aba",
                    "Widget 'Meus certificados' aparece na aba, ocupando 6 colunas (largura padrão)"),
           ], priority=1),

        tc("Validar largura padrão diferenciada para Ranking e Resumo de atividades",
           "Verificar se os widgets 'Ranking' e 'Resumo de atividades' são inseridos com largura diferente dos demais (não 6 colunas).",
           "Aba sem widgets",
           [
               step("Adicionar o widget 'Resumo das atividades'",
                    "Widget inserido com largura diferente de 6 colunas (largura específica conforme especificação)"),
               step("Adicionar o widget 'Ranking'",
                    "Widget inserido com largura diferente de 6 colunas (largura específica)"),
               step("Adicionar o widget 'Meus certificados'",
                    "Widget inserido ocupando exatamente 6 colunas"),
               step("Adicionar o widget 'Conteúdos em andamento'",
                    "Widget inserido ocupando exatamente 6 colunas"),
           ], priority=2),

        tc("Adicionar múltiplos widgets sequencialmente",
           "Verificar se é possível adicionar vários widgets em sequência e se todos são posicionados corretamente.",
           "Aba sem widgets",
           [
               step("Abrir o drawer e clicar no widget 'Ranking'",
                    "Widget 'Ranking' adicionado; toast 'Widget adicionado com sucesso' exibido"),
               step("Clicar no widget 'Meus certificados'",
                    "Widget adicionado logo abaixo ou ao lado do anterior, conforme grid"),
               step("Clicar no widget 'Conteúdos em andamento'",
                    "Widget adicionado; layout se acomoda"),
               step("Verificar o resultado final",
                    "Todos os widgets exibidos na aba, respeitando o espaço de 6 colunas (ou largura diferenciada para Ranking/Resumo)"),
           ], priority=2),

        tc("Adicionar widgets com reorganização permitida",
           "Verificar se é possível arrastar widgets adicionados quando o switch está ativo.",
           "Aba com 3 widgets adicionados\nSwitch 'Permitir reorganizar widgets' ativo",
           [
               step("Arrastar o terceiro widget para a primeira posição",
                    "Widget é movido; demais widgets se reposicionam"),
               step("Desativar o switch e tentar arrastar novamente",
                    "Reorganização bloqueada"),
           ], priority=2),

        tc("Fechar drawer durante a adição de widgets",
           "Verificar se o drawer pode ser fechado a qualquer momento sem afetar widgets já adicionados.",
           "Drawer aberto com filtros aplicados e busca digitada",
           [
               step("Adicionar um widget",
                    "Widget inserido na aba; toast exibido"),
               step("Fechar o drawer clicando no X",
                    "Drawer fechado; widget permanece na aba"),
               step("Reabrir o drawer",
                    "Filtros e busca voltam ao estado inicial (ou persistem conforme especificação)"),
           ], priority=3),
    ]
)


# ---------------------------------------------------------------------
# Suíte 10 — Edição e exclusão de widgets
# ---------------------------------------------------------------------
suite_widgets_edit = topic(
    "Edição e exclusão de widgets",
    children=[
        tc("Validar ícones de ação dos widgets adicionados",
           "Verificar se cada widget adicionado exibe os ícones de Editar (lápis) e Excluir (x).",
           "Aba com ao menos um widget adicionado",
           [
               step("Passar o cursor sobre um widget na aba",
                    "Ícones de ação exibidos: lápis (Editar) e x (Excluir)"),
               step("Passar o cursor sobre o ícone lápis",
                    "Tooltip 'Editar' (ou equivalente) exibido"),
               step("Passar o cursor sobre o ícone x",
                    "Tooltip 'Excluir' (ou equivalente) exibido"),
           ], priority=2),

        tc("Abrir drawer 'Configurações do widget' e validar estrutura",
           "Verificar se ao clicar no lápis o drawer de configurações é aberto com os campos especificados.",
           "Widget 'Meus certificados' adicionado à aba",
           [
               step("Clicar no ícone lápis do widget",
                    "Drawer é exibido"),
               step("Verificar o título do drawer",
                    "Título exibido: 'Configurações do widget'"),
               step("Verificar os campos disponíveis",
                    "Campos exibidos: 'Mostrar título' (switch), 'Título' (input, máx. 255), 'Mostrar ícone' (switch), 'Ícone' (componente de ícones similar ao modo de uso)"),
               step("Verificar os botões na parte inferior",
                    "Botões 'Cancelar' e 'Salvar' exibidos"),
           ], priority=1),

        tc("Editar e salvar configurações do widget",
           "Verificar se ao salvar as alterações o drawer fecha e o toast de sucesso é exibido.",
           "Drawer 'Configurações do widget' aberto para o widget 'Meus certificados'",
           [
               step("Ativar o switch 'Mostrar título'",
                    "Campo 'Título' é habilitado para edição"),
               step("Preencher o campo 'Título' com 'Meus Certificados do Semestre'",
                    "Campo aceita o texto"),
               step("Ativar o switch 'Mostrar ícone' e selecionar um ícone",
                    "Ícone selecionado"),
               step("Clicar em 'Salvar'",
                    "Drawer é fechado"),
               step("Verificar o toast",
                    "Toast exibido com o texto: 'Configurações salvas com sucesso'"),
               step("Verificar o widget na aba",
                    "Widget exibe o título 'Meus Certificados do Semestre' e o ícone selecionado"),
               step("Salvar o layout e recarregar a página",
                    "Configurações persistidas"),
           ], priority=1),

        tc("Cancelar edição de configurações do widget",
           "Verificar se ao clicar em 'Cancelar' o drawer fecha sem salvar alterações.",
           "Drawer 'Configurações do widget' aberto",
           [
               step("Alterar o campo 'Título' para 'Título Alterado'",
                    "Campo aceita o texto"),
               step("Clicar em 'Cancelar'",
                    "Drawer é fechado sem salvar"),
               step("Reabrir o drawer do mesmo widget",
                    "Campo 'Título' exibe o valor original (não foi alterado)"),
           ], priority=1),

        tc("Validar limite do campo 'Título' do drawer",
           "Verificar limites de caracteres no campo 'Título'.",
           "Drawer 'Configurações do widget' aberto com 'Mostrar título' ativo",
           [
               step("Digitar exatamente 255 caracteres no campo 'Título'",
                    "Campo aceita os 255 caracteres"),
               step("Tentar digitar o 256º caractere",
                    "Campo não permite a inserção do 256º caractere"),
               step("Inserir acentos, emojis e caracteres especiais",
                    "Campo aceita todos os caracteres sem erros"),
               step("Copiar um texto longo (>255 caracteres) e colar",
                    "Apenas os primeiros 255 caracteres são aceitos"),
           ], priority=2),

        tc("Validar comportamento do switch 'Mostrar título'",
           "Verificar se o switch 'Mostrar título' controla a visibilidade do título no widget.",
           "Widget com título cadastrado ('Meu título') e 'Mostrar título' ativo",
           [
               step("Desativar o switch 'Mostrar título' e salvar",
                    "Toast de sucesso exibido; widget na aba passa a não exibir o título"),
               step("Reabrir o drawer e ativar o switch novamente",
                    "Campo 'Título' volta a ser editável e exibido no widget"),
           ], priority=2),

        tc("Validar comportamento do switch 'Mostrar ícone'",
           "Verificar se o switch 'Mostrar ícone' controla a visibilidade do ícone no widget.",
           "Widget com ícone selecionado",
           [
               step("Desativar 'Mostrar ícone' e salvar",
                    "Ícone deixa de ser exibido no widget"),
               step("Reativar o switch 'Mostrar ícone'",
                    "Componente de seleção de ícone fica disponível novamente"),
               step("Selecionar outro ícone e salvar",
                    "Novo ícone exibido no widget após salvar; toast de sucesso exibido"),
           ], priority=2),

        tc("Excluir widget clicando no x",
           "Verificar se o clique no ícone x remove o widget da aba.",
           "Aba com widget 'Ranking' adicionado",
           [
               step("Clicar no ícone x do widget 'Ranking'",
                    "Sistema solicita confirmação da exclusão (modal padrão) ou executa diretamente conforme especificação"),
               step("Confirmar a exclusão",
                    "Widget é removido da aba"),
               step("Salvar o layout e recarregar",
                    "Widget não retorna após o reload (exclusão persistida)"),
           ], priority=1),

        tc("Excluir o último widget da aba - estado vazio",
           "Verificar se ao excluir o último widget da aba o estado vazio é exibido novamente.",
           "Aba com apenas um widget",
           [
               step("Clicar no ícone x do único widget e confirmar",
                    "Widget removido"),
               step("Verificar a aba",
                    "Estado vazio reaparece: título 'Nenhum widget adicionado' e botão '+ Adicionar Widget'"),
           ], priority=2),

        tc("Editar múltiplos widgets sem salvar layout",
           "Verificar se as configurações de widget são salvas individualmente ao clicar em 'Salvar' no drawer, mesmo sem salvar o layout.",
           "Aba com 2 widgets adicionados",
           [
               step("Editar o widget 1 alterando o título e clicar em 'Salvar'",
                    "Toast 'Configurações salvas com sucesso' exibido"),
               step("Editar o widget 2 alterando o ícone e clicar em 'Salvar'",
                    "Toast exibido"),
               step("Clicar em 'Cancelar' na barra de rodapé da tela de layout e confirmar o descarte",
                    "Alterações de posicionamento são descartadas, mas configurações dos widgets editados permanecem (ou também são descartadas, conforme comportamento da plataforma)"),
           ], priority=3),
    ]
)


# ---------------------------------------------------------------------
# Suíte 11 — Modo de uso - Painéis do usuário
# ---------------------------------------------------------------------
suite_modo_uso = topic(
    "Modo de uso - Painéis do usuário",
    children=[
        tc("Criar modelo de página do tipo 'Painéis do usuário'",
           "Verificar se nos modelos de página do modo de uso existe a opção 'Painéis do usuário' e se ao selecioná-la o campo 'Espaço' é exibido.",
           "Feature flag habilitar_paineis_do_usuario habilitada\nUsuário logado como Admin\nAcesso à tela de criação/edição de modos de uso\nAo menos um painel ativo cadastrado",
           [
               step("Acessar a tela de configuração de um modo de uso",
                    "Tela exibida"),
               step("Abrir o seletor de modelos de página",
                    "Entre as opções, deve existir 'Painéis do usuário'"),
               step("Selecionar a opção 'Painéis do usuário'",
                    "Novo campo 'Espaço' é exibido"),
               step("Clicar no campo 'Espaço'",
                    "Lista dos painéis disponíveis exibida (somente painéis ativos)"),
               step("Selecionar um painel e salvar o modo de uso",
                    "Modo de uso salvo com sucesso"),
           ], priority=1),

        tc("Visualizar painel na visão do aluno",
           "Verificar se ao acessar o menu do modo de uso como aluno a estrutura e layout do painel são exibidos em modo somente visualização.",
           "Modo de uso associado a um painel com 2 abas, cada uma com 2 widgets\nUsuário logado como Aluno\nMenu do modo de uso habilitado",
           [
               step("Acessar o menu criado com o modelo 'Painéis do usuário'",
                    "Painel é renderizado na visão do aluno"),
               step("Verificar as abas exibidas",
                    "Todas as abas configuradas no painel são apresentadas"),
               step("Verificar os widgets de cada aba",
                    "Widgets exibidos conforme configuração (título, ícone, posicionamento)"),
               step("Tentar interagir com elementos de edição (ex: adicionar widget, reorganizar)",
                    "Nenhuma funcionalidade de edição está disponível (modo somente visualização)"),
               step("Verificar se há filtros na visão",
                    "Não há filtros nesse primeiro momento"),
           ], priority=1),

        tc("Validar adaptação automática da visão do aluno no Tablet",
           "Verificar se na visão do aluno em Tablet o layout se adapta automaticamente.",
           "Aluno logado em tablet (ou emulação via DevTools 768px)",
           [
               step("Acessar o menu configurado com 'Painéis do usuário'",
                    "Painel renderizado"),
               step("Verificar o layout",
                    "Widgets se reorganizam conforme resolução tablet (sem sobreposição, respeitando grid responsivo)"),
           ], priority=2),

        tc("Validar adaptação automática da visão do aluno no Mobile",
           "Verificar se na visão do aluno em Mobile o layout se adapta automaticamente.",
           "Aluno logado em mobile (ou emulação via DevTools 360px)",
           [
               step("Acessar o menu configurado com 'Painéis do usuário'",
                    "Painel renderizado na largura mobile"),
               step("Verificar a disposição dos widgets",
                    "Widgets se empilham verticalmente conforme largura reduzida"),
           ], priority=2),

        tc("Bloquear reativação de modo de uso cujo painel está inativo (R15)",
           "Verificar se, ao tentar reativar um modo de uso associado a um painel inativo, o sistema bloqueia e exibe modal informativo.",
           "Modo de uso desativado associado a um painel atualmente inativo",
           [
               step("Acessar a configuração do modo de uso desativado",
                    "Tela aberta"),
               step("Tentar reativar o modo de uso",
                    "Sistema bloqueia a operação"),
               step("Verificar o modal exibido",
                    "Modal informativo exibido informando que o painel está inativo e não pode ser reativado"),
               step("Reativar o painel associado (ou selecionar outro painel ativo)",
                    "Painel fica disponível"),
               step("Tentar reativar o modo de uso novamente",
                    "Modo de uso ativado com sucesso"),
           ], priority=1),

        tc("Validar atualização do painel reflete na visão do aluno",
           "Verificar se alterações feitas no painel (widgets adicionados/removidos) refletem na visão do aluno após salvar.",
           "Painel 'Painel do Aluno' com 2 widgets associado a modo de uso ativo",
           [
               step("Como Admin, abrir o painel e adicionar um novo widget à aba ativa",
                    "Widget adicionado e layout salvo"),
               step("Como Aluno, acessar o menu configurado",
                    "Painel exibe os 3 widgets (os 2 anteriores + o novo adicionado)"),
               step("Como Admin, remover um widget e salvar",
                    "Layout salvo"),
               step("Como Aluno, recarregar o menu",
                    "Painel exibe apenas 2 widgets (reflete a remoção)"),
           ], priority=2),
    ]
)


# ---------------------------------------------------------------------
# Suíte 12 — Banco histórico e Logs
# ---------------------------------------------------------------------
suite_banco_logs = topic(
    "Banco histórico e Logs",
    children=[
        tc("Validar registro de log ao criar painel",
           "Verificar se a criação de um painel gera um log corretamente registrado.",
           "Feature flag habilitar_paineis_do_usuario habilitada\nUsuário Admin logado\nAcesso aos logs do sistema",
           [
               step("Criar um novo painel 'Painel Log Test'",
                    "Painel criado com sucesso"),
               step("Consultar os logs do sistema filtrando por 'Painéis'",
                    "Log exibido com informações: ação (criação), usuário, data/hora, recurso afetado ('Painel Log Test')"),
           ], priority=1),

        tc("Validar registro de log ao editar painel",
           "Verificar se a edição de um painel gera log.",
           "Painel existente\nAdmin logado",
           [
               step("Editar o painel alterando nome ou descrição",
                    "Alteração salva"),
               step("Consultar os logs",
                    "Log de edição exibido com informações: ação (edição), usuário, data/hora, campos alterados ou identificação do recurso"),
           ], priority=1),

        tc("Validar registro de log ao excluir painel",
           "Verificar se a exclusão de um painel gera log.",
           "Painel próprio existente",
           [
               step("Excluir o painel",
                    "Painel removido"),
               step("Consultar os logs",
                    "Log de exclusão exibido com ação, usuário, data/hora e identificação do painel"),
           ], priority=1),

        tc("Validar registro de log ao criar, renomear e excluir abas",
           "Verificar se as operações de CRUD em abas geram logs.",
           "Painel em edição",
           [
               step("Adicionar uma nova aba 'Aba Log'",
                    "Aba criada"),
               step("Renomear a aba para 'Aba Log Renomeada'",
                    "Aba renomeada; toast 'Aba renomeada com sucesso'"),
               step("Excluir a aba",
                    "Aba removida"),
               step("Consultar os logs",
                    "Logs exibidos para as 3 operações (criação, renomeação, exclusão)"),
           ], priority=2),

        tc("Validar registro de log ao adicionar, editar e excluir widgets",
           "Verificar se as operações de CRUD em widgets geram logs.",
           "Painel em edição com aba ativa",
           [
               step("Adicionar widget 'Ranking'",
                    "Widget adicionado; toast 'Widget adicionado com sucesso'"),
               step("Editar configurações do widget (título/ícone) e salvar",
                    "Toast 'Configurações salvas com sucesso'"),
               step("Excluir o widget",
                    "Widget removido"),
               step("Consultar os logs",
                    "Logs exibidos para as 3 operações (criação, edição, exclusão)"),
           ], priority=2),

        tc("Validar rotina de banco histórico para painéis, abas e widgets",
           "Verificar se o worker HistoricBaseCron exclui os registros das novas tabelas (painéis, abas e widgets) da organização corretamente, conforme rotina de banco histórico.",
           "Ambiente Stage com organização marcada para exclusão histórica\nPainéis, abas e widgets cadastrados na organização",
           [
               step("Executar manualmente ou aguardar execução do worker HistoricBaseCron",
                    "Worker executado"),
               step("Consultar as tabelas de painéis, abas e widgets",
                    "Registros da organização removidos conforme rotina de exclusão do banco histórico"),
               step("Verificar que registros de outras organizações não foram afetados",
                    "Apenas registros da organização alvo foram excluídos"),
           ], priority=1),

        tc("Validar persistência dos logs após exclusão do recurso",
           "Verificar se os logs históricos são preservados mesmo após a exclusão do recurso.",
           "Painel criado, editado e excluído",
           [
               step("Consultar os logs após a exclusão do painel",
                    "Logs de criação e edição permanecem acessíveis, preservando o histórico das ações mesmo com o recurso excluído"),
           ], priority=3),
    ]
)


# =====================================================================
# MONTAR ESTRUTURA FINAL
# =====================================================================
root_topic = topic(
    "Análise de Teste - Painéis dos Usuários (Widgets)",
    children=[
        suite_feature_flag,
        suite_listagem,
        suite_filtros,
        suite_duplicacao,
        suite_criacao_identificacao,
        suite_abas,
        suite_importacao,
        suite_layout,
        suite_widgets_add,
        suite_widgets_edit,
        suite_modo_uso,
        suite_banco_logs,
    ]
)

content = [{
    "id": gid(),
    "class": "sheet",
    "title": "Painéis dos Usuários (Widgets)",
    "rootTopic": root_topic,
    "topicPositioning": "fixed"
}]


# =====================================================================
# GERAR ARQUIVO .XMIND
# =====================================================================
def create_xmind_from_template(output_path, template_path):
    """Gera .xmind usando template existente (substitui apenas content.json)."""
    import tempfile
    temp_dir = tempfile.mkdtemp(prefix="xmind_build_")

    with zipfile.ZipFile(template_path, 'r') as z:
        z.extractall(temp_dir)

    with open(os.path.join(temp_dir, "content.json"), 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                fp = os.path.join(root, file)
                z.write(fp, os.path.relpath(fp, temp_dir))

    shutil.rmtree(temp_dir)
    print(f"XMind gerado com sucesso: {output_path}")


def create_xmind_minimal(output_path):
    """Gera .xmind mínimo válido quando não há template."""
    metadata = {"creator": {"name": "twygo-qa-agent", "version": "1.0"}}
    manifest = {
        "file-entries": {
            "content.json": {},
            "metadata.json": {},
        }
    }
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr("content.json", json.dumps(content, ensure_ascii=False, indent=2))
        z.writestr("metadata.json", json.dumps(metadata, ensure_ascii=False, indent=2))
        z.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f"XMind gerado (modo mínimo, sem template): {output_path}")


if __name__ == "__main__":
    output_file = "output/Analise_Teste_Paineis_Widgets.xmind"
    template_file = "template/template.xmind"
    if os.path.exists(template_file):
        create_xmind_from_template(output_file, template_file)
    else:
        print("AVISO: template/template.xmind não encontrado. Gerando .xmind mínimo.")
        create_xmind_minimal(output_file)
