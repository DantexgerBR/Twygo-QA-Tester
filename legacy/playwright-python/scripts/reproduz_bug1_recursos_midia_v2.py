"""
Reprodução Bug 1 v2 — Recursos de mídia (JPEG/PNG → Situação "Em processamento"):
Seletores corretos: #knowledge-repositories-resources-form-name-input
URL: /knowledge_repositories/{id}/knowledge_resources/new
"""
import os, json, pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage

load_dotenv()

BASE_URL = os.getenv("BASE_URL","").rstrip("/")+"/"
EMAIL    = os.getenv("ADMIN_EMAIL")
PASSWORD = os.getenv("ADMIN_PASSWORD")
ORG_ID   = os.getenv("ORG_ID","36675")
REPO_ID  = "333"

OUT = pathlib.Path("test-results/bug1_recursos_midia_v2")
OUT.mkdir(parents=True, exist_ok=True)

JPEG_FILE = str(pathlib.Path("test-results/bug1_jpeg_midia/imagem_teste.jpg"))


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return str(p)


def ler_linhas(page):
    try:
        return page.evaluate("""
            () => Array.from(document.querySelectorAll('tbody tr')).map(r => ({
                cells: Array.from(r.querySelectorAll('td')).map(c => c.innerText?.trim())
            }))
        """)
    except Exception:
        return []


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()

    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    # Navegar direto para /new de recursos de mídia
    new_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/knowledge_resources/new"
    page.goto(new_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(4000)
    shot(page, "01_form_recurso_midia")

    # Preencher Nome (ID correto)
    page.locator("#knowledge-repositories-resources-form-name-input").fill("JPEG Recurso Teste Bug Situacao")
    page.wait_for_timeout(200)

    # Preencher Descrição
    page.locator("#knowledge-repositories-resources-form-description-textarea").fill("Imagem JPEG para reproduzir Bug 1 - Situacao nao muda para Indexado")
    page.wait_for_timeout(200)

    shot(page, "02_form_preenchido")

    # Upload JPEG (accept: image/jpeg,.jpg,.jpeg,image/png,.png)
    print(f"  [upload JPEG]")
    page.locator("#drop-zone-upload-input").set_input_files(JPEG_FILE)
    page.wait_for_timeout(2000)
    shot(page, "03_jpeg_selecionado")

    # ── Bug 2 no recurso de mídia: botão Salvar → loading? ──────────────────
    print("\n=== Salvar recurso de mídia (verificar Bug 2) ===")
    salvar = page.get_by_role("button", name="Salvar")
    t0 = time.time()
    salvar.click()

    pagina_branca = False
    redirect_url = None
    for seg in range(1, 13):
        page.wait_for_timeout(1000)
        elapsed = time.time() - t0
        try:
            url_now = page.url
            body_len = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
            print(f"  [t={elapsed:.1f}s] url={url_now.split('/')[-1]}  body={body_len}")
            if body_len < 100 and seg >= 2:
                pagina_branca = True
            if url_now != new_url:
                redirect_url = url_now
                print(f"  [REDIRECT] → {url_now}")
                break
        except Exception:
            page.wait_for_load_state("domcontentloaded", timeout=10000)
            redirect_url = page.url
            body_len = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
            print(f"  [navegação detectada] → {redirect_url}  body={body_len}")
            if body_len < 100:
                pagina_branca = True
            break

    shot(page, "04_pos_salvar")
    toasts = page.evaluate("""() => Array.from(document.querySelectorAll('.chakra-toast')).map(t => t.innerText?.trim())""")
    print(f"  [toasts] {toasts}")
    print(f"  [página em branco] {pagina_branca}")

    # ── Bug 1: Monitorar coluna Situação ─────────────────────────────────────
    print("\n=== Bug 1: Monitorar Situação por 2 minutos ===")
    edit_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/edit?tab=identification"
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    page.get_by_role("tab", name="Recursos de mídia").click()
    page.wait_for_timeout(3000)
    shot(page, "05_lista_recursos_apos_upload")

    linhas_inicial = ler_linhas(page)
    print(f"  [estado inicial] {json.dumps(linhas_inicial, ensure_ascii=False)}")

    if not linhas_inicial or (len(linhas_inicial) == 1 and "Não há dados" in str(linhas_inicial[0])):
        print("  [AVISO] Lista vazia — upload pode ter falhado (validação de nome?)")
    else:
        print("\n  [Monitorando por 2min]...")
        nunca_indexou = True
        for tick in range(8):
            page.wait_for_timeout(15000)
            page.reload(wait_until="domcontentloaded", timeout=20000)
            page.wait_for_timeout(3000)
            try:
                page.get_by_role("tab", name="Recursos de mídia").click()
                page.wait_for_timeout(2000)
            except Exception:
                pass
            linhas_agora = ler_linhas(page)
            print(f"  [{(tick+1)*15}s] {json.dumps(linhas_agora, ensure_ascii=False)}")
            for row in linhas_agora:
                for c in row.get("cells", []):
                    if "index" in str(c).lower():
                        nunca_indexou = False
                        print(f"  [INDEXADO em {(tick+1)*15}s!]")

        shot(page, "06_situacao_2min")
        if nunca_indexou:
            print("\n  ✓ BUG 1 CONFIRMADO: Situação NUNCA mudou para 'Indexado' em 2 minutos")
        else:
            print("\n  ✗ BUG 1 NÃO reproduzido: arquivo indexou dentro de 2 minutos")

    browser.close()
    print(f"\n==> Concluído. Screenshots em: {OUT}")
