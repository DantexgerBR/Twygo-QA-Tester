"""
Reprodução v4 — clica "Aplicar e salvar" e verifica se o filtro é persistido em "Meus filtros".
"""
import os, json, pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()

BASE_URL = os.getenv("BASE_URL","").rstrip("/")+"/"
EMAIL    = os.getenv("ADMIN_EMAIL")
PASSWORD = os.getenv("ADMIN_PASSWORD")
ORG_ID   = os.getenv("ORG_ID","36675")

OUT = pathlib.Path("test-results/filtro_bc_v4")
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

    page.goto(BASE_URL + "login", wait_until="domcontentloaded", timeout=20000)
    page.locator("#user_email").fill(EMAIL)
    page.locator("#user_password").fill(PASSWORD)
    page.locator("#user_submit").click()
    page.wait_for_load_state("domcontentloaded", timeout=20000)
    page.wait_for_timeout(3000)
    print("==> Login OK")

    page.goto(f"{BASE_URL}o/{ORG_ID}/knowledge_repositories", wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)

    # 1. Abrir painel → entrar em "Bases sem fontes"
    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2000)
    page.evaluate("""
        () => {
            const el = Array.from(document.querySelectorAll('*')).find(e =>
                e.innerText?.trim() === 'Bases sem fontes' &&
                ['LABEL','SPAN','LI','DIV'].includes(e.tagName)
            );
            if (el) el.click();
        }
    """)
    page.wait_for_timeout(1500)

    # 2. Expandir "Salvar filtro" + ativar toggle
    page.evaluate("() => document.getElementById('accordion-button-expand-submit-filter')?.click()")
    page.wait_for_timeout(1200)
    page.evaluate("() => document.querySelector('.chakra-switch__track')?.click()")
    page.wait_for_timeout(1000)
    shot(page, "01_toggle_ativado_aplicar_salvar_visivel")

    # 3. Preencher nome
    page.evaluate("""
        () => {
            const input = Array.from(document.querySelectorAll('input[type="text"]')).find(i => i.offsetParent !== null);
            if (input) { input.value = ''; input.dispatchEvent(new Event('input', {bubbles:true})); }
        }
    """)
    page.wait_for_timeout(200)
    nome_input = page.locator("input[type='text']:visible").first
    nome_input.fill("Filtro Salvar Teste")
    page.wait_for_timeout(300)

    shot(page, "02_antes_aplicar_salvar")

    # 4. Clicar "Aplicar e salvar"
    print("\n  [Passo 4] Clicar 'Aplicar e salvar'")
    t0 = time.time()
    aplicar_salvar = page.evaluate("""
        () => {
            const btn = Array.from(document.querySelectorAll('button')).find(b =>
                b.innerText?.trim() === 'Aplicar e salvar'
            );
            if (btn) {
                const info = {text: btn.innerText?.trim(), id: btn.id, disabled: btn.disabled};
                btn.click();
                return info;
            }
            return null;
        }
    """)
    print(f"  [botão] {json.dumps(aplicar_salvar, ensure_ascii=False)}")

    # Monitorar por 8s
    for tick in range(1, 9):
        page.wait_for_timeout(1000)
        elapsed = time.time() - t0
        try:
            toasts = page.evaluate("() => Array.from(document.querySelectorAll('.chakra-toast')).map(t=>t.innerText?.trim()).filter(t=>t)")
            body = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
            print(f"  [t={elapsed:.1f}s] body={body}  toasts={toasts}")
            # Verificar se o drawer fechou (indicaria sucesso)
            drawer_aberto = page.evaluate("() => !!document.querySelector('[class*=\"chakra-slide\"]')")
            if not drawer_aberto and tick > 1:
                print(f"  [drawer fechou em t={elapsed:.1f}s — possível sucesso]")
                break
        except Exception:
            page.wait_for_load_state("domcontentloaded", timeout=10000)
            break

    shot(page, "03_apos_aplicar_salvar")

    # 5. Reabrir filtros e verificar "Meus filtros"
    print("\n  [Passo 5] Verificar 'Meus filtros'")
    page.wait_for_timeout(1000)
    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2500)
    shot(page, "04_lista_filtros_pos_salvar")

    resultado = page.evaluate("""
        () => {
            const txt = document.body.innerText;
            const idxMeus = txt.indexOf('Meus filtros');
            const snippet = txt.slice(idxMeus, idxMeus + 400);
            return {
                filtro_salvar_teste: txt.includes('Filtro Salvar Teste'),
                snippet_meus_filtros: snippet
            };
        }
    """)
    print(f"\n  [resultado] filtro_salvo={resultado.get('filtro_salvar_teste')}")
    print(f"  [Meus filtros snippet] '{resultado.get('snippet_meus_filtros','')[:250]}'")

    if not resultado.get("filtro_salvar_teste"):
        print("\n  ✓ BUG CONFIRMADO: 'Aplicar e salvar' não persistiu o filtro em 'Meus filtros'")
    else:
        print("\n  ✗ BUG NÃO reproduzido: filtro apareceu em 'Meus filtros'")

    browser.close()
    print(f"\n==> Concluído. Screenshots em: {OUT}")
