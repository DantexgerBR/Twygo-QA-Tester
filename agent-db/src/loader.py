"""Carregamento do arquivo de input de validações.

Aceita:
- ``.yaml`` / ``.yml`` — schema de ``ValidationInput`` (formato canônico da V1).
- ``.json`` — mesmo schema.
- ``.md`` — MD canônico do agent-at (CONTRACT.md §V2). NÃO implementado na V1:
  levanta ``NotImplementedError`` com orientação clara. O parse de validações
  secundárias embutidas no MD será adicionado quando a §V2 do CONTRACT for ativada.
"""

from __future__ import annotations

import json
from pathlib import Path

import yaml

from .validators.spec import ValidationInput


class InputFormatError(ValueError):
    """Formato de input não suportado ou malformado."""


def load_validation_input(path: str | Path) -> ValidationInput:
    """Lê o arquivo de input e devolve um ``ValidationInput`` validado."""
    file_path = Path(path)
    if not file_path.is_file():
        raise FileNotFoundError(f"Input não encontrado: {file_path}")

    suffix = file_path.suffix.lower()
    if suffix in (".yaml", ".yml"):
        raw = yaml.safe_load(file_path.read_text(encoding="utf-8")) or {}
    elif suffix == ".json":
        raw = json.loads(file_path.read_text(encoding="utf-8"))
    elif suffix == ".md":
        raise NotImplementedError(
            "Parse do MD canônico (validações secundárias, CONTRACT.md §V2) ainda "
            "não implementado na V1 do agent-db. Forneça um arquivo de validações "
            ".yaml/.json (veja inputs/example.validation.yaml)."
        )
    else:
        raise InputFormatError(
            f"Extensão não suportada: {suffix}. Use .yaml, .json ou .md (futuro)."
        )

    if not isinstance(raw, dict):
        raise InputFormatError("Conteúdo do input deve ser um mapa (dict) no topo.")
    return ValidationInput.model_validate(raw)
