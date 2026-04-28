"""
Script base para gerar XMind de análise de teste.
Este script é usado como referência pela skill /generate-xmind.
Copiar este arquivo para output/generate_xmind.py e adicionar as suítes e casos de teste.
"""

import json, zipfile, os, shutil, uuid


# =====================================================================
# FUNÇÕES UTILITÁRIAS (NÃO MODIFICAR)
# =====================================================================

def gid():
    """Gera um ID único para cada tópico do XMind."""
    return str(uuid.uuid4()).replace('-', '')[:24]


def topic(title, note=None, children=None, markers=None):
    """
    Cria um tópico genérico do XMind.
    - title: Texto do tópico
    - note: Texto da nota (objetivo + pré-condições)
    - children: Lista de tópicos filhos
    - markers: Lista de marcadores (prioridade)
    """
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
    """
    Cria um passo de teste: Ação → Resultado Esperado.
    - action: Texto descrevendo a ação do testador
    - expected: Texto descrevendo o resultado esperado (com textos literais)
    """
    return topic(action, children=[topic(expected)])


def tc(title, objective, preconditions, steps, priority=2):
    """
    Cria um caso de teste completo.
    - title: Nome do caso de teste
    - objective: Objetivo do teste (incluído na nota)
    - preconditions: Pré-condições separadas por \\n (incluídas na nota após [PRECONDITIONS])
    - steps: Lista de step() com ações e resultados esperados
    - priority: 1=Alto, 2=Médio, 3=Baixo (marcador de prioridade)
    """
    note = f"{objective}\n[PRECONDITIONS]\n{preconditions}"
    markers = [{"markerId": f"priority-{priority}"}]
    return topic(title, note=note, children=steps, markers=markers)


# =====================================================================
# DEFINIR SUÍTES E CASOS DE TESTE AQUI
# =====================================================================
# Exemplo:
#
# suite_exemplo = topic(
#     "Nome descritivo da suíte",
#     children=[
#         tc("Nome do caso de teste",
#            "Objetivo claro do que será validado.",
#            "Usuário logado como Admin\nFeature flag habilitada",
#            [
#                step("Ação 1 que o testador deve executar",
#                     "Resultado esperado com texto literal exato"),
#                step("Ação 2 que o testador deve executar",
#                     "Resultado esperado com texto literal exato"),
#            ], priority=1),
#     ]
# )


# =====================================================================
# MONTAR ESTRUTURA FINAL
# =====================================================================
root_topic = topic(
    "Análise de Teste - [NOME DO PROJETO]",
    children=[
        # Adicionar todas as suítes aqui:
        # suite_1,
        # suite_2,
        # suite_3,
    ]
)

content = [{
    "id": gid(),
    "class": "sheet",
    "title": "[NOME DO PROJETO]",
    "rootTopic": root_topic,
    "topicPositioning": "fixed"
}]


# =====================================================================
# GERAR ARQUIVO .XMIND
# =====================================================================
def create_xmind(output_path, template_path):
    """
    Gera o arquivo .xmind usando um template existente como base.
    Substitui apenas o content.json, mantendo metadata.json e demais arquivos.
    """
    temp_dir = "/tmp/temp_xmind"
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir)
    os.makedirs(temp_dir)

    # Extrair template
    with zipfile.ZipFile(template_path, 'r') as z:
        z.extractall(temp_dir)

    # Substituir content.json
    with open(os.path.join(temp_dir, "content.json"), 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

    # Reempacotar
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                fp = os.path.join(root, file)
                z.write(fp, os.path.relpath(fp, temp_dir))

    shutil.rmtree(temp_dir)
    print(f"XMind gerado com sucesso: {output_path}")


if __name__ == "__main__":
    create_xmind(
        "output/Analise_Teste_[NOME_PROJETO].xmind",
        "template/template.xmind"
    )
