"""
Lê uma planilha .xlsx (Quebra de atividades de Dev) e extrai:
- Atividades da aba `dev-qa` (Tipo, Título, Descrição, Esforço)
- Identificação de bloco a partir do título / prefixos
- Identificação de atividades transversais (Banco Histórico, Logs, Trial, Feature flag)
- Metadados da aba `produto` (account_id, folder_id, nome do projeto)

Uso:
    python read_dev_sheet.py <arquivo.xlsx>

Saída: JSON em stdout com a estrutura consumida pela skill /read-inputs.
"""

import argparse
import json
import re
import sys
from pathlib import Path


# Padrão de ID Dev: "Dev 1.1", "Dev 2.10", etc.
DEV_ID_PATTERN = re.compile(r"\b(Dev\s+\d+(?:\.\d+)?)\b", re.IGNORECASE)

# Padrão de prefixo de bloco: "[Criação de novo modelo] ...", "[Filtros e ações] ..."
BLOCO_PREFIX_PATTERN = re.compile(r"^\[([^\]]+)\]\s*")

TRANSVERSAL_TITLE_KEYWORDS = [
    "banco histórico",
    "banco historico",
    "logs",
    "auditoria",
    "trial",
    "feature flag",
    "ambientes adicionais",
]

TIPOS_RELEVANTES = {
    "Desenvolvimento",
    "Spike",
    "Teste de mesa",
    "Testes de mesa",
    "Análise de testes",
    "Execução de testes",
    "Reteste",
    "Documentação",
    "Indiretos - Cerimonias da Equipe",
    "Deploy",
    "Total",
}


def load_workbook(path: Path):
    try:
        import openpyxl
    except ImportError:
        print(
            "ERROR: openpyxl não instalado. Rode: pip install -r requirements.txt",
            file=sys.stderr,
        )
        sys.exit(1)
    return openpyxl.load_workbook(str(path), data_only=True, read_only=True)


def find_sheet(wb, candidates: list[str]):
    """Busca a primeira aba cujo nome (case-insensitive) bate com algum candidato."""
    lower_map = {name.lower(): name for name in wb.sheetnames}
    for candidate in candidates:
        if candidate.lower() in lower_map:
            return wb[lower_map[candidate.lower()]]
    return None


def find_header_row(sheet) -> tuple[int, dict[str, int]] | None:
    """
    Procura a linha de header (que contém 'Tipo da atividade' e 'Título da atividade').
    Retorna (row_index, {col_label: col_index}).
    """
    target_labels = {"tipo da atividade", "título da atividade", "titulo da atividade"}
    for row_idx, row in enumerate(sheet.iter_rows(values_only=True), start=1):
        cells_lower = [str(c).strip().lower() if c is not None else "" for c in row]
        if any(label in cells_lower for label in target_labels):
            mapping: dict[str, int] = {}
            for col_idx, cell in enumerate(cells_lower):
                if cell:
                    mapping[cell] = col_idx
            return row_idx, mapping
    return None


def get_col(mapping: dict[str, int], *aliases: str) -> int | None:
    for alias in aliases:
        if alias.lower() in mapping:
            return mapping[alias.lower()]
    return None


def detect_bloco(titulo: str, prefix_to_bloco: dict[str, str]) -> str | None:
    """Retorna o número do bloco a partir do prefixo entre colchetes."""
    match = BLOCO_PREFIX_PATTERN.match(titulo)
    if not match:
        return None
    prefix = match.group(1).strip()
    if prefix not in prefix_to_bloco:
        # Novo bloco — atribuir próximo número disponível
        next_num = str(len(prefix_to_bloco) + 1)
        prefix_to_bloco[prefix] = next_num
    return prefix_to_bloco[prefix]


def is_transversal(titulo: str) -> bool:
    lower = titulo.lower()
    return any(keyword in lower for keyword in TRANSVERSAL_TITLE_KEYWORDS)


def extract_dev_id(titulo: str, descricao: str) -> str | None:
    for source in (titulo, descricao):
        if not source:
            continue
        match = DEV_ID_PATTERN.search(source)
        if match:
            return re.sub(r"\s+", " ", match.group(1).strip())
    return None


def parse_dev_sheet(sheet) -> tuple[list[dict], dict[str, str]]:
    """
    Lê a aba `dev-qa` e retorna (atividades, prefix_to_bloco).
    """
    header_info = find_header_row(sheet)
    if header_info is None:
        return [], {}

    header_row, mapping = header_info
    col_tipo = get_col(mapping, "tipo da atividade", "tipo (*)", "tipo")
    col_titulo = get_col(mapping, "título da atividade", "titulo da atividade", "título", "titulo")
    col_desc = get_col(mapping, "descrição", "descricao")
    col_esforco = get_col(
        mapping, "esforço estimado", "esforco estimado", "esforço (h)", "esforço"
    )

    if col_tipo is None or col_titulo is None:
        return [], {}

    atividades: list[dict] = []
    prefix_to_bloco: dict[str, str] = {}

    for row in sheet.iter_rows(min_row=header_row + 1, values_only=True):
        if not row:
            continue
        tipo = str(row[col_tipo]).strip() if row[col_tipo] is not None else ""
        titulo = str(row[col_titulo]).strip() if row[col_titulo] is not None else ""

        if not tipo and not titulo:
            continue
        if tipo not in TIPOS_RELEVANTES:
            continue

        desc = (
            str(row[col_desc]).strip()
            if col_desc is not None and row[col_desc] is not None
            else ""
        )
        esforco_raw = row[col_esforco] if col_esforco is not None else None
        try:
            esforco = float(esforco_raw) if esforco_raw not in (None, "") else None
        except (ValueError, TypeError):
            esforco = None

        bloco = detect_bloco(titulo, prefix_to_bloco)
        dev_id = extract_dev_id(titulo, desc)
        transversal = is_transversal(titulo)

        atividades.append(
            {
                "tipo": tipo,
                "titulo": titulo,
                "descricao": desc,
                "esforco": esforco,
                "bloco": bloco,
                "id_dev": dev_id,
                "transversal": transversal,
            }
        )

    return atividades, prefix_to_bloco


def parse_produto_sheet(sheet) -> dict:
    """
    Lê a aba `produto` buscando account_id, folder_id e nome do projeto.
    Ignora valores que contenham URL ou a palavra 'Link'.
    """
    if sheet is None:
        return {"nome": None, "account_id": None, "folder_id": None}

    result = {"nome": None, "account_id": None, "folder_id": None}

    for row in sheet.iter_rows(values_only=True):
        if not row:
            continue
        for i, cell in enumerate(row):
            if cell is None:
                continue
            label = str(cell).strip().lower()
            value = row[i + 1] if i + 1 < len(row) else None
            value_str = str(value).strip() if value is not None else ""

            if not value_str or "http" in value_str.lower() or "link" in value_str.lower():
                continue

            if "account_id" in label or "account id" in label:
                try:
                    result["account_id"] = int(float(value_str))
                except ValueError:
                    pass
            elif "folder_id" in label or "folder id" in label:
                try:
                    result["folder_id"] = int(float(value_str))
                except ValueError:
                    pass
            elif "nome" in label and "projeto" in label and not result["nome"]:
                result["nome"] = value_str
            elif label == "projeto" and not result["nome"]:
                result["nome"] = value_str

    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("xlsx_path", help="Caminho do arquivo .xlsx")
    args = parser.parse_args()

    path = Path(args.xlsx_path)
    if not path.exists():
        print(f"ERROR: arquivo não encontrado: {path}", file=sys.stderr)
        return 1

    wb = load_workbook(path)

    dev_sheet = find_sheet(wb, ["dev-qa", "Dev-QA", "Atividades", wb.sheetnames[0]])
    if dev_sheet is None:
        print("ERROR: nenhuma aba reconhecida (dev-qa, Atividades, ...).", file=sys.stderr)
        return 1

    atividades, prefix_to_bloco = parse_dev_sheet(dev_sheet)
    blocos = {num: prefix for prefix, num in prefix_to_bloco.items()}

    produto_sheet = find_sheet(wb, ["produto", "Produto"])
    produto = parse_produto_sheet(produto_sheet)

    alertas: list[str] = []
    if produto_sheet is None:
        alertas.append("Aba 'produto' não encontrada — metadados ficarão em branco.")
    if produto.get("account_id") is None:
        alertas.append("account_id ausente ou não numérico na aba 'produto'.")
    if not atividades:
        alertas.append("Nenhuma atividade reconhecida na planilha.")

    result = {
        "arquivo": str(path.name),
        "produto": produto,
        "blocos": blocos,
        "atividades_dev": atividades,
        "alertas": alertas,
    }

    print(json.dumps(result, ensure_ascii=False, indent=2, default=str))
    return 0


if __name__ == "__main__":
    sys.exit(main())
