"""Validators (db-test-executor): runner + specs + resultados."""

from .result import Report, ValidationResult
from .runner import run_all, run_validation
from .spec import ValidationInput, ValidationSpec

__all__ = [
    "Report",
    "ValidationInput",
    "ValidationResult",
    "ValidationSpec",
    "run_all",
    "run_validation",
]
