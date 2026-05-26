"""Encontra QUALQUER elemento do DOM com texto CPF/E-MAIL/DANTE durante a reprodução."""
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
        page.evaluate("() => { const v = document.querySelector('video'); if(v){v.muted=true; v.play();} }")
        page.wait_for_timeout(6000)

        # Procura qualquer elemento (incluindo deep scan de shadow DOM) com texto-alvo
        info = page.evaluate("""() => {
            const ALVO = /CPF|E-MAIL|DANTE\\.TAVARES/i;
            const visitados = new Set();
            const achados = [];
            function visit(root) {
                if (!root || visitados.has(root)) return;
                visitados.add(root);
                const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
                    acceptNode(n) {
                        return ALVO.test(n.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                });
                let n;
                while ((n = walker.nextNode())) {
                    const el = n.parentElement;
                    if (!el) continue;
                    const s = window.getComputedStyle(el);
                    const r = el.getBoundingClientRect();
                    achados.push({
                        text: (n.nodeValue || '').trim().slice(0, 80),
                        tag: el.tagName,
                        cls: (el.className && el.className.toString) ? el.className.toString().slice(0, 100) : '',
                        id: el.id || null,
                        position: s.position,
                        zIndex: s.zIndex,
                        color: s.color,
                        fontSize: s.fontSize,
                        rect: {x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height)},
                        parentChain: (function() {
                            const chain = [];
                            let p = el.parentElement;
                            while (p && chain.length < 5) {
                                const ps = window.getComputedStyle(p);
                                chain.push({
                                    tag: p.tagName,
                                    cls: (p.className && p.className.toString) ? p.className.toString().slice(0, 60) : '',
                                    pos: ps.position,
                                    z: ps.zIndex,
                                });
                                p = p.parentElement;
                            }
                            return chain;
                        })(),
                    });
                }
                // Visita shadow roots
                Array.from(root.querySelectorAll('*')).forEach(el => {
                    if (el.shadowRoot) visit(el.shadowRoot);
                });
            }
            visit(document);
            return {qtd: achados.length, primeiros: achados.slice(0, 8)};
        }""")
        print(json.dumps(info, indent=2, ensure_ascii=False))

        browser.close()


if __name__ == "__main__":
    main()
