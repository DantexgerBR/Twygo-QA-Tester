"""db-test-executor — runner read-only que aplica validações e coleta métricas.

Para cada ``ValidationSpec``, monta a query parametrizada (db-query-builder),
executa em modo read-only e aplica a regra (count/presence/absence/equals),
devolvendo um ``ValidationResult`` PASS/FAIL/WARN/ERROR.

Tipos ainda não implementados (compare_orgs, view_definition parcial,
fk_integrity, time_window) retornam WARN com marcador ``// REVISAR`` em vez de
chutar (CLAUDE.md §9.7: não inventar query).
"""

from __future__ import annotations

from typing import Any

from sqlalchemy import Engine

from ..queries.builder import (
    BuiltQuery,
    QueryBuildError,
    build_count,
    build_select_columns,
    build_view_columns,
)
from ..utils.logging import get_logger
from .result import Report, ValidationResult
from .spec import ValidationInput, ValidationSpec

_logger = get_logger()

_NOT_IMPLEMENTED = {"compare_orgs", "fk_integrity", "time_window"}


def _execute_scalar(engine: Engine, built: BuiltQuery) -> Any:
    with engine.connect() as conn:
        return conn.execute(built.sql, built.params).scalar()


def _execute_rows(engine: Engine, built: BuiltQuery) -> list[dict[str, Any]]:
    with engine.connect() as conn:
        result = conn.execute(built.sql, built.params)
        return [dict(row) for row in result.mappings()]


def _require_table(spec: ValidationSpec) -> str:
    if not spec.table:
        raise QueryBuildError(f"Validação '{spec.id}' do tipo '{spec.type}' exige 'table'.")
    return spec.table


def _validate_count(engine: Engine, spec: ValidationSpec) -> ValidationResult:
    built = build_count(_require_table(spec), spec.where)
    actual = int(_execute_scalar(engine, built) or 0)
    expected = spec.expect.get("count")
    if expected is None:
        status, message = "WARN", "expect.count ausente — não há critério para count."
    elif actual == expected:
        status, message = "PASS", f"Contagem {actual} == esperado {expected}."
    else:
        status, message = "FAIL", f"Contagem {actual} != esperado {expected}."
    return ValidationResult(
        id=spec.id,
        type=spec.type,
        status=status,
        message=message,
        expected=expected,
        actual=actual,
        query=built.raw_sql,
        params=built.params,
    )


def _validate_presence(
    engine: Engine, spec: ValidationSpec, *, expect_present: bool
) -> ValidationResult:
    built = build_count(_require_table(spec), spec.where)
    actual = int(_execute_scalar(engine, built) or 0)
    present = actual > 0
    ok = present is expect_present
    label = "presença" if expect_present else "ausência"
    status = "PASS" if ok else "FAIL"
    message = f"Esperado {label}; encontrou {actual} registro(s)."
    return ValidationResult(
        id=spec.id,
        type=spec.type,
        status=status,
        message=message,
        expected=">0" if expect_present else "0",
        actual=actual,
        query=built.raw_sql,
        params=built.params,
    )


def _validate_equals(engine: Engine, spec: ValidationSpec) -> ValidationResult:
    if not spec.column:
        raise QueryBuildError(f"Validação '{spec.id}' do tipo 'equals' exige 'column'.")
    expected = spec.expect.get("value")
    built = build_select_columns(_require_table(spec), [spec.column], spec.where, limit=50)
    rows = _execute_rows(engine, built)
    actual_values = [row.get(spec.column) for row in rows]
    if not actual_values:
        status, message = "FAIL", "Nenhum registro encontrado para comparar."
    elif all(v == expected for v in actual_values):
        status, message = "PASS", f"Todos os {len(actual_values)} registro(s) com {spec.column}={expected!r}."
    else:
        status, message = "FAIL", f"Valores divergentes em {spec.column}: {actual_values}."
    return ValidationResult(
        id=spec.id,
        type=spec.type,
        status=status,
        message=message,
        expected=expected,
        actual=actual_values,
        query=built.raw_sql,
        params=built.params,
        evidence=rows[:50],
    )


def _validate_view_definition(engine: Engine, spec: ValidationSpec) -> ValidationResult:
    view = spec.table or spec.expect.get("view")
    if not view:
        raise QueryBuildError(f"Validação '{spec.id}' do tipo 'view_definition' exige 'table'/'view'.")
    expected_cols = spec.expect.get("columns", [])
    built = build_view_columns(view)
    rows = _execute_rows(engine, built)
    actual_cols = [row.get("column_name") for row in rows]
    if not actual_cols:
        status, message = "FAIL", f"View/objeto '{view}' não encontrado ou sem colunas."
    else:
        missing = [c for c in expected_cols if c not in actual_cols]
        if missing:
            status, message = "FAIL", f"Colunas ausentes na view '{view}': {missing}."
        else:
            status, message = "PASS", f"View '{view}' expõe todas as colunas esperadas."
    return ValidationResult(
        id=spec.id,
        type=spec.type,
        status=status,
        message=message,
        expected=expected_cols,
        actual=actual_cols,
        query=built.raw_sql,
        params=built.params,
    )


def run_validation(engine: Engine, spec: ValidationSpec) -> ValidationResult:
    """Despacha uma validação para o handler do seu tipo."""
    try:
        if spec.type == "count":
            return _validate_count(engine, spec)
        if spec.type == "presence":
            return _validate_presence(engine, spec, expect_present=True)
        if spec.type == "absence":
            return _validate_presence(engine, spec, expect_present=False)
        if spec.type == "equals":
            return _validate_equals(engine, spec)
        if spec.type == "view_definition":
            return _validate_view_definition(engine, spec)
        if spec.type in _NOT_IMPLEMENTED:
            return ValidationResult(
                id=spec.id,
                type=spec.type,
                status="WARN",
                message=f"// REVISAR — tipo '{spec.type}' ainda não implementado na V1.",
            )
        return ValidationResult(
            id=spec.id,
            type=spec.type,
            status="ERROR",
            message=f"Tipo de validação desconhecido: {spec.type}.",
        )
    except Exception as exc:  # noqa: BLE001 - converte qualquer falha em ERROR estruturado
        _logger.exception("Falha ao executar validação '%s'", spec.id)
        return ValidationResult(
            id=spec.id,
            type=spec.type,
            status="ERROR",
            message=f"{type(exc).__name__}: {exc}",
        )


def run_all(
    engine: Engine, validation_input: ValidationInput, run_id: str, *, fail_fast: bool = False
) -> Report:
    """Executa todas as validações do input e devolve o report consolidado."""
    report = Report(run_id=run_id, slug=validation_input.slug, connection=validation_input.connection)
    for spec in validation_input.validations:
        result = run_validation(engine, spec)
        report.results.append(result)
        _logger.info("[%s] %s — %s", result.status, result.id, result.message)
        if fail_fast and result.status in ("FAIL", "ERROR"):
            report.errors.append(f"fail_fast acionado em '{result.id}'.")
            break
    report.compute_summary()
    return report
