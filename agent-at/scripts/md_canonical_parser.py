"""
Parser do MD canônico de Análise de Teste (test-analysis.md).

Lê um arquivo seguindo o schema do CONTRACT.md (raiz do monorepo) e produz
um dict Python estruturado que os geradores (md_to_xmind.py, md_to_testlink.py)
consomem para emitir os derivados.

Schema esperado (resumo):
- Frontmatter YAML de projeto (raiz)
- Seções de catálogo (## Dados de teste, ## Textos literais, ## Modais, etc.)
- Suítes delimitadas por blocos YAML --- com campos `suite`, `executor`,
  `preconditions`, `playbooks` (opcional), `org` (opcional)
- Cada TC: H2 com formato "## TC<N> — <título>", seguido de metadados
  (**Prioridade**, **Tipo**, **Playbooks adicionais**), `### Objetivo`,
  e `### Passos` com passos numerados `N. <ação>\n   → <resultado>`

Uso (CLI):
    python md_canonical_parser.py <path-to-test-analysis.md>

Uso (import):
    from md_canonical_parser import parse_canonical_md
    data = parse_canonical_md(path)

Saída do parse_canonical_md:
    {
        "project_frontmatter": {...},
        "catalogs": {
            "dados_de_teste": "...",
            "textos_literais": "...",
            "modais_relevantes": "...",
            "endpoints": "...",
            "campos_e_validacoes": "..."
        },
        "suites": [
            {
                "frontmatter": {"suite": str, "executor": str, "playbooks": [...], "preconditions": [...], "org": str|None},
                "test_cases": [
                    {
                        "number": int,
                        "title": str,
                        "priority": "critical"|"high"|"medium"|"low",
                        "type": "ui"|"api"|"db"|"mixed",
                        "playbooks_adicionais": [...],
                        "objective": str,
                        "steps": [
                            {"action": str, "expected": str}
                        ]
                    }
                ]
            }
        ]
    }
"""

import re
import sys
import yaml
from pathlib import Path
from typing import Any


_PRIORITY_MAP = {
    "critical": 1,
    "high": 2,
    "medium": 2,
    "low": 3,
}


def _parse_frontmatter_block(text: str) -> dict[str, Any]:
    """Parseia um bloco YAML entre --- e ---. Retorna dict (ou {} se vazio)."""
    text = text.strip()
    if not text:
        return {}
    try:
        return yaml.safe_load(text) or {}
    except yaml.YAMLError as e:
        raise ValueError(f"YAML inválido no frontmatter: {e}\n--- bloco ---\n{text}\n---") from e


def _split_top_level_frontmatter(md: str) -> tuple[dict[str, Any], str]:
    """
    Extrai o frontmatter de raiz (primeiro bloco --- ... ---) e retorna
    (frontmatter_dict, resto_do_documento).
    """
    md = md.lstrip()
    if not md.startswith("---"):
        raise ValueError("MD canônico precisa começar com frontmatter YAML delimitado por ---")
    end = md.find("\n---", 3)
    if end == -1:
        raise ValueError("Frontmatter de raiz não fechado (faltou --- de fechamento)")
    fm_block = md[3:end]
    rest = md[end + 4:].lstrip("\n")
    return _parse_frontmatter_block(fm_block), rest


def _extract_catalog_sections(body: str) -> tuple[dict[str, str], str]:
    """
    Extrai as seções `## Dados de teste`, `## Textos literais`, etc.
    que aparecem ANTES do primeiro bloco de suíte.

    Retorna (catalogs_dict, body_sem_catalogos).
    """
    catalog_keys = {
        "## Dados de teste": "dados_de_teste",
        "## Textos literais": "textos_literais",
        "## Modais relevantes": "modais_relevantes",
        "## Endpoints (referência)": "endpoints",
        "## Endpoints": "endpoints",
        "## Campos e validações": "campos_e_validacoes",
    }

    # Procura primeiro --- (início de suíte). Tudo antes disso é catálogo.
    # Considera que catálogos podem aparecer no início, antes do primeiro `---` de suíte.
    suite_start = re.search(r"^---\s*$", body, re.MULTILINE)
    catalog_region = body[: suite_start.start()] if suite_start else body
    rest = body[suite_start.start():] if suite_start else ""

    catalogs: dict[str, str] = {}
    # Pula o título H1 do projeto se houver
    lines = catalog_region.split("\n")
    current_key: str | None = None
    buffer: list[str] = []

    for line in lines:
        match = next(
            (key for hdr, key in catalog_keys.items() if line.strip() == hdr),
            None,
        )
        if match is not None:
            if current_key:
                catalogs[current_key] = "\n".join(buffer).strip()
            current_key = match
            buffer = []
        elif current_key:
            buffer.append(line)

    if current_key:
        catalogs[current_key] = "\n".join(buffer).strip()

    return catalogs, rest


def _parse_test_case_block(block: str, tc_number_expected: int) -> dict[str, Any]:
    """
    Parseia um bloco que começa com `## TC<N> — <título>` e termina antes
    do próximo `## TC` ou final da suíte.
    """
    lines = block.split("\n")
    header = lines[0].strip()
    m = re.match(r"^## TC(\d+)\s*[—–-]\s*(.+)$", header)
    if not m:
        raise ValueError(f"Header de TC inválido: {header!r}")
    tc_num = int(m.group(1))
    title = m.group(2).strip()

    tc: dict[str, Any] = {
        "number": tc_num,
        "title": title,
        "priority": "medium",
        "type": "ui",
        "playbooks_adicionais": [],
        "objective": "",
        "steps": [],
    }

    body = "\n".join(lines[1:])

    # Metadados estruturados
    pri_m = re.search(r"^\*\*Prioridade\*\*:\s*(\w+)\s*$", body, re.MULTILINE)
    if pri_m:
        tc["priority"] = pri_m.group(1).strip().lower()

    type_m = re.search(r"^\*\*Tipo\*\*:\s*(\w+)\s*$", body, re.MULTILINE)
    if type_m:
        tc["type"] = type_m.group(1).strip().lower()

    pb_m = re.search(r"^\*\*Playbooks adicionais\*\*:\s*(\[.*?\]|\S.*)$", body, re.MULTILINE)
    if pb_m:
        raw = pb_m.group(1).strip()
        if raw.startswith("["):
            try:
                tc["playbooks_adicionais"] = yaml.safe_load(raw) or []
            except yaml.YAMLError:
                tc["playbooks_adicionais"] = []
        elif raw:
            tc["playbooks_adicionais"] = [s.strip() for s in raw.split(",") if s.strip()]

    # ### Objetivo
    obj_m = re.search(
        r"^###\s+Objetivo\s*\n(.+?)(?=\n###\s|\Z)",
        body,
        re.DOTALL | re.MULTILINE,
    )
    if obj_m:
        tc["objective"] = obj_m.group(1).strip()

    # ### Passos
    steps_m = re.search(
        r"^###\s+Passos\s*\n(.+?)(?=\n###\s|\Z)",
        body,
        re.DOTALL | re.MULTILINE,
    )
    if steps_m:
        steps_text = steps_m.group(1).strip()
        tc["steps"] = _parse_steps(steps_text)

    if not tc["steps"]:
        raise ValueError(
            f"TC{tc_num} ({title!r}) não tem nenhum passo válido. Cada passo precisa do formato "
            "'N. <ação>\\n   → <resultado>'"
        )

    return tc


def _parse_steps(text: str) -> list[dict[str, str]]:
    """
    Parseia bloco de passos no formato:

        1. Clicar no botão "Salvar"
           → Toast exibida: "Salvo com sucesso"
        2. ...
    """
    steps: list[dict[str, str]] = []
    # Padrão: linha "N. <ação>" seguida de linha indentada começando com →
    pattern = re.compile(
        r"^(\d+)\.\s+(.+?)\n\s+→\s+(.+?)(?=\n\d+\.\s|\Z)",
        re.DOTALL | re.MULTILINE,
    )
    for m in pattern.finditer(text):
        action = re.sub(r"\s+", " ", m.group(2)).strip()
        expected = re.sub(r"\s+", " ", m.group(3)).strip()
        steps.append({"action": action, "expected": expected})
    return steps


def _parse_suites(rest: str) -> list[dict[str, Any]]:
    """
    Parseia múltiplas suítes do corpo restante. Cada suíte começa com bloco
    YAML --- ... --- contendo `suite:`, `executor:`, etc.
    """
    suites: list[dict[str, Any]] = []
    # Divide por blocos de frontmatter de suíte
    # Padrão: --- (newline) ... (newline) --- delimitam o frontmatter
    fm_pattern = re.compile(r"^---\s*\n(.*?)\n---\s*$", re.DOTALL | re.MULTILINE)

    positions = []
    for m in fm_pattern.finditer(rest):
        positions.append((m.start(), m.end(), m.group(1)))

    for idx, (start, end, fm_text) in enumerate(positions):
        # Corpo da suíte: do fim deste FM até o início do próximo FM (ou fim)
        body_start = end
        body_end = positions[idx + 1][0] if idx + 1 < len(positions) else len(rest)
        suite_body = rest[body_start:body_end].strip()

        try:
            suite_fm = _parse_frontmatter_block(fm_text)
        except ValueError as e:
            raise ValueError(f"Suíte #{idx + 1}: frontmatter inválido: {e}") from e

        if "suite" not in suite_fm:
            raise ValueError(
                f"Suíte #{idx + 1}: frontmatter sem campo obrigatório 'suite'"
            )
        if "executor" not in suite_fm:
            raise ValueError(
                f"Suíte {suite_fm['suite']!r}: frontmatter sem campo obrigatório 'executor'"
            )

        # Parsea TCs
        tcs: list[dict[str, Any]] = []
        tc_pattern = re.compile(r"^## TC\d+", re.MULTILINE)
        tc_positions = [m.start() for m in tc_pattern.finditer(suite_body)]
        for ti, tc_start in enumerate(tc_positions):
            tc_end = tc_positions[ti + 1] if ti + 1 < len(tc_positions) else len(suite_body)
            tc_block = suite_body[tc_start:tc_end]
            tc = _parse_test_case_block(tc_block, ti + 1)
            tcs.append(tc)

        if not tcs:
            raise ValueError(f"Suíte {suite_fm['suite']!r}: nenhum TC encontrado")

        suites.append({"frontmatter": suite_fm, "test_cases": tcs})

    if not suites:
        raise ValueError(
            "Nenhuma suíte encontrada no MD canônico. Cada suíte deve ter bloco "
            "YAML --- ... --- com `suite:` e `executor:`."
        )

    return suites


def parse_canonical_md(path: str | Path) -> dict[str, Any]:
    """
    Entrada principal. Parseia um arquivo MD canônico e retorna o dict
    estruturado descrito no docstring do módulo.
    """
    md = Path(path).read_text(encoding="utf-8")
    project_fm, rest = _split_top_level_frontmatter(md)

    required = {"contract_version", "at_version", "project", "project_name", "generated_at", "env"}
    missing = required - set(project_fm.keys())
    if missing:
        raise ValueError(
            f"Frontmatter de projeto sem campos obrigatórios: {sorted(missing)}"
        )

    catalogs, suites_region = _extract_catalog_sections(rest)
    suites = _parse_suites(suites_region)

    return {
        "project_frontmatter": project_fm,
        "catalogs": catalogs,
        "suites": suites,
    }


def priority_to_xmind_marker(priority: str) -> str:
    """Mapeia critical/high/medium/low → priority-1/2/3."""
    return f"priority-{_PRIORITY_MAP.get(priority.lower(), 2)}"


def priority_to_testlink_importance(priority: str) -> int:
    """Mapeia critical/high/medium/low → 3/2/1 (TestLink importance)."""
    return {1: 3, 2: 2, 3: 1}.get(_PRIORITY_MAP.get(priority.lower(), 2), 2)


def preconditions_as_text(preconditions: list[str] | str | None) -> str:
    """
    Normaliza pré-condições (lista YAML ou string) numa string com
    quebras de linha para uso na nota do XMind e no <preconditions> XML.
    """
    if not preconditions:
        return ""
    if isinstance(preconditions, str):
        return preconditions.strip()
    return "\n".join(str(p).strip() for p in preconditions if str(p).strip())


def cli() -> None:
    """CLI simples para debug — imprime o dict parseado em JSON."""
    import json

    if len(sys.argv) < 2:
        print("Uso: python md_canonical_parser.py <test-analysis.md>", file=sys.stderr)
        sys.exit(1)
    data = parse_canonical_md(sys.argv[1])
    print(json.dumps(data, indent=2, ensure_ascii=False, default=str))


if __name__ == "__main__":
    cli()
