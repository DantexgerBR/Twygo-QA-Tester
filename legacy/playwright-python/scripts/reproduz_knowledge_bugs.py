"""
Reprodução dos dois bugs da Base de Conhecimento:

BUG 1 — Situação: coluna nunca sai de "Em processamento" para "Indexado"
BUG 2 — Identificação: botão Salvar fica em loading infinito (sem toast, sem redirect)

Paliativo conhecido para Bug 2: F5 (reload) faz o redirect acontecer, exibindo a toast.
"""
import os, json, pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright, expect
from pages.login_page import LoginPage

load_dotenv()

BASE_URL = os.getenv("BASE_URL", "").rstrip("/") + "/"
EMAIL    = os.getenv("ADMIN_EMAIL")
PASSWORD = os.getenv("ADMIN_PASSWORD")
ORG_ID   = os.getenv("ORG_ID", "36675")

OUT = pathlib.Path("test-results/knowledge_bugs")
OUT.mkdir(parents=True, exist_ok=True)


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return p


def dump(page, label, js):
    try:
        r = page.evaluate(js)
        print(f"\n  [{label}] {json.dumps(r, ensure_ascii=False)}")
        return r
    except Exception as e:
        print(f"  [ERRO {label}] {e}")
        return None


# Criar arquivo de imagem JPEG mínimo para upload
def criar_jpeg_teste(path):
    # JPEG mínimo válido (1x1 pixel branco)
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


# Criar PDF mínimo válido para upload
def criar_pdf_teste(path):
    pdf_content = b"""%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF"""
    pathlib.Path(path).write_bytes(pdf_content)


JPEG_FILE = str(OUT / "arquivo_teste.jpg")
PDF_FILE  = str(OUT / "arquivo_teste.pdf")
criar_jpeg_teste(JPEG_FILE)
criar_pdf_teste(PDF_FILE)
print(f"[files] JPEG: {JPEG_FILE}")
print(f"[files] PDF:  {PDF_FILE}")


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False, slow_mo=200)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()

    # ── Login ─────────────────────────────────────────────────────────────────
    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    # ── Navegar para /new ─────────────────────────────────────────────────────
    new_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/new"
    page.goto(new_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(3000)
    shot(page, "01_form_identificacao")
    print("\n=== BUG 2: Identificação — botão Salvar loading infinito ===")

    # ── Preencher Nome e Descrição ────────────────────────────────────────────
    nome_field = page.locator("#knowledge-repositories-form-name-input")
    nome_field.fill("TESTE_AUTOMACAO_BUGS_BC")
    page.wait_for_timeout(300)

    desc_field = page.locator("#knowledge-repositories-form-description-input")
    desc_field.fill("Repositório criado automaticamente para reproduzir bugs de processamento e salvamento")
    page.wait_for_timeout(300)

    shot(page, "02_form_preenchido")

    # ── Clicar em Salvar e monitorar o estado do botão ────────────────────────
    salvar_btn = page.get_by_role("button", name="Salvar")
    print(f"\n  [antes do click] btn disabled={salvar_btn.is_disabled()}")
    shot(page, "03_antes_salvar")

    t_inicio = time.time()
    salvar_btn.click()
    print(f"  [click Salvar] t=0s")
    page.wait_for_timeout(1000)
    shot(page, "04_1s_apos_salvar")

    # Monitorar loading do botão por 15s
    for segundo in range(1, 16):
        page.wait_for_timeout(1000)
        elapsed = time.time() - t_inicio
        url_atual = page.url

        btn_state = dump(page, f"btn_state_t{segundo}s", """
            () => {
                const btn = Array.from(document.querySelectorAll('button'))
                    .find(b => b.innerText?.trim() === 'Salvar' || b.innerText?.includes('Salvar'));
                if (!btn) return {encontrado: false};
                return {
                    text: btn.innerText?.trim(),
                    disabled: btn.disabled,
                    aria_busy: btn.getAttribute('aria-busy'),
                    data_loading: btn.getAttribute('data-loading'),
                    class: btn.className,
                    loading_spinner: !!btn.querySelector('[class*="spinner"], [class*="loading"]')
                };
            }
        """)

        toast = page.locator(".chakra-toast, [class*='toast'], [role='status'], [role='alert']").count()
        print(f"  [t={elapsed:.1f}s] url={url_atual.split('/')[-1]}  toast_count={toast}")

        if url_atual != new_url:
            print(f"  [REDIRECT detectado] → {url_atual}")
            break

    shot(page, "05_15s_apos_salvar")
    url_pos_salvar = page.url

    # Verificar toast após 15s
    dump(page, "toasts_apos_15s", """
        () => Array.from(document.querySelectorAll('[class*="toast"], [role="status"], [role="alert"]'))
            .map(t => ({text: t.innerText?.trim().slice(0,100), class: t.className}))
    """)

    # ── Workaround: F5 para ver se o redirect acontece ────────────────────────
    print(f"\n  [paliativo] Recarregando página (F5)...")
    page.reload(wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(3000)
    url_pos_f5 = page.url
    print(f"  [URL pós-F5] {url_pos_f5}")
    shot(page, "06_apos_f5")

    # Verificar toast pós-F5
    dump(page, "toasts_pos_f5", """
        () => Array.from(document.querySelectorAll('[class*="toast"], [role="status"], [role="alert"], .flash, [class*="flash"], [class*="alert"]'))
            .map(t => ({text: t.innerText?.trim().slice(0,150), class: t.className, visible: t.offsetParent !== null}))
            .filter(t => t.text)
    """)

    # ── Se o repositório foi criado, testar uploads ───────────────────────────
    if "/knowledge_repositories/" in url_pos_f5 and "/new" not in url_pos_f5:
        repo_url = url_pos_f5
        print(f"\n=== BUG 1: Situação — teste de upload e status ===")
        print(f"  [repo criado] {repo_url}")

        # Abrir aba "Fontes de conhecimento"
        try:
            fontes_tab = page.get_by_role("tab", name="Fontes de conhecimento")
            fontes_tab.click()
            page.wait_for_timeout(3000)
            shot(page, "07_fontes_conhecimento_tab")
        except Exception as e:
            print(f"  [ERRO abrir Fontes de conhecimento] {e}")

        # Mapear a aba de Fontes de conhecimento
        dump(page, "estrutura_fontes", """
            () => {
                const panel = document.querySelector('[role="tabpanel"]');
                if (!panel) return [{msg: 'sem tabpanel'}];
                return {
                    text_snippet: panel.innerText?.slice(0, 500),
                    buttons: Array.from(panel.querySelectorAll('button')).map(b => ({text: b.innerText?.trim(), id: b.id, class: b.className})),
                    inputs: Array.from(panel.querySelectorAll('input')).map(i => ({type: i.type, id: i.id, name: i.name, accept: i.getAttribute('accept')})),
                    table_headers: Array.from(panel.querySelectorAll('th')).map(th => th.innerText?.trim())
                };
            }
        """)

        shot(page, "08_fontes_mapeadas")

        # Tentar upload de JPEG
        try:
            file_input = page.locator("input[type='file']").first
            if file_input.count() > 0:
                print(f"\n  [upload] Enviando JPEG...")
                file_input.set_input_files(JPEG_FILE)
                page.wait_for_timeout(3000)
                shot(page, "09_apos_upload_jpeg")

                # Checar coluna Situação
                dump(page, "situacao_imediatamente", """
                    () => {
                        const cells = Array.from(document.querySelectorAll('td, [class*="status"], [class*="situation"], [class*="badge"]'));
                        return cells.filter(c => {
                            const t = c.innerText?.trim();
                            return t && (t.toLowerCase().includes('process') || t.toLowerCase().includes('index') || t.toLowerCase().includes('situa'));
                        }).map(c => ({text: c.innerText?.trim(), class: c.className}));
                    }
                """)

                # Aguardar 30s e checar se mudou para "Indexado"
                print(f"  [aguardando 30s] Verificando se Situação muda de 'Em processamento' para 'Indexado'...")
                for i in range(6):
                    page.wait_for_timeout(5000)
                    dump(page, f"situacao_{(i+1)*5}s", """
                        () => {
                            const cells = Array.from(document.querySelectorAll('td, [class*="status"], [class*="badge"], span'));
                            return cells.filter(c => {
                                const t = c.innerText?.trim();
                                return t && (t.toLowerCase().includes('process') || t.toLowerCase().includes('index'));
                            }).map(c => ({text: c.innerText?.trim(), class: c.className})).slice(0, 5);
                        }
                    """)

                shot(page, "10_situacao_30s_depois")

            else:
                print("  [AVISO] Nenhum input[type=file] encontrado na aba Fontes de conhecimento")
        except Exception as e:
            print(f"  [ERRO upload] {e}")

    elif "/new" in url_pos_f5:
        print(f"\n  [BUG 2 CONFIRMADO] Mesmo após F5, URL ainda é /new — repositório NÃO foi salvo.")
        shot(page, "07_bug2_confirmado_nao_salvou")
    else:
        # Repositório pode ter sido criado sem redirect
        print(f"\n  [URL desconhecida] {url_pos_f5}")
        shot(page, "07_url_desconhecida")

    browser.close()
    print("\n==> Script de reprodução concluído.")
    print(f"    Screenshots em: {OUT}")
