# -*- coding: utf-8 -*-
"""
TC12 — Confirmacao final (read-only) — QA 1.3 / RN 3 (Artia 19707).
Consolida a evidencia: banco certo, schema da tabela, total=0, e os usuarios de teste.
Grava saida em evidencias/tc12-user_course_preferences.txt. Apenas SELECT.
"""
import sys, json
from pathlib import Path
from datetime import datetime, timezone

OUT = []
def p(*a):
    line = " ".join(str(x) for x in a)
    print(line); OUT.append(line)

sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
ENV_PATH = BASE / ".env"

def load_env(path):
    env = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env

env = load_env(ENV_PATH)
def pick(*keys):
    for k in keys:
        if env.get(k):
            return env[k]

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

try:
    with conn.cursor() as c:
        c.execute("SET SESSION TRANSACTION READ ONLY")

    p(f"# TC12 — user_course_preferences (RN 3 / Artia 19707)")
    p(f"# gerado em {datetime.now(timezone.utc).isoformat()} (UTC) — read-only")
    info = q("SELECT VERSION() AS v, DATABASE() AS db")[0]
    p(f"# banco: {info['db']} (MySQL {info['v']}) @ twygo-rc")
    p("")

    p("[1] Ambiente confere:")
    p("   org 37061 ->", q("SELECT id, name FROM organizations WHERE id=37061"))
    p("   event 807533 ->", q("SELECT id, name, organization_id FROM events WHERE id=807533"))
    p("")

    p("[2] Schema de user_course_preferences:")
    for col in q("""SELECT column_name AS n, column_type AS t, is_nullable AS nl
                    FROM information_schema.columns
                    WHERE table_schema='twygo_db_rc' AND table_name='user_course_preferences'
                    ORDER BY ordinal_position"""):
        p(f"     {col['n']:14} {col['t']:16} null={col['nl']}")
    p("   -> NAO ha coluna event_id/course_id: escopo e apenas user_id (por usuario global)")
    p("")

    p("[3] Conteudo:")
    p("   total de linhas =", q("SELECT COUNT(*) AS n FROM user_course_preferences")[0]["n"])
    p("   amostra:", q("SELECT * FROM user_course_preferences LIMIT 10") or "(vazia)")
    p("")

    p("[4] Usuario de teste (confirma que existe, mas nao tem preferencia gravada):")
    cols_users = [c["COLUMN_NAME"] if "COLUMN_NAME" in c else c["column_name"]
                  for c in q("""SELECT column_name FROM information_schema.columns
                                WHERE table_schema='twygo_db_rc' AND table_name='users'""")]
    name_col = "first_name" if "first_name" in cols_users else ("login" if "login" in cols_users else "email")
    users = q(f"SELECT id, {name_col}, email FROM users WHERE email LIKE %s OR email LIKE %s LIMIT 10",
              ["%dante%", "%agents.qa%"])
    for u in users:
        p("     ", json.dumps(u, default=str, ensure_ascii=False))
    if users:
        uid = users[0]["id"]
        p(f"   prefs do user {uid}:", q("SELECT * FROM user_course_preferences WHERE user_id=%s", [uid]) or "(nenhuma)")

    ev = BASE / "evidencias"
    ev.mkdir(exist_ok=True)
    (ev / "tc12-user_course_preferences.txt").write_text("\n".join(OUT), encoding="utf-8")
    p("")
    p(f"[ok] evidencia salva em {ev / 'tc12-user_course_preferences.txt'}")
finally:
    conn.close()
