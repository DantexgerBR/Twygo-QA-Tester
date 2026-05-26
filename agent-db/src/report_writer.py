"""Escrita do report em ``output/{slug}_{ts}/`` (db-report-generator — V1: JSON).

CLAUDE.md §9.10: cada execução grava em pasta nova; NUNCA sobrescreve.
HTML (Jinja2) e CSV de evidência ficam para iteração futura do
db-report-generator — a V1 emite ``report.json`` + ``summary.txt``.
"""

from __future__ import annotations

from pathlib import Path

from .config import AGENT_ROOT
from .utils.logging import get_logger
from .utils.slug import slugify, timestamp_slug
from .validators.result import Report

_logger = get_logger()

DEFAULT_OUTPUT_DIR = AGENT_ROOT / "output"


def _summary_text(report: Report) -> str:
    lines = [
        f"Run: {report.run_id}",
        f"Slug: {report.slug}",
        f"Gerado em: {report.generated_at}",
        f"Conexão: {report.connection}",
        "",
        "Resumo:",
    ]
    for key in ("PASS", "FAIL", "WARN", "ERROR", "total"):
        if key in report.summary:
            lines.append(f"  {key}: {report.summary[key]}")
    lines.append("")
    lines.append(f"Resultado geral: {'PASS' if report.passed else 'FAIL'}")
    lines.append("")
    for result in report.results:
        lines.append(f"  [{result.status}] {result.id} — {result.message}")
    return "\n".join(lines) + "\n"


def write_report(report: Report, output_dir: str | Path | None = None) -> Path:
    """Grava o report numa pasta nova ``{slug}_{ts}/`` e devolve o caminho.

    Se ``output_dir`` for um caminho de arquivo ``.json`` (invocação por
    subprocesso com path absoluto, CONTRACT.md §V2), grava o JSON exatamente ali.
    """
    if output_dir is not None and str(output_dir).lower().endswith(".json"):
        json_path = Path(output_dir)
        json_path.parent.mkdir(parents=True, exist_ok=True)
        json_path.write_text(report.model_dump_json(indent=2), encoding="utf-8")
        _logger.info("Report gravado em %s", json_path)
        return json_path

    base = Path(output_dir) if output_dir is not None else DEFAULT_OUTPUT_DIR
    run_dir = base / f"{slugify(report.slug)}_{timestamp_slug()}"
    run_dir.mkdir(parents=True, exist_ok=False)

    (run_dir / "report.json").write_text(report.model_dump_json(indent=2), encoding="utf-8")
    (run_dir / "summary.txt").write_text(_summary_text(report), encoding="utf-8")
    _logger.info("Report gravado em %s", run_dir)
    return run_dir
