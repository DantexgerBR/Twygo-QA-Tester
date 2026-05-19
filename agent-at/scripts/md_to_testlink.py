"""
Gera .xml TestLink a partir do MD canônico (test-analysis.md).

Lê o MD via md_canonical_parser e renderiza usando template Jinja2
(`testlink.xml.j2`). O XML segue o schema TestLink padrão:

    <testsuite name="">
      <testsuite name="<suite-name>">
        <testcase name="...">
          <summary>...</summary>
          <preconditions>...</preconditions>
          <execution_type>1|2</execution_type>
          <importance>1|2|3</importance>
          <steps>
            <step>
              <step_number>1</step_number>
              <actions>...</actions>
              <expectedresults>...</expectedresults>
              <execution_type>1|2</execution_type>
            </step>
          </steps>
        </testcase>
      </testsuite>
    </testsuite>

Compatível com TestLink import (validado em CONTRACT.md §8.3).

Uso (CLI):
    python md_to_testlink.py <input-md> <output-xml> [--template <path>]
"""

import argparse
import sys
from pathlib import Path

try:
    from jinja2 import Environment, FileSystemLoader, select_autoescape
except ImportError as e:
    print(
        "Erro: jinja2 não instalado. Rode: pip install jinja2",
        file=sys.stderr,
    )
    raise SystemExit(1) from e

from md_canonical_parser import (
    parse_canonical_md,
    priority_to_testlink_importance,
    preconditions_as_text,
)


def _suite_preconditions(suite: dict) -> str:
    fm = suite["frontmatter"]
    return preconditions_as_text(fm.get("preconditions"))


def _tc_importance(tc: dict) -> int:
    return priority_to_testlink_importance(tc.get("priority", "medium"))


def render_testlink_xml(parsed: dict, template_dir: Path) -> str:
    env = Environment(
        loader=FileSystemLoader(str(template_dir)),
        autoescape=select_autoescape(default_for_string=False),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    template = env.get_template("testlink.xml.j2")
    return template.render(
        suites=parsed["suites"],
        suite_preconditions=_suite_preconditions,
        tc_importance=_tc_importance,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Gera XML TestLink a partir do MD canônico.")
    parser.add_argument("input_md", help="Caminho para test-analysis.md")
    parser.add_argument("output_xml", help="Caminho do .xml TestLink a gerar")
    parser.add_argument(
        "--template",
        default=None,
        help="Pasta com testlink.xml.j2 (default: pasta deste script)",
    )
    args = parser.parse_args()

    input_md = Path(args.input_md).resolve()
    output_xml = Path(args.output_xml).resolve()

    template_dir = Path(args.template).resolve() if args.template else Path(__file__).resolve().parent

    parsed = parse_canonical_md(input_md)
    xml = render_testlink_xml(parsed, template_dir)

    output_xml.parent.mkdir(parents=True, exist_ok=True)
    output_xml.write_text(xml, encoding="utf-8")

    suites_count = len(parsed["suites"])
    tcs_count = sum(len(s["test_cases"]) for s in parsed["suites"])
    print(
        f"XML TestLink gerado: {output_xml}\n"
        f"  {suites_count} suíte(s), {tcs_count} caso(s) de teste"
    )


if __name__ == "__main__":
    try:
        main()
    except (FileNotFoundError, ValueError) as e:
        print(f"Erro: {e}", file=sys.stderr)
        sys.exit(1)
