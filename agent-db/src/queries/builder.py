"""db-query-builder — converte caso de teste declarativo em SQL parametrizado.

Implementa a responsabilidade da skill ``db-query-builder``: nunca devolve SQL
com valores inline; sempre ``text()`` + ``bindparams`` nomeados. Passa o SQL
final pelo read-only guard antes de devolver.

Identificadores (nome de tabela/coluna) NÃO podem ser bindados por driver SQL —
então são validados contra um regex estrito de identificador antes de entrar na
string. Valores SEMPRE vão por bindparam.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import bindparam, text
from sqlalchemy.sql.elements import TextClause

from ..connections.readonly_guard import assert_read_only

# Identificador SQL seguro: tabela/coluna. Bloqueia injeção via nome de objeto.
_IDENTIFIER = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


class QueryBuildError(ValueError):
    """Erro ao montar a query a partir do caso de teste declarativo."""


def _safe_identifier(name: str, kind: str) -> str:
    if not isinstance(name, str) or not _IDENTIFIER.match(name):
        raise QueryBuildError(
            f"{kind} inválido: {name!r}. Esperado identificador [A-Za-z_][A-Za-z0-9_]*."
        )
    return name


@dataclass
class BuiltQuery:
    """Resultado do builder: SQL parametrizado pronto para o executor.

    Atributos:
        sql: ``TextClause`` SQLAlchemy (parametrizado, read-only validado).
        params: dict de bindparams (valores).
        mode: ``single`` (default) ou ``batch`` (keyset pagination — futuro).
        raw_sql: snapshot textual do SQL para evidência/replay.
    """

    sql: TextClause
    params: dict[str, Any] = field(default_factory=dict)
    mode: str = "single"
    raw_sql: str = ""


def _bind(raw_sql: str, params: dict[str, Any], mode: str = "single") -> BuiltQuery:
    """Valida read-only, monta o ``text()`` e amarra os bindparams nomeados."""
    assert_read_only(raw_sql)
    clause = text(raw_sql)
    if params:
        clause = clause.bindparams(*(bindparam(k) for k in params))
    return BuiltQuery(sql=clause, params=dict(params), mode=mode, raw_sql=raw_sql.strip())


def _build_where(filters: dict[str, Any]) -> tuple[str, dict[str, Any]]:
    """Constrói a cláusula WHERE com colunas validadas e valores em bindparams."""
    if not filters:
        return "", {}
    clauses: list[str] = []
    params: dict[str, Any] = {}
    for column, value in filters.items():
        col = _safe_identifier(column, "Coluna de filtro")
        param_name = f"f_{col}"
        clauses.append(f"`{col}` = :{param_name}")
        params[param_name] = value
    return " WHERE " + " AND ".join(clauses), params


def build_count(table: str, where: dict[str, Any] | None = None) -> BuiltQuery:
    """``SELECT COUNT(*)`` em ``table`` com filtros opcionais (count/presence/absence)."""
    tbl = _safe_identifier(table, "Tabela")
    where_sql, params = _build_where(where or {})
    raw = f"SELECT COUNT(*) AS total FROM `{tbl}`{where_sql}"
    return _bind(raw, params)


def build_select_columns(
    table: str,
    columns: list[str],
    where: dict[str, Any] | None = None,
    limit: int = 50,
) -> BuiltQuery:
    """``SELECT col, ...`` para inspeção de valores (equals) com LIMIT defensivo."""
    tbl = _safe_identifier(table, "Tabela")
    safe_cols = [_safe_identifier(c, "Coluna") for c in columns]
    if not safe_cols:
        raise QueryBuildError("Nenhuma coluna fornecida para o SELECT.")
    where_sql, params = _build_where(where or {})
    col_list = ", ".join(f"`{c}`" for c in safe_cols)
    if not isinstance(limit, int) or limit <= 0:
        raise QueryBuildError(f"limit inválido: {limit!r}")
    raw = f"SELECT {col_list} FROM `{tbl}`{where_sql} LIMIT {limit}"
    return _bind(raw, params)


def build_view_columns(view_name: str) -> BuiltQuery:
    """Lista colunas de uma view via ``information_schema`` (view_definition)."""
    name = _safe_identifier(view_name, "Nome da view")
    raw = (
        "SELECT COLUMN_NAME AS column_name FROM information_schema.COLUMNS "
        "WHERE TABLE_NAME = :view_name ORDER BY ORDINAL_POSITION"
    )
    return _bind(raw, {"view_name": name})
