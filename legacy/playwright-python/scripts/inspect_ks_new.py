import os, json, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pages.login_page import LoginPage

load_dotenv()
BASE_URL = os.getenv("BASE_URL","").rstrip("/")+"/"
EMAIL    = os.getenv("ADMIN_EMAIL")
PASSWORD = os.getenv("ADMIN_PASSWORD")
ORG_ID   = os.getenv("ORG_ID","36675")

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = pw.chromium.launch(headless=True).new_page()
    browser.close()
    browser = pw.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width":1440,"height":900})
    page = ctx.new_page()
    LoginPage(page).login(BASE_URL, EMAIL, PASSWORD)
    page.goto(f"{BASE_URL}o/{ORG_ID}/knowledge_repositories/333/knowledge_sources/new",wait_until="domcontentloaded",timeout=20000)
    page.wait_for_timeout(5000)
    r = page.evaluate("""
        () => Array.from(document.querySelectorAll('input,textarea')).map(i=>({
            tag:i.tagName,type:i.type,id:i.id,name:i.name,placeholder:i.placeholder,
            accept:i.getAttribute('accept'),visible:i.offsetParent!==null,
            label:document.querySelector(`label[for="${i.id}"]`)?.innerText?.trim()
        })).filter(x=>x.visible||x.type==='file')
    """)
    print(json.dumps(r,ensure_ascii=False,indent=2))
    browser.close()
