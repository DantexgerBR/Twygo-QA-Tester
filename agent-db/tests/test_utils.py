"""Testes dos utilitários: substituição de env, mask de senha, slug."""

import pytest
from src.utils.env import MissingEnvVarError, mask_dsn, substitute_env_vars
from src.utils.slug import slugify


def test_substitute_env_vars_from_environment(monkeypatch):
    monkeypatch.setenv("DB_HOST", "db.example.com")
    result = substitute_env_vars({"host": "${DB_HOST}", "port": 3306})
    assert result == {"host": "db.example.com", "port": 3306}


def test_substitute_env_vars_default():
    result = substitute_env_vars("${UNSET_VAR:-fallback}")
    assert result == "fallback"


def test_substitute_env_vars_missing_raises():
    with pytest.raises(MissingEnvVarError):
        substitute_env_vars("${DEFINITELY_NOT_SET_12345}")


def test_mask_dsn_hides_password():
    masked = mask_dsn("mysql+pymysql://user:s3cr3t@host:3306/twygo")
    assert "s3cr3t" not in masked
    assert "***" in masked


def test_slugify():
    assert slugify("Créditos de IA — Fase 02") == "creditos-de-ia-fase-02"
    assert slugify("") == "run"
