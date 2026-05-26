"""
Reprodução v3 — filtro BC: clica no chakra-switch__track para ativar toggle + Aplicar → verifica se salva.
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

OUT = pathlib.Path("test-results/filtro_bc_v3")
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

    # 1. Abrir painel de filtros
    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2000)
    shot(page, "01_lista_filtros")

    # 2. Entrar no filtro "Bases sem fontes" clicando no radio/label da linha
    page.evaluate("""
        () => {
            // Tentar clicar na linha completa "Bases sem fontes"
            const allEls = Array.from(document.querySelectorAll('*'));
            const label = allEls.find(el =>
                el.innerText?.trim() === 'Bases sem fontes' &&
                (el.tagName === 'LABEL' || el.tagName === 'SPAN' || el.tagName === 'LI' || el.tagName === 'DIV')
            );
            if (label) label.click();
        }
    """)
    page.wait_for_timeout(1500)
    shot(page, "02_filtro_selecionado")

    # 3. Expandir seção "Salvar filtro"
    page.evaluate("() => document.getElementById('accordion-button-expand-submit-filter')?.click()")
    page.wait_for_timeout(1500)
    shot(page, "03_salvar_expandido")

    # 4. Ativar toggle via chakra-switch__track (elemento visual)
    toggle_result = page.evaluate("""
        () => {
            const track = document.querySelector('.chakra-switch__track, [class*="switch__track"]');
            if (track) {
                track.click();
                return {found: true, aria_before: document.querySelector('[role="switch"]')?.getAttribute('aria-checked')};
            }
            // fallback: label do switch
            const label = document.querySelector('label.chakra-switch, [class*="switch"]');
            if (label) {
                label.click();
                return {found: true, via: 'label'};
            }
            return {found: false};
        }
    """)
    print(f"\n  [toggle click] {json.dumps(toggle_result, ensure_ascii=False)}")
    page.wait_for_timeout(1000)
    shot(page, "04_toggle_apos_click")

    # Verificar estado visual do toggle
    toggle_estado = page.evaluate("""
        () => {
            const sw = document.querySelector('[role="switch"]');
            const track = document.querySelector('.chakra-switch__track');
            const input = document.querySelector('.chakra-switch__input, input[class*="switch"]');
            return {
                role_switch_aria: sw?.getAttribute('aria-checked'),
                track_class: track?.className,
                input_checked: input?.checked,
                toggle_text_area: document.querySelector('[class*="salvar"], [class*="save-filter"]')?.innerText?.trim()
            };
        }
    """)
    print(f"  [toggle estado] {json.dumps(toggle_estado, ensure_ascii=False)}")

    # 5. Preencher nome
    nome_input_id = page.evaluate("""
        () => {
            // O campo Nome do filtro a ser salvo
            const inputs = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null);
            const nome = inputs.find(i => i.value.includes('Bases') || i.placeholder?.toLowerCase().includes('nome') || i.id.includes('name'));
            return nome?.id || (inputs[0]?.id);
        }
    """)
    if nome_input_id:
        page.fill(f"#{nome_input_id}", "Filtro Teste Automação BC")
        page.wait_for_timeout(300)
    shot(page, "05_nome_preenchido")

    # 6. Clicar "Aplicar" (botão azul no footer do drawer)
    print("\n  [Passo 6] Clicar 'Aplicar'")
    aplicar_result = page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button'));
            const aplicar = btns.find(b => b.innerText?.trim() === 'Aplicar');
            if (aplicar) {
                const info = {id: aplicar.id, disabled: aplicar.disabled, class: aplicar.className.slice(0,60)};
                aplicar.click();
                return info;
            }
            return null;
        }
    """)
    print(f"  [Aplicar] {json.dumps(aplicar_result, ensure_ascii=False)}")

    # Monitorar resultado
    for tick in range(1, 7):
        page.wait_for_timeout(1000)
        try:
            url = page.url
            body = page.evaluate("() => document.body?.innerText?.trim()?.length ?? 0")
            toasts = page.evaluate("() => Array.from(document.querySelectorAll('.chakra-toast')).map(t=>t.innerText?.trim()).filter(t=>t)")
            print(f"  [t={tick}s] body={body}  toasts={toasts}  url_tail={url.split('/')[-1].split('?')[0]}")
        except Exception:
            print(f"  [t={tick}s] navegação detectada")
            page.wait_for_load_state("domcontentloaded", timeout=10000)
            break

    shot(page, "06_apos_aplicar")

    # 7. Verificar "Meus filtros" na lista
    print("\n  [Passo 7] Verificar se filtro aparece em 'Meus filtros'")
    page.wait_for_timeout(1000)
    page.evaluate("() => document.getElementById('open-filter')?.click()")
    page.wait_for_timeout(2500)
    shot(page, "07_lista_apos_salvar")

    meus_filtros = page.evaluate("""
        () => {
            const txt = document.body.innerText;
            const idx = txt.indexOf('Meus filtros');
            const snippet = txt.slice(idx, idx + 500);
            return {
                snippet,
                filtro_encontrado: txt.includes('Filtro Teste') || txt.includes('Filtro Teste Automação BC')
            };
        }
    """)
    print(f"\n  [Meus filtros] encontrado={meus_filtros.get('filtro_encontrado')}  snippet='{meus_filtros.get('snippet', '')[:200]}'")

    browser.close()
    print(f"\n==> Concluído. Screenshots em: {OUT}")
