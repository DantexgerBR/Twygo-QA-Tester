"""
Reprodução Bug 1 — aba "Recursos de mídia":
Upload JPEG/PNG e monitorar coluna Situação (esperado: "Em processamento" nunca muda para "Indexado")
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
REPO_ID  = "333"

OUT = pathlib.Path("test-results/bug1_recursos_midia")
OUT.mkdir(parents=True, exist_ok=True)

JPEG_FILE = str(pathlib.Path("test-results/bug1_jpeg_midia/imagem_teste.jpg"))


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


def ler_linhas(page):
    return page.evaluate("""
        () => Array.from(document.querySelectorAll('tbody tr')).map(r => ({
            cells: Array.from(r.querySelectorAll('td')).map(c => c.innerText?.trim())
        }))
    """)


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()

    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    print("==> Login OK")

    edit_url = f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/{REPO_ID}/edit?tab=identification"
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)

    # Abrir Recursos de mídia
    page.get_by_role("tab", name="Recursos de mídia").click()
    page.wait_for_timeout(4000)
    shot(page, "01_recursos_midia_vazio")

    # Mapear o botão Adicionar desta aba e o que acontece ao clicar
    print("\n  [click] + Adicionar em Recursos de mídia")
    page.evaluate("""
        () => {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b =>
                b.innerText?.trim().includes('Adicionar') &&
                !b.closest('[class*="popover"], header, nav')
            );
            if (btn) btn.click();
        }
    """)
    page.wait_for_timeout(4000)
    current_url = page.url
    print(f"  [URL após click Adicionar] {current_url}")
    shot(page, "02_apos_click_adicionar")

    # Se navegou para nova página, mapear os campos
    if current_url != (edit_url.split('?')[0] + "?tab=identification"):
        dump(page, "campos_nova_pagina", """
            () => Array.from(document.querySelectorAll('input, textarea')).filter(i => i.offsetParent !== null || i.type === 'file').map(i => ({
                tag: i.tagName, type: i.type, id: i.id, name: i.name,
                placeholder: i.placeholder, accept: i.getAttribute('accept'),
                visible: i.offsetParent !== null
            }))
        """)
        # Preencher nome
        try:
            page.locator("input[type='text']:visible").first.fill("JPEG Recurso Teste Bug 1")
            page.wait_for_timeout(200)
        except Exception as e:
            print(f"  [ERRO nome] {e}")

        # Upload JPEG
        file_input = page.locator("input[type='file']").first
        if file_input.count() > 0:
            print(f"  [upload JPEG]")
            try:
                file_input.set_input_files(JPEG_FILE)
                page.wait_for_timeout(2000)
                shot(page, "03_jpeg_no_form")
            except Exception as e:
                print(f"  [ERRO upload] {e}")

        shot(page, "04_form_preenchido")

        # Salvar
        salvar = page.get_by_role("button", name="Salvar")
        if salvar.count() > 0:
            salvar.click()
        else:
            # Tentar botão Enviar ou Adicionar
            for label in ["Enviar", "Adicionar", "Confirmar", "Criar"]:
                btn = page.get_by_role("button", name=label)
                if btn.count() > 0:
                    btn.click()
                    break
        page.wait_for_timeout(8000)
        try:
            page.wait_for_load_state("domcontentloaded", timeout=10000)
        except Exception:
            pass
        print(f"  [URL pós-salvar] {page.url}")
        shot(page, "05_pos_salvar")

    else:
        # Abre como modal/overlay na mesma página
        dump(page, "modal_recursos_midia", """
            () => {
                const overlay = document.querySelector('[role="dialog"], [class*="modal"]:not([class*="hidden"]), [class*="drawer"]');
                if (!overlay) return {found: false};
                return {
                    found: true,
                    text: overlay.innerText?.slice(0, 400),
                    file_inputs: Array.from(overlay.querySelectorAll('input[type="file"]')).map(i => ({id: i.id, accept: i.getAttribute('accept')})),
                    text_inputs: Array.from(overlay.querySelectorAll('input[type="text"], textarea')).map(i => ({id: i.id, placeholder: i.placeholder})),
                    buttons: Array.from(overlay.querySelectorAll('button')).map(b => ({text: b.innerText?.trim(), id: b.id}))
                };
            }
        """)

    # Voltar para a listagem e checar Situação
    page.goto(edit_url, wait_until="domcontentloaded", timeout=20000)
    page.wait_for_timeout(5000)
    try:
        page.get_by_role("tab", name="Recursos de mídia").click()
        page.wait_for_timeout(3000)
    except Exception:
        pass
    shot(page, "06_lista_apos_upload")

    linhas_inicial = ler_linhas(page)
    print(f"\n  [situacao inicial] {json.dumps(linhas_inicial, ensure_ascii=False)}")

    if not linhas_inicial:
        print("  [AVISO] Nenhum registro — upload pode ter falhado silenciosamente")
    else:
        print("\n  [monitorando Situação por 2 min]...")
        jpeg_indexou = False
        for tick in range(8):
            page.wait_for_timeout(15000)
            page.reload(wait_until="domcontentloaded", timeout=20000)
            page.wait_for_timeout(3000)
            try:
                page.get_by_role("tab", name="Recursos de mídia").click()
                page.wait_for_timeout(2000)
            except Exception:
                pass
            linhas_agora = ler_linhas(page)
            print(f"  [{(tick+1)*15}s] {json.dumps(linhas_agora, ensure_ascii=False)}")
            for row in linhas_agora:
                cells = row.get("cells", [])
                if any("index" in str(c).lower() for c in cells):
                    jpeg_indexou = True
                    print(f"  [INDEXADO em {(tick+1)*15}s]")

        shot(page, "07_situacao_2min")
        if not jpeg_indexou:
            print("\n  [BUG 1 CONFIRMADO] Situação NUNCA mudou para 'Indexado' em 2 minutos")

    browser.close()
    print(f"\n==> Concluído. Screenshots em: {OUT}")
