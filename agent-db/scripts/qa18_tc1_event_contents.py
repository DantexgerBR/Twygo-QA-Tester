# -*- coding: utf-8 -*-
"""QA 1.8 TC1 [db] — event_contents NAO deve ter is_draft/parent_event_content_id (RN8 descartada). Read-only."""
import sys, json
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
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
    database=g("DB_DATABASE_RC","DB_DATABASE"), cursorclass=pymysql.cursors.DictCursor, connect_timeout=15)
def q(sql, p=None):
    with conn.cursor() as c: c.execute(sql, p or []); return c.fetchall()
OUT=[]
def p(*a):
    s=" ".join(str(x) for x in a); print(s); OUT.append(s)
try:
    with conn.cursor() as c: c.execute("SET SESSION TRANSACTION READ ONLY")
    cols = q("""SELECT column_name AS n, column_type AS t FROM information_schema.columns
                WHERE table_schema='twygo_db_rc' AND table_name='event_contents' ORDER BY ordinal_position""")
    names = [c["n"] for c in cols]
    p(f"# QA 1.8 TC1 — event_contents ({len(names)} colunas)")
    suspeitas = [n for n in names if any(k in n.lower() for k in ("draft","rascunho","parent_event_content","version","versao"))]
    p("colunas suspeitas de rascunho/versionamento:", suspeitas or "NENHUMA")
    p("is_draft presente?            ", "is_draft" in names)
    p("parent_event_content_id?      ", "parent_event_content_id" in names)
    p("")
    p("VEREDITO TC1:", "PASSOU (rascunho NAO implementado — regressao ok)" if not suspeitas else f"FALHOU (achou: {suspeitas})")
    p("")
    p("todas as colunas:", ", ".join(names))
    ev = BASE/"evidencias"; ev.mkdir(exist_ok=True)
    (ev/"qa18-tc1-event_contents.txt").write_text("\n".join(OUT), encoding="utf-8")
    p(f"[ok] evidencia: {ev/'qa18-tc1-event_contents.txt'}")
finally:
    conn.close()
