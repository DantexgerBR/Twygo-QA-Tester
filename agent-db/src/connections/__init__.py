"""Camada de conexão: engine factory read-only + guard de mutação."""

from .engine import build_url, create_readonly_engine, ping
from .readonly_guard import MutationError, assert_read_only

__all__ = [
    "MutationError",
    "assert_read_only",
    "build_url",
    "create_readonly_engine",
    "ping",
]
