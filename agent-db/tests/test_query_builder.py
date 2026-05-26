"""Testes do query builder — garante parametrização e bloqueio de injeção."""

import pytest
from src.queries.builder import (
    QueryBuildError,
    build_count,
    build_select_columns,
    build_view_columns,
)


def test_build_count_no_filter():
    q = build_count("ai_indexing_logs")
    assert q.raw_sql == "SELECT COUNT(*) AS total FROM `ai_indexing_logs`"
    assert q.params == {}


def test_build_count_with_filters_uses_bindparams():
    q = build_count("ai_indexing_logs", {"organization_id": 36675, "status": "completed"})
    assert ":f_organization_id" in q.raw_sql
    assert ":f_status" in q.raw_sql
    # Valores vão por bindparam — nunca inline na string.
    assert "36675" not in q.raw_sql
    assert "completed" not in q.raw_sql
    assert q.params == {"f_organization_id": 36675, "f_status": "completed"}


def test_build_select_columns_limits():
    q = build_select_columns("panels", ["status"], {"id": 1}, limit=10)
    assert "LIMIT 10" in q.raw_sql
    assert q.params == {"f_id": 1}


def test_build_view_columns():
    q = build_view_columns("vw_consumo_creditos")
    assert "information_schema" in q.raw_sql
    assert q.params == {"view_name": "vw_consumo_creditos"}


@pytest.mark.parametrize(
    "bad_table",
    [
        "panels; DROP TABLE x",
        "panels WHERE 1=1",
        "panels`",
        "1panels",
        "",
    ],
)
def test_injection_via_table_name_rejected(bad_table):
    with pytest.raises(QueryBuildError):
        build_count(bad_table)


def test_injection_via_column_name_rejected():
    with pytest.raises(QueryBuildError):
        build_select_columns("panels", ["status; DROP TABLE x"])


def test_empty_columns_rejected():
    with pytest.raises(QueryBuildError):
        build_select_columns("panels", [])
