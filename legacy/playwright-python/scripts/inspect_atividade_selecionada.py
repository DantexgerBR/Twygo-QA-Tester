"""Descobre qual atividade é selecionada quando o teste clica em 'vídeo'."""
import os
import json
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()
BASE = os.environ["BASE_URL"].rstrip("/") + "/"
EMAIL = os.environ["ALUNO_EMAIL"]
PWD = os.environ["ALUNO_PASSWORD"]
EVENTO = os.environ["EVENTO_ID"]
ATIV = os.environ["ATIVIDADE_VIDEO_MARCA_DAGUA_ID"]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = ctx.new_page()
        page.goto(BASE + "login", wait_until="domcontentloaded")
        page.locator("#user_email").fill(EMAIL)
        page.locator("#user_password").fill(PWD)
        page.locator("#user_submit").click()
        page.wait_for_load_state("domcontentloaded", timeout=20000)
        page.wait_for_timeout(3000)
        page.goto(f"{BASE}e/{EVENTO}/learn?learn_origin=my-contents", wait_until="domcontentloaded")
        page.wait_for_timeout(6000)

        # Lista todos os itens da lista de conteúdo do curso
        itens = page.evaluate("""() => {
            const candidatos = Array.from(document.querySelectorAll('a, button, li, div'))
                .filter(el => {
                    const t = (el.innerText || '').trim();
                    return t.length > 0 && t.length < 120 && /vídeo|video/i.test(t);
                })
                .slice(0, 30)
                .map(el => ({
                    tag: el.tagName,
                    text: (el.innerText || '').trim().slice(0, 100),
                    href: el.tagName === 'A' ? el.href : null,
                    cls: el.className && el.className.toString ? el.className.toString().slice(0, 80) : '',
                }));
            return candidatos;
        }""")
        print("=== Itens com 'vídeo' no texto ===")
        for it in itens:
            print(json.dumps(it, ensure_ascii=False))

        # Lista todos os "Conteúdos" da lateral (geralmente sidebar)
        conteudos = page.evaluate("""() => {
            // tenta achar o sidebar/lista de conteúdos
            const links = Array.from(document.querySelectorAll('a[href*="/contents/"], a[href*="/learn"]'))
                .map(a => ({href: a.href, text: (a.innerText || '').trim().slice(0, 100)}));
            return links.slice(0, 30);
        }""")
        print("\n=== Links de conteúdos/learn ===")
        for c in conteudos:
            print(json.dumps(c, ensure_ascii=False))

        # Tenta acessar URL direta da atividade
        print(f"\n=== Tentando URL direta /e/{EVENTO}/learn/{ATIV} ===")
        page.goto(f"{BASE}e/{EVENTO}/learn/{ATIV}", wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(7000)
        print(f"URL após: {page.url}")
        titulo = page.evaluate("""() => {
            const h = document.querySelector('h1, h2, .chakra-heading');
            return h ? (h.innerText || '').trim() : null;
        }""")
        print(f"Título: {titulo}")
        qtd_video = page.locator("video").count()
        print(f"<video> tags: {qtd_video}")

        browser.close()


if __name__ == "__main__":
    main()
