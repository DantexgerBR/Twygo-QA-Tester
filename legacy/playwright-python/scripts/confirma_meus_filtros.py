import os, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()
BASE_URL = os.getenv("BASE_URL","").rstrip("/")+"/"
EMAIL    = os.getenv("ADMIN_EMAIL")
PASSWORD = os.getenv("ADMIN_PASSWORD")
ORG_ID   = os.getenv("ORG_ID","36675")
OUT = pathlib.Path("test-results/filtro_confirmacao")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()
    page.goto(BASE_URL + "login", wait_until="domcontentloaded", timeout=20000)
    page.locator("#user_email").fill(EMAIL)
    page.locator("#user_password").fill(PASSWORD)
    page.locator("#user_submit").click()
    page.wait_for_load_state("domcontentloaded", timeout=20000)
    page.wait_for_timeout(3000)
    page.goto(f"{BASE_URL}o/{ORG_ID}/knowledge_repositories", wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)

    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2500)
    # voltar para lista se necessário
    page.evaluate("""
        () => {
            const link = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText?.trim() === 'Lista de filtros');
            if (link) link.click();
        }
    """)
    page.wait_for_timeout(1500)
    # expandir Meus filtros
    page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button'));
            const meus = btns.find(b => b.innerText?.trim() === 'Meus filtros');
            if (meus) meus.click();
        }
    """)
    page.wait_for_timeout(1500)
    page.screenshot(path=str(OUT / "meus_filtros.png"), full_page=True)
    txt = page.evaluate("() => document.body.innerText")
    idx = txt.find("Meus filtros")
    print(f"[snippet] '{txt[idx:idx+400]}'")
    print(f"[filtro salvo] {'Filtro Salvar Teste' in txt}")
    browser.close()
