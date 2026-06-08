# -*- coding: utf-8 -*-
"""QA 1.9 — reforco TC11 (historico por usuario) via fonte de verdade + cobre Tabelas do Banco TC5/TC6.
Read-only: schema de conversations/messages + se ha conversas escopadas por usuario no curso 807533."""
import sys, json
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
def load_env(path):
    env = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        l = raw.strip()
        if l and not l.startswith("#") and "=" in l:
            k,_,v = l.partition("="); env[k.strip()] = v.strip().strip('"').strip("'")
    return env
env = load_env(BASE/".env"); g = lambda *ks: next((env[k] for k in ks if env.get(k)), None)
import pymysql
conn = pymysql.connect(host=g("DB_HOST_RC","DB_HOST"), port=int(g("DB_PORT_RC","DB_PORT") or 3306),
    user=g("DB_USER_RC","DB_USER"), password=g("DB_PASSWORD_RC","DB_PASSWORD") or "",
    database=g("DB_DATABASE_RC","DB_DATABASE"), cursorclass=pymysql.cursors.DictCursor, connect_timeout=15)
def q(sql,p=None):
    with conn.cursor() as c: c.execute(sql,p or []); return c.fetchall()
OUT=[]
def p(*a):
    s=" ".join(str(x) for x in a); print(s); OUT.append(s)
def cols(t):
    return q("""SELECT column_name AS n, column_type AS t FROM information_schema.columns
                WHERE table_schema='twygo_db_rc' AND table_name=%s ORDER BY ordinal_position""",[t])
try:
    with conn.cursor() as c: c.execute("SET SESSION TRANSACTION READ ONLY")
    for t in ("conversations","messages"):
        cs = cols(t)
        if not cs:
            p(f"### {t}: TABELA NAO EXISTE"); continue
        names=[c["n"] for c in cs]
        p(f"### {t} ({len(names)} colunas): {', '.join(names)}")
        # campos chave pro escopo por usuario/curso e extensoes do estudio
        for key in ("user_id","event_id","studio_partition_id","summary","last_message_at","title"):
            p(f"   tem {key}? {'SIM' if key in names else 'nao'}")
        p("")
    # Há histórico escopado por usuário no curso 807533?
    ccols=[c["n"] for c in cols("conversations")]
    if "event_id" in ccols and "user_id" in ccols:
        p("### conversations do curso 807533, por usuario:")
        rows=q("""SELECT user_id, COUNT(*) AS n FROM conversations
                  WHERE event_id=807533 GROUP BY user_id ORDER BY n DESC LIMIT 10""")
        p("   ", json.dumps(rows, default=str, ensure_ascii=False) if rows else "(nenhuma conversa nesse curso)")
        tot=q("SELECT COUNT(*) AS n, COUNT(DISTINCT user_id) AS u FROM conversations WHERE event_id=807533")[0]
        p(f"   total conversas no 807533: {tot['n']} | usuarios distintos: {tot['u']}")
        p("   -> se ha multiplos user_id distintos, confirma historico ESCOPADO POR USUARIO (TC11)")
    else:
        p("### conversations nao tem user_id+event_id juntos — escopo por usuario nao confirmavel por essas colunas")
    ev=BASE/"evidencias"; ev.mkdir(exist_ok=True)
    (ev/"qa19-conversations-messages.txt").write_text("\n".join(OUT), encoding="utf-8")
    p(f"\n[ok] evidencia: {ev/'qa19-conversations-messages.txt'}")
finally:
    conn.close()
