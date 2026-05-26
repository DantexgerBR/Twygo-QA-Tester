"""Logging com `rich`, com fallback para o logging padrão.

Regra dura: logs NUNCA ecoam senha. Quem precisa logar uma DSN deve passá-la
por ``mask_dsn`` (em ``utils.env``) antes.
"""

from __future__ import annotations

import logging

try:
    from rich.logging import RichHandler

    _HAS_RICH = True
except ImportError:  # pragma: no cover - rich é dependência declarada
    _HAS_RICH = False


_CONFIGURED = False


def get_logger(name: str = "agent_db", level: int = logging.INFO) -> logging.Logger:
    """Devolve um logger configurado uma única vez por processo."""
    global _CONFIGURED
    logger = logging.getLogger(name)

    if not _CONFIGURED:
        if _HAS_RICH:
            handler: logging.Handler = RichHandler(
                rich_tracebacks=True, show_path=False, markup=False
            )
            fmt = "%(message)s"
        else:
            handler = logging.StreamHandler()
            fmt = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        handler.setFormatter(logging.Formatter(fmt))
        root = logging.getLogger("agent_db")
        root.handlers.clear()
        root.addHandler(handler)
        root.setLevel(level)
        root.propagate = False
        _CONFIGURED = True

    logger.setLevel(level)
    return logger
