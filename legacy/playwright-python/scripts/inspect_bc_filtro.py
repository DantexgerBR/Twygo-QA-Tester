"""
Inspeção: filtro na listagem da Base de conhecimento.
Foco: botão "Filtro", modal/painel de filtros, opções "Aplicar" vs "Aplicar e salvar".
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

OUT = pathlib.Path("test-results/inspect_bc_filtro")
OUT.mkdir(parents=True, exist_ok=True)


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return str(p)


def dump(page, label, js):
    try:
        r = page.evaluate(js)
        print(f"\n  [{label}] {json.dumps(r, ensure_ascii=False, indent=2)}")
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

    lista_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories"
    page.goto(lista_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    shot(page, "01_listagem_bc")

    # Mapear botões na listagem
    dump(page, "botoes_listagem", """
        () => Array.from(document.querySelectorAll('button')).map(b => ({
            text: b.innerText?.trim(), id: b.id, class: b.className.slice(0,60)
        })).filter(b => b.text && b.text.length < 40)
    """)

    # Clicar no botão Filtro
    print("\n  [click] Botão Filtro")
    filtro_clicado = page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => b.innerText?.trim().toLowerCase().includes('filtro') ||
                                       b.innerText?.trim().toLowerCase().includes('filter'));
            if (btn) { btn.click(); return btn.innerText?.trim(); }
            return null;
        }
    """)
    print(f"  [botão filtro clicado] '{filtro_clicado}'")
    page.wait_for_timeout(3000)
    shot(page, "02_filtro_aberto")

    # Mapear painel/modal de filtros
    dump(page, "painel_filtro", """
        () => {
            const overlay = document.querySelector('[role="dialog"], [class*="filter"], [class*="drawer"], [class*="sidebar"]');
            if (!overlay) {
                // talvez seja inline
                return {
                    found: false,
                    novos_elementos: Array.from(document.querySelectorAll('button')).map(b => ({
                        text: b.innerText?.trim(), id: b.id
                    })).filter(b => b.text && b.text.length < 40)
                };
            }
            return {
                found: true,
                text: overlay.innerText?.slice(0, 600),
                buttons: Array.from(overlay.querySelectorAll('button')).map(b => ({
                    text: b.innerText?.trim(), id: b.id, class: b.className.slice(0,60)
                })),
                inputs: Array.from(overlay.querySelectorAll('input, select')).map(i => ({
                    type: i.type, id: i.id, placeholder: i.placeholder
                }))
            };
        }
    """)

    # Procurar especificamente os botões "Aplicar" e "Aplicar e salvar"
    dump(page, "botoes_aplicar", """
        () => Array.from(document.querySelectorAll('button')).filter(b => {
            const t = b.innerText?.trim().toLowerCase();
            return t.includes('aplicar') || t.includes('salvar') || t.includes('apply') || t.includes('save');
        }).map(b => ({text: b.innerText?.trim(), id: b.id, class: b.className.slice(0,60), disabled: b.disabled}))
    """)

    shot(page, "03_filtro_mapeado")
    browser.close()
    print("\n==> Inspeção concluída.")
