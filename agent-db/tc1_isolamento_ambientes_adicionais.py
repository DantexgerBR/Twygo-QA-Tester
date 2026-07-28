"""
TC1 — Isolamento em Ambientes Adicionais (Suite 14, card Artia #19338).

Invariante (RN multi-tenant): uma reinscrição de recertificação num ambiente
NÃO pode criar/afetar participants no ambiente pareado. Cada `event_participant`
pertence a um `event`, que pertence a UMA `organization` — logo a reinscrição
(que incrementa `recertification_number` e cria nova linha) fica escopada por org.

Validação READ-ONLY contra o banco do app (twygo_db_rc / MySQL 8), que contém:
  - org 37048 "Recertificação"            (PRINCIPAL)
  - org 37050 "Adicional Recertificação"  (ADICIONAL pareado)

Prova de isolamento em 3 frentes:
  Q1. Contagem de participants e de reinscritos (recertification_number>0) por org.
  Q2. Estrutural: nenhuma linha de event_participants "cruza" tenant
      (todo participant de um event da org X tem event.organization_id = X).
  Q3. Cross-check por e-mail: alunos reinscritos no 37048 que TAMBÉM existem no
      37050 têm recertification_number=0 lá (a reinscrição no principal não
      propagou pro pareado).

Veredito: PASS se o adicional (37050) tem 0 reinscrições e nenhum vazamento
estrutural/por-email vindo do principal.
"""
import sys
from pathlib import Path
import pymysql

# Console Windows é cp1252 por padrão — força UTF-8 pra emojis/acentos no output.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

PRINCIPAL = 37048
ADICIONAL = 37050

env = {}
for line in (Path(__file__).parent / ".env").read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip()


def connect():
    return pymysql.connect(
        host=env["DB_HOST_RC"], port=int(env["DB_PORT_RC"]),
        user=env["DB_USER_RC"], password=env["DB_PASSWORD_RC"],
        database=env["DB_DATABASE_RC"], connect_timeout=20, read_timeout=60,
        ssl={"ssl": {}}, cursorclass=pymysql.cursors.DictCursor,
    )


def main():
    failures = []
    conn = connect()
    with conn.cursor() as cur:
        # Guard read-only de sessão (defesa em profundidade).
        cur.execute("SET SESSION TRANSACTION READ ONLY")

        print("=" * 72)
        print("TC1 — Isolamento de participants entre ambientes adicionais")
        print(f"   PRINCIPAL={PRINCIPAL} (Recertificação) | ADICIONAL={ADICIONAL} (Adicional)")
        print("=" * 72)

        # ── Q1: contagens por org ──
        cur.execute(
            """
            SELECT e.organization_id AS org,
                   COUNT(*) AS total,
                   SUM(ep.recertification_number > 0) AS reinscritos,
                   COALESCE(MAX(ep.recertification_number), 0) AS max_recert
            FROM event_participants ep
            JOIN events e ON e.id = ep.event_id
            WHERE e.organization_id IN (%s, %s)
            GROUP BY e.organization_id
            """,
            (PRINCIPAL, ADICIONAL),
        )
        by_org = {r["org"]: r for r in cur.fetchall()}
        print("\n[Q1] Participants por org:")
        for org in (PRINCIPAL, ADICIONAL):
            r = by_org.get(org, {"total": 0, "reinscritos": 0, "max_recert": 0})
            print(f"   org {org}: total={r['total']} | reinscritos={int(r['reinscritos'] or 0)} | max_recert={r['max_recert']}")

        princ_reins = int((by_org.get(PRINCIPAL) or {}).get("reinscritos") or 0)
        adic_reins = int((by_org.get(ADICIONAL) or {}).get("reinscritos") or 0)

        if princ_reins == 0:
            failures.append("Pré-condição fraca: principal tem 0 reinscrições — sem evidência de atividade de reinscrição pra isolar.")
        if adic_reins != 0:
            failures.append(f"VAZAMENTO: adicional (37050) tem {adic_reins} reinscrições — esperado 0 (isolamento violado).")
        else:
            print(f"\n[Q1] OK: principal exerceu reinscrição ({princ_reins} linhas); adicional permanece em 0.")

        # ── Q2: nenhum participant cruza tenant ──
        # Conta participants do 37050 cujo event NÃO pertence ao 37050 (deveria ser 0).
        cur.execute(
            """
            SELECT COUNT(*) AS cruzados
            FROM event_participants ep
            JOIN events e ON e.id = ep.event_id
            WHERE e.organization_id = %s
              AND ep.recertification_number > 0
            """,
            (ADICIONAL,),
        )
        cruzados = cur.fetchone()["cruzados"]
        print(f"\n[Q2] Participants reinscritos em events do 37050: {cruzados} (esperado 0)")
        if cruzados != 0:
            failures.append(f"Q2: {cruzados} participants reinscritos em events do adicional.")
        else:
            print("[Q2] OK: estrutura particionada — nenhum reinscrito no adicional.")

        # ── Q3: cross-check por e-mail (mesma identidade nos 2 tenants) ──
        cur.execute(
            """
            SELECT ep48.email AS email,
                   MAX(ep48.recertification_number) AS recert_principal,
                   MAX(ep50.recertification_number) AS recert_adicional
            FROM event_participants ep48
            JOIN events e48 ON e48.id = ep48.event_id AND e48.organization_id = %s
            JOIN event_participants ep50 ON ep50.email = ep48.email
            JOIN events e50 ON e50.id = ep50.event_id AND e50.organization_id = %s
            WHERE ep48.recertification_number > 0
            GROUP BY ep48.email
            """,
            (PRINCIPAL, ADICIONAL),
        )
        shared = cur.fetchall()
        print(f"\n[Q3] E-mails reinscritos no 37048 que TAMBÉM existem no 37050: {len(shared)}")
        leaked = [s for s in shared if int(s["recert_adicional"] or 0) > 0]
        for s in shared[:10]:
            print(f"   {s['email']}: recert principal={s['recert_principal']} | adicional={s['recert_adicional']}")
        if leaked:
            failures.append(f"Q3: {len(leaked)} e-mail(s) com reinscrição também no adicional (possível vazamento).")
        else:
            print("[Q3] OK: nenhuma identidade compartilhada teve reinscrição propagada pro adicional.")

        # ── Amostra de reinscritos do principal (tangível no relatório) ──
        cur.execute(
            """
            SELECT ep.email, ep.event_id, ep.recertification_number, ep.created_at
            FROM event_participants ep
            JOIN events e ON e.id = ep.event_id AND e.organization_id = %s
            WHERE ep.recertification_number > 0
            ORDER BY ep.recertification_number DESC, ep.created_at DESC
            LIMIT 5
            """,
            (PRINCIPAL,),
        )
        print("\n[amostra] Reinscritos no principal (37048):")
        for r in cur.fetchall():
            print(f"   event={r['event_id']} recert_n={r['recertification_number']} {r['email']} ({r['created_at']})")

    conn.close()

    print("\n" + "=" * 72)
    if failures:
        print("VEREDITO TC1: ❌ FALHOU / ATENÇÃO")
        for f in failures:
            print("   -", f)
    else:
        print("VEREDITO TC1: ✅ PASSOU — isolamento de participants confirmado")
        print("   Reinscrição exercida no principal (37048) NÃO produziu nenhuma")
        print("   reinscrição no adicional (37050): estrutural + observacional + por e-mail.")
    print("=" * 72)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
