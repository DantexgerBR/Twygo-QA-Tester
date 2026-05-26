"""
Gera os dois arquivos .xlsx finais de quebra de atividades:
- QA_Atividades_<Projeto>_Complementada.xlsx (Dev + QA)
- QA_Only_<Projeto>.xlsx (apenas QA)

Recebe a estrutura consolidada via JSON (stdin ou --input).

Uso:
    python generate_qa_sheet.py --input atividades.json --output-dir output/
    cat atividades.json | python generate_qa_sheet.py --output-dir output/

Estrutura do JSON de entrada:
{
  "projeto": "Modelos de Conteúdo",
  "atividades_dev_originais": [
    {"tipo": "Desenvolvimento", "titulo": "...", "descricao": "...", "esforco": 16},
    ...
  ],
  "atividades_qa": [
    {"tipo": "Análise de testes", "titulo": "Análise de testes", "descricao": "...", "esforco": 12},
    {"tipo": "Execução de testes", "titulo": "QA 1.1 - Listagem", "descricao": "...", "esforco": 4},
    ...
  ]
}
"""

import argparse
import json
import re
import sys
from pathlib import Path

COLUNAS = [
    "Tipo da atividade",
    "Título da atividade",
    "Descrição",
    "Esforço estimado",
    "Início estimado",
    "Término estimado",
    "Responsável",
]

TIPOS_QA_ONLY = {
    "Análise de testes",
    "Execução de testes",
    "Reteste",
    "Documentação",
    "Indiretos - Cerimonias da Equipe",
    "Deploy",
    "Total",
}


def load_template() -> dict:
    template_path = Path(__file__).parent.parent / "templates" / "qa_activities_template.json"
    return json.loads(template_path.read_text(encoding="utf-8"))


def slug_projeto(nome: str) -> str:
    """Normaliza o nome do projeto para uso em nome de arquivo."""
    nome = nome.strip()
    # Substitui caracteres especiais por _
    nome = re.sub(r"[áàâã]", "a", nome, flags=re.IGNORECASE)
    nome = re.sub(r"[éèê]", "e", nome, flags=re.IGNORECASE)
    nome = re.sub(r"[íì]", "i", nome, flags=re.IGNORECASE)
    nome = re.sub(r"[óòôõ]", "o", nome, flags=re.IGNORECASE)
    nome = re.sub(r"[úù]", "u", nome, flags=re.IGNORECASE)
    nome = re.sub(r"[ç]", "c", nome, flags=re.IGNORECASE)
    nome = re.sub(r"[^\w\s-]", "", nome)
    nome = re.sub(r"\s+", "_", nome)
    return nome


def order_qa_atividades(qa: list[dict]) -> list[dict]:
    """
    Ordena atividades de QA:
    - Análise de testes primeiro
    - Execuções por bloco (extraindo número do título QA X.Y)
    - Transversais (x.x) por último
    """
    analise = [a for a in qa if a.get("tipo") == "Análise de testes"]
    execucoes = [a for a in qa if a.get("tipo") == "Execução de testes"]

    def sort_key(atividade: dict) -> tuple:
        titulo = atividade.get("titulo", "")
        # Casa "QA 1.2 - ..." ou "QA x.x - ..."
        match = re.match(r"QA\s+([\dx]+)\.([\dx]+)", titulo)
        if not match:
            return (999, 999, titulo)
        bloco_str, num_str = match.groups()
        bloco = 999 if bloco_str == "x" else int(bloco_str)
        num = 999 if num_str == "x" else int(num_str)
        return (bloco, num, titulo)

    execucoes_sorted = sorted(execucoes, key=sort_key)
    outras = [
        a
        for a in qa
        if a.get("tipo") not in {"Análise de testes", "Execução de testes"}
    ]
    return analise + execucoes_sorted + outras


def write_sheet(ws, atividades: list[dict]) -> None:
    """Escreve cabeçalho + linhas em uma worksheet."""
    ws.append(COLUNAS)
    for a in atividades:
        ws.append(
            [
                a.get("tipo", ""),
                a.get("titulo", ""),
                a.get("descricao", ""),
                a.get("esforco") if a.get("esforco") is not None else "",
                "",  # Início estimado
                "",  # Término estimado
                "",  # Responsável
            ]
        )


def build_atividades_completa(
    dev_originais: list[dict],
    qa: list[dict],
    finais: list[dict],
) -> list[dict]:
    """
    Planilha Completa: preserva originais não-QA + QA gerado + finais fixas.
    Atividades originais cujo tipo seja Análise/Execução/Reteste/Doc/Deploy/Total
    são REMOVIDAS (serão substituídas pelas geradas e fixas).
    """
    tipos_substituidos = {
        "Análise de testes",
        "Execução de testes",
        "Reteste",
        "Documentação",
        "Indiretos - Cerimonias da Equipe",
        "Deploy",
        "Total",
    }
    preservadas = [a for a in dev_originais if a.get("tipo") not in tipos_substituidos]
    qa_ordenadas = order_qa_atividades(qa)
    return preservadas + qa_ordenadas + finais


def build_atividades_qa_only(qa: list[dict], finais: list[dict]) -> list[dict]:
    """Planilha QA-Only: apenas tipos relevantes de QA + finais fixas."""
    qa_ordenadas = order_qa_atividades(qa)
    qa_filtradas = [a for a in qa_ordenadas if a.get("tipo") in TIPOS_QA_ONLY]
    return qa_filtradas + finais


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        help="Caminho do JSON de entrada. Se omitido, lê de stdin.",
        default=None,
    )
    parser.add_argument(
        "--output-dir",
        help="Pasta de saída (default: output/).",
        default="output",
    )
    args = parser.parse_args()

    try:
        import openpyxl
    except ImportError:
        print(
            "ERROR: openpyxl não instalado. Rode: pip install -r requirements.txt",
            file=sys.stderr,
        )
        return 1

    # Carregar JSON
    if args.input:
        data = json.loads(Path(args.input).read_text(encoding="utf-8"))
    else:
        data = json.loads(sys.stdin.read())

    projeto = data.get("projeto", "Projeto").strip() or "Projeto"
    dev_originais = data.get("atividades_dev_originais", [])
    qa = data.get("atividades_qa", [])

    template = load_template()
    finais = template["atividades_finais"]

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    slug = slug_projeto(projeto)

    # Planilha Completa
    completa_path = output_dir / f"QA_Atividades_{slug}_Complementada.xlsx"
    wb_completa = openpyxl.Workbook()
    ws = wb_completa.active
    ws.title = "Atividades"
    write_sheet(ws, build_atividades_completa(dev_originais, qa, finais))
    wb_completa.save(str(completa_path))

    # Planilha QA-Only
    qa_only_path = output_dir / f"QA_Only_{slug}.xlsx"
    wb_qa = openpyxl.Workbook()
    ws = wb_qa.active
    ws.title = "QA"
    write_sheet(ws, build_atividades_qa_only(qa, finais))
    wb_qa.save(str(qa_only_path))

    # Resumo
    execucoes = [a for a in qa if a.get("tipo") == "Execução de testes"]
    horas_execucao = sum(float(a.get("esforco") or 0) for a in execucoes)
    horas_analise = sum(
        float(a.get("esforco") or 0)
        for a in qa
        if a.get("tipo") == "Análise de testes"
    )
    horas_deploy = next(
        (float(f.get("esforco") or 0) for f in finais if f.get("tipo") == "Deploy"),
        0,
    )

    summary = {
        "projeto": projeto,
        "arquivos": {
            "planilha_completa": str(completa_path),
            "planilha_qa_only": str(qa_only_path),
        },
        "totais": {
            "qtd_execucoes": len(execucoes),
            "horas_analise": horas_analise,
            "horas_execucao": horas_execucao,
            "horas_deploy": horas_deploy,
            "horas_total_qa": horas_analise + horas_execucao + horas_deploy,
        },
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
