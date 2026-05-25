"""
Gera .xmind a partir do MD canônico (test-analysis.md).

Lê o MD via md_canonical_parser, monta a estrutura content.json do XMind
(mesmo formato do generate_xmind.py legado) e empacota usando o template
em template/template.xmind como base.

Uso (CLI):
    python md_to_xmind.py <input-md> <output-xmind> [--template <path>]

Default do template: <repo>/agent-at/template/template.xmind
"""

import argparse
import json
import shutil
import sys
import uuid
import zipfile
from pathlib import Path

from md_canonical_parser import (
    parse_canonical_md,
    priority_to_xmind_marker,
    preconditions_as_text,
)


def _gid() -> str:
    return uuid.uuid4().hex[:24]


def _topic(
    title: str,
    note: str | None = None,
    children: list[dict] | None = None,
    markers: list[dict] | None = None,
) -> dict:
    t = {
        "id": _gid(),
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


def _step_topic(action: str, expected: str) -> dict:
    return _topic(action, children=[_topic(expected)])


def _tc_topic(tc: dict, suite_preconditions: str) -> dict:
    objective = tc.get("objective", "").strip() or tc["title"]
    note_parts = [objective]
    if suite_preconditions:
        note_parts.append("[PRECONDITIONS]")
        note_parts.append(suite_preconditions)
    note = "\n".join(note_parts)

    marker = [{"markerId": priority_to_xmind_marker(tc["priority"])}]
    steps = [_step_topic(s["action"], s["expected"]) for s in tc["steps"]]

    return _topic(tc["title"], note=note, children=steps, markers=marker)


def _suite_topic(suite: dict) -> dict:
    fm = suite["frontmatter"]
    suite_pre = preconditions_as_text(fm.get("preconditions"))
    tcs = [_tc_topic(tc, suite_pre) for tc in suite["test_cases"]]
    return _topic(fm["suite"], children=tcs)


def build_xmind_content(parsed: dict) -> list[dict]:
    """Constrói o content.json (lista de sheets) do XMind."""
    project_name = parsed["project_frontmatter"]["project_name"]
    suites = [_suite_topic(s) for s in parsed["suites"]]
    root = _topic(f"Análise de Teste - {project_name}", children=suites)

    sheet = {
        "id": _gid(),
        "class": "sheet",
        "title": "Folha 1",
        "rootTopic": root,
    }
    return [sheet]


def write_xmind(content: list[dict], template_path: Path, output_path: Path) -> None:
    """
    Copia o template.xmind, substitui content.json, mantém metadata.json e
    demais arquivos internos.
    """
    if not template_path.exists():
        raise FileNotFoundError(f"Template não encontrado: {template_path}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    # Copia template como base
    shutil.copyfile(template_path, output_path)

    # Substitui content.json sem mexer no resto
    # Estratégia: extrai tudo, sobrescreve content.json, re-empacota
    tmp_dir = output_path.with_suffix(".tmp_unpack")
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)
    tmp_dir.mkdir()

    try:
        with zipfile.ZipFile(output_path, "r") as zf:
            zf.extractall(tmp_dir)

        (tmp_dir / "content.json").write_text(
            json.dumps(content, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )

        # Re-empacota
        output_path.unlink()
        with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for path in tmp_dir.rglob("*"):
                if path.is_file():
                    zf.write(path, path.relative_to(tmp_dir))
    finally:
        if tmp_dir.exists():
            shutil.rmtree(tmp_dir)


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera .xmind a partir do MD canônico.")
    parser.add_argument("input_md", help="Caminho para test-analysis.md")
    parser.add_argument("output_xmind", help="Caminho do .xmind a gerar")
    parser.add_argument(
        "--template",
        default=None,
        help="Caminho do template .xmind (default: <repo>/agent-at/template/template.xmind)",
    )
    args = parser.parse_args()

    input_md = Path(args.input_md).resolve()
    output_xmind = Path(args.output_xmind).resolve()

    if args.template:
        template_path = Path(args.template).resolve()
    else:
        # Resolve relativo a este script: agent-at/scripts/md_to_xmind.py → agent-at/template/template.xmind
        template_path = Path(__file__).resolve().parent.parent / "template" / "template.xmind"

    parsed = parse_canonical_md(input_md)
    content = build_xmind_content(parsed)
    write_xmind(content, template_path, output_xmind)

    suites_count = len(parsed["suites"])
    tcs_count = sum(len(s["test_cases"]) for s in parsed["suites"])
    print(
        f"XMind gerado: {output_xmind}\n"
        f"  {suites_count} suíte(s), {tcs_count} caso(s) de teste"
    )


if __name__ == "__main__":
    try:
        main()
    except (FileNotFoundError, ValueError) as e:
        print(f"Erro: {e}", file=sys.stderr)
        sys.exit(1)
