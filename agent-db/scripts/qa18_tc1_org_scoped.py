# -*- coding: utf-8 -*-
"""QA 1.18 TC1 [db] — contagem ORG-SCOPED via joins. READ-ONLY.
Mede o que a exclusao da org deveria zerar, inclusive tabelas sem organization_id direto."""
import sys, os
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
ORG = int(os.environ.get("ORG_ID", "37062"))
SCHEMA = "twygo_db_rc"

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
def count(label, sql, params):
    try:
        with conn.cursor() as c:
            c.execute(sql, params); n = c.fetchone()["n"]
        p(f"  {label:42s} = {n}")
        return n
    except Exception as e:
        p(f"  {label:42s} = ERRO ({str(e)[:70]})")
        return None

QUERIES = [
    ("events (cursos da org)",            "SELECT COUNT(*) n FROM events WHERE organization_id=%s", [ORG]),
    ("event_contents (via events)",       "SELECT COUNT(*) n FROM event_contents ec JOIN events e ON ec.event_id=e.id WHERE e.organization_id=%s", [ORG]),
    ("activity_summaries (via ec->events)","SELECT COUNT(*) n FROM activity_summaries a JOIN event_contents ec ON a.event_content_id=ec.id JOIN events e ON ec.event_id=e.id WHERE e.organization_id=%s", [ORG]),
    ("user_course_preferences (via event)","SELECT COUNT(*) n FROM user_course_preferences u JOIN events e ON u.event_id=e.id WHERE e.organization_id=%s", [ORG]),
    ("conversations (organization_id)",    "SELECT COUNT(*) n FROM conversations WHERE organization_id=%s", [ORG]),
    ("messages (organization_id)",         "SELECT COUNT(*) n FROM messages WHERE organization_id=%s", [ORG]),
    ("studio_generation_partitions (org)", "SELECT COUNT(*) n FROM studio_generation_partitions WHERE organization_id=%s", [ORG]),
]
try:
    with conn.cursor() as c: c.execute("SET SESSION TRANSACTION READ ONLY")
    p(f"# QA 1.18 TC1 — contagem ORG-SCOPED (org {ORG}, schema {SCHEMA})")
    p("")
    for label, sql, params in QUERIES:
        count(label, sql, params)
    p("")
    p("(conversations/messages/studio_generation_partitions sao geradas por IA;")
    p(" a Trial 37062 esta SEM creditos -> nao populaveis por enquanto.)")
    ev = BASE / "evidencias"; ev.mkdir(exist_ok=True)
    tag = os.environ.get("SNAP", "baseline")
    (ev / f"qa18-tc1-org-scoped-{ORG}-{tag}.txt").write_text("\n".join(OUT), encoding="utf-8")
    p(f"[ok] {ev/f'qa18-tc1-org-scoped-{ORG}-{tag}.txt'}")
finally:
    conn.close()
