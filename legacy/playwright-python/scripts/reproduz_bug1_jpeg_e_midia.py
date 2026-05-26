"""
Reprodução Bug 1:
- Testa upload de JPEG (forçado, fora do accept list) para ver se fica "Em processamento"
- Também mapeia a aba "Recursos de mídia" (pode ser onde JPEGs são suportados)
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

OUT = pathlib.Path("test-results/bug1_jpeg_midia")
OUT.mkdir(parents=True, exist_ok=True)


def criar_jpeg(path):
    jpeg_bytes = bytes([
        0xFF,0xD8,0xFF,0xE0,0x00,0x10,0x4A,0x46,0x49,0x46,0x00,0x01,
        0x01,0x00,0x00,0x01,0x00,0x01,0x00,0x00,0xFF,0xDB,0x00,0x43,
        0x00,0x08,0x06,0x06,0x07,0x06,0x05,0x08,0x07,0x07,0x07,0x09,
        0x09,0x08,0x0A,0x0C,0x14,0x0D,0x0C,0x0B,0x0B,0x0C,0x19,0x12,
        0x13,0x0F,0x14,0x1D,0x1A,0x1F,0x1E,0x1D,0x1A,0x1C,0x1C,0x20,
        0x24,0x2E,0x27,0x20,0x22,0x2C,0x23,0x1C,0x1C,0x28,0x37,0x29,
        0x2C,0x30,0x31,0x34,0x34,0x34,0x1F,0x27,0x39,0x3D,0x38,0x32,
        0x3C,0x2E,0x33,0x34,0x32,0xFF,0xC0,0x00,0x0B,0x08,0x00,0x01,
        0x00,0x01,0x01,0x01,0x11,0x00,0xFF,0xC4,0x00,0x1F,0x00,0x00,
        0x01,0x05,0x01,0x01,0x01,0x01,0x01,0x01,0x00,0x00,0x00,0x00,
        0x00,0x00,0x00,0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,
        0x09,0x0A,0x0B,0xFF,0xC4,0x00,0xB5,0x10,0x00,0x02,0x01,0x03,
        0x03,0x02,0x04,0x03,0x05,0x05,0x04,0x04,0x00,0x00,0x01,0x7D,
        0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,0x21,0x31,0x41,0x06,
        0x13,0x51,0x61,0x07,0x22,0x71,0x14,0x32,0x81,0x91,0xA1,0x08,
        0x23,0x42,0xB1,0xC1,0x15,0x52,0xD1,0xF0,0x24,0x33,0x62,0x72,
        0x82,0xFF,0xDA,0x00,0x08,0x01,0x01,0x00,0x00,0x3F,0x00,0xFB,
        0xDE,0xCA,0xFB,0xDE,0xCA,0xFF,0xD9
    ])
    pathlib.Path(path).write_bytes(jpeg_bytes)


JPEG_FILE = str(OUT / "imagem_teste.jpg")
criar_jpeg(JPEG_FILE)
print(f"[jpeg] {JPEG_FILE}")


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return str(p)


def dump(page, label, js):
    try:
        r = page.evaluate(js)
        print(f"\n  [{label}] {json.dumps(r, ensure_ascii=False)}")
        return r
    except Exception as e:
        print(f"  [ERRO {label}] {e}")
        return None


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()

    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    edit_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/edit?tab=identification"

    # ── Parte 1: JPEG na aba Fontes de conhecimento ───────────────────────────
    print("\n=== Bug 1 — Teste com JPEG ===")
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    page.get_by_role("tab", name="Fontes de conhecimento").click()
    page.wait_for_timeout(3000)

    # Navegar para adicionar fonte
    page.evaluate("""
        () => {
            const btn = Array.from(document.querySelectorAll('button')).find(b =>
                b.innerText?.trim().includes('Adicionar') &&
                !b.closest('[class*="popover"], header, nav')
            );
            if (btn) btn.click();
        }
    """)
    page.wait_for_url("**/knowledge_sources/**", timeout=10000)
    page.wait_for_timeout(3000)
    print(f"  [URL] {page.url}")

    page.locator("#knowledge-repositories-sources-form-name-input").fill("JPEG Teste Bug 1")
    page.locator("#knowledge-repositories-sources-form-description-textarea").fill("Imagem JPEG para reproduzir bug de processamento")

    # Forçar upload de JPEG removendo o accept do input
    page.evaluate("""
        () => {
            const input = document.getElementById('drop-zone-upload-input');
            if (input) input.removeAttribute('accept');
        }
    """)
    file_input = page.locator("#drop-zone-upload-input")
    file_input.set_input_files(JPEG_FILE)
    page.wait_for_timeout(2000)
    shot(page, "01_jpeg_selecionado")

    dump(page, "preview_jpeg", """
        () => {
            const area = document.querySelector('[class*="drop"], [class*="upload-area"]');
            return {text: area?.innerText?.trim().slice(0,200)};
        }
    """)

    salvar = page.get_by_role("button", name="Salvar")
    salvar.click()
    page.wait_for_timeout(8000)

    try:
        page.wait_for_load_state("domcontentloaded", timeout=10000)
    except Exception:
        pass

    print(f"  [URL pós-salvar] {page.url}")
    shot(page, "02_pos_salvar_jpeg")

    # Verificar situação imediata do JPEG
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    try:
        page.get_by_role("tab", name="Fontes de conhecimento").click()
        page.wait_for_timeout(3000)
    except Exception:
        pass

    shot(page, "03_fontes_com_jpeg")
    linhas = dump(page, "linhas_situacao_inicial", """
        () => Array.from(document.querySelectorAll('tbody tr')).map(r => ({
            cells: Array.from(r.querySelectorAll('td')).map(c => c.innerText?.trim())
        }))
    """)

    # Monitorar por 90s
    print("\n  [monitorando por 90s]...")
    jpeg_indexou = False
    for tick in range(6):
        page.wait_for_timeout(15000)
        page.reload(wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(3000)
        try:
            page.get_by_role("tab", name="Fontes de conhecimento").click()
            page.wait_for_timeout(2000)
        except Exception:
            pass
        linhas_agora = dump(page, f"situacao_{(tick+1)*15}s", """
            () => Array.from(document.querySelectorAll('tbody tr')).map(r => ({
                cells: Array.from(r.querySelectorAll('td')).map(c => c.innerText?.trim())
            }))
        """)
        if linhas_agora:
            for row in linhas_agora:
                cells = row.get("cells", [])
                for c in cells:
                    if "index" in str(c).lower() and "jpeg" in str(cells).lower():
                        jpeg_indexou = True
                        print(f"  [JPEG INDEXADO em {(tick+1)*15}s!] {cells}")

    shot(page, "04_situacao_90s_jpeg")
    if not jpeg_indexou:
        print("\n  [BUG 1 CONFIRMADO] JPEG ficou em 'Em processamento' — não indexou em 90s")

    # ── Parte 2: Aba Recursos de mídia ───────────────────────────────────────
    print("\n=== Aba Recursos de mídia ===")
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    try:
        page.get_by_role("tab", name="Recursos de mídia").click()
        page.wait_for_timeout(4000)
    except Exception as e:
        print(f"  [ERRO abrir Recursos de mídia] {e}")

    shot(page, "05_recursos_midia_tab")

    dump(page, "recursos_midia_estrutura", """
        () => {
            return {
                text: document.body.innerText?.slice(0, 400),
                buttons: Array.from(document.querySelectorAll('button')).map(b => ({text: b.innerText?.trim(), id: b.id})).filter(b => b.text && b.text.length < 30),
                table_headers: Array.from(document.querySelectorAll('th')).map(th => th.innerText?.trim()),
                file_inputs: Array.from(document.querySelectorAll('input[type="file"]')).map(i => ({id: i.id, accept: i.getAttribute('accept')}))
            };
        }
    """)

    browser.close()
    print(f"\n==> Concluído. Screenshots em: {OUT}")
