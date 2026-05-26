"""
Inspeção 2: formulário de criação (/new) e estrutura interna de um knowledge repository.
Foco: seção "Identificação", botão Salvar, coluna "Situação" em uploads.
"""
import os, json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage

load_dotenv()

BASE_URL = os.getenv("BASE_URL", "").rstrip("/") + "/"
EMAIL    = os.getenv("ADMIN_EMAIL")
PASSWORD = os.getenv("ADMIN_PASSWORD")
ORG_ID   = os.getenv("ORG_ID", "36675")

OUT = pathlib.Path("test-results/inspect_knowledge_repo_2")
OUT.mkdir(parents=True, exist_ok=True)


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"[screenshot] {p}")


def dump(page, label, js):
    try:
        r = page.evaluate(js)
        print(f"\n--- {label} ---")
        print(json.dumps(r, ensure_ascii=False, indent=2))
        return r
    except Exception as e:
        print(f"[ERRO {label}] {e}")
        return None


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False, slow_mo=300)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()

    # Login
    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    # 1. Abrir formulário /new
    new_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/new"
    print(f"==> {new_url}")
    try:
        page.goto(new_url, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(4000)
    except Exception as e:
        print(f"[ERRO goto /new] {e}")

    shot(page, "01_form_new")

    # 2. Mapear todos os campos e seções do formulário
    dump(page, "Campos do formulário", """
        () => {
            return Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
                tag: el.tagName,
                type: el.type,
                name: el.name,
                id: el.id,
                placeholder: el.placeholder,
                label: document.querySelector(`label[for="${el.id}"]`)?.innerText?.trim()
            })).filter(x => x.name || x.id);
        }
    """)

    dump(page, "Seções / títulos do formulário", """
        () => Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,fieldset legend,[class*="section-title"],[class*="card-title"],[class*="panel-title"]'))
            .map(el => ({tag: el.tagName, text: el.innerText?.trim(), class: el.className}))
            .filter(x => x.text)
    """)

    dump(page, "Botões no formulário", """
        () => Array.from(document.querySelectorAll('button,[type=submit],[type=button]'))
            .map(b => ({tag: b.tagName, text: b.innerText?.trim() || b.value, id: b.id, class: b.className, disabled: b.disabled}))
            .filter(x => x.text)
    """)

    # 3. Preencher campos obrigatórios para criar um repositório de teste
    print("\n==> Preenchendo nome do repositório de teste")
    try:
        # Tentar preencher o campo Nome/Título
        name_field = page.locator("input[name*='name'], input[name*='title'], #knowledge_repository_name, #knowledge_repository_title").first
        if name_field.count() > 0:
            name_field.fill("TESTE_AUTOMACAO_BUG_SITUACAO")
            page.wait_for_timeout(500)
            shot(page, "02_nome_preenchido")
    except Exception as e:
        print(f"[ERRO preencher nome] {e}")

    # 4. Procurar aba/seção "Identificação" especificamente
    dump(page, "Aba ou seção Identificação", """
        () => {
            const all = Array.from(document.querySelectorAll('*'));
            return all.filter(el => el.innerText?.trim().toLowerCase() === 'identificação' ||
                                    el.innerText?.trim().toLowerCase() === 'identificacao')
                      .map(el => ({tag: el.tagName, class: el.className, id: el.id, parent_class: el.parentElement?.className}));
        }
    """)

    # 5. Verificar se há abas (tabs) na página
    dump(page, "Abas/Tabs", """
        () => Array.from(document.querySelectorAll('[role="tab"], .nav-link, .nav-tab, [class*="tab-item"]'))
            .map(t => ({text: t.innerText?.trim(), class: t.className, href: t.getAttribute('href'), active: t.classList.contains('active')}))
    """)

    # 6. Tentar salvar e ver o que acontece (para observar o loading infinito)
    print("\n==> Tentando salvar formulário para observar comportamento do botão")
    try:
        save_btn = page.locator("button:has-text('Salvar'), input[value*='Salvar'], button:has-text('Criar')").first
        if save_btn.count() > 0:
            shot(page, "03_antes_de_salvar")
            save_btn.click()
            page.wait_for_timeout(5000)
            shot(page, "04_apos_clicar_salvar")

            # Verificar estado do botão após click
            dump(page, "Estado do botão Salvar após click", """
                () => Array.from(document.querySelectorAll('button,[type=submit]'))
                    .filter(b => b.innerText?.toLowerCase().includes('salvar') || b.innerText?.toLowerCase().includes('criar') || b.value?.toLowerCase().includes('salvar'))
                    .map(b => ({text: b.innerText?.trim() || b.value, disabled: b.disabled, class: b.className,
                                aria_busy: b.getAttribute('aria-busy'), data_loading: b.getAttribute('data-loading'),
                                style: b.getAttribute('style')}))
            """)
    except Exception as e:
        print(f"[ERRO salvar] {e}")

    # 7. Ver se foi redirecionado para a página do repositório criado
    current_url = page.url
    print(f"\n[URL atual] {current_url}")
    shot(page, "05_estado_final")

    # 8. Se criou o repositório, explorar a tela interna (onde fica a coluna Situação)
    if "/knowledge_repositories/" in current_url and "/new" not in current_url:
        print("==> Repositório criado! Explorando tela interna...")
        page.wait_for_timeout(3000)

        dump(page, "Coluna Situação na tela interna", """
            () => {
                const result = [];
                document.querySelectorAll('th, td, [class*="status"], [class*="situation"]').forEach(el => {
                    const t = el.innerText?.trim();
                    if (t && (t.toLowerCase().includes('situa') || t.toLowerCase().includes('process') || t.toLowerCase().includes('index'))) {
                        result.push({tag: el.tagName, text: t, class: el.className});
                    }
                });
                return result;
            }
        """)

        dump(page, "Abas na tela interna", """
            () => Array.from(document.querySelectorAll('[role="tab"], .nav-link, .tab-item, a[data-toggle="tab"]'))
                .map(t => ({text: t.innerText?.trim(), href: t.href || t.getAttribute('href'), active: t.classList.contains('active')}))
        """)

    # HTML para análise
    html = page.evaluate("() => document.body.innerHTML.slice(0, 6000)")
    with open(str(OUT / "html_snippet.txt"), "w") as f:
        f.write(html)

    browser.close()
    print("\n==> Inspeção 2 concluída.")
