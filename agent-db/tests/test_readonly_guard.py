"""Testes do read-only guard — a peça de segurança mais crítica."""

import pytest
from src.connections.readonly_guard import MutationError, assert_read_only


@pytest.mark.parametrize(
    "sql",
    [
        "SELECT COUNT(*) FROM ai_indexing_logs",
        "select id from panels where id = :id",
        "WITH x AS (SELECT 1) SELECT * FROM x",
        "SHOW TABLES",
        "EXPLAIN SELECT 1",
        "SELECT 1;",  # terminador final tolerado
        "  SELECT 1  ",  # espaços ao redor
    ],
)
def test_read_only_queries_pass(sql):
    assert_read_only(sql)  # não levanta


@pytest.mark.parametrize(
    "sql",
    [
        "INSERT INTO panels (name) VALUES ('x')",
        "UPDATE panels SET status = 'active'",
        "DELETE FROM panels",
        "DROP TABLE panels",
        "TRUNCATE panels",
        "ALTER TABLE panels ADD COLUMN x INT",
        "SET SESSION foo = 1",
        "SELECT 1; DROP TABLE panels",  # múltiplos statements
        "SELECT 1; SELECT 2",  # múltiplos selects
        "",  # vazio
        "GRANT ALL ON *.* TO 'x'",
    ],
)
def test_mutation_queries_blocked(sql):
    with pytest.raises(MutationError):
        assert_read_only(sql)


def test_comment_smuggling_blocked():
    # Tentativa de esconder DELETE atrás de comentário não engana o guard.
    with pytest.raises(MutationError):
        assert_read_only("SELECT 1 /* */ ; DELETE FROM panels")
