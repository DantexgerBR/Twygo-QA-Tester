"""
Script de inspeção: /o/36675/knowledge_repositories
Mapeia:
  - Coluna "Situação" e seus possíveis valores (Em processamento / Indexado)
  - Formulário "Identificação" e botão Salvar
  - Estrutura da listagem de arquivos
"""
import os, json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage

load_dotenv()

BASE_URL   = os.getenv("BASE_URL", "").rstrip("/") + "/"
EMAIL      = os.getenv("ADMIN_EMAIL")
PASSWORD   = os.getenv("ADMIN_PASSWORD")
ORG_ID     = os.getenv("ORG_ID", "36675")
REPO_URL   = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories"

OUT = pathlib.Path("test-results/inspect_knowledge_repo")
OUT.mkdir(parents=True, exist_ok=True)


def login(page):
    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"[screenshot] {p}")


def dump_elements(page, label, js):
    try:
        result = page.evaluate(js)
        print(f"\n--- {label} ---")
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return result
    except Exception as e:
        print(f"[ERRO {label}] {e}")
        return None


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()

    # 1. Login
    print("==> Login")
    login(page)

    # 2. Navegar para knowledge_repositories
    print(f"==> Navegando para {REPO_URL}")
    try:
        page.goto(REPO_URL, wait_until="domcontentloaded", timeout=20000)
        page.wait_for_timeout(5000)
    except Exception as e:
        print(f"[ERRO goto] {e}")

    shot(page, "01_lista_repositorios")

    # 3. Listar repositórios disponíveis
    dump_elements(page, "Repositórios (linhas)", """
        () => {
            const rows = document.querySelectorAll('table tbody tr, [data-item-id], .repository-item, li[data-id]');
            return Array.from(rows).slice(0, 20).map(r => ({
                tag: r.tagName,
                id: r.getAttribute('data-id') || r.getAttribute('data-item-id') || r.id,
                text: r.innerText?.slice(0, 120),
                href: r.querySelector('a')?.href
            }));
        }
    """)

    # 4. Procurar qualquer link/botão para entrar em um repositório
    links = dump_elements(page, "Links de repositório", """
        () => Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.innerText?.trim().slice(0, 60),
            href: a.href
        })).filter(x => x.href && x.href.includes('knowledge_repositor'))
    """)

    # 5. Tentar entrar no primeiro repositório disponível
    if links:
        first_repo_href = links[0].get("href")
        if first_repo_href:
            print(f"==> Entrando no repositório: {first_repo_href}")
            try:
                page.goto(first_repo_href, wait_until="domcontentloaded", timeout=20000)
                page.wait_for_timeout(5000)
                shot(page, "02_dentro_repositorio")
            except Exception as e:
                print(f"[ERRO goto repo] {e}")

            # 6. Mapear coluna "Situação"
            dump_elements(page, "Coluna Situação", """
                () => {
                    const situacao = [];
                    // cabeçalhos de tabela
                    document.querySelectorAll('th, .th, [class*="header"]').forEach(h => {
                        if (h.innerText?.toLowerCase().includes('situa')) {
                            situacao.push({tipo: 'header', text: h.innerText, tag: h.tagName, class: h.className});
                        }
                    });
                    // células com texto de status
                    document.querySelectorAll('td, [class*="status"], [class*="situation"], [class*="badge"]').forEach(c => {
                        const t = c.innerText?.trim();
                        if (t && (t.toLowerCase().includes('process') || t.toLowerCase().includes('index'))) {
                            situacao.push({tipo: 'cell', text: t, tag: c.tagName, class: c.className});
                        }
                    });
                    return situacao.slice(0, 30);
                }
            """)

            # 7. Mapear botão / formulário Identificação
            dump_elements(page, "Formulário Identificação / botão Salvar", """
                () => {
                    const items = [];
                    // botões com texto salvar
                    document.querySelectorAll('button, input[type=submit], [type=button]').forEach(b => {
                        const t = b.innerText?.trim() || b.value || '';
                        if (t.toLowerCase().includes('salvar') || t.toLowerCase().includes('save')) {
                            items.push({tipo: 'btn_salvar', tag: b.tagName, text: t, id: b.id, class: b.className, disabled: b.disabled});
                        }
                    });
                    // labels / fieldsets com "Identificação"
                    document.querySelectorAll('label, legend, h2, h3, h4, [class*="title"], [class*="heading"]').forEach(el => {
                        const t = el.innerText?.trim();
                        if (t && t.toLowerCase().includes('identifica')) {
                            items.push({tipo: 'label_identificacao', tag: el.tagName, text: t, id: el.id, class: el.className});
                        }
                    });
                    return items.slice(0, 30);
                }
            """)

            # 8. Screenshot full-page do estado atual
            shot(page, "03_mapeamento_completo")

            # 9. Tentar abrir painel lateral clicando no primeiro arquivo da lista
            clicked = page.evaluate("""
                () => {
                    // tentar primeira linha clicável da tabela
                    const row = document.querySelector('table tbody tr td:first-child, [class*="file-name"], [class*="filename"], [class*="title"] a');
                    if (row) { row.click(); return row.innerText?.trim().slice(0,60); }
                    return null;
                }
            """)
            print(f"[click first item] {clicked}")
            if clicked:
                page.wait_for_timeout(3000)
                shot(page, "04_painel_lateral_apos_click")
                dump_elements(page, "Painel lateral aberto", """
                    () => {
                        const panel = document.querySelector('[class*="sidebar"], [class*="panel"], [class*="drawer"], [role="dialog"]');
                        if (!panel) return [{msg: 'nenhum painel encontrado'}];
                        return [{
                            tag: panel.tagName,
                            class: panel.className,
                            text_snippet: panel.innerText?.slice(0, 300),
                            inputs: Array.from(panel.querySelectorAll('input, textarea, select')).map(i => ({
                                tag: i.tagName, name: i.name, id: i.id, placeholder: i.placeholder, type: i.type
                            })),
                            buttons: Array.from(panel.querySelectorAll('button')).map(b => ({
                                text: b.innerText?.trim(), id: b.id, class: b.className
                            }))
                        }];
                    }
                """)

    # 10. HTML parcial da página para análise de estrutura
    html_snippet = page.evaluate("() => document.body.innerHTML.slice(0, 4000)")
    with open(str(OUT / "page_html_snippet.txt"), "w") as f:
        f.write(html_snippet)
    print(f"[html] {OUT / 'page_html_snippet.txt'}")

    browser.close()
    print("\n==> Inspeção concluída.")
