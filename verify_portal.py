from playwright.sync_api import sync_playwright
from pathlib import Path
import json

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True, args=['--enable-unsafe-swiftshader'])
    page = browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('http://127.0.0.1:8765',wait_until='networkidle')
    page.wait_for_selector('#model-loader.hidden',timeout=60000,state='attached')
    assert page.locator('#model-stage canvas').count()==1
    assert page.evaluate('''() => [...document.querySelectorAll('a[href^="#"]')].every(a=>document.getElementById(a.hash.slice(1)))''')
    assert page.evaluate('''() => {const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);return ids.length===new Set(ids).size}''')
    shots=Path('verification');shots.mkdir(exist_ok=True)
    results=[]
    for width in [1440,1024,768,390,320]:
        page.set_viewport_size({'width':width,'height':1000})
        page.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'))")
        page.wait_for_timeout(900)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),width
        if width<=1100:
            page.locator('[data-menu-toggle]').click()
            assert page.locator('[data-menu-toggle]').get_attribute('aria-expanded')=='true'
            page.keyboard.press('Escape')
            assert page.locator('[data-menu-toggle]').get_attribute('aria-expanded')=='false'
            page.locator('[data-menu-toggle]').click()
            page.locator('.main-nav a[href="#departamentos"]').click()
            assert page.locator('[data-menu-toggle]').get_attribute('aria-expanded')=='false'
        page.evaluate('scrollTo(0,0)');page.wait_for_timeout(900)
        if width in [1440,390]:page.screenshot(path=str(shots/f'portal-{width}.png'),full_page=True)
        results.append({'width':width,'overflow':False,'menu':'passed' if width<=1100 else 'desktop'})
    page.set_viewport_size({'width':1440,'height':1000})
    page.evaluate('scrollTo(0,0)');page.wait_for_timeout(900)
    stage=page.locator('#model-stage')
    stage.screenshot(path=str(shots/'model-before.png'))
    stage.hover(position={'x':150,'y':180});page.mouse.wheel(0,-100);page.mouse.click(1050,450);page.wait_for_timeout(600)
    stage.screenshot(path=str(shots/'model-after.png'))
    assert (shots/'model-before.png').read_bytes()!=(shots/'model-after.png').read_bytes()
    links=page.locator('a[href*="docs.google.com/forms"]')
    assert links.count()==3
    for a in links.all():
        assert a.get_attribute('target')=='_blank' and a.get_attribute('rel')=='noopener noreferrer'
    with page.expect_popup() as popup:
        links.first.click()
    form=popup.value
    try:
        form.wait_for_load_state('domcontentloaded',timeout=45000)
        form_result={'url':form.url,'title':form.title(),'text':form.locator('body').inner_text()[:500]}
    except Exception as e:form_result={'url':form.url,'error':str(e)}
    page.emulate_media(reduced_motion='reduce');page.reload(wait_until='networkidle');page.wait_for_selector('#model-loader.hidden',state='attached')
    assert page.locator('.hero-copy').evaluate('e=>getComputedStyle(e).opacity')=='1'
    assert not errors,errors
    hashes={}
    for f in ['assets/js/model.js','assets/models/logo_GLTF_final_v2.glb']:
        hashes[f]=Path(f).read_bytes()==Path('backups/20260906-154910',f).read_bytes()
        assert hashes[f]
    report={'viewports':results,'model_loaded':True,'model_interaction_render_changed':True,'preserved':hashes,'internal_links':'passed','form':form_result,'reduced_motion':'passed','page_errors':errors}
    (shots/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))
    browser.close()

