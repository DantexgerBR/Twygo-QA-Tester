# -*- coding: utf-8 -*-
"""QA 1.18 — consulta read-only de ai_generation_tasks (org-scoped) + schema de
user_course_preferences (join do org_scoped quebrou com Unknown column event_id)."""
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
        p(f"# ai_generation_tasks — org {ORG} ({os.environ.get('SNAP','snap')})\n")
        c.execute("SHOW COLUMNS FROM ai_generation_tasks")
        cols = [r["Field"] for r in c.fetchall()]
        p("colunas:", ", ".join(cols))
        org_col = "organization_id" if "organization_id" in cols else None
        if org_col:
            c.execute(f"SELECT COUNT(*) n FROM ai_generation_tasks WHERE {org_col}=%s", [ORG])
            p(f"\nai_generation_tasks (org {ORG}) =", c.fetchone()["n"])
            c.execute(f"SELECT * FROM ai_generation_tasks WHERE {org_col}=%s ORDER BY id DESC LIMIT 5", [ORG])
        else:
            p("\n(sem organization_id direto — tentando via event_content/event)")
            c.execute("SELECT COUNT(*) n FROM ai_generation_tasks t JOIN event_contents ec ON t.event_content_id=ec.id JOIN events e ON ec.event_id=e.id WHERE e.organization_id=%s", [ORG])
            p(f"ai_generation_tasks (via ec->events, org {ORG}) =", c.fetchone()["n"])
            c.execute("SELECT t.* FROM ai_generation_tasks t JOIN event_contents ec ON t.event_content_id=ec.id JOIN events e ON ec.event_id=e.id WHERE e.organization_id=%s ORDER BY t.id DESC LIMIT 5", [ORG])
        for r in c.fetchall():
            slim = {k: (str(v)[:60]) for k, v in r.items() if v is not None}
            p("  -", slim)
        p("\n# user_course_preferences — colunas reais")
        c.execute("SHOW COLUMNS FROM user_course_preferences")
        p("colunas:", ", ".join(r["Field"] for r in c.fetchall()))
    ev = BASE / "evidencias"; ev.mkdir(exist_ok=True)
    tag = os.environ.get("SNAP", "snap")
    fp = ev / f"qa18-ai-generation-tasks-{ORG}-{tag}.txt"
    fp.write_text("\n".join(OUT), encoding="utf-8")
    p(f"[ok] {fp}")
finally:
    conn.close()
