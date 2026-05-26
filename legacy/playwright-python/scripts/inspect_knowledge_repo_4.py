"""
Inspeção 4: Modal "+ Adicionar" na aba Fontes de conhecimento.
Foco: campos do formulário de upload, botão salvar do modal, coluna Situação após adicionar.
"""
import os, json, pathlib, sys, time
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage

load_dotenv()

BASE_URL  = os.getenv("BASE_URL", "").rstrip("/") + "/"
EMAIL     = os.getenv("ADMIN_EMAIL")
PASSWORD  = os.getenv("ADMIN_PASSWORD")
ORG_ID    = os.getenv("ORG_ID", "36675")
REPO_ID   = "333"

OUT = pathlib.Path("test-results/inspect_knowledge_repo_4")
OUT.mkdir(parents=True, exist_ok=True)

JPEG_FILE = str(pathlib.Path("test-results/knowledge_bugs/arquivo_teste.jpg"))
PDF_FILE  = str(pathlib.Path("test-results/knowledge_bugs/arquivo_teste.pdf"))


def shot(page, name):
    p = OUT / f"{name}.png"
    page.screenshot(path=str(p), full_page=True)
    print(f"  [screenshot] {p}")
    return str(p)


def dump(page, label, js):
    try:
        r = page.evaluate(js)
        print(f"\n  [{label}]\n  {json.dumps(r, ensure_ascii=False, indent=2)}")
        return r
    except Exception as e:
        print(f"  [ERRO {label}] {e}")
        return None


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False, slow_mo=400)
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()

    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    edit_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/edit?tab=identification"
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    shot(page, "01_edit_page")

    # 1. Clicar na aba "Fontes de conhecimento"
    print("\n  [click] Aba Fontes de conhecimento")
    fontes_tab = page.get_by_role("tab", name="Fontes de conhecimento")
    fontes_tab.click()
    page.wait_for_timeout(4000)
    shot(page, "02_fontes_tab_aberta")

    dump(page, "fontes_tab_panel", """
        () => {
            const panel = document.querySelector('[role="tabpanel"]');
            return {
                text: panel?.innerText?.slice(0, 400),
                buttons: Array.from(panel?.querySelectorAll('button') || []).map(b => ({
                    text: b.innerText?.trim(), id: b.id, class: b.className.slice(0, 60)
                })),
                table_headers: Array.from(panel?.querySelectorAll('th') || []).map(th => th.innerText?.trim()),
                rows: Array.from(panel?.querySelectorAll('tbody tr') || []).length
            };
        }
    """)

    # 2. Clicar em "+ Adicionar"
    print("\n  [click] Botão + Adicionar na aba Fontes")
    try:
        # O botão pode ter texto "Adicionar" com ícone +
        adicionar = page.locator('[role="tabpanel"] button').filter(has_text="Adicionar").first
        adicionar.click()
        page.wait_for_timeout(4000)
        shot(page, "03_modal_adicionar_aberto")

        # Mapear o modal
        dump(page, "modal_completo", """
            () => {
                const modal = document.querySelector('[role="dialog"]');
                if (!modal) return {found: false};
                return {
                    found: true,
                    title: modal.querySelector('h2, h3, [class*="title"]')?.innerText?.trim(),
                    text_snippet: modal.innerText?.slice(0, 600),
                    inputs: Array.from(modal.querySelectorAll('input, textarea')).map(i => ({
                        type: i.type,
                        id: i.id,
                        name: i.name,
                        placeholder: i.placeholder,
                        accept: i.getAttribute('accept'),
                        label: document.querySelector(`label[for="${i.id}"]`)?.innerText?.trim()
                    })),
                    buttons: Array.from(modal.querySelectorAll('button')).map(b => ({
                        text: b.innerText?.trim(), id: b.id, class: b.className.slice(0,60)
                    })),
                    file_inputs: Array.from(modal.querySelectorAll('input[type="file"]')).map(i => ({
                        id: i.id, accept: i.getAttribute('accept'), multiple: i.multiple
                    })),
                    upload_zone: !!modal.querySelector('[class*="drop"], [class*="upload"]')
                };
            }
        """)

        # 3. Procurar área de upload (dropzone ou input[file])
        file_input = page.locator('[role="dialog"] input[type="file"]').first
        if file_input.count() > 0:
            print("\n  [upload JPEG via modal]")
            file_input.set_input_files(JPEG_FILE)
            page.wait_for_timeout(2000)
            shot(page, "04_jpeg_selecionado")

            dump(page, "modal_com_arquivo", """
                () => {
                    const modal = document.querySelector('[role="dialog"]');
                    return {
                        text: modal?.innerText?.slice(0, 500),
                        progress: Array.from(modal?.querySelectorAll('[class*="progress"], [role="progressbar"]') || []).map(p => ({
                            class: p.className, value: p.getAttribute('aria-valuenow'), text: p.innerText
                        })),
                        status_cells: Array.from(modal?.querySelectorAll('[class*="status"], [class*="badge"], td') || []).map(c => ({
                            text: c.innerText?.trim(), class: c.className
                        })).filter(c => c.text)
                    };
                }
            """)

            # Preencher campo Nome se existir
            nome_input = page.locator('[role="dialog"] input[type="text"]').first
            if nome_input.count() > 0:
                nome_input.fill("Imagem Teste Automação")
                page.wait_for_timeout(300)

            shot(page, "05_antes_salvar_modal")

            # Clicar em Salvar/Adicionar no modal
            salvar_modal = page.locator('[role="dialog"] button').filter(has_text="Salvar").first
            if salvar_modal.count() == 0:
                salvar_modal = page.locator('[role="dialog"] button').filter(has_text="Adicionar").first
            if salvar_modal.count() == 0:
                salvar_modal = page.locator('[role="dialog"] button').filter(has_text="Confirmar").first

            if salvar_modal.count() > 0:
                salvar_modal.click()
                page.wait_for_timeout(3000)
                shot(page, "06_pos_salvar_modal")

                dump(page, "pos_salvar_modal", """
                    () => {
                        const panel = document.querySelector('[role="tabpanel"]');
                        return {
                            modal_ainda_aberto: !!document.querySelector('[role="dialog"]'),
                            toasts: Array.from(document.querySelectorAll('.chakra-toast')).map(t => t.innerText?.trim()),
                            tabela_linhas: Array.from(panel?.querySelectorAll('tbody tr') || []).map(r => ({
                                cells: Array.from(r.querySelectorAll('td')).map(c => c.innerText?.trim())
                            }))
                        };
                    }
                """)

                # Coluna Situação após upload
                print("\n  [aguardando 45s] Monitorando coluna Situação...")
                for tick in range(9):
                    page.wait_for_timeout(5000)
                    situacao = dump(page, f"situacao_{(tick+1)*5}s", """
                        () => {
                            const panel = document.querySelector('[role="tabpanel"]') || document.body;
                            const rows = Array.from(panel.querySelectorAll('tbody tr'));
                            return rows.map(r => ({
                                cells: Array.from(r.querySelectorAll('td')).map(c => c.innerText?.trim())
                            }));
                        }
                    """)
                    if situacao:
                        for row in situacao:
                            cells = row.get("cells", [])
                            if any("index" in str(c).lower() or "process" in str(c).lower() for c in cells):
                                print(f"  [Situação encontrada em {(tick+1)*5}s] {cells}")
                    page.reload(wait_until="domcontentloaded", timeout=20000) if tick == 4 else None
                    if tick == 4:
                        page.wait_for_timeout(3000)
                        page.get_by_role("tab", name="Fontes de conhecimento").click()
                        page.wait_for_timeout(2000)

                shot(page, "07_situacao_final_45s")

            else:
                print("  [AVISO] Nenhum botão Salvar/Adicionar encontrado no modal")
                dump(page, "todos_botoes_modal", "() => Array.from(document.querySelectorAll('[role=\"dialog\"] button')).map(b => ({text: b.innerText?.trim(), class: b.className}))")

        else:
            print("  [sem file input no modal] Verificando se há dropzone ou outro método de upload")
            shot(page, "04_sem_file_input")
            dump(page, "modal_sem_file_input", """
                () => {
                    const modal = document.querySelector('[role="dialog"]');
                    return {
                        html_snippet: modal?.innerHTML?.slice(0, 2000)
                    };
                }
            """)

    except Exception as e:
        print(f"  [ERRO] {e}")
        shot(page, "erro_modal")

    browser.close()
    print("\n==> Inspeção 4 concluída.")
