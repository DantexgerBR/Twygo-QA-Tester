"""Read-only guard — defesa em profundidade contra mutação de dados.

Inspirado no padrão da skill ``postgres`` (sanjay3290/ai-skills) citada no
CLAUDE.md §8. Duas camadas:

1. ``MutationGuard.assert_read_only(sql)`` — rejeita qualquer SQL que não seja
   um único ``SELECT``/``WITH`` antes de chegar ao driver.
2. ``SET SESSION TRANSACTION READ ONLY`` aplicado na conexão (em ``engine.py``).

Regra dura (CLAUDE.md §9.1/§9.3): conexão sempre read-only e queries sempre
parametrizadas. String-format de SQL é proibido — o builder usa ``text()`` +
``bindparams``; este guard é a checagem final antes de executar.
"""

from __future__ import annotations

import re

# Palavras que indicam mutação ou DDL. Bloqueadas em qualquer posição de comando.
_FORBIDDEN = {
    "insert",
    "update",
    "delete",
    "drop",
    "truncate",
    "alter",
    "create",
    "replace",
    "merge",
    "grant",
    "revoke",
    "call",
    "set",
    "lock",
    "rename",
}

# Comandos read-only aceitos como primeira palavra do statement.
_ALLOWED_LEADING = {"select", "with", "show", "explain", "describe", "desc"}

_COMMENT_BLOCK = re.compile(r"/\*.*?\*/", re.DOTALL)
_COMMENT_LINE = re.compile(r"--[^\n]*")
_WORD = re.compile(r"[a-zA-Z_]+")


class MutationError(RuntimeError):
    """Levantada quando uma query não passa no guard read-only."""


def _strip_comments(sql: str) -> str:
    no_block = _COMMENT_BLOCK.sub(" ", sql)
    return _COMMENT_LINE.sub(" ", no_block)


def assert_read_only(sql: str) -> None:
    """Valida que ``sql`` é um único statement read-only. Levanta ``MutationError``.

    Bloqueia: múltiplos statements (``;`` separando), comandos de mutação/DDL,
    e qualquer statement que não comece com um comando permitido.
    """
    cleaned = _strip_comments(sql).strip()
    if not cleaned:
        raise MutationError("SQL vazio.")

    # Múltiplos statements: ; só é tolerado como terminador final.
    stripped_trailing = cleaned.rstrip(";").strip()
    if ";" in stripped_trailing:
        raise MutationError(
            "Múltiplos statements detectados. Apenas um SELECT por validação é permitido."
        )

    leading_match = _WORD.search(stripped_trailing)
    if leading_match is None:
        raise MutationError(f"Não foi possível identificar o comando em: {sql!r}")
    leading = leading_match.group(0).lower()
    if leading not in _ALLOWED_LEADING:
        raise MutationError(
            f"Comando '{leading}' não é read-only. Permitidos: {sorted(_ALLOWED_LEADING)}."
        )

    # Defesa extra: nenhuma palavra de mutação em lugar nenhum do statement.
    words = {w.lower() for w in _WORD.findall(stripped_trailing)}
    forbidden_found = words & _FORBIDDEN
    if forbidden_found:
        raise MutationError(
            f"Palavra(s) de mutação/DDL detectada(s): {sorted(forbidden_found)}. "
            "Queries devem ser read-only e parametrizadas."
        )
