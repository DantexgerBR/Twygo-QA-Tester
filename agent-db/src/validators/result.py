"""Modelo de resultado de uma validação (PASS/FAIL/WARN) + report consolidado.

O ``report.json`` é o contrato estável que agentes upstream (AT, Playwright)
consomem. Inclui snapshot da query executada para replay manual (CLAUDE.md §2.5).
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

Status = Literal["PASS", "FAIL", "WARN", "ERROR"]


class ValidationResult(BaseModel):
    """Resultado de uma única validação."""

    id: str
    type: str
    status: Status
    message: str = ""
    expected: Any = None
    actual: Any = None
    query: str = ""
    params: dict[str, Any] = Field(default_factory=dict)
    evidence: list[dict[str, Any]] = Field(default_factory=list)


class Report(BaseModel):
    """Report consolidado de uma execução. Schema versionado para upstream."""

    schema_version: int = 1
    run_id: str
    slug: str
    generated_at: str = Field(
        default_factory=lambda: datetime.now(UTC).isoformat()
    )
    connection: str = "default"
    summary: dict[str, int] = Field(default_factory=dict)
    results: list[ValidationResult] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)

    def compute_summary(self) -> None:
        """Recalcula contagem por status."""
        counts = {"PASS": 0, "FAIL": 0, "WARN": 0, "ERROR": 0}
        for result in self.results:
            counts[result.status] = counts.get(result.status, 0) + 1
        counts["total"] = len(self.results)
        self.summary = counts

    @property
    def passed(self) -> bool:
        """True se nenhuma validação falhou ou errou (WARN não reprova)."""
        return self.summary.get("FAIL", 0) == 0 and self.summary.get("ERROR", 0) == 0
