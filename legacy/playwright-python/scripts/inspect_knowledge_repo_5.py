"""
Inspeção 5: Modal de upload de arquivo (Fontes de conhecimento → + Adicionar).
Usa click via evaluate para evitar ambiguidade com outros botões "Adicionar".
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
REPO_ID   = "333"

OUT = pathlib.Path("test-results/inspect_knowledge_repo_5")
OUT.mkdir(parents=True, exist_ok=True)

JPEG_FILE = str(pathlib.Path("test-results/knowledge_bugs/arquivo_teste.jpg"))


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
    browser = pw.chromium.launch(headless=False, slow_mo=400)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()

    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    edit_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/edit?tab=identification"
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)

    # Clicar na aba "Fontes de conhecimento"
    page.get_by_role("tab", name="Fontes de conhecimento").click()
    page.wait_for_timeout(4000)
    shot(page, "01_fontes_tab")

    # Mapear o container real da aba (não depende de role=tabpanel)
    dump(page, "container_fontes", """
        () => {
            // Procurar pelo botão "+ Adicionar" que está DENTRO da área de conteúdo
            const btns = Array.from(document.querySelectorAll('button'));
            const adicionar = btns.find(b => b.innerText?.trim().includes('Adicionar') && b.closest('[class*="tab"], [id*="tab"]'));
            const container = adicionar?.closest('[class*="tab"], [class*="panel"], main, [class*="content"]');
            return {
                btn_found: !!adicionar,
                btn_text: adicionar?.innerText?.trim(),
                btn_id: adicionar?.id,
                btn_class: adicionar?.className,
                container_tag: container?.tagName,
                container_class: container?.className?.slice(0, 80),
                container_children: container?.children?.length
            };
        }
    """)

    # Click via evaluate no botão "+ Adicionar" da aba Fontes
    clicked = page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button'));
            // O botão correto tem "+" antes de "Adicionar" e está dentro da área de conteúdo
            const btn = btns.find(b => {
                const txt = b.innerText?.trim();
                return txt && txt.includes('Adicionar') && !b.closest('[class*="popover"], [class*="navbar"], header, nav');
            });
            if (btn) { btn.click(); return btn.innerText?.trim(); }
            return null;
        }
    """)
    print(f"\n  [click via evaluate] botão clicado: '{clicked}'")
    page.wait_for_timeout(4000)
    shot(page, "02_apos_click_adicionar")

    # Mapear o que abriu (modal/drawer/dialog)
    dump(page, "overlay_aberto", """
        () => {
            const overlay = document.querySelector('[role="dialog"], [class*="modal"], [class*="drawer"], [class*="overlay"]');
            if (!overlay) return {found: false, body_new_elements: document.body.innerHTML.length};
            return {
                found: true,
                role: overlay.getAttribute('role'),
                class: overlay.className?.slice(0, 80),
                text: overlay.innerText?.slice(0, 600),
                inputs: Array.from(overlay.querySelectorAll('input, textarea')).map(i => ({
                    type: i.type, id: i.id, name: i.name, placeholder: i.placeholder,
                    accept: i.getAttribute('accept'),
                    label: document.querySelector(`label[for="${i.id}"]`)?.innerText?.trim()
                })),
                buttons: Array.from(overlay.querySelectorAll('button')).map(b => ({
                    text: b.innerText?.trim(), id: b.id
                }))
            };
        }
    """)

    # Verificar file inputs em toda a página após o click
    dump(page, "todos_file_inputs", """
        () => Array.from(document.querySelectorAll('input[type="file"]')).map(i => ({
            id: i.id, name: i.name, accept: i.getAttribute('accept'),
            multiple: i.multiple,
            visible: i.offsetParent !== null,
            parent_class: i.parentElement?.className?.slice(0, 80)
        }))
    """)

    # Tentar upload pelo input[file] mais recentemente adicionado
    file_inputs = page.locator("input[type='file']")
    n = file_inputs.count()
    print(f"\n  [file inputs encontrados] {n}")
    if n > 0:
        for i in range(n):
            try:
                fi = file_inputs.nth(i)
                fi.set_input_files(JPEG_FILE)
                print(f"  [upload no input #{i}] OK")
                page.wait_for_timeout(2000)
                shot(page, f"03_upload_{i}")
                break
            except Exception as e:
                print(f"  [input #{i} falhou] {e}")

    shot(page, "04_estado_apos_tentativa_upload")

    # Dump do HTML do overlay para análise manual
    html_overlay = page.evaluate("""
        () => {
            const overlay = document.querySelector('[role="dialog"], [class*="modal-content"], [class*="drawer-content"]');
            return overlay?.innerHTML?.slice(0, 5000) || 'sem overlay';
        }
    """)
    with open(str(OUT / "overlay_html.txt"), "w") as f:
        f.write(html_overlay)
    print(f"\n  [html] {OUT}/overlay_html.txt")

    browser.close()
    print("\n==> Inspeção 5 concluída.")
