"""
Lê integralmente o XML exportado do TestLink e gera data/testlink-full-catalog.json.

Uso (na raiz do repositório API):
  python automation/tools/parse_testlink_xml.py
  python automation/tools/parse_testlink_xml.py --xml caminho/alvo.xml
"""

from __future__ import annotations

import argparse
import html
import json
import re
import unicodedata
import xml.etree.ElementTree as ET
from datetime import UTC, datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_XML = (
    PROJECT_ROOT
    / "test-assets"
    / "testlink"
    / "xml"
    / "AT - API V2 Usuarios - atualizado.xml"
)
OUTPUT_JSON = PROJECT_ROOT / "data" / "testlink-full-catalog.json"

IGNORED_SUITES = frozenset(
    {
        "Feature flag (API V2 Usuários)",
        "Logs",
    }
)


def _norm_text(s: str | None) -> str:
    if not s:
        return ""
    s = html.unescape(" ".join(s.split()).strip())
    return s


def _element_text(el: ET.Element | None) -> str:
    if el is None:
        return ""
    return _norm_text("".join(el.itertext()))


def _slug(s: str, max_len: int = 80) -> str:
    s = s.lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[-\s]+", "_", s).strip("_")
    return s[:max_len] or "case"


def _fold(s: str) -> str:
    """Lowercase e remove acentos para heurísticas de classificação."""
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c)).lower()


def _classify_case(title: str) -> list[str]:
    t = _fold(title)
    tags: list[str] = []
    if "erro" in t or t.strip().startswith("erro -"):
        tags.append("negative")
    if "comparacao" in t or "v1 vs v2" in t:
        tags.append("comparison_v1_v2")
    if "compatibilidade" in t:
        tags.append("v1_compatibility")
    if "performance" in t:
        tags.append("performance")
    if not tags:
        tags.append("positive_or_neutral")
    return tags


def parse_testsuite(suite_el: ET.Element, suite_order: int) -> dict:
    name = suite_el.get("name") or ""
    ignored = name in IGNORED_SUITES
    testcases: list[dict] = []
    for tc_order, tc in enumerate(suite_el.findall("testcase")):
        tc_name = tc.get("name") or ""
        summary_el = tc.find("summary")
        pre_el = tc.find("preconditions")
        steps_el = tc.find("steps")
        steps_out: list[dict] = []
        if steps_el is not None:
            for st in steps_el.findall("step"):
                sn = st.find("step_number")
                steps_out.append(
                    {
                        "step_number": int(sn.text) if sn is not None and sn.text and sn.text.strip().isdigit() else None,
                        "actions": _element_text(st.find("actions")),
                        "expectedresults": _element_text(st.find("expectedresults")),
                    }
                )
            steps_out.sort(key=lambda x: (x["step_number"] is None, x["step_number"] or 0))

        ext_id = f"s{suite_order:02d}_t{tc_order + 1:03d}_{_slug(name, 40)}__{_slug(tc_name, 60)}"
        testcases.append(
            {
                "external_id": ext_id,
                "name": tc_name,
                "order_in_suite": tc_order + 1,
                "summary": _element_text(summary_el),
                "preconditions": _element_text(pre_el),
                "execution_type": _element_text(tc.find("execution_type")),
                "importance": _element_text(tc.find("importance")),
                "steps": steps_out,
                "step_count": len(steps_out),
                "classification_hints": _classify_case(tc_name),
            }
        )

    return {
        "suite_name": name,
        "suite_order": suite_order,
        "ignored_for_automation": ignored,
        "testcase_count": len(testcases),
        "testcases": testcases,
    }


def build_document(xml_path: Path) -> dict:
    tree = ET.parse(xml_path)
    root = tree.getroot()
    if root.tag != "testsuite":
        raise ValueError(f"Raiz esperada <testsuite>, obtida <{root.tag}>")

    child_suites = [c for c in root.findall("testsuite") if (c.get("name") or "").strip()]
    parsed = [parse_testsuite(su, i + 1) for i, su in enumerate(child_suites)]

    active = [s for s in parsed if not s["ignored_for_automation"]]
    ignored = [s for s in parsed if s["ignored_for_automation"]]

    active_tc = sum(s["testcase_count"] for s in active)
    ignored_tc = sum(s["testcase_count"] for s in ignored)
    total_steps = sum(
        len(tc["steps"]) for s in parsed for tc in s["testcases"]
    )

    return {
        "meta": {
            "generated_at": datetime.now(UTC).isoformat(),
            "source_xml": str(xml_path.resolve()),
            "parser": "automation/tools/parse_testlink_xml.py",
            "ignored_suite_names": sorted(IGNORED_SUITES),
            "execution_model_notes": (
                "Execução desejada em três frentes por suíte (ou full): "
                "(1) base — pytest/catalogo alinhado aos casos do XML; "
                "(2) exploratório — variações/dados sintéticos na mesma área funcional; "
                "(3) comparativo — V1 vs V2 onde o caso ou a suíte exigir. "
                "Filtrar por suíte exige o mesmo nome (ou substring acordada) nos três pipelines."
            ),
            "counts": {
                "suites_total": len(parsed),
                "suites_active": len(active),
                "suites_ignored": len(ignored),
                "testcases_total": active_tc + ignored_tc,
                "testcases_active": active_tc,
                "testcases_ignored": ignored_tc,
                "steps_total_all_testcases": total_steps,
            },
        },
        "suites": parsed,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Extrai catálogo completo do XML TestLink.")
    ap.add_argument("--xml", type=Path, default=DEFAULT_XML, help="Caminho do XML exportado")
    ap.add_argument("-o", "--output", type=Path, default=OUTPUT_JSON, help="JSON de saída")
    args = ap.parse_args()
    if not args.xml.exists():
        print(f"Arquivo não encontrado: {args.xml}")
        return 1
    doc = build_document(args.xml)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
    c = doc["meta"]["counts"]
    print(f"Escrito: {args.output}")
    print(
        f"Suítes: {c['suites_total']} (ativas {c['suites_active']}, ignoradas {c['suites_ignored']}) | "
        f"Casos: {c['testcases_total']} (ativos {c['testcases_active']}) | "
        f"Passos (soma): {c['steps_total_all_testcases']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
