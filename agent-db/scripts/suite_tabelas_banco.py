# -*- coding: utf-8 -*-
"""Suite "Tabelas do Banco de Dados" (AT novo-estudio) — TC1-TC7 + TC10, read-only MySQL twygo_db_rc.
Valida existencia das tabelas e colunas esperadas pela AT. TC8/TC9 (DynamoDB) e TC11 (rails) fora de alcance."""
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
SCHEMA="twygo_db_rc"
def q(sql,p=None):
    with conn.cursor() as c: c.execute(sql,p or []); return c.fetchall()
OUT=[]
def p(*a):
    s=" ".join(str(x) for x in a); print(s); OUT.append(s)
def coldict(t):
    return {c["n"]: c for c in q("""SELECT column_name n, column_type t, is_nullable nl
        FROM information_schema.columns WHERE table_schema=%s AND table_name=%s ORDER BY ordinal_position""",[SCHEMA,t])}
def fks(t):
    return q("""SELECT constraint_name cn, column_name col, referenced_table_name rt, referenced_column_name rc
        FROM information_schema.key_column_usage
        WHERE table_schema=%s AND table_name=%s AND referenced_table_name IS NOT NULL""",[SCHEMA,t])

# (tabela, [colunas esperadas], TC)
ESPERADO = {
 "studio_generation_partitions": (["id","event_content_id","status","artifact_type","result_data","lock_active","applied_to_event_content_at","approved_by","trace_id","created_at","updated_at"], "TC1"),
 "activity_summaries": (["id","event_content_id","summary_one_line","key_takeaways","glossary_introduced","created_at","updated_at"], "TC2"),
 "org_generation_preferences": (["id","organization_id","image_provider","audio_provider","voice_persona","created_at","updated_at"], "TC3"),
 "user_course_preferences": (["id","user_id","event_id","tab_order","last_tab","created_at","updated_at"], "TC4"),
 "conversations": (["organization_dataset_id","event_id","user_id","context_type"], "TC5"),
 "messages": (["studio_partition_id"], "TC6"),
 "event_contents": (["display_label","display_icon"], "TC7"),
}
try:
    with conn.cursor() as c: c.execute("SET SESSION TRANSACTION READ ONLY")
    p("# Suite Tabelas do Banco — twygo_db_rc (read-only) — 08/06/2026\n")
    for tbl,(esperadas,tc) in ESPERADO.items():
        cd = coldict(tbl)
        if not cd:
            p(f"[{tc}] {tbl}: ❌ TABELA NAO EXISTE"); p(""); continue
        faltando = [c for c in esperadas if c not in cd]
        veredito = "✅ PASSOU" if not faltando else f"❌ FALHOU (faltam: {faltando})"
        p(f"[{tc}] {tbl}: {veredito}")
        # detalhes uteis
        for c in esperadas:
            if c in cd: p(f"     {c:32} {cd[c]['t']:24} null={cd[c]['nl']}")
            else: p(f"     {c:32} <AUSENTE>")
        p("")
    # TC10 — FKs
    p("[TC10] FKs:")
    for tbl in ("studio_generation_partitions","user_course_preferences"):
        f = fks(tbl)
        p(f"   {tbl}: {json.dumps(f, ensure_ascii=False, default=str) if f else 'NENHUMA FK / tabela inexistente'}")
        # ON DELETE rule
        rules = q("""SELECT constraint_name cn, delete_rule FROM information_schema.referential_constraints
                     WHERE constraint_schema=%s AND table_name=%s""",[SCHEMA,tbl])
        if rules: p(f"      delete_rule: {json.dumps(rules, ensure_ascii=False, default=str)}")
    ev=BASE/"evidencias"; ev.mkdir(exist_ok=True)
    (ev/"suite-tabelas-banco.txt").write_text("\n".join(OUT), encoding="utf-8")
    p(f"\n[ok] evidencia: {ev/'suite-tabelas-banco.txt'}")
finally:
    conn.close()
