(function(){
    const header=document.querySelector('[data-header]');
    const toggle=document.querySelector('[data-menu-toggle]');
    const menu=document.querySelector('[data-menu]');
    const links=[...document.querySelectorAll('.main-nav a[href^="#"]')];
    const sections=[...document.querySelectorAll('main section[id]')];
    const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>24);
    const closeMenu=()=>{toggle?.setAttribute('aria-expanded','false');menu?.classList.remove('open');document.body.classList.remove('menu-open')};
    toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu?.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open)});
    links.forEach(link=>link.addEventListener('click',closeMenu));
    window.addEventListener('resize',()=>{if(window.innerWidth>820)closeMenu()});
    const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -40px'}):null;
    document.querySelectorAll('.reveal').forEach(element=>{if(element.dataset.revealDelay)element.style.setProperty('--delay',`${element.dataset.revealDelay}ms`);observer?observer.observe(element):element.classList.add('visible')});
    if('IntersectionObserver'in window){const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`))}),{rootMargin:'-35% 0px -55%'});sections.forEach(section=>sectionObserver.observe(section))}
    const year=document.querySelector('[data-year]');if(year)year.textContent=new Date().getFullYear();
    updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
})();
