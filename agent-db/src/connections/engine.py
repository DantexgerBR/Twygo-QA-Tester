"""Engine factory SQLAlchemy + PyMySQL com sessão read-only.

CLAUDE.md §2.1: conexão sempre abre como somente leitura — aplicamos
``SET SESSION TRANSACTION READ ONLY`` em cada checkout do pool.

A engine é criada de forma *lazy* (nada conecta no import) para que ``--help``,
ruff e testes rodem sem ``.env`` nem banco disponível.
"""

from __future__ import annotations

from sqlalchemy import Engine, create_engine, event, text
from sqlalchemy.engine import URL

from ..config import ConnectionConfig
from ..utils.logging import get_logger

_logger = get_logger()


def build_url(cfg: ConnectionConfig) -> URL:
    """Monta a URL SQLAlchemy para o driver PyMySQL (sem expor senha em texto)."""
    return URL.create(
        drivername="mysql+pymysql",
        username=cfg.user,
        password=cfg.password or None,
        host=cfg.host,
        port=cfg.port,
        database=cfg.database,
        query={"charset": "utf8mb4"},
    )


def create_readonly_engine(cfg: ConnectionConfig) -> Engine:
    """Cria uma Engine cujas conexões abrem em modo read-only.

    Se ``cfg.read_only`` for True (default), registra um listener que executa
    ``SET SESSION TRANSACTION READ ONLY`` a cada conexão entregue pelo pool.
    """
    url = build_url(cfg)
    engine = create_engine(
        url,
        pool_pre_ping=cfg.pool_pre_ping,
        pool_size=cfg.pool_size,
        max_overflow=cfg.max_overflow,
        future=True,
    )

    if cfg.read_only:

        @event.listens_for(engine, "connect")
        def _set_read_only(dbapi_conn, _connection_record):  # noqa: ANN001
            cursor = dbapi_conn.cursor()
            try:
                cursor.execute("SET SESSION TRANSACTION READ ONLY")
            finally:
                cursor.close()

    _logger.info(
        "Engine criada para %s:%s/%s (read_only=%s)",
        cfg.host,
        cfg.port,
        cfg.database,
        cfg.read_only,
    )
    return engine


def ping(engine: Engine) -> bool:
    """Valida a conexão com ``SELECT 1`` (fase 1 Init do CLAUDE.md §4)."""
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return result.scalar_one() == 1
