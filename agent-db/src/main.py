"""CLI do agent-db — executa validações read-only de banco.

Uso (de dentro de ``agent-db/``):

    # validação a partir de um arquivo de validações .yaml/.json
    python -m src.main --input inputs/example.validation.yaml

    # validar apenas a conexão (fase Init — SELECT 1)
    python -m src.main --check-connection

    # gravar o report num path explícito (invocação por subprocesso, CONTRACT §V2)
    python -m src.main --input <in.yaml> --output outputs/<runId>/report.json

Exit codes: 0 = todas as validações PASS/WARN; 1 = houve FAIL/ERROR;
2 = erro de uso/configuração.
"""

from __future__ import annotations

import argparse
import sys
import uuid

from .config import load_config
from .connections.engine import create_readonly_engine, ping
from .loader import load_validation_input
from .report_writer import write_report
from .utils.env import MissingEnvVarError, load_env
from .utils.logging import get_logger
from .validators.runner import run_all

_logger = get_logger()


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="agent-db",
        description="Executor de validações read-only em banco (Twygo QA).",
    )
    parser.add_argument(
        "--input",
        "-i",
        help="Caminho do arquivo de validações (.yaml/.json) ou MD canônico (.md, futuro).",
    )
    parser.add_argument(
        "--output",
        "-o",
        help="Pasta base de output ou caminho .json explícito. Default: output/{slug}_{ts}/.",
    )
    parser.add_argument(
        "--config",
        "-c",
        help="Caminho do database.config.yaml. Default: config/ com fallback ao .example.",
    )
    parser.add_argument(
        "--connection",
        default=None,
        help="Nome da conexão a usar (sobrescreve a do input). Default: a do input ou 'default'.",
    )
    parser.add_argument(
        "--check-connection",
        action="store_true",
        help="Apenas valida a conexão (SELECT 1) e sai.",
    )
    parser.add_argument(
        "--fail-fast",
        action="store_true",
        help="Para na primeira validação FAIL/ERROR.",
    )
    return parser


def _run(args: argparse.Namespace) -> int:
    load_env()
    config = load_config(args.config)

    # --check-connection: valida a conexão default (ou --connection) e sai.
    if args.check_connection:
        conn_name = args.connection or "default"
        engine = create_readonly_engine(config.connection(conn_name))
        ok = ping(engine)
        _logger.info("Conexão '%s': %s", conn_name, "OK" if ok else "FALHOU")
        return 0 if ok else 1

    if not args.input:
        _logger.error("Faltou --input (ou use --check-connection). Veja --help.")
        return 2

    validation_input = load_validation_input(args.input)
    conn_name = args.connection or validation_input.connection
    validation_input.connection = conn_name

    engine = create_readonly_engine(config.connection(conn_name))
    if not ping(engine):
        _logger.error("Não foi possível validar a conexão '%s' (SELECT 1 falhou).", conn_name)
        return 1

    run_id = uuid.uuid4().hex[:12]
    report = run_all(
        engine,
        validation_input,
        run_id=run_id,
        fail_fast=args.fail_fast or config.defaults.fail_fast,
    )

    out_path = write_report(report, args.output)
    _logger.info(
        "Concluído: %s | resultado geral %s | %s",
        report.summary,
        "PASS" if report.passed else "FAIL",
        out_path,
    )
    return 0 if report.passed else 1


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)
    try:
        return _run(args)
    except NotImplementedError as exc:
        _logger.error(str(exc))
        return 2
    except MissingEnvVarError as exc:
        _logger.error(str(exc))
        return 2
    except (FileNotFoundError, KeyError, ValueError) as exc:
        _logger.error("%s: %s", type(exc).__name__, exc)
        return 2


if __name__ == "__main__":
    sys.exit(main())
