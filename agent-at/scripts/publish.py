"""
Publica o test-analysis.md canônico para a pasta inputs/ do agent-playwright.

CONTRACT.md §3.2 declara que a cópia da AT canônica para
`agent-playwright/projects/<slug>/inputs/test-analysis.md` é o caminho que
consumidores (orchestrator, planner, generator) leem. Sem sincronização, o
canonical fica atualizado em `agent-at/projects/<slug>/output/` mas o consumer
lê versão antiga silenciosamente.

Este script automatiza essa cópia + valida diff antes/depois.

Uso (CLI):
    python publish.py                        # auto-detect (1 projeto)
    python publish.py --project recertificacao
    PROJECT=recertificacao python publish.py
    python publish.py --dry-run              # mostra diff sem copiar

Convenção de descoberta de projeto idêntica aos outros scripts (CLAUDE.md §3.2):
  1. Flag --project <slug>
  2. Variável de ambiente PROJECT=<slug>
  3. Auto-detect se exatamente 1 projeto em agent-at/projects/

Exit codes:
  0 = sucesso (copiado OU já idêntico)
  1 = erro (canonical não existe, destino não-existe, projeto ambíguo, etc.)
"""

from __future__ import annotations

import argparse
import difflib
import os
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
AT_PROJECTS = REPO_ROOT / "agent-at" / "projects"
PW_PROJECTS = REPO_ROOT / "agent-playwright" / "projects"


def discover_project(cli_slug: str | None) -> str:
    """Resolve project slug per CLAUDE.md §3.2 convention."""
    if cli_slug:
        return cli_slug
    env_slug = os.environ.get("PROJECT", "").strip()
    if env_slug:
        return env_slug
    candidates = sorted(
        p.name for p in AT_PROJECTS.iterdir()
        if p.is_dir() and (p / "output" / "test-analysis.md").exists()
    )
    if len(candidates) == 1:
        return candidates[0]
    if not candidates:
        raise SystemExit(
            "Nenhum projeto encontrado em agent-at/projects/<slug>/output/test-analysis.md"
        )
    raise SystemExit(
        f"Múltiplos projetos disponíveis: {', '.join(candidates)}. "
        "Use --project <slug> ou PROJECT=<slug>."
    )


def diff_summary(src: str, dst: str, src_path: Path, dst_path: Path) -> tuple[int, int, list[str]]:
    """Retorna (added, removed, sample_lines) para mostrar resumo do que muda."""
    src_lines = src.splitlines(keepends=False)
    dst_lines = dst.splitlines(keepends=False)
    diff = list(difflib.unified_diff(
        dst_lines, src_lines,
        fromfile=str(dst_path.name) + " (consumer atual)",
        tofile=str(src_path.name) + " (canonical)",
        lineterm="",
        n=0,
    ))
    added = sum(1 for ln in diff if ln.startswith("+") and not ln.startswith("+++"))
    removed = sum(1 for ln in diff if ln.startswith("-") and not ln.startswith("---"))
    return added, removed, diff[:30]


def main() -> int:
    parser = argparse.ArgumentParser(description="Publica test-analysis.md canônico para agent-playwright/inputs.")
    parser.add_argument("--project", default=None, help="Slug do projeto (default: auto-detect ou $PROJECT).")
    parser.add_argument("--dry-run", action="store_true", help="Mostra diff sem copiar.")
    args = parser.parse_args()

    slug = discover_project(args.project)

    src = AT_PROJECTS / slug / "output" / "test-analysis.md"
    dst_dir = PW_PROJECTS / slug / "inputs"
    dst = dst_dir / "test-analysis.md"

    if not src.exists():
        print(f"[publish] ERRO: canonical não existe em {src}", file=sys.stderr)
        return 1
    if not dst_dir.exists():
        print(f"[publish] ERRO: pasta destino não existe em {dst_dir}", file=sys.stderr)
        return 1

    src_text = src.read_text(encoding="utf-8")
    dst_text = dst.read_text(encoding="utf-8") if dst.exists() else ""

    if src_text == dst_text:
        print(f"[publish] no-op: {dst} já idêntico ao canonical")
        return 0

    added, removed, sample = diff_summary(src_text, dst_text, src, dst)
    print(f"[publish] projeto: {slug}")
    print(f"[publish] origem:  {src.relative_to(REPO_ROOT)}")
    print(f"[publish] destino: {dst.relative_to(REPO_ROOT)}")
    print(f"[publish] diff:    +{added} / -{removed}")
    if sample:
        print("[publish] amostra do diff (primeiras 30 linhas):")
        for ln in sample:
            print(f"  {ln}")

    if args.dry_run:
        print("[publish] --dry-run: nada copiado.")
        return 0

    shutil.copy2(src, dst)
    print(f"[publish] OK — copiado.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
