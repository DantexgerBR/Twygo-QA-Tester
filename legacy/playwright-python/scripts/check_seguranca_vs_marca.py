"""Compara overlay da marca d'água variando o valor de Segurança."""
import os
import json
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()
BASE = os.environ["BASE_URL"].rstrip("/") + "/"
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PWD = os.environ["ADMIN_PASSWORD"]
ALUNO_EMAIL = os.environ["ALUNO_EMAIL"]
ALUNO_PWD = os.environ["ALUNO_PASSWORD"]
EVENTO = os.environ["EVENTO_ID"]
ATIV = os.environ["ATIVIDADE_VIDEO_MARCA_DAGUA_ID"]


def set_seguranca(browser, valor: str):
    ctx = browser.new_context(viewport={"width": 1366, "height": 768})
    page = ctx.new_page()
    page.goto(BASE + "login", wait_until="domcontentloaded")
    page.locator("#user_email").fill(ADMIN_EMAIL)
    page.locator("#user_password").fill(ADMIN_PWD)
    page.locator("#user_submit").click()
    page.wait_for_load_state("domcontentloaded", timeout=20000)
    page.wait_for_timeout(3000)
    page.goto(f"{BASE}e/{EVENTO}/contents/{ATIV}/edit", wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(6000)
    page.locator("#content_file_security").select_option(valor)
    page.wait_for_timeout(500)
    page.locator("#button_send_form").click()
    page.wait_for_timeout(4000)
    page.close()
    ctx.close()


def medir_overlay(browser, label: str):
    ctx = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = ctx.new_page()
    page.goto(BASE + "login", wait_until="domcontentloaded")
    page.locator("#user_email").fill(ALUNO_EMAIL)
    page.locator("#user_password").fill(ALUNO_PWD)
    page.locator("#user_submit").click()
    page.wait_for_load_state("domcontentloaded", timeout=20000)
    page.wait_for_timeout(3000)
    page.goto(f"{BASE}e/{EVENTO}/learn?learn_origin=my-contents", wait_until="domcontentloaded")
    page.wait_for_timeout(6000)
    try:
        page.get_by_text("vídeo", exact=False).first.click(timeout=3000)
        page.wait_for_timeout(5000)
    except Exception:
        pass
    page.evaluate("() => { const v = document.querySelector('video'); if(v){v.muted=true; v.play();} }")
    page.wait_for_timeout(6000)
    res = page.evaluate("""() => {
        const divs = Array.from(document.querySelectorAll('div')).filter(el => {
            const s = window.getComputedStyle(el);
            return s.zIndex === '99999' && s.position === 'absolute';
        });
        return {
            qtdOverlays: divs.length,
            children: divs.length > 0 ? divs[0].children.length : -1,
            firstHtml: divs.length > 0 ? divs[0].outerHTML.substring(0, 220) : null,
        };
    }""")
    print(f"[{label}] {json.dumps(res, ensure_ascii=False)}")
    page.close()
    ctx.close()


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for valor, nome in [("0", "Somente Visualizar"), ("2", "Visualizar e Baixar")]:
            print(f"\n>>> Mudando Segurança para '{nome}' (value={valor})")
            set_seguranca(browser, valor)
            medir_overlay(browser, nome)
        browser.close()


if __name__ == "__main__":
    main()
