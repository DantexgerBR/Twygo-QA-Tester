"""
Reprodução v2 — página "Adicionar fonte de conhecimento":
  Bug 1: coluna Situação fica em "Em processamento" e nunca muda para "Indexado"
  Bug 2: botão Salvar fica em loading infinito (página em branco pós-redirect)

Nota: o formulário aceita apenas .pdf, .doc, .docx, .ppt, .pptx, .mp4, .mp3
(JPEG/PNG não são suportados nesta aba — Recursos de mídia pode aceitar imagens)
"""
import os, json, pathlib, sys, time, struct, zlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage

load_dotenv()

BASE_URL  = os.getenv("BASE_URL", "").rstrip("/") + "/"
EMAIL     = os.getenv("ADMIN_EMAIL")
PASSWORD  = os.getenv("ADMIN_PASSWORD")
ORG_ID    = os.getenv("ORG_ID", "36675")
REPO_ID   = "333"

OUT = pathlib.Path("test-results/knowledge_bugs_v2")
OUT.mkdir(parents=True, exist_ok=True)


def criar_pdf_com_texto(path):
    """PDF válido com texto indexável."""
    content = b"""%PDF-1.4
1 0 obj
<</Type /Catalog /Pages 2 0 R>>
endobj

2 0 obj
<</Type /Pages /Kids [3 0 R] /Count 1>>
endobj

3 0 obj
<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
/Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>>
endobj

4 0 obj
<</Length 44>>
stream
BT /F1 12 Tf 100 700 Td (Teste de automacao QA) Tj ET
endstream
endobj

5 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
endobj

xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000000360 00000 n

trailer
<</Size 6 /Root 1 0 R>>
startxref
441
%%EOF"""
    pathlib.Path(path).write_bytes(content)


PDF_TESTE = str(OUT / "fonte_teste.pdf")
criar_pdf_com_texto(PDF_TESTE)
print(f"[pdf] {PDF_TESTE}")


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
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()

    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    # Navegar para o edit page e abrir Fontes de conhecimento
    edit_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/edit?tab=identification"
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    page.get_by_role("tab", name="Fontes de conhecimento").click()
    page.wait_for_timeout(3000)
    shot(page, "01_fontes_tab")

    # Clicar + Adicionar (navega para página nova)
    page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => {
                const txt = b.innerText?.trim();
                return txt && txt.includes('Adicionar') &&
                       !b.closest('[class*="popover"], [class*="navbar"], header, nav');
            });
            if (btn) btn.click();
        }
    """)
    page.wait_for_url("**/knowledge_sources/**", timeout=10000)
    page.wait_for_timeout(3000)
    adicionar_url = page.url
    print(f"\n  [URL adicionar] {adicionar_url}")
    shot(page, "02_adicionar_fonte_page")

    # ── Preencher formulário ──────────────────────────────────────────────────
    page.locator("#knowledge-repositories-sources-form-name-input").fill("Fonte PDF Teste Automação")
    page.wait_for_timeout(300)
    page.locator("#knowledge-repositories-sources-form-description-textarea").fill("Arquivo PDF criado automaticamente para teste de indexação")

    page.wait_for_timeout(300)
    shot(page, "03_form_preenchido")

    # Upload do PDF via dropzone
    file_input = page.locator("#drop-zone-upload-input")
    print(f"\n  [upload PDF] {PDF_TESTE}")
    try:
        file_input.set_input_files(PDF_TESTE)
        page.wait_for_timeout(3000)
        shot(page, "04_pdf_selecionado")

        dump(page, "preview_upload", """
            () => {
                const area = document.querySelector('[class*="drop"], [class*="upload-area"], [id*="upload"]');
                return {
                    text: area?.innerText?.trim().slice(0, 200),
                    progress: document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')
                };
            }
        """)
    except Exception as e:
        print(f"  [ERRO upload] {e}")
        shot(page, "04_erro_upload")

    # ── BUG 2: clicar Salvar e monitorar loading ──────────────────────────────
    print("\n=== BUG 2: Salvar fonte → loading infinito? ===")
    salvar = page.get_by_role("button", name="Salvar")
    print(f"  [antes do click] disabled={salvar.is_disabled()}")
    shot(page, "05_antes_salvar")

    t0 = time.time()
    salvar.click()
    print(f"  [click Salvar] t=0s")

    pagina_branca_detectada = False
    for seg in range(1, 13):
        page.wait_for_timeout(1000)
        elapsed = time.time() - t0
        try:
            url_now = page.url
            body_len = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
            toast_count = page.locator(".chakra-toast").count()
        except Exception:
            # Página navegou — capturar novo estado
            page.wait_for_load_state("domcontentloaded", timeout=10000)
            url_now = page.url
            body_len = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
            toast_count = 0

        if body_len < 200 and seg >= 2:
            pagina_branca_detectada = True
            print(f"  [t={elapsed:.1f}s] PÁGINA EM BRANCO detectada! body_len={body_len}")
        else:
            print(f"  [t={elapsed:.1f}s] url={url_now.split('/')[-1]}  body={body_len}  toasts={toast_count}")

        if url_now != adicionar_url:
            print(f"  [REDIRECT] → {url_now}")
            break

    shot(page, "06_pos_salvar_10s")
    url_pos_salvar = page.url

    # Toast
    dump(page, "toasts_pos_salvar", """
        () => Array.from(document.querySelectorAll('.chakra-toast')).map(t => t.innerText?.trim())
    """)

    # F5 se página em branco
    if pagina_branca_detectada:
        print("\n  [paliativo F5]")
        page.reload(wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(3000)
        shot(page, "07_pos_f5")
        dump(page, "toasts_pos_f5", """
            () => Array.from(document.querySelectorAll('.chakra-toast, .flash, [class*="alert"]')).map(t => t.innerText?.trim()).filter(t => t)
        """)

    # ── BUG 1: Verificar coluna Situação ─────────────────────────────────────
    print("\n=== BUG 1: Coluna Situação — monitorar por 2 min ===")

    # Navegar para a tab Fontes do repo
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    page.get_by_role("tab", name="Fontes de conhecimento").click()
    page.wait_for_timeout(3000)
    shot(page, "08_fontes_com_registro")

    def ler_situacao(page):
        return page.evaluate("""
            () => {
                const rows = Array.from(document.querySelectorAll('tbody tr, [class*="table-row"], [class*="list-item"]'));
                return rows.map(r => ({
                    cells: Array.from(r.querySelectorAll('td, [class*="cell"]')).map(c => c.innerText?.trim())
                })).filter(r => r.cells.length > 0);
            }
        """)

    situacao_inicial = ler_situacao(page)
    print(f"  [situacao inicial] {json.dumps(situacao_inicial, ensure_ascii=False)}")

    if not situacao_inicial:
        print("  [AVISO] Nenhum registro na tabela — upload pode não ter sido salvo")
    else:
        print("\n  [monitorando Situação por 2 minutos (recarregando a cada 15s)]...")
        nunca_indexou = True
        for i in range(8):  # 8 x 15s = 2min
            page.wait_for_timeout(15000)
            page.reload(wait_until="domcontentloaded", timeout=20000)
            page.wait_for_timeout(3000)
            try:
                page.get_by_role("tab", name="Fontes de conhecimento").click()
                page.wait_for_timeout(2000)
            except Exception:
                pass
            situacao_agora = ler_situacao(page)
            print(f"  [{(i+1)*15}s] {json.dumps(situacao_agora, ensure_ascii=False)}")
            for row in situacao_agora:
                for c in row.get("cells", []):
                    if "index" in str(c).lower():
                        print(f"  [INDEXADO em {(i+1)*15}s!]")
                        nunca_indexou = False
                        break
            if not nunca_indexou:
                break

        shot(page, "09_situacao_2min_depois")
        if nunca_indexou:
            print("\n  [BUG 1 CONFIRMADO] Situação NUNCA mudou para 'Indexado' após 2 minutos")

    browser.close()
    print(f"\n==> Reprodução concluída. Screenshots em: {OUT}")
