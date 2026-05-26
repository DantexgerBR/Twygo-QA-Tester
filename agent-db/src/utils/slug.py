"""Slug e timestamp para nomear pastas de output (``output/{slug}_{ts}/``)."""

from __future__ import annotations

import re
import unicodedata
from datetime import UTC, datetime


def slugify(text: str) -> str:
    """Converte texto livre em slug seguro para nome de pasta/arquivo.

    Lowercase, sem acentos, hífens no lugar de espaços/símbolos.
    """
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text)
    return ascii_text.strip("-") or "run"


def timestamp_slug(moment: datetime | None = None) -> str:
    """Timestamp UTC compacto para sufixar pastas de output (sem ``:`` — Windows)."""
    moment = moment or datetime.now(UTC)
    return moment.strftime("%Y%m%dT%H%M%SZ")
