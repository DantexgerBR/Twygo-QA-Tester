"""
Gera o XMind de Análise de Teste para o projeto Painéis dos Usuários (Widgets).
Suítes derivadas da planilha 'Quebra de atividades - Painéis dos usuários (Widgets).xlsx'
(aba 'dev-qa', atividades do tipo 'Execução de testes').

Os passos foram escritos seguindo as convenções da skill twygo-qa-conventions §8
(compatibilidade com agent-playwright): verbos canônicos, nomes literais entre aspas,
resultados assertáveis com texto literal e elemento alvo.
"""

import json
import os
import shutil
import tempfile
import uuid
import zipfile

PROJECT = "Painéis dos Usuários (Widgets)"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "Analise_Teste_Paineis_Widgets.xmind")
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "..", "template", "template.xmind")


# ---------------------------------------------------------------------------
# UTILITÁRIOS XMind
# ---------------------------------------------------------------------------

def gid():
    return str(uuid.uuid4()).replace("-", "")[:24]


def topic(title, note=None, children=None, markers=None):
    t = {
        "id": gid(),
        "class": "topic",
        "title": title,
        "structureClass": "org.xmind.ui.map.unbalanced",
        "titleUnedited": True,
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


# Pré-condições reutilizáveis
PC_BASE = (
    "Ambiente Stage configurado\n"
    "Funcionalidade 'Gestão de Painéis' habilitada no contrato\n"
    "Feature flag 'habilitar_paineis_do_usuario' ativa\n"
    "Usuário logado como Admin"
)
PC_BASE_ALUNO = (
    "Ambiente Stage configurado\n"
    "Funcionalidade 'Gestão de Painéis' habilitada no contrato\n"
    "Feature flag 'habilitar_paineis_do_usuario' ativa\n"
    "Usuário logado como Aluno"
)


# ---------------------------------------------------------------------------
# SUÍTE 1 - Listagem de painéis
# ---------------------------------------------------------------------------

suite_1 = topic("Listagem de painéis", children=[
    tc(
        "Acessar a listagem de Painéis a partir do menu Modos de uso",
        "Validar acesso à listagem e renomeação de menu/breadcrumb (R1).",
        PC_BASE,
        [
            step("Clicar no menu lateral 'Menu'",
                 "Submenu lateral é exibido contendo os itens de navegação"),
            step("Clicar no submenu 'Modos de uso'",
                 "Sistema redireciona para a tela de Modos de uso e exibe breadcrumb 'Navegação > Modos de uso'"),
            step("Clicar na aba 'Painéis'",
                 "Aba 'Painéis' fica selecionada e exibe a listagem de painéis"),
            step("Verificar o componente da listagem",
                 "Listagem é renderizada usando o componente 'list-control'"),
        ],
        priority=1,
    ),
    tc(
        "Validar componentes obrigatórios da listagem de painéis",
        "Verificar presença de botão Adicionar, campo de pesquisa e visualizações lista/cards (R2).",
        PC_BASE,
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem de painéis é exibida"),
            step("Verificar a presença do botão de criação",
                 "Botão '+ Adicionar' é exibido no topo da listagem"),
            step("Verificar a presença do campo de pesquisa",
                 "Campo de pesquisa é exibido no topo da listagem"),
            step("Verificar os modos de visualização disponíveis",
                 "Controles 'Lista' e 'Cards' são exibidos; modo 'Lista' está selecionado por padrão"),
        ],
        priority=1,
    ),
    tc(
        "Validar colunas exibidas na visualização em lista",
        "Validar colunas Nome, Descrição, Provedora, Data de criação, Ativo? e Ações (R2).",
        PC_BASE + "\nExistem painéis previamente cadastrados na organização",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso no modo 'Lista'",
                 "Tabela exibe os cabeçalhos: 'Nome', 'Descrição', 'Provedora', 'Data de criação', 'Ativo?', 'Ações'"),
            step("Verificar a coluna 'Ativo?'",
                 "Coluna 'Ativo?' apresenta um switch por linha indicando estado ativo/inativo"),
            step("Verificar a coluna 'Ações'",
                 "Coluna 'Ações' exibe os ícones de 'Editar', 'Duplicar' e 'Excluir' em cada linha"),
        ],
        priority=1,
    ),
    tc(
        "Alternar entre visualização em lista e cards",
        "Validar troca de visualização lista/cards e persistência da seleção do usuário (R2).",
        PC_BASE + "\nExistem painéis previamente cadastrados na organização",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida no modo 'Lista' por padrão"),
            step("Clicar no controle de visualização 'Cards'",
                 "Listagem é renderizada em formato de cards"),
            step("Clicar no controle de visualização 'Lista'",
                 "Listagem volta a ser renderizada em formato de tabela com as colunas padrão"),
        ],
        priority=2,
    ),
    tc(
        "Ordenar listagem por cada coluna",
        "Validar ordenação ascendente/descendente em cada coluna ordenável (R2).",
        PC_BASE + "\nExistem ao menos 3 painéis cadastrados",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida com ordenação padrão"),
            step("Clicar no cabeçalho da coluna 'Nome'",
                 "Linhas são reordenadas em ordem alfabética crescente pelo nome"),
            step("Clicar novamente no cabeçalho da coluna 'Nome'",
                 "Linhas são reordenadas em ordem alfabética decrescente pelo nome"),
            step("Clicar no cabeçalho da coluna 'Data de criação'",
                 "Linhas são reordenadas pela data de criação na ordem indicada pelo ícone"),
        ],
        priority=2,
    ),
    tc(
        "Paginação da listagem com volume de painéis",
        "Validar paginação quando há mais painéis que o limite por página.",
        PC_BASE + "\nExistem mais de 25 painéis cadastrados",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida com paginação no rodapé"),
            step("Clicar no botão 'Próxima página' do paginador",
                 "Sistema avança uma página e exibe os próximos registros"),
            step("Clicar no botão 'Página anterior' do paginador",
                 "Sistema retorna para a página anterior"),
        ],
        priority=2,
    ),
    tc(
        "Acessar listagem com a feature flag desabilitada",
        "Garantir que aba 'Painéis' não é exibida quando a flag está desabilitada (R1).",
        "Ambiente Stage configurado\nFuncionalidade 'Gestão de Painéis' habilitada no contrato\nFeature flag 'habilitar_paineis_do_usuario' DESABILITADA\nUsuário logado como Admin",
        [
            step("Acessar Menu > Modos de uso",
                 "Tela de Modos de uso é exibida"),
            step("Verificar a presença da aba 'Painéis'",
                 "Aba 'Painéis' NÃO é exibida na tela de Modos de uso"),
        ],
        priority=1,
    ),
    tc(
        "Renomeação de Navegação para Menu e atualização do breadcrumb",
        "Garantir alterações de label do menu e breadcrumb (R1).",
        PC_BASE,
        [
            step("Verificar o item do menu lateral antes do submenu 'Modos de uso'",
                 "Item exibido é 'Menu' (renomeado de 'Navegação')"),
            step("Acessar Menu > Modos de uso",
                 "Breadcrumb exibido: 'Navegação > Modos de uso' (e não 'Navegação > Modo de uso')"),
        ],
        priority=2,
    ),
    tc(
        "Validar acessibilidade por teclado na listagem (TAB / setas / ENTER / ESC)",
        "Validar usabilidade conforme requisito da planilha (QA 2.1).",
        PC_BASE + "\nExistem painéis cadastrados",
        [
            step("Acessar a listagem de Painéis",
                 "Listagem é exibida"),
            step("Pressionar a tecla 'Tab' repetidamente",
                 "Foco percorre os controles na ordem: campo de pesquisa, controles de visualização, botão '+ Adicionar', linhas da tabela"),
            step("Pressionar a tecla 'Enter' no botão '+ Adicionar' com foco",
                 "Sistema redireciona para a tela de criação de painel"),
            step("Pressionar a tecla 'Esc' na tela aberta",
                 "Sistema retorna para a listagem (ou exibe modal de confirmação se houver alterações)"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 2 - Ativar / Inativar painel
# ---------------------------------------------------------------------------

suite_2 = topic("Ativar / Inativar painel", children=[
    tc(
        "Inativar um painel não associado a nenhum modo de uso",
        "Validar inativação direta via switch da coluna 'Ativo?' (R2 RN12).",
        PC_BASE + "\nExiste painel 'Painel QA Teste' cadastrado e ativo, sem associação com modo de uso",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida com 'Painel QA Teste' ativo"),
            step("Clicar no switch da coluna 'Ativo?' na linha 'Painel QA Teste'",
                 "Switch fica desligado e estado 'Inativo' é persistido"),
            step("Recarregar a página",
                 "Painel 'Painel QA Teste' permanece com switch desligado na coluna 'Ativo?'"),
        ],
        priority=1,
    ),
    tc(
        "Ativar um painel previamente inativo",
        "Validar reativação via switch (R2 RN12).",
        PC_BASE + "\nExiste painel 'Painel QA Teste' cadastrado e inativo",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida com 'Painel QA Teste' inativo"),
            step("Clicar no switch da coluna 'Ativo?' na linha 'Painel QA Teste'",
                 "Switch fica ligado e estado 'Ativo' é persistido"),
        ],
        priority=1,
    ),
    tc(
        "Tentar inativar painel associado a um ou mais modos de uso",
        "Validar modal informativo de bloqueio (R2 RN12.1).",
        PC_BASE + "\nExiste painel 'Painel Vinculado' associado a 2 menus de modos de uso ativos",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida com 'Painel Vinculado' ativo"),
            step("Clicar no switch da coluna 'Ativo?' na linha 'Painel Vinculado'",
                 "Modal informativo é exibido listando os menus que utilizam o painel e informando que não pode ser desativado"),
            step("Clicar no botão 'Fechar' ou 'OK' do modal",
                 "Modal é fechado e switch permanece ligado (painel continua ativo)"),
        ],
        priority=1,
    ),
    tc(
        "Tentar reativar modo de uso vinculado a um painel inativo",
        "Validar bloqueio descrito em R15 RN93.",
        PC_BASE + "\nExiste menu de modo de uso vinculado ao painel 'Painel QA Teste' que está inativo\nMenu está inativo",
        [
            step("Acessar Menu > Modos de uso",
                 "Tela de Modos de uso é exibida"),
            step("Clicar no switch de ativação do menu vinculado a 'Painel QA Teste'",
                 "Modal informativo é exibido informando que o painel está inativo e não pode ser reativado"),
            step("Clicar no botão 'Fechar' do modal",
                 "Modal é fechado e menu permanece inativo"),
        ],
        priority=1,
    ),
    tc(
        "Verificar persistência do estado Ativo? após reload",
        "Validar persistência das alterações de status.",
        PC_BASE + "\nExistem painéis ativos e inativos",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Alterar o switch 'Ativo?' de um painel para o estado oposto",
                 "Switch reflete o novo estado"),
            step("Recarregar a página (F5)",
                 "Listagem é recarregada e o switch mantém o estado alterado"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 3 - Compartilhamento de painéis
# ---------------------------------------------------------------------------

suite_3 = topic("Compartilhamento de painéis", children=[
    tc(
        "Visualizar painel compartilhado na listagem",
        "Validar exibição de painéis com provedora externa (R2 RN14).",
        PC_BASE + "\nOrganização possui painel compartilhado 'Painel Compartilhado X' com provedora 'Twygo Studio'",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Verificar a coluna 'Provedora' do painel 'Painel Compartilhado X'",
                 "Coluna 'Provedora' exibe 'Twygo Studio'"),
        ],
        priority=2,
    ),
    tc(
        "Tentar editar um painel compartilhado",
        "Validar restrição de edição (R2 RN15).",
        PC_BASE + "\nOrganização possui painel compartilhado 'Painel Compartilhado X'",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Verificar o ícone 'Editar' na linha do painel 'Painel Compartilhado X'",
                 "Ícone 'Editar' está desabilitado ou ausente para painéis compartilhados"),
        ],
        priority=1,
    ),
    tc(
        "Tentar excluir um painel compartilhado",
        "Validar restrição de exclusão (R2 RN15).",
        PC_BASE + "\nOrganização possui painel compartilhado 'Painel Compartilhado X'",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Verificar o ícone 'Excluir' na linha do painel 'Painel Compartilhado X'",
                 "Ícone 'Excluir' está desabilitado ou ausente para painéis compartilhados"),
        ],
        priority=1,
    ),
    tc(
        "Duplicar painel compartilhado",
        "Validar se ação de duplicar fica disponível em painéis compartilhados.",
        PC_BASE + "\nOrganização possui painel compartilhado 'Painel Compartilhado X'",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Clicar no ícone 'Duplicar' na linha do painel 'Painel Compartilhado X'",
                 "Painel é duplicado para a organização atual com nome '[Cópia] Painel Compartilhado X'"),
            step("Verificar o painel duplicado na listagem",
                 "Painel '[Cópia] Painel Compartilhado X' é exibido como painel próprio (provedora local) e permite edição/exclusão"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 4 - Pesquisa e Filtros
# ---------------------------------------------------------------------------

suite_4 = topic("Pesquisa e Filtros", children=[
    tc(
        "Pesquisar painel pelo nome",
        "Validar pesquisa por Nome (R2 RN8, R3 RN16).",
        PC_BASE + "\nExistem painéis 'Vendas 2026', 'Marketing Q1', 'Financeiro'",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Preencher o campo de pesquisa com 'Vendas'",
                 "Listagem é filtrada exibindo apenas o painel 'Vendas 2026'"),
            step("Limpar o campo de pesquisa",
                 "Listagem volta a exibir todos os painéis"),
        ],
        priority=1,
    ),
    tc(
        "Pesquisar painel pela descrição",
        "Validar pesquisa por Descrição (R3 RN16).",
        PC_BASE + "\nExiste painel com descrição contendo 'KPIs estratégicos'",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Preencher o campo de pesquisa com 'KPIs'",
                 "Listagem exibe apenas painéis cuja Descrição contém 'KPIs'"),
        ],
        priority=2,
    ),
    tc(
        "Aplicar filtro padrão 'Painéis próprios'",
        "Validar filtro padrão Próprios (R3 RN17).",
        PC_BASE + "\nExistem painéis próprios e compartilhados na organização",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Selecionar o filtro 'Painéis próprios'",
                 "Listagem exibe somente painéis cuja Provedora é a própria organização"),
        ],
        priority=1,
    ),
    tc(
        "Aplicar filtro padrão 'Painéis compartilhados'",
        "Validar filtro padrão Compartilhados (R3 RN17).",
        PC_BASE + "\nExistem painéis próprios e compartilhados na organização",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Selecionar o filtro 'Painéis compartilhados'",
                 "Listagem exibe somente painéis cuja Provedora é externa"),
        ],
        priority=1,
    ),
    tc(
        "Aplicar filtro padrão 'Painéis ativos'",
        "Validar filtro padrão Ativos (R3 RN17).",
        PC_BASE + "\nExistem painéis ativos e inativos",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Selecionar o filtro 'Painéis ativos'",
                 "Listagem exibe somente painéis com switch 'Ativo?' ligado"),
        ],
        priority=1,
    ),
    tc(
        "Aplicar filtro padrão 'Painéis inativos'",
        "Validar filtro padrão Inativos (R3 RN17).",
        PC_BASE + "\nExistem painéis ativos e inativos",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Selecionar o filtro 'Painéis inativos'",
                 "Listagem exibe somente painéis com switch 'Ativo?' desligado"),
        ],
        priority=1,
    ),
    tc(
        "Filtrar pela coluna 'Provedora'",
        "Validar filtro por coluna (R3 RN18).",
        PC_BASE + "\nExistem painéis de diferentes provedoras",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Clicar no ícone de filtro do cabeçalho da coluna 'Provedora'",
                 "Painel de filtro é exibido com as provedoras disponíveis"),
            step("Selecionar uma provedora específica e aplicar",
                 "Listagem exibe apenas painéis daquela provedora"),
        ],
        priority=2,
    ),
    tc(
        "Pesquisar termo inexistente",
        "Validar comportamento da listagem sem resultados.",
        PC_BASE,
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Preencher o campo de pesquisa com 'XXXYYY9999'",
                 "Listagem exibe estado vazio com mensagem padrão de 'Nenhum resultado encontrado'"),
        ],
        priority=2,
    ),
    tc(
        "Combinar pesquisa e filtros padrão",
        "Validar interação entre pesquisa e filtros.",
        PC_BASE + "\nExistem painéis 'Vendas 2026' (ativo) e 'Vendas 2025' (inativo)",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Selecionar o filtro 'Painéis ativos'",
                 "Listagem é filtrada por painéis ativos"),
            step("Preencher o campo de pesquisa com 'Vendas'",
                 "Listagem exibe apenas 'Vendas 2026' (ativo + nome contém 'Vendas')"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 5 - Adicionar/editar aba (Identificação + Abas)
# ---------------------------------------------------------------------------

suite_5 = topic("Adicionar/editar aba", children=[
    tc(
        "Acessar a tela de criação de painel",
        "Validar acesso à tela de criação a partir do botão '+ Adicionar' (R5 RN21).",
        PC_BASE,
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Clicar no botão '+ Adicionar'",
                 "Sistema redireciona para a tela de criação de painel exibindo as abas 'Identificação' e 'Layouts'; aba 'Identificação' fica ativa por padrão"),
        ],
        priority=1,
    ),
    tc(
        "Criar painel com Nome e Descrição preenchidos (happy path)",
        "Validar criação completa de painel (R5 RN22, RN23).",
        PC_BASE,
        [
            step("Acessar a tela de criação clicando em '+ Adicionar'",
                 "Tela de criação é exibida na aba 'Identificação'"),
            step("Preencher o campo 'Nome' com 'Painel de Vendas Q1'",
                 "Campo aceita o valor digitado"),
            step("Preencher o campo 'Descrição' com 'Painel para acompanhamento de KPIs de vendas'",
                 "Campo aceita o valor digitado"),
            step("Clicar na aba 'Layouts'",
                 "Aba 'Layouts' fica selecionada e exibe a aba inicial 'Nova aba' criada automaticamente"),
            step("Clicar no botão 'Salvar layout'",
                 "Painel é salvo, sistema redireciona para a listagem e exibe 'Painel de Vendas Q1' na primeira posição"),
        ],
        priority=1,
    ),
    tc(
        "Tentar salvar painel sem preencher o campo obrigatório 'Nome'",
        "Validar mensagem de erro em campo obrigatório.",
        PC_BASE,
        [
            step("Acessar a tela de criação clicando em '+ Adicionar'",
                 "Tela de criação é exibida na aba 'Identificação'"),
            step("Deixar o campo 'Nome' vazio e tentar avançar",
                 "Campo 'Nome' fica destacado em vermelho com mensagem de campo obrigatório"),
        ],
        priority=1,
    ),
    tc(
        "Validar limite de 255 caracteres no campo Nome",
        "Validar limitação do input.",
        PC_BASE,
        [
            step("Acessar a tela de criação clicando em '+ Adicionar'",
                 "Tela de criação é exibida"),
            step("Preencher o campo 'Nome' com 256 caracteres",
                 "Campo aceita no máximo 255 caracteres ou exibe mensagem de limite excedido"),
        ],
        priority=2,
    ),
    tc(
        "Validar limite de 500 caracteres no campo Descrição",
        "Validar limitação do textarea.",
        PC_BASE,
        [
            step("Acessar a tela de criação clicando em '+ Adicionar'",
                 "Tela de criação é exibida"),
            step("Preencher o campo 'Descrição' com 501 caracteres",
                 "Campo aceita no máximo 500 caracteres ou exibe mensagem de limite excedido"),
        ],
        priority=2,
    ),
    tc(
        "Validar tipos de caracteres aceitos no campo Nome",
        "Validar aceitação de letras, números, especiais e acentos.",
        PC_BASE,
        [
            step("Acessar a tela de criação clicando em '+ Adicionar'",
                 "Tela de criação é exibida"),
            step("Preencher o campo 'Nome' com 'Áéíóú ç ñ - _ . / 123 !@#'",
                 "Campo aceita caracteres especiais, acentos e números sem alteração visual"),
            step("Clicar no botão 'Salvar layout'",
                 "Painel é salvo com o nome exato preenchido"),
        ],
        priority=3,
    ),
    tc(
        "Validar exibição da aba inicial 'Nova aba' criada automaticamente",
        "Validar criação automática da primeira aba (R6 RN25).",
        PC_BASE,
        [
            step("Acessar a tela de criação clicando em '+ Adicionar'",
                 "Tela de criação é exibida"),
            step("Clicar na aba 'Layouts'",
                 "Aba inicial nomeada 'Nova aba' é exibida automaticamente como aba ativa"),
        ],
        priority=1,
    ),
    tc(
        "Renomear aba existente via ícone de lápis",
        "Validar fluxo de renomeação (R6 RN27, RN28).",
        PC_BASE + "\nExiste painel em edição com aba 'Nova aba'",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Aba 'Nova aba' é exibida"),
            step("Clicar no ícone de lápis ao lado do nome 'Nova aba'",
                 "Modal 'Renomear aba' é exibido com subtítulo 'Altere o nome da aba selecionada' e campo 'Nome da aba'"),
            step("Preencher o campo 'Nome da aba' com 'Resumo Geral'",
                 "Campo aceita o valor"),
            step("Clicar no botão 'Renomear'",
                 "Modal é fechado, aba é renomeada para 'Resumo Geral' e toast exibida: 'Aba renomeada com sucesso'"),
        ],
        priority=1,
    ),
    tc(
        "Cancelar renomeação de aba",
        "Validar ação de cancelar no modal Renomear (R6 RN28).",
        PC_BASE + "\nExiste painel em edição com aba 'Resumo Geral'",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Aba 'Resumo Geral' é exibida"),
            step("Clicar no ícone de lápis ao lado do nome 'Resumo Geral'",
                 "Modal 'Renomear aba' é exibido"),
            step("Preencher o campo 'Nome da aba' com 'Outro nome'",
                 "Campo aceita o valor"),
            step("Clicar no botão 'Cancelar'",
                 "Modal é fechado e nome da aba permanece 'Resumo Geral'"),
        ],
        priority=2,
    ),
    tc(
        "Adicionar nova aba via opção 'Criar nova aba'",
        "Validar fluxo de criação de aba vazia (R6 RN30, RN31, RN32).",
        PC_BASE + "\nExiste painel em edição com pelo menos uma aba",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Aba existente é exibida"),
            step("Clicar no botão 'Adicionar aba'",
                 "Modal 'Adicionar nova aba' é exibido com subtítulo 'Escolha como deseja criar a nova aba' e duas opções"),
            step("Clicar na opção 'Criar nova aba'",
                 "Modal avança para o step 'Crie uma nova aba vazia' com campos 'Nome da aba' e 'Categoria'"),
            step("Preencher o campo 'Nome da aba' com 'Engajamento'",
                 "Campo aceita o valor"),
            step("Selecionar 'Aprendizagem' no dropdown 'Categoria'",
                 "Opção é selecionada"),
            step("Clicar no botão 'Criar aba'",
                 "Modal é fechado, nova aba 'Engajamento' é adicionada e selecionada como aba ativa"),
        ],
        priority=1,
    ),
    tc(
        "Cancelar criação de nova aba a partir da seleção de tipo",
        "Validar ação Cancelar no modal de seleção (R6 RN30).",
        PC_BASE + "\nExiste painel em edição",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Aba existente é exibida"),
            step("Clicar no botão 'Adicionar aba'",
                 "Modal 'Adicionar nova aba' é exibido"),
            step("Fechar o modal pelo botão 'X' ou clicando fora",
                 "Modal é fechado e nenhuma aba é criada"),
        ],
        priority=2,
    ),
    tc(
        "Voltar do step 'Criar nova aba' para a seleção de tipo",
        "Validar ação Voltar (R6 RN31).",
        PC_BASE + "\nExiste painel em edição",
        [
            step("Acessar a aba 'Layouts' e clicar em 'Adicionar aba'",
                 "Modal 'Adicionar nova aba' é exibido"),
            step("Clicar na opção 'Criar nova aba'",
                 "Modal avança para o step de criação"),
            step("Clicar no botão 'Voltar'",
                 "Modal retorna ao step de seleção entre 'Criar nova aba' e 'Importar de outro painel'"),
        ],
        priority=2,
    ),
    tc(
        "Excluir aba quando há mais de uma aba",
        "Validar exclusão e regra da aba única remanescente (R6 RN33, RN34).",
        PC_BASE + "\nPainel em edição contém duas abas: 'Aba A' e 'Aba B'",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Abas 'Aba A' e 'Aba B' são exibidas"),
            step("Clicar no ícone 'Excluir' da aba 'Aba B'",
                 "Aba 'Aba B' é removida e a 'Aba A' fica como aba ativa"),
            step("Verificar o ícone 'Excluir' na aba restante 'Aba A'",
                 "Ícone 'Excluir' está desabilitado/oculto na aba 'Aba A' (regra de pelo menos uma aba)"),
        ],
        priority=1,
    ),
    tc(
        "Tentar excluir aba quando há apenas uma aba",
        "Validar bloqueio de exclusão da aba única (R6 RN26, RN34).",
        PC_BASE + "\nPainel em edição contém apenas a aba 'Nova aba'",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Aba 'Nova aba' é exibida como única"),
            step("Verificar a presença e estado do ícone 'Excluir' na 'Nova aba'",
                 "Ícone 'Excluir' está desabilitado/oculto"),
            step("Verificar a presença do ícone 'Renomear' (lápis)",
                 "Ícone de renomear permanece habilitado"),
        ],
        priority=1,
    ),
    tc(
        "Modal padrão de confirmação ao alternar abas com alterações não salvas",
        "Validar modal de alterações pendentes (Dev 3.18 - lógica reaproveitada).",
        PC_BASE + "\nPainel em edição contém duas abas: 'Aba A' (com alterações não salvas) e 'Aba B'",
        [
            step("Estar na 'Aba A' com alterações não salvas",
                 "Aba 'Aba A' é exibida com alterações pendentes"),
            step("Clicar na 'Aba B'",
                 "Modal padrão de confirmação é exibido perguntando se deseja salvar as alterações"),
            step("Clicar no botão 'Sim, salvar' do modal",
                 "Alterações são salvas, modal é fechado e 'Aba B' fica ativa"),
        ],
        priority=2,
    ),
    tc(
        "Modal de confirmação do navegador ao sair com alterações não salvas",
        "Validar prompt do navegador ao tentar sair via botão Voltar do navegador.",
        PC_BASE + "\nPainel em edição com alterações não salvas",
        [
            step("Estar na tela de edição com alterações não salvas",
                 "Tela de edição é exibida"),
            step("Clicar no botão 'Voltar' do navegador",
                 "Prompt nativo do navegador é exibido perguntando se deseja sair sem salvar"),
            step("Cancelar o prompt do navegador",
                 "Usuário permanece na tela de edição com as alterações"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 6 - Layout das abas
# ---------------------------------------------------------------------------

suite_6 = topic("Layout das abas", children=[
    tc(
        "Validar barra de ferramentas fixa no topo da área de layout",
        "Validar componentes da toolbar (R8 RN54, RN55).",
        PC_BASE + "\nPainel em edição com aba 'Nova aba' selecionada",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Barra de ferramentas é exibida no topo da área de layout, fixa enquanto rola"),
            step("Verificar os elementos da toolbar",
                 "Botão '+ Adicionar widget' à esquerda; controles 'Visualização: Desktop', 'Visualização: Tablet', 'Visualização: Mobile' e switch 'Permitir reorganizar widgets' à direita"),
        ],
        priority=1,
    ),
    tc(
        "Trocar visualização para Tablet (768) e validar alerta",
        "Validar comportamento e alerta no modo Tablet (R8 RN57, RN57.1).",
        PC_BASE + "\nPainel em edição com aba contendo widgets",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido no modo Desktop por padrão"),
            step("Clicar no controle 'Visualização: Tablet'",
                 "Layout é renderizado em 768px e alerta exibido: 'Visualização (Tablet) — edição disponível no Desktop'"),
            step("Verificar o switch 'Permitir reorganizar widgets'",
                 "Switch fica desabilitado e exibe tooltip 'Edição disponível apenas no modo Desktop' ao passar o cursor"),
        ],
        priority=1,
    ),
    tc(
        "Trocar visualização para Mobile (360) e validar alerta",
        "Validar comportamento e alerta no modo Mobile (R8 RN57.2).",
        PC_BASE + "\nPainel em edição com aba contendo widgets",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido no modo Desktop"),
            step("Clicar no controle 'Visualização: Mobile'",
                 "Layout é renderizado em 360px e alerta exibido: 'Visualização (Mobile) — edição disponível no Desktop'"),
            step("Verificar o switch 'Permitir reorganizar widgets'",
                 "Switch fica desabilitado e exibe tooltip 'Edição disponível apenas no modo Desktop'"),
        ],
        priority=1,
    ),
    tc(
        "Voltar para visualização Desktop após Tablet/Mobile",
        "Validar volta ao modo Desktop e reativação do switch.",
        PC_BASE + "\nPainel em edição com aba contendo widgets",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido"),
            step("Clicar no controle 'Visualização: Tablet'",
                 "Layout é renderizado em 768px"),
            step("Clicar no controle 'Visualização: Desktop'",
                 "Layout é renderizado em largura Desktop e alerta de Tablet/Mobile NÃO é exibido"),
            step("Verificar o switch 'Permitir reorganizar widgets'",
                 "Switch fica habilitado novamente"),
        ],
        priority=2,
    ),
    tc(
        "Ativar switch 'Permitir reorganizar widgets' e mover widget",
        "Validar reorganização habilitada (R8 RN59, RN59.1).",
        PC_BASE + "\nPainel em edição com aba contendo dois widgets",
        [
            step("Acessar a aba 'Layouts' do painel em edição no modo Desktop",
                 "Layout é exibido com os widgets"),
            step("Ativar o switch 'Permitir reorganizar widgets'",
                 "Switch fica ligado e widgets exibem indicação visual de que são arrastáveis"),
            step("Arrastar o primeiro widget para a posição do segundo",
                 "Widgets trocam de posição no grid"),
        ],
        priority=2,
    ),
    tc(
        "Switch desativado: tentar arrastar widget",
        "Validar bloqueio de reorganização com switch desligado (R8 RN60).",
        PC_BASE + "\nPainel em edição com aba contendo dois widgets",
        [
            step("Acessar a aba 'Layouts' do painel em edição no modo Desktop",
                 "Layout é exibido com os widgets"),
            step("Manter o switch 'Permitir reorganizar widgets' desligado",
                 "Switch permanece desligado"),
            step("Tentar arrastar um widget",
                 "Widget não é movido (drag bloqueado) e nenhuma alteração ocorre no layout"),
        ],
        priority=2,
    ),
    tc(
        "Estado vazio da aba sem widgets",
        "Validar estado vazio com título, descrição e botão (R8 RN61, RN62, RN63).",
        PC_BASE + "\nPainel em edição com aba 'Nova aba' sem widgets",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Aba 'Nova aba' é exibida sem widgets"),
            step("Verificar o estado vazio da área de layout",
                 'Ícone ilustrativo é exibido, título "Nenhum widget adicionado", descrição "Clique no botão \\"Adicionar Widget\\" para começar a montar sua tela personalizada" e botão primário "+ Adicionar Widget"'),
            step("Clicar no botão '+ Adicionar Widget' do estado vazio",
                 "Drawer 'Widgets disponíveis' é aberto (mesma ação do botão da toolbar)"),
        ],
        priority=1,
    ),
    tc(
        "Salvar layout pela barra de rodapé",
        "Validar persistência via 'Salvar layout' (R8 RN65, RN65.2).",
        PC_BASE + "\nPainel em edição com aba contendo widget recém-adicionado",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido com o widget"),
            step("Clicar no botão 'Salvar layout' da barra de rodapé",
                 "Layout é persistido, sistema redireciona para a listagem de painéis e o painel aparece na listagem"),
            step("Reabrir o painel salvo",
                 "Aba e widgets continuam exibidos exatamente como salvos"),
        ],
        priority=1,
    ),
    tc(
        "Cancelar edição com alterações não salvas",
        "Validar ação 'Cancelar' (R8 RN65, RN65.1).",
        PC_BASE + "\nPainel em edição com alterações não salvas",
        [
            step("Estar na aba 'Layouts' com alterações não salvas",
                 "Layout é exibido com alterações pendentes"),
            step("Clicar no botão 'Cancelar' da barra de rodapé",
                 "Sistema descarta alterações e retorna para a listagem de painéis"),
        ],
        priority=2,
    ),
    tc(
        "Toolbar permanece fixa ao rolar a área de layout",
        "Validar comportamento sticky da toolbar (R8 RN54).",
        PC_BASE + "\nPainel em edição com aba contendo muitos widgets",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido com vários widgets"),
            step("Rolar verticalmente a área de layout",
                 "Barra de ferramentas permanece visível e fixa no topo durante a rolagem"),
            step("Rolar verticalmente até o final",
                 "Barra de rodapé com 'Cancelar' e 'Salvar layout' permanece visível e fixa no rodapé"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 7 - Adicionar widgets
# ---------------------------------------------------------------------------

suite_7 = topic("Adicionar widgets", children=[
    tc(
        "Abrir drawer de widgets disponíveis",
        "Validar abertura do drawer (R9 RN66, RN67).",
        PC_BASE + "\nPainel em edição com aba selecionada",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido"),
            step("Clicar no botão '+ Adicionar widget' da toolbar",
                 "Drawer lateral é aberto com título 'Widgets disponíveis'"),
        ],
        priority=1,
    ),
    tc(
        "Validar componentes do drawer de widgets",
        "Validar campos de filtro, busca e listagem (R9 RN67, RN68, RN69, RN69.1, RN70).",
        PC_BASE + "\nPainel em edição com aba selecionada",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer 'Widgets disponíveis' é exibido"),
            step("Verificar a área de filtros",
                 "Bloco de filtros está colapsado por padrão"),
            step("Clicar no campo de filtros para expandir",
                 "Filtros são exibidos, incluindo o multi select 'Categorias' com opções 'Todos' e 'Aprendizagem'"),
            step("Verificar o campo 'Buscar'",
                 'Campo "Buscar" é exibido com placeholder "Digite o nome do widget..."'),
            step("Verificar a listagem abaixo dos filtros",
                 "Widgets são listados agrupados pela categoria 'Aprendizagem'"),
        ],
        priority=1,
    ),
    tc(
        "Validar widgets disponíveis na categoria Aprendizagem",
        "Validar listagem completa dos widgets (R9 RN73-77).",
        PC_BASE + "\nPainel em edição com aba selecionada",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Verificar os widgets exibidos na categoria 'Aprendizagem'",
                 "Drawer exibe os widgets: 'Resumo das atividades', 'Conteúdos em andamento', 'Ranking', 'Meus certificados'"),
            step("Verificar a apresentação de cada widget",
                 "Cada widget exibe Nome, Descrição, badge de perfil 'Usuário' e tag de categoria 'Aprendizagem'"),
        ],
        priority=1,
    ),
    tc(
        "Validar descrição literal dos widgets",
        "Validar textos descritivos exatos (R9 RN73-76).",
        PC_BASE + "\nPainel em edição com aba selecionada",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Verificar a descrição do widget 'Resumo das atividades'",
                 'Descrição exibida: "Exibe um resumo completo das atividades de aprendizagem do usuário"'),
            step("Verificar a descrição do widget 'Conteúdos em andamento'",
                 'Descrição exibida: "Exibe os conteúdos que o usuário está cursando atualmente"'),
            step("Verificar a descrição do widget 'Ranking'",
                 'Descrição exibida: "Exibe para o usuário a sua posição do ranking e o top 5 do ambiente"'),
            step("Verificar a descrição do widget 'Meus certificados'",
                 'Descrição exibida: "Exibe todos os certificados que o usuário conquistou"'),
        ],
        priority=2,
    ),
    tc(
        "Filtrar widgets pelo multi select 'Categorias'",
        "Validar filtro por categoria (R9 RN69.1).",
        PC_BASE + "\nPainel em edição com aba selecionada",
        [
            step("Abrir o drawer e expandir os filtros",
                 "Filtros são exibidos com 'Todos' e 'Aprendizagem'"),
            step("Selecionar apenas 'Aprendizagem' no multi select",
                 "Listagem exibe somente widgets da categoria 'Aprendizagem'"),
            step("Selecionar 'Todos'",
                 "Listagem exibe todos os widgets disponíveis"),
        ],
        priority=2,
    ),
    tc(
        "Pesquisar widget pelo nome no drawer",
        "Validar campo de busca (R9 RN70).",
        PC_BASE + "\nPainel em edição com aba selecionada",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Preencher o campo 'Buscar' com 'Ranking'",
                 "Listagem exibe somente o widget 'Ranking'"),
            step("Limpar o campo 'Buscar'",
                 "Listagem volta a exibir todos os widgets"),
        ],
        priority=2,
    ),
    tc(
        "Adicionar widget 'Resumo das atividades' ao layout",
        "Validar adição de widget (R9 RN80, RN81, RN83).",
        PC_BASE + "\nPainel em edição com aba 'Nova aba' vazia",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Clicar no widget 'Resumo das atividades'",
                 'Widget é adicionado ao layout da aba ativa e toast exibida: "Widget adicionado com sucesso"'),
            step("Verificar a posição do widget no layout",
                 "Widget 'Resumo das atividades' é exibido no layout (largura padrão diferente de 6 colunas conforme exceção)"),
        ],
        priority=1,
    ),
    tc(
        "Adicionar widget 'Conteúdos em andamento' (largura padrão 6 colunas)",
        "Validar adição com largura padrão (R9 RN83.1).",
        PC_BASE + "\nPainel em edição com aba 'Nova aba' vazia",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Clicar no widget 'Conteúdos em andamento'",
                 'Widget é adicionado ao layout e toast exibida: "Widget adicionado com sucesso"'),
            step("Verificar a largura do widget no grid",
                 "Widget ocupa 6 colunas do grid"),
        ],
        priority=2,
    ),
    tc(
        "Adicionar widget 'Ranking' (largura especial)",
        "Validar largura específica do Ranking (R9 RN83.1).",
        PC_BASE + "\nPainel em edição com aba 'Nova aba' vazia",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Clicar no widget 'Ranking'",
                 'Widget é adicionado ao layout e toast exibida: "Widget adicionado com sucesso"'),
            step("Verificar a largura do widget no grid",
                 "Widget Ranking ocupa largura padrão diferente de 6 colunas (exceção descrita na documentação)"),
        ],
        priority=2,
    ),
    tc(
        "Adicionar múltiplos widgets em sequência",
        "Validar empilhamento e cálculo de próxima posição.",
        PC_BASE + "\nPainel em edição com aba 'Nova aba' vazia",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Clicar no widget 'Resumo das atividades'",
                 "Widget é adicionado e ocupa a primeira posição do grid"),
            step("Clicar no widget 'Conteúdos em andamento'",
                 "Widget é adicionado e posicionado abaixo/à direita do anterior conforme próxima posição calculada"),
            step("Clicar no widget 'Meus certificados'",
                 "Widget é adicionado e posicionado na próxima posição disponível"),
        ],
        priority=2,
    ),
    tc(
        "Tooltip de descrição do widget ao passar o cursor",
        "Validar tooltip detalhado (R9 RN77).",
        PC_BASE + "\nPainel em edição com aba selecionada",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Posicionar o cursor sobre o widget 'Ranking' por 1s",
                 'Tooltip exibido com a descrição completa "Exibe para o usuário a sua posição do ranking e o top 5 do ambiente"'),
        ],
        priority=3,
    ),
    tc(
        "Pesquisar widget com termo inexistente no drawer",
        "Validar estado vazio da pesquisa do drawer.",
        PC_BASE + "\nPainel em edição com aba selecionada",
        [
            step("Abrir o drawer de widgets disponíveis",
                 "Drawer é exibido"),
            step("Preencher o campo 'Buscar' com 'XXXX9999'",
                 "Listagem do drawer exibe estado vazio sem widgets"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 8 - Editar/Excluir widgets
# ---------------------------------------------------------------------------

suite_8 = topic("Editar/Excluir widgets", children=[
    tc(
        "Abrir drawer de configurações ao clicar no ícone de lápis",
        "Validar abertura do drawer de edição (R10 RN84).",
        PC_BASE + "\nPainel em edição com aba contendo o widget 'Resumo das atividades'",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido com o widget"),
            step("Clicar no ícone 'Editar' (lápis) do widget 'Resumo das atividades'",
                 "Drawer 'Configurações do widget' é exibido"),
        ],
        priority=1,
    ),
    tc(
        "Validar campos do drawer 'Configurações do widget'",
        "Validar componentes do drawer (R10 RN85).",
        PC_BASE + "\nDrawer 'Configurações do widget' aberto para o widget 'Resumo das atividades'",
        [
            step("Verificar os campos do drawer",
                 "Drawer contém: switch 'Mostrar título', campo 'Título' (input texto, máx. 255 caracteres), switch 'Mostrar ícone', campo 'Ícone' (componente seletor de ícones)"),
            step("Verificar os botões do drawer",
                 "Botões 'Cancelar' e 'Salvar' são exibidos no rodapé do drawer"),
        ],
        priority=1,
    ),
    tc(
        "Salvar alterações no drawer de configurações do widget",
        "Validar persistência das configurações (R10 RN86).",
        PC_BASE + "\nDrawer 'Configurações do widget' aberto para o widget 'Resumo das atividades'",
        [
            step("Ativar o switch 'Mostrar título'",
                 "Switch fica ligado"),
            step("Preencher o campo 'Título' com 'Resumo Personalizado'",
                 "Campo aceita o valor"),
            step("Ativar o switch 'Mostrar ícone'",
                 "Switch fica ligado"),
            step("Selecionar um ícone no componente 'Ícone'",
                 "Ícone é selecionado"),
            step("Clicar no botão 'Salvar' do drawer",
                 'Drawer é fechado e toast exibida: "Configurações salvas com sucesso"'),
            step("Verificar o widget no layout",
                 "Widget exibe título 'Resumo Personalizado' e o ícone selecionado"),
        ],
        priority=1,
    ),
    tc(
        "Cancelar alterações no drawer de configurações do widget",
        "Validar ação Cancelar do drawer (R10 RN86.1).",
        PC_BASE + "\nDrawer 'Configurações do widget' aberto para o widget 'Resumo das atividades'\nWidget originalmente sem título customizado",
        [
            step("Preencher o campo 'Título' com 'Não vai salvar'",
                 "Campo aceita o valor"),
            step("Clicar no botão 'Cancelar' do drawer",
                 "Drawer é fechado sem persistir alterações"),
            step("Verificar o widget no layout",
                 "Widget mantém o título original (sem 'Não vai salvar')"),
        ],
        priority=2,
    ),
    tc(
        "Limite de 255 caracteres no campo 'Título' do drawer",
        "Validar limitação do campo Título.",
        PC_BASE + "\nDrawer 'Configurações do widget' aberto para um widget",
        [
            step("Preencher o campo 'Título' com 256 caracteres",
                 "Campo aceita no máximo 255 caracteres ou exibe mensagem de limite excedido"),
        ],
        priority=3,
    ),
    tc(
        "Excluir widget pelo ícone 'x'",
        "Validar exclusão do widget (R10 RN87).",
        PC_BASE + "\nPainel em edição com aba contendo widget 'Conteúdos em andamento'",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido com o widget"),
            step("Clicar no ícone 'Excluir' (x) do widget 'Conteúdos em andamento'",
                 "Widget é removido do layout"),
            step("Clicar no botão 'Salvar layout'",
                 "Layout é persistido sem o widget excluído"),
        ],
        priority=1,
    ),
    tc(
        "Switches 'Mostrar título' e 'Mostrar ícone' desligados",
        "Validar comportamento quando switches estão desligados.",
        PC_BASE + "\nDrawer 'Configurações do widget' aberto",
        [
            step("Desativar o switch 'Mostrar título'",
                 "Campo 'Título' fica desabilitado"),
            step("Desativar o switch 'Mostrar ícone'",
                 "Campo 'Ícone' fica desabilitado"),
            step("Clicar no botão 'Salvar' do drawer",
                 'Drawer é fechado e toast exibida: "Configurações salvas com sucesso"'),
            step("Verificar o widget no layout",
                 "Widget é exibido sem título e sem ícone"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 9 - Duplicar painéis
# ---------------------------------------------------------------------------

suite_9 = topic("Duplicar painéis", children=[
    tc(
        "Duplicar painel próprio com várias abas e widgets",
        "Validar duplicação completa (R4 RN19, RN20).",
        PC_BASE + "\nExiste painel próprio 'Painel Original' com 3 abas e 5 widgets configurados",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida com 'Painel Original'"),
            step("Clicar no ícone 'Duplicar' na linha do 'Painel Original'",
                 "Painel é duplicado e listagem é atualizada"),
            step("Verificar o novo painel no final da listagem",
                 "Novo painel '[Cópia] Painel Original' é exibido na última posição"),
            step("Abrir o painel '[Cópia] Painel Original'",
                 "Painel duplicado contém as 3 abas e os 5 widgets do painel original com configurações preservadas"),
        ],
        priority=1,
    ),
    tc(
        "Duplicar painel ativo - status do painel duplicado",
        "Validar status do painel duplicado.",
        PC_BASE + "\nExiste painel próprio 'Painel Original' ATIVO",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Clicar no ícone 'Duplicar' na linha do 'Painel Original'",
                 "Painel é duplicado"),
            step("Verificar o switch 'Ativo?' do painel '[Cópia] Painel Original'",
                 "Switch reflete o estado padrão definido para painéis duplicados (ativo ou inativo conforme regra do produto)"),
        ],
        priority=2,
    ),
    tc(
        "Duplicar painel várias vezes",
        "Validar geração de múltiplas cópias com nomes únicos.",
        PC_BASE + "\nExiste painel 'Painel Original'",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Clicar no ícone 'Duplicar' na linha do 'Painel Original'",
                 "Painel '[Cópia] Painel Original' é criado"),
            step("Clicar novamente no ícone 'Duplicar' na linha do 'Painel Original'",
                 "Outra cópia é criada com nome único (ex: '[Cópia] Painel Original (2)' ou similar)"),
        ],
        priority=2,
    ),
    tc(
        "Editar painel duplicado",
        "Validar que cópia é independente do original.",
        PC_BASE + "\nExiste painel duplicado '[Cópia] Painel Original'",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem é exibida"),
            step("Clicar no ícone 'Editar' na linha de '[Cópia] Painel Original'",
                 "Tela de edição é exibida"),
            step("Alterar o nome para 'Painel Editado' e salvar",
                 "Nome é atualizado para 'Painel Editado'"),
            step("Verificar o painel original na listagem",
                 "Painel 'Painel Original' permanece com nome inalterado"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 10 - Importar abas
# ---------------------------------------------------------------------------

suite_10 = topic("Importar abas", children=[
    tc(
        "Acessar o fluxo de Importar de outro painel",
        "Validar acesso ao step de importação (R7 RN42, RN43).",
        PC_BASE + "\nPainel em edição com pelo menos uma aba\nExistem outros painéis com abas e widgets disponíveis",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Aba existente é exibida"),
            step("Clicar no botão 'Adicionar aba'",
                 "Modal 'Adicionar nova aba' é exibido com subtítulo 'Escolha como deseja criar a nova aba'"),
            step("Clicar na opção 'Importar de outro painel'",
                 "Modal avança para o step com subtítulo 'Importar de outro painel' e exibe campo 'Painel de origem'"),
        ],
        priority=1,
    ),
    tc(
        "Selecionar painel de origem e listar abas disponíveis",
        "Validar carregamento das abas (R7 RN44, RN45).",
        PC_BASE + "\nPainel em edição\nExiste painel 'Painel Origem' com 2 abas: 'Aba X' (2 widgets) e 'Aba Y' (3 widgets)",
        [
            step("Iniciar o fluxo Importar de outro painel",
                 "Modal de importação é exibido com 'Painel de origem'"),
            step("Selecionar 'Painel Origem' no select 'Painel de origem'",
                 "Campo 'Aba disponível' é exibido listando 'Aba X (2 widgets)' e 'Aba Y (3 widgets)'"),
        ],
        priority=1,
    ),
    tc(
        "Visualizar preview da aba selecionada",
        "Validar exibição de preview com widgets (R7 RN46).",
        PC_BASE + "\nModal de importação aberto com 'Painel Origem' selecionado e abas listadas",
        [
            step("Selecionar 'Aba X (2 widgets)' no campo 'Aba disponível'",
                 "Preview é exibido com nome da aba, quantidade de widgets e a lista de widgets inclusos"),
        ],
        priority=1,
    ),
    tc(
        "Auto-preencher campo 'Nome da nova aba' com nome original",
        "Validar pré-preenchimento (R7 RN47, RN48).",
        PC_BASE + "\nModal de importação aberto, painel e aba selecionados",
        [
            step("Selecionar 'Aba X' no campo 'Aba disponível'",
                 "Preview é exibido"),
            step("Verificar o campo 'Nome da nova aba'",
                 "Campo é preenchido automaticamente com 'Aba X'"),
            step("Alterar o valor para 'Aba Importada'",
                 "Campo aceita a edição"),
        ],
        priority=2,
    ),
    tc(
        "Selecionar Categoria na importação",
        "Validar campo Categoria (R7 RN49).",
        PC_BASE + "\nModal de importação aberto",
        [
            step("Selecionar painel e aba no fluxo de importação",
                 "Campo 'Categoria' é exibido"),
            step("Selecionar 'Aprendizagem' no dropdown 'Categoria'",
                 "Opção é selecionada"),
        ],
        priority=2,
    ),
    tc(
        "Importar aba (happy path)",
        "Validar importação completa (R7 RN50, RN51, RN52, RN53).",
        PC_BASE + "\nModal de importação aberto, 'Painel Origem' e 'Aba X' (2 widgets) selecionados, 'Nome da nova aba' = 'Aba Importada'",
        [
            step("Clicar no botão 'Importar aba'",
                 'Modal é fechado, nova aba "Aba Importada" é criada e selecionada como aba ativa, toast exibida: "Aba importada com sucesso"'),
            step("Verificar a aba importada",
                 "Aba 'Aba Importada' contém os 2 widgets copiados da 'Aba X' do 'Painel Origem'"),
        ],
        priority=1,
    ),
    tc(
        "Voltar do step de importação para a seleção de tipo",
        "Validar ação Voltar (R7).",
        PC_BASE + "\nModal de importação aberto",
        [
            step("Estar no step 'Importar de outro painel'",
                 "Modal exibido com campos de painel/aba"),
            step("Clicar no botão 'Voltar'",
                 "Modal retorna ao step de seleção entre 'Criar nova aba' e 'Importar de outro painel'"),
        ],
        priority=2,
    ),
    tc(
        "Cancelar importação",
        "Validar ação Cancelar.",
        PC_BASE + "\nModal de importação aberto",
        [
            step("Estar no step 'Importar de outro painel' com campos preenchidos",
                 "Modal exibido"),
            step("Clicar no botão 'Cancelar'",
                 "Modal é fechado e nenhuma aba é importada"),
        ],
        priority=2,
    ),
    tc(
        "Tentar importar sem selecionar painel de origem",
        "Validar campo obrigatório.",
        PC_BASE + "\nModal de importação aberto",
        [
            step("Estar no step 'Importar de outro painel' sem selecionar painel",
                 "Campos seguintes ('Aba disponível', 'Nome da nova aba') não são exibidos"),
            step("Tentar acionar 'Importar aba' (se botão estiver visível)",
                 "Botão está desabilitado ou exibe erro de campo obrigatório no 'Painel de origem'"),
        ],
        priority=2,
    ),
    tc(
        "Importar aba com painel sem abas disponíveis",
        "Validar comportamento quando painel não tem abas (cenário de borda).",
        PC_BASE + "\nExiste painel 'Painel Vazio' sem abas registradas (caso possível)",
        [
            step("Iniciar o fluxo de importação",
                 "Modal exibido"),
            step("Selecionar 'Painel Vazio' no campo 'Painel de origem'",
                 "Campo 'Aba disponível' exibe estado vazio ou mensagem informando que não há abas disponíveis"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 11 - Modo de uso > Painéis do usuário
# ---------------------------------------------------------------------------

suite_11 = topic("Modo de uso - Painéis do usuário", children=[
    tc(
        "Selecionar 'Painéis do usuário' como modelo de página no modo de uso",
        "Validar seleção do modelo e exibição do campo Espaço (R11 RN88).",
        PC_BASE + "\nExiste painel 'Painel Aluno' ativo cadastrado",
        [
            step("Acessar Menu > Modos de uso",
                 "Tela de Modos de uso é exibida"),
            step("Acessar a configuração de um menu existente (ou criar novo)",
                 "Formulário de configuração é exibido"),
            step("Selecionar 'Painéis do usuário' no modelo de página",
                 "Campo 'Espaço' é exibido para selecionar o painel"),
            step("Selecionar 'Painel Aluno' no campo 'Espaço'",
                 "Painel é selecionado e configuração é salva"),
        ],
        priority=1,
    ),
    tc(
        "Listar painéis disponíveis no campo 'Espaço'",
        "Validar opções listadas no campo Espaço.",
        PC_BASE + "\nExistem painéis ativos e inativos cadastrados",
        [
            step("Acessar a configuração de um menu de modo de uso",
                 "Formulário é exibido"),
            step("Selecionar 'Painéis do usuário' no modelo de página",
                 "Campo 'Espaço' é exibido"),
            step("Abrir o dropdown 'Espaço'",
                 "Opções listadas correspondem aos painéis ativos disponíveis para a organização"),
        ],
        priority=2,
    ),
    tc(
        "Visualizar painel pelo aluno (visualização readonly)",
        "Validar exibição readonly para o aluno (R11 RN89).",
        PC_BASE_ALUNO + "\nMenu de modo de uso configurado com 'Painel Aluno' ativo",
        [
            step("Acessar o menu configurado com 'Painel Aluno'",
                 "Painel é exibido com a estrutura/layout cadastrados"),
            step("Verificar a presença de controles de edição",
                 "Botões '+ Adicionar widget', 'Salvar layout', 'Cancelar', switch 'Permitir reorganizar' e ícones de editar/excluir widgets NÃO são exibidos"),
            step("Verificar todas as abas configuradas",
                 "Todas as abas do painel são exibidas e clicáveis para o aluno"),
        ],
        priority=1,
    ),
    tc(
        "Aluno alterna entre abas do painel",
        "Validar navegação entre abas (R11 RN89.1).",
        PC_BASE_ALUNO + "\nMenu configurado com painel que possui 2 abas: 'Resumo' e 'Conteúdos'",
        [
            step("Acessar o menu do painel",
                 "Aba 'Resumo' é exibida como aba ativa"),
            step("Clicar na aba 'Conteúdos'",
                 "Aba 'Conteúdos' fica ativa e exibe seus widgets"),
        ],
        priority=2,
    ),
    tc(
        "Aluno tenta arrastar widget no painel",
        "Validar bloqueio de reorganização para o aluno.",
        PC_BASE_ALUNO + "\nMenu configurado com painel contendo 2 widgets",
        [
            step("Acessar o menu do painel",
                 "Painel é exibido com os widgets"),
            step("Tentar arrastar um widget",
                 "Widget não é movido (modo readonly)"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 12 - Dashboard - Visão do aluno
# ---------------------------------------------------------------------------

suite_12 = topic("Dashboard - Visão do aluno", children=[
    tc(
        "Renderizar widget 'Resumo das atividades' para o aluno",
        "Validar exibição do widget com dados reais.",
        PC_BASE_ALUNO + "\nAluno possui histórico de atividades de aprendizagem\nMenu configurado com painel contendo widget 'Resumo das atividades'",
        [
            step("Acessar o menu do painel",
                 "Painel é exibido"),
            step("Verificar o widget 'Resumo das atividades'",
                 "Widget exibe os dados de aprendizagem do usuário (mesmos dados disponíveis no dashboard legado)"),
        ],
        priority=1,
    ),
    tc(
        "Renderizar widget 'Conteúdos em andamento' para o aluno",
        "Validar exibição do widget com dados reais.",
        PC_BASE_ALUNO + "\nAluno possui conteúdos em andamento\nMenu configurado com painel contendo widget 'Conteúdos em andamento'",
        [
            step("Acessar o menu do painel",
                 "Painel é exibido"),
            step("Verificar o widget 'Conteúdos em andamento'",
                 "Widget exibe a lista de conteúdos que o aluno está cursando atualmente"),
        ],
        priority=1,
    ),
    tc(
        "Renderizar widget 'Ranking' para o aluno",
        "Validar exibição do widget Ranking.",
        PC_BASE_ALUNO + "\nAluno possui posição no ranking\nMenu configurado com painel contendo widget 'Ranking'",
        [
            step("Acessar o menu do painel",
                 "Painel é exibido"),
            step("Verificar o widget 'Ranking'",
                 "Widget exibe posição do aluno e o top 5 do ambiente"),
        ],
        priority=1,
    ),
    tc(
        "Renderizar widget 'Meus certificados' para o aluno",
        "Validar exibição do widget de certificados.",
        PC_BASE_ALUNO + "\nAluno possui certificados conquistados\nMenu configurado com painel contendo widget 'Meus certificados'",
        [
            step("Acessar o menu do painel",
                 "Painel é exibido"),
            step("Verificar o widget 'Meus certificados'",
                 "Widget exibe a lista de certificados conquistados pelo aluno"),
        ],
        priority=1,
    ),
    tc(
        "Renderização de widget configurado com título e ícone customizados",
        "Validar persistência das customizações para a visão do aluno.",
        PC_BASE_ALUNO + "\nWidget 'Resumo das atividades' configurado com Mostrar título=ON, Título='Meu Resumo' e Ícone customizado",
        [
            step("Acessar o menu do painel como aluno",
                 "Painel é exibido"),
            step("Verificar o widget 'Resumo das atividades'",
                 "Widget exibe o título 'Meu Resumo' e o ícone customizado configurados pelo Admin"),
        ],
        priority=2,
    ),
    tc(
        "Aluno acessa painel sem widgets configurados",
        "Validar comportamento de painel vazio.",
        PC_BASE_ALUNO + "\nMenu configurado com painel cuja aba ativa não possui widgets",
        [
            step("Acessar o menu do painel",
                 "Painel é exibido"),
            step("Verificar o conteúdo da aba",
                 "Aba é exibida vazia (sem o estado vazio de admin) ou conforme regra do produto para visão readonly"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 13 - Mobile (DevTools 412x915 / 393x873 / 414x896 horizontal e vertical)
# ---------------------------------------------------------------------------

suite_13 = topic("Mobile", children=[
    tc(
        "Visualização do aluno em viewport Mobile 412x915 (vertical)",
        "Validar responsividade da visão do aluno (QA 6.3).",
        PC_BASE_ALUNO + "\nViewport Mobile 412x915 (vertical)\nMenu configurado com painel contendo widgets",
        [
            step("Acessar o menu do painel no viewport 412x915",
                 "Painel é renderizado adaptado ao viewport, com widgets reorganizados verticalmente"),
            step("Rolar verticalmente",
                 "Conteúdo é scrollável e widgets são exibidos sequencialmente"),
        ],
        priority=2,
    ),
    tc(
        "Visualização do aluno em viewport Mobile 393x873 (vertical)",
        "Validar responsividade.",
        PC_BASE_ALUNO + "\nViewport Mobile 393x873 (vertical)",
        [
            step("Acessar o menu do painel no viewport 393x873",
                 "Painel é renderizado adaptado ao viewport"),
        ],
        priority=2,
    ),
    tc(
        "Visualização do aluno em viewport Mobile 414x896 (vertical)",
        "Validar responsividade.",
        PC_BASE_ALUNO + "\nViewport Mobile 414x896 (vertical)",
        [
            step("Acessar o menu do painel no viewport 414x896",
                 "Painel é renderizado adaptado ao viewport"),
        ],
        priority=2,
    ),
    tc(
        "Visualização do aluno em viewport Mobile horizontal",
        "Validar orientação horizontal.",
        PC_BASE_ALUNO + "\nViewport Mobile 915x412 (horizontal)",
        [
            step("Acessar o menu do painel no viewport horizontal",
                 "Painel é renderizado em modo horizontal e widgets ajustam-se à largura disponível"),
        ],
        priority=3,
    ),
    tc(
        "Acesso do Admin pelo viewport Mobile - exibição do alerta",
        "Validar mensagem de edição apenas no Desktop (R8 RN57.1, RN57.2).",
        PC_BASE + "\nViewport Mobile 412x915",
        [
            step("Acessar a aba 'Layouts' do painel em edição",
                 "Layout é exibido"),
            step("Verificar o alerta exibido",
                 "Alerta exibido: 'Visualização (Mobile) — edição disponível no Desktop'"),
            step("Verificar o switch 'Permitir reorganizar widgets'",
                 "Switch fica desabilitado e tooltip 'Edição disponível apenas no modo Desktop' é exibida ao tocá-lo"),
        ],
        priority=1,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 14 - Worker - Migração de painéis
# ---------------------------------------------------------------------------

suite_14 = topic("Worker - Migração de painéis", children=[
    tc(
        "Worker cria painel padrão para organização sem painel pré-existente",
        "Validar migração inicial.",
        PC_BASE.replace("Usuário logado como Admin", "Usuário Super Admin com acesso à execução de workers")
            + "\nOrganização não possui painel padrão criado",
        [
            step("Executar o worker de migração de painéis para a organização-alvo",
                 "Worker executa sem erros e logs indicam criação de painel padrão"),
            step("Acessar a aba 'Painéis' como Admin da organização",
                 "Listagem exibe um painel padrão criado pelo worker, com abas e widgets equivalentes ao dashboard legado"),
            step("Acessar Menu > Modos de uso",
                 "Menu antigo de dashboard foi removido e novo menu (mesmo nome e ícone) foi criado vinculado ao painel padrão"),
        ],
        priority=1,
    ),
    tc(
        "Worker não duplica painel quando organização já possui painel padrão",
        "Validar idempotência do worker.",
        PC_BASE.replace("Usuário logado como Admin", "Usuário Super Admin")
            + "\nOrganização já possui painel padrão criado",
        [
            step("Executar o worker de migração de painéis novamente",
                 "Worker executa sem erros e logs indicam que painel padrão já existe; nenhuma duplicação ocorre"),
            step("Acessar a aba 'Painéis'",
                 "Listagem mantém apenas o painel padrão original"),
        ],
        priority=2,
    ),
    tc(
        "Worker cria shared events necessários",
        "Validar criação de shared events.",
        PC_BASE.replace("Usuário logado como Admin", "Usuário Super Admin")
            + "\nOrganização sem shared events do painel",
        [
            step("Executar o worker de migração",
                 "Worker cria os shared events necessários para os widgets do painel"),
            step("Verificar registros de shared events da organização",
                 "Shared events do painel padrão estão presentes"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 15 - Worker - Reversão
# ---------------------------------------------------------------------------

suite_15 = topic("Worker - Reversão", children=[
    tc(
        "Worker de reversão restaura dashboard padrão anterior",
        "Validar reversão do modo de uso.",
        PC_BASE.replace("Usuário logado como Admin", "Usuário Super Admin")
            + "\nOrganização foi migrada para o painel padrão",
        [
            step("Executar o worker de reversão para a organização-alvo",
                 "Worker executa sem erros e logs indicam reversão"),
            step("Acessar Menu > Modos de uso como Admin da organização",
                 "Menu vinculado ao painel padrão foi removido e dashboard antigo está disponível novamente"),
        ],
        priority=1,
    ),
    tc(
        "Reversão preserva painéis criados manualmente",
        "Validar que painéis manuais não são apagados na reversão.",
        PC_BASE.replace("Usuário logado como Admin", "Usuário Super Admin")
            + "\nOrganização possui painel padrão (migrado) + painel 'Manual A' criado pelo Admin",
        [
            step("Executar o worker de reversão",
                 "Worker executa"),
            step("Acessar a aba 'Painéis' como Admin",
                 "Painel 'Manual A' continua presente; apenas o vínculo do menu de modo de uso foi revertido"),
        ],
        priority=2,
    ),
    tc(
        "Worker de reversão é idempotente",
        "Validar execução repetida do worker.",
        PC_BASE.replace("Usuário logado como Admin", "Usuário Super Admin")
            + "\nOrganização já revertida",
        [
            step("Executar o worker de reversão novamente",
                 "Worker executa sem erros e logs indicam que a reversão já foi aplicada; nenhuma alteração adicional ocorre"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 16 - Beta / Launch
# ---------------------------------------------------------------------------

suite_16 = topic("Beta / Launch", children=[
    tc(
        "Funcionalidade na tabela de preços e contrato",
        "Validar inclusão da funcionalidade no contrato (Dev 8.1).",
        "Ambiente Stage configurado\nUsuário logado como Super Admin",
        [
            step("Acessar a tabela de preços e contratos via Super Admin",
                 "Tela de tabela de preços é exibida"),
            step("Verificar a presença da funcionalidade 'Gestão de Painéis'",
                 "Funcionalidade 'Gestão de Painéis' é listada e pode ser habilitada/desabilitada por contrato"),
        ],
        priority=1,
    ),
    tc(
        "Bloqueio de contrato na tela de edição de painel sem funcionalidade habilitada",
        "Validar tela padrão de bloqueio (Dev 8.2).",
        "Ambiente Stage configurado\nFuncionalidade 'Gestão de Painéis' DESABILITADA no contrato\nFeature flag 'habilitar_paineis_do_usuario' ativa\nUsuário logado como Admin",
        [
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Sistema exibe tela padrão de bloqueio de contrato"),
            step("Verificar o conteúdo do bloqueio",
                 "Tela exibe título, descrição e CTA padrão da funcionalidade bloqueada por contrato"),
        ],
        priority=1,
    ),
    tc(
        "Bloqueio de contrato no modelo 'Painéis do usuário' do modo de uso",
        "Validar bloqueio em modo de uso (Dev 8.2).",
        "Ambiente Stage configurado\nFuncionalidade 'Gestão de Painéis' DESABILITADA no contrato\nUsuário logado como Admin",
        [
            step("Acessar a configuração de um menu de modo de uso",
                 "Formulário é exibido"),
            step("Tentar selecionar 'Painéis do usuário' no modelo de página",
                 "Opção exibe modal de bloqueio de contrato OU está desabilitada"),
        ],
        priority=2,
    ),
    tc(
        "Funcionalidade incluída no Beta automático",
        "Validar inclusão no beta (Dev 8.3).",
        "Ambiente Stage configurado\nOrganização nova criada como beta\nUsuário logado como Admin da org",
        [
            step("Acessar Menu > Modos de uso",
                 "Tela é exibida"),
            step("Verificar a aba 'Painéis'",
                 "Aba 'Painéis' é exibida (funcionalidade habilitada por padrão para beta)"),
        ],
        priority=2,
    ),
    tc(
        "Org trial com painéis pré-cadastrados",
        "Validar inclusão de painéis no trial (Dev 8.4, QA 11.3).",
        "Ambiente Stage configurado\nOrganização criada via fluxo de trial",
        [
            step("Acessar a aba 'Painéis' como Admin do trial",
                 "Listagem exibe os painéis pré-definidos da org trial (informações pré-cadastradas para o dashboard do aluno)"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 17 - Banco histórico
# ---------------------------------------------------------------------------

suite_17 = topic("Banco histórico", children=[
    tc(
        "Worker HistoricBaseCron exclui registros de panel_tabs e panel_widgets da organização",
        "Validar inclusão das tabelas na rotina de banco histórico (R13 RN91).",
        "Ambiente Stage configurado\nOrganização excluída/marcada para histórico\nExistem registros em panel_tabs e panel_widgets vinculados via organization_id",
        [
            step("Executar o worker HistoricBaseCron para a organização-alvo",
                 "Worker executa sem erros e logs indicam inclusão das tabelas panel_tabs e panel_widgets"),
            step("Verificar a tabela panel_tabs após execução",
                 "Registros vinculados à organization_id da organização-alvo são removidos"),
            step("Verificar a tabela panel_widgets após execução",
                 "Registros vinculados à organization_id da organização-alvo são removidos"),
        ],
        priority=1,
    ),
    tc(
        "Worker preserva registros de outras organizações",
        "Validar isolamento por organization_id.",
        "Ambiente Stage configurado\nOrganização A (excluída) e Organização B (ativa) possuem painéis",
        [
            step("Executar o worker HistoricBaseCron para a Organização A",
                 "Worker executa"),
            step("Verificar registros da Organização B nas tabelas panel_tabs e panel_widgets",
                 "Registros da Organização B permanecem inalterados"),
        ],
        priority=2,
    ),
    tc(
        "Worker registra log de tabelas processadas",
        "Validar logs de auditoria do worker.",
        "Ambiente Stage configurado\nOrganização-alvo possui painéis",
        [
            step("Executar o worker HistoricBaseCron",
                 "Worker registra logs estruturados indicando as tabelas processadas (panel_tabs, panel_widgets) e quantidade de registros excluídos"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 18 - Logs
# ---------------------------------------------------------------------------

suite_18 = topic("Logs", children=[
    tc(
        "Log de criação de painel",
        "Validar registro de log na criação (R14 RN92).",
        PC_BASE,
        [
            step("Acessar a aba 'Painéis' e clicar em '+ Adicionar'",
                 "Tela de criação é exibida"),
            step("Preencher Nome e salvar o painel",
                 "Painel é criado e listado"),
            step("Acessar a tela de logs do sistema (admin de logs)",
                 "Log de 'criação de painel' é registrado com user_id, organization_id, IP, timestamp e payload"),
        ],
        priority=1,
    ),
    tc(
        "Log de edição de painel",
        "Validar registro de log na edição.",
        PC_BASE + "\nExiste painel cadastrado",
        [
            step("Editar um painel alterando o Nome",
                 "Painel é salvo"),
            step("Acessar a tela de logs",
                 "Log de 'edição de painel' é registrado com diff dos campos alterados, user_id, organization_id e IP"),
        ],
        priority=1,
    ),
    tc(
        "Log de exclusão de painel",
        "Validar registro de log na exclusão.",
        PC_BASE + "\nExiste painel cadastrado",
        [
            step("Excluir um painel pela ação 'Excluir'",
                 "Painel é removido"),
            step("Acessar a tela de logs",
                 "Log de 'exclusão de painel' é registrado com user_id, organization_id, IP e referência ao painel excluído"),
        ],
        priority=1,
    ),
    tc(
        "Log de criação de aba",
        "Validar log para abas.",
        PC_BASE + "\nPainel em edição",
        [
            step("Adicionar nova aba ao painel e salvar",
                 "Aba é criada"),
            step("Acessar a tela de logs",
                 "Log de 'criação de aba' é registrado com user_id, organization_id e IP"),
        ],
        priority=2,
    ),
    tc(
        "Log de exclusão de aba",
        "Validar log para abas.",
        PC_BASE + "\nPainel com 2 abas",
        [
            step("Excluir uma aba do painel e salvar",
                 "Aba é removida"),
            step("Acessar a tela de logs",
                 "Log de 'exclusão de aba' é registrado com user_id, organization_id e IP"),
        ],
        priority=2,
    ),
    tc(
        "Log de adição/remoção de widget",
        "Validar log para widgets.",
        PC_BASE + "\nPainel em edição",
        [
            step("Adicionar e depois excluir um widget na aba e salvar layout",
                 "Widget é adicionado e em seguida removido"),
            step("Acessar a tela de logs",
                 "Logs de 'criação de widget' e 'exclusão de widget' são registrados com user_id, organization_id e IP"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 19 - Ambientes adicionais
# ---------------------------------------------------------------------------

suite_19 = topic("Ambientes adicionais", children=[
    tc(
        "Funcionalidade de Painéis em ambiente adicional",
        "Validar disponibilidade da funcionalidade em ambientes adicionais.",
        "Ambiente adicional configurado para a organização\nFuncionalidade 'Gestão de Painéis' habilitada\nFeature flag 'habilitar_paineis_do_usuario' ativa\nUsuário logado como Admin no ambiente adicional",
        [
            step("Acessar Menu > Modos de uso no ambiente adicional",
                 "Tela é exibida"),
            step("Verificar a aba 'Painéis'",
                 "Aba 'Painéis' é exibida e listagem é carregada corretamente"),
        ],
        priority=2,
    ),
    tc(
        "Painéis criados no ambiente principal não vazam para ambiente adicional",
        "Validar isolamento de dados entre ambientes.",
        "Organização com ambiente principal e adicional\nPainel 'Painel Principal' criado no ambiente principal",
        [
            step("Acessar a aba 'Painéis' no ambiente adicional",
                 "Listagem do ambiente adicional NÃO contém 'Painel Principal'"),
        ],
        priority=2,
    ),
    tc(
        "Modo de uso configurado em ambiente adicional usa painel local",
        "Validar configuração isolada por ambiente.",
        "Ambiente adicional configurado\nPainel 'Painel Local' criado no ambiente adicional",
        [
            step("Acessar a configuração de modo de uso no ambiente adicional",
                 "Formulário é exibido"),
            step("Selecionar 'Painéis do usuário' e abrir o dropdown 'Espaço'",
                 "Dropdown lista apenas painéis do ambiente adicional ('Painel Local')"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 20 - Feature flag
# ---------------------------------------------------------------------------

suite_20 = topic("Feature flag", children=[
    tc(
        "Feature flag desabilitada - aba 'Painéis' não é exibida para Admin",
        "Validar ocultação total do módulo (R1).",
        "Ambiente Stage configurado\nFuncionalidade 'Gestão de Painéis' habilitada no contrato\nFeature flag 'habilitar_paineis_do_usuario' DESABILITADA\nUsuário logado como Admin",
        [
            step("Acessar Menu > Modos de uso",
                 "Tela é exibida sem a aba 'Painéis'"),
        ],
        priority=1,
    ),
    tc(
        "Feature flag habilitada com painéis criados - menu do aluno acessível",
        "Validar acesso do aluno com flag ativa.",
        "Ambiente Stage configurado\nFlag ativa\nMenu de modo de uso configurado com painel ativo\nUsuário logado como Aluno",
        [
            step("Acessar o menu configurado com painel",
                 "Painel é exibido normalmente para o aluno"),
        ],
        priority=1,
    ),
    tc(
        "Transição: flag habilitada -> desabilitada com painéis aplicados",
        "Validar ocultação do menu com widgets na visão do aluno.",
        "Ambiente Stage configurado\nFlag inicialmente ATIVA\nMenu de modo de uso configurado com painel\nUsuário logado como Aluno",
        [
            step("Acessar o menu como aluno (flag ativa)",
                 "Painel é exibido"),
            step("Desabilitar a feature flag para a organização",
                 "Flag é desabilitada"),
            step("Recarregar a aplicação como aluno",
                 "Menu vinculado ao painel é ocultado da visão do aluno"),
        ],
        priority=1,
    ),
    tc(
        "Menu marcado como 'Padrão' com flag desabilitada",
        "Validar comportamento de menu padrão quando flag fica off.",
        "Ambiente Stage configurado\nFlag inicialmente ATIVA\nMenu vinculado ao painel marcado como 'Padrão'\nUsuário logado como Aluno",
        [
            step("Desabilitar a feature flag para a organização",
                 "Flag é desabilitada"),
            step("Acessar a aplicação como aluno",
                 "Sistema NÃO usa o menu de painel como página padrão; aluno é redirecionado para o dashboard legado ou outro modo de uso disponível"),
        ],
        priority=2,
    ),
    tc(
        "Transição: flag desabilitada -> habilitada",
        "Validar reativação do módulo.",
        "Ambiente Stage configurado\nFlag inicialmente DESABILITADA\nUsuário logado como Admin",
        [
            step("Acessar Menu > Modos de uso (flag desabilitada)",
                 "Aba 'Painéis' NÃO é exibida"),
            step("Habilitar a feature flag para a organização",
                 "Flag é habilitada"),
            step("Recarregar a tela de Modos de uso",
                 "Aba 'Painéis' passa a ser exibida"),
        ],
        priority=2,
    ),
])


# ---------------------------------------------------------------------------
# SUÍTE 21 - Trial
# ---------------------------------------------------------------------------

suite_21 = topic("Trial", children=[
    tc(
        "Criação de trial via URL com painéis pré-definidos",
        "Validar inclusão de painéis na criação de trial (Dev 8.4, QA 11.3).",
        "Ambiente Stage configurado",
        [
            step("Acessar a URL 'https://stage.twygoead.com/new/register/steps?1' e completar o cadastro",
                 "Trial é criado com sucesso"),
            step("Realizar login no trial recém-criado como Admin",
                 "Usuário acessa o trial"),
            step("Acessar a aba 'Painéis' em Menu > Modos de uso",
                 "Listagem exibe os painéis pré-definidos do trial (dashboard do aluno migrado)"),
        ],
        priority=2,
    ),
    tc(
        "Criação de trial via API com painéis pré-definidos",
        "Validar inclusão via API.",
        "Ambiente Stage configurado\nToken de acesso válido para 'https://stage.twygo.com/api/v2/external_onboarding'",
        [
            step("Enviar POST 'https://stage.twygo.com/api/v2/external_onboarding' com payload de criação de trial",
                 "API responde com status 201/200 e cria o trial"),
            step("Realizar login no trial criado como Admin",
                 "Usuário acessa o trial"),
            step("Acessar a aba 'Painéis'",
                 "Listagem exibe os painéis pré-definidos do trial"),
        ],
        priority=2,
    ),
    tc(
        "Exclusão de trial: dados pré-definidos da SophiaTech removidos",
        "Validar limpeza completa na exclusão do trial.",
        "Trial criado e populado com painéis e abas",
        [
            step("Executar a rotina de exclusão do trial",
                 "Rotina executa"),
            step("Verificar a base de dados após exclusão",
                 "Todos os registros pré-definidos da SophiaTech (painéis, abas, widgets) são removidos da organização-trial"),
        ],
        priority=3,
    ),
    tc(
        "Exclusão de trial: dados criados pelo Admin removidos",
        "Validar limpeza de dados manuais do Admin.",
        "Trial criado, Admin criou painel 'Painel do Admin Trial'",
        [
            step("Executar a rotina de exclusão do trial",
                 "Rotina executa"),
            step("Verificar a base após exclusão",
                 "Painel 'Painel do Admin Trial' (criado manualmente) também é removido junto com pré-definidos"),
        ],
        priority=3,
    ),
])


# ---------------------------------------------------------------------------
# MONTAR ESTRUTURA FINAL
# ---------------------------------------------------------------------------

root_topic = topic(
    f"Análise de Teste - {PROJECT}",
    children=[
        suite_1, suite_2, suite_3, suite_4, suite_5, suite_6, suite_7,
        suite_8, suite_9, suite_10, suite_11, suite_12, suite_13, suite_14,
        suite_15, suite_16, suite_17, suite_18, suite_19, suite_20, suite_21,
    ],
)

content = [{
    "id": gid(),
    "class": "sheet",
    "title": PROJECT,
    "rootTopic": root_topic,
    "topicPositioning": "fixed",
}]


# ---------------------------------------------------------------------------
# GERAR ARQUIVO .XMIND
# ---------------------------------------------------------------------------

def create_xmind(output_path, template_path):
    temp_dir = tempfile.mkdtemp(prefix="xmind_build_")
    try:
        with zipfile.ZipFile(template_path, "r") as z:
            z.extractall(temp_dir)

        with open(os.path.join(temp_dir, "content.json"), "w", encoding="utf-8") as f:
            json.dump(content, f, ensure_ascii=False, indent=2)

        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as z:
            for root, _dirs, files in os.walk(temp_dir):
                for file in files:
                    fp = os.path.join(root, file)
                    z.write(fp, os.path.relpath(fp, temp_dir))

        print(f"XMind gerado com sucesso: {output_path}")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


if __name__ == "__main__":
    create_xmind(OUTPUT_PATH, TEMPLATE_PATH)
