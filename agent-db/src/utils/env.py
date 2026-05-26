"""Carregamento de variáveis de ambiente e substituição ``${VAR}`` em configs.

Regras duras (CLAUDE.md §2.2 / §9.2):
- Credenciais SÓ via ``.env`` (carregado com python-dotenv).
- ``config.yaml`` referencia ``${VAR}`` — nunca valores literais.
- Logs NUNCA ecoam senha — use ``mask_dsn`` antes de logar uma DSN.
"""

from __future__ import annotations

import os
import re
from pathlib import Path
from typing import Any

try:
    from dotenv import load_dotenv

    _HAS_DOTENV = True
except ImportError:  # pragma: no cover - dotenv é dependência declarada
    _HAS_DOTENV = False

# Padrão de placeholder ${VAR} ou ${VAR:-default}
_PLACEHOLDER = re.compile(r"\$\{(?P<name>[A-Za-z_][A-Za-z0-9_]*)(?::-(?P<default>[^}]*))?\}")


def load_env(env_path: str | Path | None = None) -> None:
    """Carrega o ``.env`` no ambiente do processo (idempotente).

    Se ``env_path`` for omitido, procura ``.env`` no diretório de trabalho atual
    e nos pais. Não sobrescreve variáveis já definidas no ambiente.
    """
    if not _HAS_DOTENV:
        return
    if env_path is not None:
        load_dotenv(env_path, override=False)
        return
    found = _find_dotenv()
    if found is not None:
        load_dotenv(found, override=False)


def _find_dotenv(start: Path | None = None) -> Path | None:
    here = (start or Path.cwd()).resolve()
    for directory in [here, *here.parents]:
        candidate = directory / ".env"
        if candidate.is_file():
            return candidate
    return None


class MissingEnvVarError(RuntimeError):
    """Levantada quando um ``${VAR}`` referenciado não está no ambiente."""


def substitute_env_vars(value: Any) -> Any:
    """Substitui recursivamente ``${VAR}`` em strings/listas/dicts pelo valor do ambiente.

    Suporta ``${VAR:-default}``. Levanta ``MissingEnvVarError`` se a variável
    não existe e nenhum default foi dado.
    """
    if isinstance(value, str):
        return _substitute_str(value)
    if isinstance(value, dict):
        return {k: substitute_env_vars(v) for k, v in value.items()}
    if isinstance(value, list):
        return [substitute_env_vars(v) for v in value]
    return value


def _substitute_str(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        name = match.group("name")
        default = match.group("default")
        if name in os.environ:
            return os.environ[name]
        if default is not None:
            return default
        raise MissingEnvVarError(
            f"Variável de ambiente '{name}' referenciada na config mas não definida. "
            "Defina-a no .env (veja .env.example)."
        )

    return _PLACEHOLDER.sub(repl, text)


def mask_dsn(dsn: str) -> str:
    """Mascara a senha numa DSN/URL de conexão para logging seguro.

    ``mysql+pymysql://user:secret@host/db`` -> ``mysql+pymysql://user:***@host/db``
    """
    return re.sub(r"(://[^:/@]+:)([^@]+)(@)", r"\1***\3", dsn)
