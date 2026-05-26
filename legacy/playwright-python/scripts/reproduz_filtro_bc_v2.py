"""
Reprodução v2 — filtro BC: ativar "Salvar na lista de filtros" + Aplicar → verifica se salva em "Meus filtros"
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

OUT = pathlib.Path("test-results/filtro_bc_v2")
OUT.mkdir(parents=True, exist_ok=True)


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return str(p)


def dump(page, label, js):
    try:
        r = page.evaluate(js)
        print(f"\n  [{label}] {json.dumps(r, ensure_ascii=False)}")
        return r
    except Exception as e:
        print(f"  [ERRO {label}] {e}")
        return None


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()

    # Login
    page.goto(BASE_URL + "login", wait_until="domcontentloaded", timeout=20000)
    page.locator("#user_email").fill(EMAIL)
    page.locator("#user_password").fill(PASSWORD)
    page.locator("#user_submit").click()
    page.wait_for_load_state("domcontentloaded", timeout=20000)
    page.wait_for_timeout(3000)
    print("==> Login OK")

    # Navegar para listagem BC
    page.goto(f"{BASE_URL}o/{ORG_ID}/knowledge_repositories", wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)

    # ── Passo 1: Abrir filtros ────────────────────────────────────────────────
    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2000)
    shot(page, "01_lista_filtros")

    # ── Passo 2: Entrar no filtro "Bases sem fontes" ──────────────────────────
    # Clicar no ícone de edição/abertura do filtro padrão
    page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button, [role="button"]'));
            // Clicar na linha "Bases sem fontes"
            const item = btns.find(b => b.innerText?.includes('Bases sem fontes'));
            if (item) { item.click(); return; }
            // Ou clicar no radio/link da linha
            const links = Array.from(document.querySelectorAll('a, [class*="filter-item"]'));
            const link = links.find(l => l.innerText?.includes('Bases sem fontes'));
            if (link) link.click();
        }
    """)
    page.wait_for_timeout(2000)

    # Verificar se entrou no detalhe do filtro
    current_panel = page.evaluate("() => document.querySelector('[class*=\"drawer\"], [class*=\"sidebar\"]')?.innerText?.slice(0, 100)")
    print(f"  [painel atual] {current_panel}")

    # Se ainda na lista, clicar no ícone de copiar/abrir do filtro padrão
    # O ícone de edição aparece ao lado de cada filtro na lista
    page.evaluate("""
        () => {
            // Tentar clicar no ícone de cópia/usar do filtro padrão "Bases sem fontes"
            const spans = Array.from(document.querySelectorAll('[class*="filter"] span, [class*="item"] span'));
            const copy = spans.find(s => s.innerText?.trim() === 'content_copy' || s.innerText?.trim() === 'edit');
            if (copy) {
                const btn = copy.closest('button') || copy;
                btn.click();
                return;
            }
        }
    """)
    page.wait_for_timeout(1000)
    shot(page, "02_dentro_filtro")

    # ── Passo 3: Expandir "Salvar filtro" ────────────────────────────────────
    page.evaluate("() => document.getElementById('accordion-button-expand-submit-filter')?.click()")
    page.wait_for_timeout(1500)
    shot(page, "03_salvar_filtro_expandido")

    # ── Passo 4: Ativar toggle "Salvar na lista de filtros" ───────────────────
    print("\n  [Passo 4] Ativar toggle 'Salvar na lista de filtros'")
    toggle_clicado = page.evaluate("""
        () => {
            // Toggle switch para salvar na lista
            const toggles = Array.from(document.querySelectorAll('[role="switch"], input[type="checkbox"], [class*="toggle"], [class*="switch"]'));
            const toggle = toggles.find(t => {
                const label = document.querySelector(`label[for="${t.id}"]`)?.innerText?.toLowerCase() ||
                              t.closest('[class*="form"]')?.innerText?.toLowerCase() || '';
                return label.includes('salvar') || label.includes('lista');
            });
            if (toggle) {
                const antes = toggle.getAttribute('aria-checked') || toggle.checked;
                toggle.click();
                return {id: toggle.id, antes: antes, tag: toggle.tagName};
            }
            // Fallback: qualquer switch/toggle visível no painel
            const anyToggle = toggles.find(t => t.offsetParent !== null);
            if (anyToggle) {
                anyToggle.click();
                return {id: anyToggle.id, antes: anyToggle.getAttribute('aria-checked'), tag: anyToggle.tagName};
            }
            return null;
        }
    """)
    print(f"  [toggle] {json.dumps(toggle_clicado, ensure_ascii=False)}")
    page.wait_for_timeout(1500)
    shot(page, "04_toggle_ativado")

    # Verificar estado do toggle após click
    dump(page, "toggle_estado", """
        () => {
            const toggles = Array.from(document.querySelectorAll('[role="switch"]'));
            return toggles.map(t => ({
                id: t.id, aria_checked: t.getAttribute('aria-checked'),
                class: t.className.slice(0,60),
                label: document.querySelector(`label[for="${t.id}"]`)?.innerText?.trim()
            }));
        }
    """)

    # ── Passo 5: Preencher nome do filtro ────────────────────────────────────
    nome_input = page.evaluate("""
        () => {
            const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
            const nome = inputs.find(i => i.offsetParent !== null);
            if (nome) {
                nome.value = '';
                nome.dispatchEvent(new Event('input', {bubbles: true}));
                return nome.id;
            }
            return null;
        }
    """)
    if nome_input:
        page.locator(f"#{nome_input}").fill("Filtro Teste Automação BC")
        page.wait_for_timeout(300)

    shot(page, "05_nome_preenchido")
    dump(page, "estado_formulario_salvar", """
        () => {
            const panel = document.querySelector('[id*="filter"], [class*="drawer"]') || document.body;
            return {
                toggles: Array.from(panel.querySelectorAll('[role="switch"]')).map(t => ({
                    id: t.id, checked: t.getAttribute('aria-checked')
                })),
                inputs_text: Array.from(panel.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null).map(i => ({
                    id: i.id, value: i.value
                })),
                botoes_footer: Array.from(panel.querySelectorAll('button')).filter(b => {
                    const t = b.innerText?.trim().toLowerCase();
                    return t === 'aplicar' || t === 'cancelar' || t.includes('salvar');
                }).map(b => ({text: b.innerText?.trim(), id: b.id, disabled: b.disabled}))
            };
        }
    """)

    # ── Passo 6: Clicar "Aplicar" (com toggle de salvar ativado) ─────────────
    print("\n  [Passo 6] Clicar 'Aplicar' com toggle de salvar ativado")
    t0 = time.time()
    page.locator("#list-filter-apply").click()
    page.wait_for_timeout(5000)
    elapsed = time.time() - t0

    url_apos = page.url
    body_len = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
    toasts = page.evaluate("""
        () => Array.from(document.querySelectorAll('.chakra-toast')).map(t => t.innerText?.trim()).filter(t => t)
    """)
    shot(page, "06_apos_aplicar")
    print(f"  [URL] {url_apos}")
    print(f"  [body_len] {body_len}")
    print(f"  [toasts] {toasts}")
    print(f"  [tempo] {elapsed:.1f}s")

    # ── Passo 7: Verificar se o filtro apareceu em "Meus filtros" ────────────
    print("\n  [Passo 7] Verificar se filtro foi salvo em 'Meus filtros'")
    page.wait_for_timeout(2000)
    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2500)
    shot(page, "07_lista_filtros_pos_salvar")

    dump(page, "meus_filtros", """
        () => {
            const all = document.body.innerText;
            // Procurar seção "Meus filtros"
            const idx = all.indexOf('Meus filtros');
            return {
                meus_filtros_snippet: all.slice(idx, idx + 400),
                filtro_teste_encontrado: all.includes('Filtro Teste Automação BC') || all.includes('Filtro Teste Automa')
            };
        }
    """)

    browser.close()
    print(f"\n==> Concluído. Screenshots em: {OUT}")
