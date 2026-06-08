# -*- coding: utf-8 -*-
"""Retrabalho 19788 [P2] "Nao salva cores nos modelos" — checa brand_colors da org 37061 (Kit de Marca).
Rodar ANTES e DEPOIS de salvar uma cor na UI pra comparar value/updated_at. Read-only.
Uso: python scripts/cores_modelo_brand_colors.py [rotulo]   (rotulo ex.: antes / depois)"""
import sys, json
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
rotulo = sys.argv[1] if len(sys.argv) > 1 else "estado"
BASE = Path(__file__).resolve().parents[1]
env={}
for l in (BASE/".env").read_text(encoding="utf-8").splitlines():
    l=l.strip()
    if l and not l.startswith("#") and "=" in l:
        k,_,v=l.partition("="); env[k.strip()]=v.strip().strip('"').strip("'")
g=lambda *ks: next((env[k] for k in ks if env.get(k)), None)
import pymysql
c=pymysql.connect(host=g("DB_HOST_RC","DB_HOST"),port=int(g("DB_PORT_RC","DB_PORT") or 3306),user=g("DB_USER_RC","DB_USER"),password=g("DB_PASSWORD_RC","DB_PASSWORD") or "",database=g("DB_DATABASE_RC","DB_DATABASE"),cursorclass=pymysql.cursors.DictCursor,connect_timeout=15)
cur=c.cursor(); cur.execute("SET SESSION TRANSACTION READ ONLY")
def q(s): cur.execute(s); return cur.fetchall()
rows=q("SELECT id,name,value,position,updated_at FROM brand_colors WHERE brand_id=1435 ORDER BY position")
out=[f"# brand_colors brand_id=1435 (org 37061, event 807573) — rotulo: {rotulo}"]
for r in rows:
    out.append(f"  pos {r['position']} | {r['name']:12} | {r['value']:9} | updated_at={r['updated_at']}")
txt="\n".join(out); print(txt)
ev=BASE/"evidencias"; ev.mkdir(exist_ok=True)
(ev/f"cores-modelo-{rotulo}.txt").write_text(txt, encoding="utf-8")
print(f"\n[ok] {ev/('cores-modelo-'+rotulo+'.txt')}")
c.close()
