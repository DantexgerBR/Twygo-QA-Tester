"""
Reprodução: filtro da Base de conhecimento — "Aplicar e salvar" não funciona.
Fluxo: Filtro → + Novo → preencher critérios → Aplicar e salvar
"""
import os, json, pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage

load_dotenv()

BASE_URL = os.getenv("BASE_URL","").rstrip("/")+"/"
EMAIL    = os.getenv("ADMIN_EMAIL")
PASSWORD = os.getenv("ADMIN_PASSWORD")
ORG_ID   = os.getenv("ORG_ID","36675")

OUT = pathlib.Path("test-results/filtro_bc")
OUT.mkdir(parents=True, exist_ok=True)


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return str(p)


def dump(page, label, js):
    try:
        r = page.evaluate(js)
        print(f"\n  [{label}] {json.dumps(r, ensure_ascii=False, indent=2)}")
        return r
    except Exception as e:
        print(f"  [ERRO {label}] {e}")
        return None


def abrir_filtro(page):
    page.locator("#open-filter").click()
    page.wait_for_timeout(2000)


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

    lista_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories"
    page.goto(lista_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)

    # ── Abrir painel de filtros ───────────────────────────────────────────────
    abrir_filtro(page)
    shot(page, "01_painel_filtros")

    # ── Selecionar um filtro padrão e testar "Aplicar" ────────────────────────
    print("\n  [Passo 1] Selecionar filtro padrão 'Bases sem fontes' e Aplicar")
    page.evaluate("""
        () => {
            const radios = Array.from(document.querySelectorAll('input[type="radio"], [type="radio"]'));
            const r = radios[0];
            if (r) r.click();
        }
    """)
    # Ou clicar na linha do filtro
    page.evaluate("""
        () => {
            const items = Array.from(document.querySelectorAll('[class*="filter"], [class*="list-item"]'));
            const item = items.find(i => i.innerText?.includes('Bases sem fontes'));
            if (item) item.click();
        }
    """)
    page.wait_for_timeout(500)

    # Clicar em "Aplicar" (filtro rápido — deve funcionar)
    page.locator("#list-filter-apply").click()
    page.wait_for_timeout(3000)
    shot(page, "02_apos_aplicar_rapido")

    toasts_aplicar = page.evaluate("""
        () => Array.from(document.querySelectorAll('.chakra-toast')).map(t => t.innerText?.trim())
    """)
    print(f"  [toasts após Aplicar] {toasts_aplicar}")
    print(f"  [URL após Aplicar] {page.url}")

    # ── Abrir filtros novamente e clicar "+ Novo" ─────────────────────────────
    abrir_filtro(page)
    shot(page, "03_painel_reaberto")

    print("\n  [Passo 2] Clicar em + Novo para criar filtro")
    novo_btn = page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button, a'));
            const btn = btns.find(b => b.innerText?.trim() === 'Novo' || b.innerText?.trim() === '+ Novo');
            if (btn) { btn.click(); return btn.innerText?.trim(); }
            return null;
        }
    """)
    print(f"  [clicado] '{novo_btn}'")
    page.wait_for_timeout(3000)
    shot(page, "04_novo_filtro_form")

    dump(page, "novo_filtro_elementos", """
        () => {
            // Mapear o conteúdo do drawer/painel de filtro
            const drawer = document.querySelector('[class*="drawer"], [class*="filter-panel"], [class*="sidebar"]') ||
                           document.querySelector('[id*="filter"]')?.closest('[class*="panel"], [class*="container"]');
            const area = drawer || document.body;
            return {
                buttons: Array.from(area.querySelectorAll('button')).map(b => ({
                    text: b.innerText?.trim(), id: b.id, class: b.className.slice(0,60), disabled: b.disabled
                })).filter(b => b.text && b.text.length < 50),
                inputs: Array.from(area.querySelectorAll('input, textarea')).filter(i => i.offsetParent !== null).map(i => ({
                    type: i.type, id: i.id, placeholder: i.placeholder, value: i.value
                })),
                text_snippet: area.innerText?.slice(0, 500)
            };
        }
    """)

    # Procurar "Aplicar e salvar" especificamente
    dump(page, "botao_aplicar_salvar", """
        () => Array.from(document.querySelectorAll('button')).filter(b => {
            const t = b.innerText?.trim().toLowerCase();
            return t.includes('salvar') || t.includes('aplicar e');
        }).map(b => ({text: b.innerText?.trim(), id: b.id, class: b.className.slice(0,60), disabled: b.disabled}))
    """)

    shot(page, "05_novo_filtro_mapeado")

    # ── Tentar preencher e usar "Aplicar e salvar" ────────────────────────────
    print("\n  [Passo 3] Preencher nome do filtro (se houver campo)")
    try:
        nome_input = page.locator("input[placeholder*='nome'], input[id*='name'], input[placeholder*='Nome']").first
        if nome_input.count() > 0 and nome_input.is_visible():
            nome_input.fill("Filtro Teste Automação")
            page.wait_for_timeout(300)
    except Exception as e:
        print(f"  [ERRO nome] {e}")

    # Clicar em "Aplicar e salvar"
    print("\n  [Passo 4] Clicar em 'Aplicar e salvar'")
    aplicar_salvar = page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => {
                const t = b.innerText?.trim().toLowerCase();
                return t.includes('aplicar e salvar') || (t.includes('salvar') && t.includes('aplicar'));
            });
            if (btn) {
                const info = {text: btn.innerText?.trim(), disabled: btn.disabled, id: btn.id};
                btn.click();
                return info;
            }
            // Tentar qualquer botão com "salvar"
            const salvar = btns.find(b => b.innerText?.trim().toLowerCase().includes('salvar') &&
                                          !b.innerText?.trim().toLowerCase().includes('cancelar'));
            if (salvar) {
                const info = {text: salvar.innerText?.trim(), disabled: salvar.disabled, id: salvar.id};
                salvar.click();
                return info;
            }
            return null;
        }
    """)
    print(f"  [botão clicado] {json.dumps(aplicar_salvar, ensure_ascii=False)}")
    page.wait_for_timeout(5000)
    shot(page, "06_apos_aplicar_salvar")

    # Verificar resultado
    url_final = page.url
    toasts = page.evaluate("""
        () => Array.from(document.querySelectorAll('.chakra-toast, [role="status"], [role="alert"]'))
            .map(t => t.innerText?.trim()).filter(t => t)
    """)
    body_len = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
    print(f"\n  [URL final] {url_final}")
    print(f"  [toasts] {toasts}")
    print(f"  [body_len] {body_len}")

    # Verificar se o filtro aparece em "Meus filtros"
    abrir_filtro(page)
    page.wait_for_timeout(2000)
    dump(page, "meus_filtros_apos_salvar", """
        () => {
            const area = document.body;
            const meusSection = Array.from(area.querySelectorAll('*')).find(el =>
                el.innerText?.trim() === 'Meus filtros'
            );
            const parent = meusSection?.closest('[class*="section"], [class*="group"], div');
            return {
                meus_filtros_text: parent?.innerText?.slice(0, 300) || 'seção não encontrada'
            };
        }
    """)
    shot(page, "07_meus_filtros_pos_salvar")

    browser.close()
    print(f"\n==> Concluído. Screenshots em: {OUT}")
