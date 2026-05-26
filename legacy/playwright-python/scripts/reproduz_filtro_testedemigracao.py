"""
Testa "Aplicar e salvar" no ambiente testedemigracao com credenciais do incidente.
"""
import pathlib, sys, time, json
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from playwright.sync_api import sync_playwright

BASE_URL = "https://testedemigracao.stage.twygoead.com/"
EMAIL    = "evertongambeta@gmail.com"
PASSWORD = "123456"
ORG_ID   = "19653"

OUT = pathlib.Path("test-results/filtro_testedemigracao")
OUT.mkdir(parents=True, exist_ok=True)


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return str(p)


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()

    print("==> Login em testedemigracao...")
    try:
        page.goto(BASE_URL + "users/login", wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(2000)
        page.locator("#user_email").fill(EMAIL)
        page.locator("#user_password").fill(PASSWORD)
        page.locator("#user_submit").click()
        page.wait_for_load_state("domcontentloaded", timeout=20000)
        page.wait_for_timeout(3000)
        print(f"  [URL pós-login] {page.url}")
        shot(page, "00_pos_login")
    except Exception as e:
        print(f"  [ERRO login] {e}")
        shot(page, "00_erro_login")
        browser.close()
        exit(1)

    # Navegar para BC
    bc_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories"
    try:
        page.goto(bc_url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(5000)
        shot(page, "01_listagem_bc")
    except Exception as e:
        print(f"  [ERRO navegar BC] {e}")
        shot(page, "01_erro_bc")
        browser.close()
        exit(1)

    # Abrir painel de filtros
    filter_btn = page.evaluate("() => !!document.getElementById('open-filter')")
    print(f"  [botão filtro presente] {filter_btn}")
    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2500)
    shot(page, "02_filtro_aberto")

    # Entrar em "Bases sem fontes"
    page.evaluate("""
        () => {
            const el = Array.from(document.querySelectorAll('*')).find(e =>
                e.innerText?.trim() === 'Bases sem fontes' &&
                ['LABEL','SPAN','LI','DIV','BUTTON'].includes(e.tagName)
            );
            if (el) el.click();
        }
    """)
    page.wait_for_timeout(1500)
    shot(page, "03_bases_sem_fontes")

    # Expandir "Salvar filtro"
    page.evaluate("() => document.getElementById('accordion-button-expand-submit-filter')?.click()")
    page.wait_for_timeout(1200)

    # Ativar toggle
    page.evaluate("() => document.querySelector('.chakra-switch__track')?.click()")
    page.wait_for_timeout(1000)
    shot(page, "04_toggle_ativado")

    # Verificar botões disponíveis
    botoes = page.evaluate("""
        () => Array.from(document.querySelectorAll('button')).filter(b => {
            const t = b.innerText?.trim().toLowerCase();
            return t.includes('aplicar') || t.includes('salvar');
        }).map(b => ({text: b.innerText?.trim(), id: b.id, disabled: b.disabled}))
    """)
    print(f"\n  [botões encontrados] {json.dumps(botoes, ensure_ascii=False)}")

    # Clicar "Aplicar e salvar"
    print("\n  [click] Aplicar e salvar")
    t0 = time.time()
    resultado = page.evaluate("""
        () => {
            const btn = Array.from(document.querySelectorAll('button')).find(b =>
                b.innerText?.trim() === 'Aplicar e salvar'
            );
            if (!btn) return {encontrado: false};
            btn.click();
            return {encontrado: true, id: btn.id, disabled: btn.disabled};
        }
    """)
    print(f"  [resultado click] {json.dumps(resultado, ensure_ascii=False)}")

    for tick in range(1, 9):
        page.wait_for_timeout(1000)
        elapsed = time.time() - t0
        try:
            toasts = page.evaluate("() => Array.from(document.querySelectorAll('.chakra-toast')).map(t=>t.innerText?.trim()).filter(t=>t)")
            body   = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
            url    = page.url
            print(f"  [t={elapsed:.1f}s] body={body}  toasts={toasts}  url={url.split('/')[-1]}")
        except Exception:
            page.wait_for_load_state("domcontentloaded", timeout=10000)
            break

    shot(page, "05_apos_aplicar_salvar")

    # Verificar se salvou
    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2000)
    page.evaluate("""
        () => {
            const link = Array.from(document.querySelectorAll('button')).find(b => b.innerText?.trim() === 'Lista de filtros');
            if (link) link.click();
        }
    """)
    page.wait_for_timeout(1500)
    page.evaluate("""
        () => {
            const meus = Array.from(document.querySelectorAll('button')).find(b => b.innerText?.trim() === 'Meus filtros');
            if (meus) meus.click();
        }
    """)
    page.wait_for_timeout(1500)
    shot(page, "06_meus_filtros")

    txt = page.evaluate("() => document.body.innerText")
    idx = txt.find("Meus filtros")
    snippet = txt[idx:idx+400] if idx >= 0 else "(não encontrado)"
    print(f"\n  [Meus filtros snippet] '{snippet[:300]}'")

    browser.close()
    print(f"\n==> Concluído. Screenshots em: {OUT}")
