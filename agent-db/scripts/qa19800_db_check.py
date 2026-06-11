# -*- coding: utf-8 -*-
"""Card 19800 — cross-check read-only no MySQL:
(1) event_contents.narrator_script deve estar VAZIO na criação (PR 10544);
(2) ai_generation_tasks do roteiro: completed com approved_by/applied_to_target_at NULL
    (aguardando aprovação manual — não auto-aprovado)."""
import sys, os
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
BASE = Path(__file__).resolve().parents[1]
EC_ID = int(os.environ.get("EC_ID", "9295618"))
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
        p(f"# Card 19800 — cross-check DB (ec {EC_ID}, org {ORG})\n")

        c.execute("SHOW COLUMNS FROM event_contents LIKE 'narrator%'")
        cols = [r["Field"] for r in c.fetchall()]
        p("colunas narrator* em event_contents:", cols or "NENHUMA")
        if cols:
            sel = ", ".join(cols)
            c.execute(f"SELECT id, title, {sel} FROM event_contents WHERE id=%s", [EC_ID])
            row = c.fetchone()
            if row:
                for k, v in row.items():
                    val = (str(v)[:120] + "…") if v and len(str(v)) > 120 else v
                    p(f"  {k} = {val!r}")
                for col in cols:
                    vazio = not row[col]
                    p(f"  >> {col} VAZIO na criação? {'SIM ✔ (fix ok)' if vazio else 'NÃO ✖ (pré-preenchido!)'}")
            else:
                p("  event_content não encontrado!")

        p("")
        c.execute("""SELECT id, artifact_type, mode, status, approved_by, applied_to_target_at,
                            completed_at, created_at
                     FROM ai_generation_tasks
                     WHERE target_resource_id=%s AND target_resource_type='event_content'
                     ORDER BY created_at DESC LIMIT 3""", [EC_ID])
        rows = c.fetchall()
        p(f"ai_generation_tasks da ec {EC_ID}: {len(rows)} registro(s)")
        for r in rows:
            p(f"  - id={r['id'][:8]}… artifact={r['artifact_type']} mode={r['mode']} status={r['status']}")
            p(f"    approved_by={r['approved_by']!r} applied_to_target_at={r['applied_to_target_at']!r}")
            p(f"    completed_at={r['completed_at']} created_at={r['created_at']}")
            nao_auto = r["approved_by"] is None and r["applied_to_target_at"] is None
            p(f"    >> aguardando aprovação manual (não auto-aprovada)? {'SIM ✔ (fix ok)' if nao_auto else 'NÃO ✖'}")
    ev = BASE / "evidencias"; ev.mkdir(exist_ok=True)
    fp = ev / f"qa19800-db-check-ec{EC_ID}.txt"
    fp.write_text("\n".join(OUT), encoding="utf-8")
    p(f"\n[ok] {fp}")
finally:
    conn.close()
