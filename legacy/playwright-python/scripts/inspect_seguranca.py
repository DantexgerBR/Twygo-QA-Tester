"""Inspeciona a seção 'Segurança' da edição da atividade para descobrir o tipo do controle."""
import os
import json
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()
BASE = os.environ["BASE_URL"].rstrip("/") + "/"
EMAIL = os.environ["ADMIN_EMAIL"]
PWD = os.environ["ADMIN_PASSWORD"]
EVENTO = os.environ["EVENTO_ID"]
ATIV = os.environ["ATIVIDADE_VIDEO_MARCA_DAGUA_ID"]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1366, "height": 768})
        page = ctx.new_page()
        page.goto(BASE + "login", wait_until="domcontentloaded")
        page.locator("#user_email").fill(EMAIL)
        page.locator("#user_password").fill(PWD)
        page.locator("#user_submit").click()
        page.wait_for_load_state("domcontentloaded", timeout=20000)
        page.wait_for_timeout(3000)
        page.goto(f"{BASE}e/{EVENTO}/contents/{ATIV}/edit", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(6000)

        # Inspeciona elementos ao redor da palavra "Segurança"
        info = page.evaluate("""() => {
            // Acha o nó de texto "Segurança"
            const xpath = document.evaluate(
                "//*[normalize-space(text())='Segurança' or contains(text(),'Segurança')]",
                document, null, XPathResult.ANY_TYPE, null
            );
            const nodes = [];
            let n;
            while ((n = xpath.iterateNext())) nodes.push(n);
            if (!nodes.length) return {found: false};
            // Pega o primeiro e mostra a vizinhança
            const root = nodes[0].closest('div, fieldset, section') || nodes[0].parentElement;
            const html = root.outerHTML.substring(0, 4000);
            // Procura selects, radios, buttons dentro do root
            const selects = Array.from(root.querySelectorAll('select')).map(s => ({
                name: s.name, value: s.value,
                opcoes: Array.from(s.options).map(o => ({value: o.value, text: o.text, selected: o.selected})),
            }));
            const radios = Array.from(root.querySelectorAll('input[type="radio"]')).map(r => ({
                name: r.name, value: r.value, checked: r.checked,
                label: (() => { const id = r.id; if(!id) return null; const l = document.querySelector(`label[for='${id}']`); return l ? l.innerText.trim() : null; })(),
            }));
            const botoes = Array.from(root.querySelectorAll('button')).map(b => ({
                text: (b.innerText || '').trim().slice(0, 80),
                role: b.getAttribute('role'),
                ariaHasPopup: b.getAttribute('aria-haspopup'),
                ariaExpanded: b.getAttribute('aria-expanded'),
                outer: b.outerHTML.substring(0, 250),
            }));
            return {found: true, html, selects, radios, botoes};
        }""")
        print(json.dumps(info, indent=2, ensure_ascii=False)[:6000])

        browser.close()


if __name__ == "__main__":
    main()
