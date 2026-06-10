# -*- coding: utf-8 -*-
"""QA 1.18 TC1 [db] — Exclusao do Banco Historico. READ-ONLY.

O TC valida que, ao EXCLUIR uma org, os registros somem das tabelas de historico.
Read-only NAO consegue provar a delecao (e destrutivo). O que da pra validar aqui:
  (1) quais das tabelas existem no MySQL twygo_db_rc (vs DynamoDB, fora);
  (2) se cada tabela tem coluna de escopo por organizacao;
  (3) quantos registros a org 37061 tem hoje (baseline = o que a exclusao deveria zerar).
"""
import sys
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
import os
ORG = int(os.environ.get("ORG_ID", "37061"))
SCHEMA = "twygo_db_rc"

# tabelas do Objetivo da 1.18 (MySQL novas + estendidas). DynamoDB fica fora.
MYSQL_TABLES = [
    "studio_generation_partitions",
    "activity_summaries",
    "org_generation_preferences",
    "user_course_preferences",
    "conversations",
    "messages",
    "event_contents",
]
DYNAMO_TABLES = ["studio_checkpoints", "messages"]

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

OUT = []
def p(*a):
    s = " ".join(str(x) for x in a); print(s); OUT.append(s)

def q(sql, params=None):
    with conn.cursor() as c:
        c.execute(sql, params or []); return c.fetchall()

ORG_COL_CANDIDATES = ["organization_id", "org_id", "organisation_id"]

try:
    with conn.cursor() as c:
        c.execute("SET SESSION TRANSACTION READ ONLY")
    p(f"# QA 1.18 TC1 — Exclusao do Banco Historico (READ-ONLY, schema {SCHEMA}, org {ORG})")
    p("")
    for t in MYSQL_TABLES:
        cols = q("""SELECT column_name AS n FROM information_schema.columns
                    WHERE table_schema=%s AND table_name=%s ORDER BY ordinal_position""", [SCHEMA, t])
        if not cols:
            p(f"[{t}] -> NAO EXISTE em {SCHEMA} (pode estar em outro datastore)")
            continue
        names = [c["n"] for c in cols]
        org_col = next((oc for oc in ORG_COL_CANDIDATES if oc in names), None)
        total = q(f"SELECT COUNT(*) AS n FROM `{t}`")[0]["n"]
        if org_col:
            n_org = q(f"SELECT COUNT(*) AS n FROM `{t}` WHERE `{org_col}`=%s", [ORG])[0]["n"]
            p(f"[{t}] existe | col_org={org_col} | total={total} | org {ORG}={n_org}")
        else:
            # tabelas sem coluna org direta (escopo via event_id/user_id)
            scope = [n for n in names if n in ("event_id","user_id","event_content_id","conversation_id")]
            p(f"[{t}] existe | SEM coluna org direta | escopo provavel via {scope or '??'} | total={total}")
    p("")
    p("DynamoDB (fora do MySQL, nao validavel aqui):", ", ".join(DYNAMO_TABLES))
    p("")
    p("NOTA: read-only confirma schema + baseline de dados da org. A assercao do TC")
    p("('apos excluir a org, registros somem') exige E2E destrutivo (criar org")
    p("descartavel -> popular -> excluir -> reconsultar) + acesso ao DynamoDB.")
    ev = BASE / "evidencias"; ev.mkdir(exist_ok=True)
    (ev / "qa18-tc1-exclusao-historico.txt").write_text("\n".join(OUT), encoding="utf-8")
    p(f"[ok] evidencia: {ev/'qa18-tc1-exclusao-historico.txt'}")
finally:
    conn.close()
