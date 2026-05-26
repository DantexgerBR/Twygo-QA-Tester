"""
Inspeção 3:
  - Bug 2 (confirmação): editar repo existente → Salvar → tela em branco
  - Bug 1: "+ Adicionar" na aba Fontes de conhecimento → modal de upload → coluna Situação
"""
import os, json, pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage

load_dotenv()

BASE_URL  = os.getenv("BASE_URL", "").rstrip("/") + "/"
EMAIL     = os.getenv("ADMIN_EMAIL")
PASSWORD  = os.getenv("ADMIN_PASSWORD")
ORG_ID    = os.getenv("ORG_ID", "36675")
REPO_ID   = "333"  # criado no script anterior

OUT = pathlib.Path("test-results/inspect_knowledge_repo_3")
OUT.mkdir(parents=True, exist_ok=True)

JPEG_FILE = str(pathlib.Path("test-results/knowledge_bugs/arquivo_teste.jpg"))
PDF_FILE  = str(pathlib.Path("test-results/knowledge_bugs/arquivo_teste.pdf"))


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return str(p)


def dump(page, label, js):
    try:
        r = page.evaluate(js)
        print(f"\n  [{label}]\n  {json.dumps(r, ensure_ascii=False, indent=2)}")
        return r
    except Exception as e:
        print(f"  [ERRO {label}] {e}")
        return None


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False, slow_mo=300)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()

    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    edit_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/edit?tab=identification"
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(4000)
    shot(page, "01_edit_identificacao")
    print(f"\n  [URL] {page.url}")

    # ── BUG 2: Editar Identificação e Salvar (no repo existente) ──────────────
    print("\n=== BUG 2: Editar Identificação → Salvar → tela em branco? ===")
    try:
        desc_field = page.locator("#knowledge-repositories-form-description-input")
        desc_field.fill("Descrição atualizada pela automação — teste de loading infinito")
        page.wait_for_timeout(500)
        shot(page, "02_campo_editado")

        salvar = page.get_by_role("button", name="Salvar")
        t0 = time.time()
        salvar.click()
        print(f"  [click Salvar] t=0s")

        for i in range(1, 8):
            page.wait_for_timeout(1000)
            url_now = page.url
            # checar se página em branco (nenhum filho no main content)
            has_content = page.evaluate("""
                () => {
                    const main = document.querySelector('[class*="main-content"], main, #main, .container-fluid');
                    const tabs = document.querySelector('[role="tabpanel"], [class*="tab-panel"]');
                    return {
                        main_children: main?.children?.length ?? -1,
                        tabs_found: !!tabs,
                        body_text_len: document.body.innerText?.trim().length
                    };
                }
            """)
            toast = page.locator(".chakra-toast").count()
            print(f"  [t={i}s] url={url_now.split('?')[0].split('/')[-1]}  content={has_content}  toasts={toast}")
            if url_now != edit_url:
                print(f"  [redirect] → {url_now}")
                break

        shot(page, "03_pos_salvar_edit")
        print(f"  [URL final] {page.url}")
        print(f"  [body_text len] {page.evaluate('() => document.body.innerText?.trim().length')}")

    except Exception as e:
        print(f"  [ERRO Bug2] {e}")

    # ── Navegar para aba Fontes de conhecimento ───────────────────────────────
    print("\n=== BUG 1: Aba Fontes de conhecimento ===")
    fontes_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/edit?tab=knowledge_sources"
    try:
        page.goto(fontes_url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(4000)
    except Exception as e:
        # fallback: clicar na tab
        try:
            page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
            page.wait_for_timeout(3000)
            page.get_by_role("tab", name="Fontes de conhecimento").click()
            page.wait_for_timeout(3000)
        except Exception as e2:
            print(f"  [ERRO navegar fontes] {e2}")
    shot(page, "04_fontes_tab")

    # Mapear o "+ Adicionar" e o que aparece
    dump(page, "tab_fontes_estrutura", """
        () => {
            const tab = document.querySelector('[role="tabpanel"]') || document.body;
            return {
                text: tab.innerText?.slice(0, 300),
                buttons: Array.from(tab.querySelectorAll('button')).map(b => ({text: b.innerText?.trim(), id: b.id, class: b.className})),
                table_headers: Array.from(tab.querySelectorAll('th')).map(th => th.innerText?.trim()),
                inputs: Array.from(tab.querySelectorAll('input')).map(i => ({type: i.type, id: i.id, accept: i.getAttribute('accept')}))
            };
        }
    """)

    # Clicar no "+ Adicionar"
    print("\n  [click] Botão + Adicionar")
    try:
        adicionar_btn = page.get_by_role("button", name="Adicionar")
        adicionar_btn.click()
        page.wait_for_timeout(3000)
        shot(page, "05_modal_adicionar")

        dump(page, "modal_adicionar", """
            () => {
                const modal = document.querySelector('[role="dialog"], [class*="modal"], [class*="drawer"]');
                if (!modal) return {found: false, all_buttons: Array.from(document.querySelectorAll('button')).map(b => b.innerText?.trim())};
                return {
                    found: true,
                    text: modal.innerText?.slice(0, 500),
                    inputs: Array.from(modal.querySelectorAll('input, textarea')).map(i => ({
                        type: i.type, id: i.id, name: i.name, placeholder: i.placeholder, accept: i.getAttribute('accept'),
                        label: document.querySelector(`label[for="${i.id}"]`)?.innerText?.trim()
                    })),
                    buttons: Array.from(modal.querySelectorAll('button')).map(b => ({text: b.innerText?.trim(), id: b.id})),
                    upload_area: !!modal.querySelector('[class*="upload"], [class*="dropzone"], input[type="file"]')
                };
            }
        """)
    except Exception as e:
        print(f"  [ERRO click Adicionar] {e}")

    shot(page, "06_modal_mapeado")

    # Tentar fazer upload pelo modal
    print("\n  Tentando upload de arquivo via modal...")
    try:
        file_input_modal = page.locator('[role="dialog"] input[type="file"], input[type="file"]').first
        if file_input_modal.count() > 0:
            print("  [file input encontrado] Fazendo upload JPEG...")
            file_input_modal.set_input_files(JPEG_FILE)
            page.wait_for_timeout(2000)
            shot(page, "07_arquivo_selecionado")

            dump(page, "preview_arquivo", """
                () => {
                    const modal = document.querySelector('[role="dialog"]') || document.body;
                    return {
                        text: modal.innerText?.slice(0, 400),
                        upload_inputs: Array.from(modal.querySelectorAll('input')).map(i => ({type: i.type, value: i.value?.slice(0,50), files: i.files?.length}))
                    };
                }
            """)
        else:
            print("  [sem file input no modal] Mapeando área de upload...")
            dump(page, "upload_area_alternativa", """
                () => {
                    return {
                        dropzones: Array.from(document.querySelectorAll('[class*="drop"], [class*="upload"], [data-testid*="upload"]'))
                            .map(d => ({tag: d.tagName, class: d.className, text: d.innerText?.slice(0,100)})),
                        file_inputs: Array.from(document.querySelectorAll('input[type="file"]'))
                            .map(i => ({id: i.id, accept: i.getAttribute('accept'), visible: i.offsetParent !== null}))
                    };
                }
            """)
    except Exception as e:
        print(f"  [ERRO upload modal] {e}")

    # Campos de identificação do arquivo (nome, descrição)
    dump(page, "campos_modal", """
        () => {
            const modal = document.querySelector('[role="dialog"]') || document.body;
            return Array.from(modal.querySelectorAll('input[type="text"], textarea, input[type="file"]')).map(i => ({
                type: i.type, id: i.id, name: i.name, placeholder: i.placeholder,
                label: document.querySelector(`label[for="${i.id}"]`)?.innerText?.trim()
            }));
        }
    """)

    shot(page, "08_estado_final_modal")
    browser.close()
    print("\n==> Inspeção 3 concluída.")
