"""Busca abrangente: onde está o botão/link de download na tela do aluno?"""
import os
import json
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()
BASE = os.environ["BASE_URL"].rstrip("/") + "/"
EMAIL = os.environ["ALUNO_EMAIL"]
PWD = os.environ["ALUNO_PASSWORD"]
EVENTO = os.environ["EVENTO_ID"]


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
        try:
            page.get_by_text("vídeo", exact=False).first.click(timeout=3000)
            page.wait_for_timeout(4500)
        except Exception:
            pass

        # 1) Procura QUALQUER elemento com atributo download, data-plyr=download, ou texto/aria/title com baixar/download
        info = page.evaluate("""() => {
            const all = Array.from(document.querySelectorAll('*'));
            const matches = [];
            for (const el of all) {
                const tag = el.tagName;
                const text = (el.innerText || '').trim();
                const aria = el.getAttribute('aria-label') || '';
                const title = el.getAttribute('title') || '';
                const dataPlyr = el.getAttribute('data-plyr') || '';
                const hasDownload = el.hasAttribute('download');
                if (
                    hasDownload ||
                    dataPlyr === 'download' ||
                    /baixar|download/i.test(aria) ||
                    /baixar|download/i.test(title) ||
                    /^baixar|^download/i.test(text.slice(0, 30))
                ) {
                    matches.push({
                        tag,
                        text: text.slice(0, 80),
                        aria,
                        title,
                        dataPlyr,
                        hasDownload,
                        href: el.tagName === 'A' ? el.href : null,
                        cls: (el.className && el.className.toString) ? el.className.toString().slice(0, 120) : '',
                        outer: el.outerHTML.substring(0, 280),
                    });
                }
            }
            return matches.slice(0, 30);
        }""")
        print("=== Candidatos a botão/link de download ===")
        for m in info:
            print(json.dumps(m, ensure_ascii=False))

        # 2) Procura iframes (pode ter player em iframe)
        frames = [f.url for f in page.frames]
        print("\n=== Frames ===")
        for f in frames:
            print(f)

        # 3) Procura todos os <a> com .mp4 no href
        mp4s = page.evaluate("""() => Array.from(document.querySelectorAll('a')).filter(a => /\\.mp4/i.test(a.href)).map(a => ({href: a.href, text: (a.innerText||'').trim().slice(0,80), download: a.hasAttribute('download')}))""")
        print("\n=== Links .mp4 ===")
        for m in mp4s:
            print(json.dumps(m, ensure_ascii=False))

        page.screenshot(path="/tmp/t1597_inspect.png", full_page=True)
        print("\nScreenshot salvo em /tmp/t1597_inspect.png")

        browser.close()


if __name__ == "__main__":
    main()
