"""Após setup_t1597 (Segurança=Visualizar e Baixar), o overlay z-index:99999 está vazio.
Checar se há outro div candidato ou se a marca d'água foi desligada no setup."""
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
            page.wait_for_timeout(5000)
        except Exception:
            pass

        # tenta dar play
        try:
            page.evaluate("() => { const v = document.querySelector('video'); if(v){v.muted=true; v.play();} }")
            page.wait_for_timeout(6000)
        except Exception:
            pass

        info = page.evaluate("""() => {
            const v = document.querySelector('video');
            const overlays = Array.from(document.querySelectorAll('div')).filter(el => {
                const s = window.getComputedStyle(el);
                const z = parseInt(s.zIndex || '0', 10);
                return s.position === 'absolute' && z >= 100;
            }).map(el => ({
                zIndex: window.getComputedStyle(el).zIndex,
                position: window.getComputedStyle(el).position,
                children: el.children.length,
                rect: (() => { const r = el.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; })(),
                cls: (el.className && el.className.toString) ? el.className.toString().slice(0, 100) : '',
                innerText: (el.innerText || '').slice(0, 150),
                outer: el.outerHTML.substring(0, 280),
            }));
            return {
                videoSrc: v ? (v.currentSrc || v.src) : null,
                videoPaused: v ? v.paused : null,
                videoTime: v ? v.currentTime : null,
                overlays,
                qtdVideos: document.querySelectorAll('video').length,
            };
        }""")
        print(json.dumps(info, indent=2, ensure_ascii=False)[:6000])

        # Também checa título da atividade selecionada
        titulo = page.evaluate("""() => {
            const h = document.querySelector('h1, h2, .chakra-heading');
            return h ? (h.innerText || '').trim() : null;
        }""")
        print(f"\n=== Título visível: {titulo}")

        page.screenshot(path="/tmp/t1597_after_setup.png", full_page=True)
        browser.close()


if __name__ == "__main__":
    main()
