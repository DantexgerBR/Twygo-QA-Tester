# -*- coding: utf-8 -*-
"""QA 1.18 — lista os events remanescentes da org 37062 pós-exclusão (read-only)."""
import sys, os
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
ORG = int(os.environ.get("ORG_ID", "37062"))

def load_env(path):
    env = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        l = raw.strip()
        if l and not l.startswith("#") and "=" in l:
            k, _, v = l.partition("="); env[k.strip()] = v.strip().strip('"').strip("'")
    return env
env = load_env(BASE / ".env")
g = lambda *ks: next((env[k] for k in ks if env.get(k)), None)
import pymysql
conn = pymysql.connect(host=g("DB_HOST_RC","DB_HOST"), port=int(g("DB_PORT_RC","DB_PORT") or 3306),
    user=g("DB_USER_RC","DB_USER"), password=g("DB_PASSWORD_RC","DB_PASSWORD") or "",
    database=g("DB_DATABASE_RC","DB_DATABASE"), cursorclass=pymysql.cursors.DictCursor, connect_timeout=20)
OUT = []
def p(*a):
    s = " ".join(str(x) for x in a); print(s); OUT.append(s)
try:
    with conn.cursor() as c:
        c.execute("SET SESSION TRANSACTION READ ONLY")
        c.execute("SHOW COLUMNS FROM events")
        cols = [r["Field"] for r in c.fetchall()]
        interesse = [x for x in ["id","name","kind","status","deleted_at","discarded_at","created_at"] if x in cols]
        p(f"# events remanescentes org {ORG} (colunas: {', '.join(interesse)})\n")
        c.execute(f"SELECT {', '.join(interesse)} FROM events WHERE organization_id=%s ORDER BY id", [ORG])
        for r in c.fetchall():
            p("  -", {k: str(v)[:50] for k, v in r.items()})
    ev = BASE / "evidencias"
    (ev / f"qa18-events-restantes-{ORG}-pos-exclusao-1106.txt").write_text("\n".join(OUT), encoding="utf-8")
    p("[ok] salvo em evidencias/")
finally:
    conn.close()
