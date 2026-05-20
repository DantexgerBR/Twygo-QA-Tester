"""
Lê um documento .docx (Discovery / Spike / Especificação) e extrai:
- Regras de Negócio numeradas (RN 1, RN 2.1, ...)
- Texto livre quando não houver RNs explícitas (modo inferência)
- Fluxos comuns Twygo (Aula, Página, Curso, Modelo, ...)
- Atividades transversais mencionadas (Banco Histórico, Logs, Trial, Feature flag)

Uso:
    python read_requirements.py <arquivo.docx>

Saída: JSON em stdout com a estrutura consumida pela skill /read-inputs.
"""

import argparse
import json
import re
import sys
from pathlib import Path


# Padrões de RN: aceita "RN 1", "RN 1.2", "RN 10.3", "[RN 5]", "(RN 2.1)", etc.
RN_PATTERN = re.compile(r"\b(RN\s+\d+(?:\.\d+)?)\b", re.IGNORECASE)

TRANSVERSAIS_KEYWORDS = {
    "banco histórico": "Banco Histórico",
    "banco historico": "Banco Histórico",
    "logs": "Logs",
    "auditoria": "Logs",
    "trial": "Trial",
    "feature flag": "Feature flag",
    "ambientes adicionais": "Ambientes adicionais",
    "beta": "Beta / Launch",
    "launch": "Beta / Launch",
}

FLUXOS_KEYWORDS = {
    "aula": "Aula",
    "página": "Página",
    "pagina": "Página",
    "curso": "Curso",
    "modelo de conteúdo": "Modelo de Conteúdo",
    "modelo de conteudo": "Modelo de Conteúdo",
}


def read_docx(path: Path) -> str:
    """Lê o .docx e retorna todo o texto concatenado."""
    try:
        import docx
    except ImportError:
        print(
            "ERROR: python-docx não instalado. Rode: pip install -r requirements.txt",
            file=sys.stderr,
        )
        sys.exit(1)

    document = docx.Document(str(path))
    paragraphs = [p.text for p in document.paragraphs if p.text.strip()]
    # Também extrair texto de tabelas
    for table in document.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    paragraphs.append(cell.text)
    return "\n".join(paragraphs)


def extract_rns(text: str) -> list[dict]:
    """
    Extrai RNs numeradas do texto. Cada RN é capturada com seu ID e o
    parágrafo subsequente até a próxima RN ou final de seção.
    """
    rns: list[dict] = []
    seen_ids: set[str] = set()

    # Procurar pela posição de cada RN
    matches = list(RN_PATTERN.finditer(text))
    for i, match in enumerate(matches):
        rn_id = re.sub(r"\s+", " ", match.group(1).strip().upper())  # "RN 1"
        if rn_id in seen_ids:
            continue
        seen_ids.add(rn_id)

        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        rn_text = text[start:end].strip(" :.-\n")

        # Truncar para evitar capturar seções inteiras
        if "\n\n" in rn_text:
            rn_text = rn_text.split("\n\n")[0]

        rns.append({"id": rn_id, "texto": rn_text, "inferida": False})

    return rns


def detect_transversais(text: str) -> list[str]:
    """Detecta menções a atividades transversais no documento."""
    detected: set[str] = set()
    lower = text.lower()
    for keyword, label in TRANSVERSAIS_KEYWORDS.items():
        if keyword in lower:
            detected.add(label)
    return sorted(detected)


def detect_fluxos(text: str) -> list[str]:
    """Detecta menções a fluxos comuns no documento."""
    detected: set[str] = set()
    lower = text.lower()
    for keyword, label in FLUXOS_KEYWORDS.items():
        if keyword in lower:
            detected.add(label)
    return sorted(detected)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("docx_path", help="Caminho do arquivo .docx")
    args = parser.parse_args()

    path = Path(args.docx_path)
    if not path.exists():
        print(f"ERROR: arquivo não encontrado: {path}", file=sys.stderr)
        return 1

    text = read_docx(path)
    rns = extract_rns(text)
    transversais = detect_transversais(text)
    fluxos = detect_fluxos(text)

    alertas: list[str] = []
    if not rns:
        alertas.append(
            "Documento não possui RNs numeradas (RN 1, RN 2.1, ...). "
            "Inferir regras a partir do texto e validar com o usuário."
        )

    result = {
        "arquivo": str(path.name),
        "rns": rns,
        "fluxos_detectados": fluxos,
        "transversais_detectadas": transversais,
        "alertas": alertas,
        "texto_completo_chars": len(text),
    }

    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
