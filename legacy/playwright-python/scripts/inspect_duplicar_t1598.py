"""Avança no modal de Copiar atividade: seleciona curso e vê a lista de atividades."""
import os
import json
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()
BASE = os.environ["BASE_URL"].rstrip("/") + "/"
EMAIL = os.environ["ADMIN_EMAIL"]
PWD = os.environ["ADMIN_PASSWORD"]
EVENTO = os.environ["EVENTO_ID"]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1366, "height": 900})
        page.goto(BASE + "login", wait_until="domcontentloaded")
        page.locator("#user_email").fill(EMAIL)
        page.locator("#user_password").fill(PWD)
        page.locator("#user_submit").click()
        page.wait_for_load_state("domcontentloaded", timeout=20000)
        page.wait_for_timeout(3000)

        page.goto(f"{BASE}e/{EVENTO}/contents", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(7000)

        page.locator(".copy_content_btn").click()
        page.wait_for_timeout(3000)

        # Estrutura do modal: vamos pegar TUDO clicável dentro dele
        modal_struct = page.evaluate("""() => {
            // simplemodal-container parece ser o container do modal
            const m = document.querySelector('#simplemodal-container, .simplemodal-container, .simplemodal-data');
            if (!m) return {found:false};
            const cliques = Array.from(m.querySelectorAll('li, a, button, [onclick]'))
                .slice(0, 15)
                .map(el => ({
                    tag: el.tagName,
                    text: (el.innerText || '').trim().slice(0, 80),
                    cls: (el.className && el.className.toString) ? el.className.toString().slice(0, 80) : '',
                    onclick: el.getAttribute('onclick'),
                    href: el.getAttribute('href'),
                    dataId: el.getAttribute('data-id'),
                }));
            return {found: true, cliques};
        }""")
        print("=== Estrutura do modal ===")
        print(json.dumps(modal_struct, indent=2, ensure_ascii=False))

        # Clicar no primeiro curso da lista (dentro do modal)
        # Usar force=True por causa do overlay
        try:
            # tenta achar o <li> com texto "787697 - " e clicar via JS
            page.evaluate("""() => {
                const m = document.querySelector('#simplemodal-container, .simplemodal-container');
                const items = m ? Array.from(m.querySelectorAll('li, a')) : [];
                const alvo = items.find(el => /^787697\\s*-/.test((el.innerText||'').trim()));
                if (alvo) alvo.click();
            }""")
            page.wait_for_timeout(4000)
            page.screenshot(path="/tmp/t1598_apos_curso_origem.png", full_page=True)
        except Exception as e:
            print(f"Falha ao avançar: {e}")

        # depois de clicar no curso, espera-se a lista de atividades do curso 787697
        atividades = page.evaluate("""() => {
            const m = document.querySelector('#simplemodal-container, .simplemodal-container');
            if (!m) return null;
            return {
                titulo: (m.innerText || '').slice(0, 200),
                itens: Array.from(m.querySelectorAll('li, a, .item, [data-id]')).slice(0, 15).map(el => ({
                    tag: el.tagName,
                    text: (el.innerText || '').trim().slice(0, 80),
                    dataId: el.getAttribute('data-id'),
                    onclick: el.getAttribute('onclick'),
                }))
            };
        }""")
        print("\n=== Modal após selecionar curso 787697 ===")
        print(json.dumps(atividades, indent=2, ensure_ascii=False)[:3000])

        browser.close()


if __name__ == "__main__":
    main()
