# -*- coding: utf-8 -*-
"""
TC12 — Query de validação (read-only) — QA 1.3 / RN 3 (Artia 19707).
Pré: descoberta confirmou banco certo + tabela user_course_preferences existe em twygo_db_rc (MySQL).
Aqui: schema real + existe QUALQUER linha? + linhas do curso 807533 + ids dos usuarios de teste.
Apenas SELECT.
"""
import os
import sys
import json
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

import pymysql
conn = pymysql.connect(
    host=pick("DB_HOST_RC", "DB_HOST"), port=int(pick("DB_PORT_RC", "DB_PORT") or 3306),
    user=pick("DB_USER_RC", "DB_USER"), password=pick("DB_PASSWORD_RC", "DB_PASSWORD") or "",
    database=pick("DB_DATABASE_RC", "DB_DATABASE"), cursorclass=pymysql.cursors.DictCursor,
    connect_timeout=15,
)

def q(sql, params=None):
    with conn.cursor() as c:
        c.execute(sql, params or [])
        return c.fetchall()

def show(rows):
    if not rows:
        print("   (nenhuma linha)")
        return
    for r in rows:
        print("   " + json.dumps(r, default=str, ensure_ascii=False))

try:
    with conn.cursor() as c:
        c.execute("SET SESSION TRANSACTION READ ONLY")

    print("=== A. Schema real de user_course_preferences ===")
    cols = q(
        """SELECT column_name AS name, column_type AS type, is_nullable AS nullable
           FROM information_schema.columns
           WHERE table_schema = 'twygo_db_rc' AND table_name = 'user_course_preferences'
           ORDER BY ordinal_position"""
    )
    for col in cols:
        print(f"   {col['name']:28} {col['type']:22} null={col['nullable']}")
    colnames = [c["name"] for c in cols]

    print("\n=== B. Total de linhas na tabela inteira ===")
    print("   total =", q("SELECT COUNT(*) AS n FROM user_course_preferences")[0]["n"])

    print("\n=== C. Amostra (ate 10 linhas quaisquer) ===")
    show(q("SELECT * FROM user_course_preferences LIMIT 10"))

    # Descobrir nome da coluna do curso (event_id / course_id / event)
    fk_col = None
    for cand in ("event_id", "course_id", "event", "course"):
        if cand in colnames:
            fk_col = cand
            break
    print(f"\n=== D. Linhas do curso 807533 (coluna FK detectada: {fk_col}) ===")
    if fk_col:
        show(q(f"SELECT * FROM user_course_preferences WHERE `{fk_col}` = 807533"))
    else:
        print("   coluna de curso nao identificada automaticamente; ver schema acima")

    print("\n=== E. Usuarios de teste (dante / agents.qa) ===")
    show(q(
        """SELECT id, name, email FROM users
           WHERE email LIKE %s OR email LIKE %s OR name LIKE %s
           LIMIT 10""",
        ["%dante%", "%agents.qa%", "%dante%"],
    ))

finally:
    conn.close()
    print("\n[fim] conexao fechada.")
