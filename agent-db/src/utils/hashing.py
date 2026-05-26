"""Hash determinístico de linhas para comparação sem materializar todos os bytes.

CLAUDE.md §2.5: comparações de registros usam SHA-256 das colunas relevantes
(``strict_equal``) para detectar divergência.
"""

from __future__ import annotations

import hashlib
import json
from collections.abc import Mapping
from typing import Any


def row_hash(row: Mapping[str, Any]) -> str:
    """SHA-256 hex de uma linha (dict coluna->valor), determinístico.

    Ordena as chaves e serializa em JSON canônico para que a mesma linha
    sempre produza o mesmo hash, independente da ordem das colunas.
    """
    canonical = json.dumps(dict(row), sort_keys=True, default=str, ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()
