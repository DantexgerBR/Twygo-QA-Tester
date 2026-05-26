"""Schema do input de validações (caso de teste de banco declarativo).

Para a V1 do agent-db, o input canônico é um arquivo YAML/JSON com uma lista de
validações. O parse do MD canônico do agent-at (CONTRACT.md §V2) está previsto
mas ainda NÃO implementado — ver ``inputs/loader.py``.

Schema (YAML):

    slug: creditos-fase02-logs-indexacao   # opcional; usado no nome do output
    connection: default                    # opcional; conexão nomeada
    validations:
      - id: log-presente
        type: presence
        table: ai_indexing_logs
        where: { organization_id: 36675, status: completed }
      - id: um-log-por-execucao
        type: count
        table: ai_indexing_logs
        where: { organization_id: 36675 }
        expect: { count: 1 }
      - id: status-completed
        type: equals
        table: ai_indexing_logs
        column: status
        where: { organization_id: 36675 }
        expect: { value: completed }
"""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

ValidationType = Literal[
    "count",
    "presence",
    "absence",
    "equals",
    "compare_orgs",
    "view_definition",
    "fk_integrity",
    "time_window",
]


class ValidationSpec(BaseModel):
    """Uma validação declarativa de banco."""

    id: str
    type: ValidationType
    table: str | None = None
    column: str | None = None
    where: dict[str, Any] = Field(default_factory=dict)
    expect: dict[str, Any] = Field(default_factory=dict)
    description: str = ""


class ValidationInput(BaseModel):
    """Arquivo de input completo: metadados + lista de validações."""

    slug: str = "db-validation"
    connection: str = "default"
    validations: list[ValidationSpec]
