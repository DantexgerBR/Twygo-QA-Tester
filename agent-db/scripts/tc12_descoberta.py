# -*- coding: utf-8 -*-
"""
TC12 — Descoberta (read-only) para QA 1.3 / RN 3 (Artia 19707).
Objetivo desta etapa: NÃO validar ainda — só confirmar terreno:
  1) Estou no banco certo? (org 37061 e curso/event 807533 existem)
  2) A tabela user_course_preferences existe? Em qual schema? Quais colunas?
  3) Tabelas irmãs da RN do novo estúdio existem? (sanity do build)
Conexão: credenciais _RC do .env (twygo-rc, MySQL 3306). Apenas SELECT.
"""
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"

def load_env(path):
    env = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env

env = load_env(ENV_PATH)

def pick(*keys):
    for k in keys:
        if env.get(k):
            return env[k]
    return None

host = pick("DB_HOST_RC", "DB_HOST")
port = int(pick("DB_PORT_RC", "DB_PORT") or 3306)
user = pick("DB_USER_RC", "DB_USER")
password = pick("DB_PASSWORD_RC", "DB_PASSWORD") or ""
database = pick("DB_DATABASE_RC", "DB_DATABASE")

print(f"[conn] host={host} port={port} user={user} db={database}")

import pymysql

conn = pymysql.connect(
    host=host, port=port, user=user, password=password,
    database=database, cursorclass=pymysql.cursors.DictCursor,
    connect_timeout=15, read_default_file=None,
)

def q(sql, params=None):
    with conn.cursor() as c:
        c.execute(sql, params or [])
        return c.fetchall()

try:
    # Guard read-only na sessão
    with conn.cursor() as c:
        c.execute("SET SESSION TRANSACTION READ ONLY")

    print("\n=== 0. Versão / banco atual ===")
    print(q("SELECT VERSION() AS version, DATABASE() AS db")[0])

    print("\n=== 1. Estou no banco certo? org 37061 e event 807533 ===")
    try:
        orgs = q("SELECT id, name FROM organizations WHERE id = 37061")
        print("organizations(37061):", orgs or "NAO ENCONTRADO")
    except Exception as e:
        print("organizations: erro/inexistente ->", e)
    try:
        ev = q("SELECT id, name, organization_id FROM events WHERE id = 807533")
        print("events(807533):", ev or "NAO ENCONTRADO")
    except Exception as e:
        print("events: erro/inexistente ->", e)

    print("\n=== 2. Tabela user_course_preferences existe? (todos os schemas) ===")
    found = q(
        """SELECT table_schema, table_name
           FROM information_schema.tables
           WHERE table_name = 'user_course_preferences'"""
    )
    print("ocorrencias:", found or "NENHUMA")

    if found:
        for row in found:
            sch = row["table_schema"]
            print(f"\n--- schema do user_course_preferences: {sch} ---")
            cols = q(
                """SELECT column_name, column_type, is_nullable, column_default
                   FROM information_schema.columns
                   WHERE table_schema = %s AND table_name = 'user_course_preferences'
                   ORDER BY ordinal_position""",
                [sch],
            )
            for col in cols:
                print(f"  {col['column_name']:30} {col['column_type']:20} null={col['is_nullable']}")
            cnt = q(f"SELECT COUNT(*) AS n FROM `{sch}`.user_course_preferences")[0]["n"]
            print(f"  total de linhas na tabela: {cnt}")

    print("\n=== 3. Tabelas irmãs da RN do novo estúdio (sanity do build) ===")
    irmas = [
        "activity_summaries", "event_contents", "conversations", "messages",
        "org_generation_preferences", "studio_generation_partitions",
    ]
    sib = q(
        """SELECT table_schema, table_name
           FROM information_schema.tables
           WHERE table_name IN %s""",
        [tuple(irmas)],
    )
    print("encontradas:", sib or "NENHUMA")

finally:
    conn.close()
    print("\n[fim] conexao fechada.")
