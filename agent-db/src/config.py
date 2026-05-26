"""Carregamento e validação da configuração do agent-db.

Lê ``config/database.config.yaml`` (com fallback ao ``.example``), substitui
``${VAR}`` pelos valores do ambiente (``.env``) e valida o shape com Pydantic.

Regra dura: credenciais NUNCA ficam no YAML — só ``${VAR}`` que resolve do
``.env`` (CLAUDE.md §9.2).
"""

from __future__ import annotations

from pathlib import Path

import yaml
from pydantic import BaseModel, Field

from .utils.env import substitute_env_vars

# Caminhos relativos à raiz do agent-db (este arquivo está em src/).
AGENT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = AGENT_ROOT / "config" / "database.config.yaml"
EXAMPLE_CONFIG = AGENT_ROOT / "config" / "database.config.example.yaml"


class ConnectionConfig(BaseModel):
    """Parâmetros de uma conexão nomeada."""

    host: str
    port: int = 3306
    user: str
    password: str = ""
    database: str
    read_only: bool = True
    pool_pre_ping: bool = True
    pool_size: int = 5
    max_overflow: int = 5


class DefaultsConfig(BaseModel):
    chunk_size: int = 5000
    fail_fast: bool = False
    evidence_top_n: int = 50
    report_format: list[str] = Field(default_factory=lambda: ["json"])


class AgentDbConfig(BaseModel):
    """Config completa do agent-db."""

    connections: dict[str, ConnectionConfig]
    defaults: DefaultsConfig = Field(default_factory=DefaultsConfig)
    batch_tables: list[str] = Field(default_factory=list)

    def connection(self, name: str = "default") -> ConnectionConfig:
        if name not in self.connections:
            raise KeyError(
                f"Conexão '{name}' não definida na config. "
                f"Disponíveis: {sorted(self.connections)}"
            )
        return self.connections[name]


def resolve_config_path(path: str | Path | None = None) -> Path:
    """Resolve o caminho da config, com fallback ao ``.example``."""
    if path is not None:
        resolved = Path(path)
        if not resolved.is_file():
            raise FileNotFoundError(f"Config não encontrada: {resolved}")
        return resolved
    if DEFAULT_CONFIG.is_file():
        return DEFAULT_CONFIG
    if EXAMPLE_CONFIG.is_file():
        return EXAMPLE_CONFIG
    raise FileNotFoundError(
        f"Nenhuma config encontrada em {DEFAULT_CONFIG} nem {EXAMPLE_CONFIG}. "
        "Copie o .example para database.config.yaml e ajuste."
    )


def load_config(path: str | Path | None = None) -> AgentDbConfig:
    """Lê o YAML, substitui ``${VAR}`` pelo ambiente e valida com Pydantic."""
    config_path = resolve_config_path(path)
    raw = yaml.safe_load(config_path.read_text(encoding="utf-8")) or {}
    resolved = substitute_env_vars(raw)
    # YAML traz port como string após substituição de ${DB_PORT}; Pydantic coage.
    return AgentDbConfig.model_validate(resolved)
