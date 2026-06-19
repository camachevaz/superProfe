/**
 * SúperProfe · render.js
 * Lee content.json y puebla el HTML con el contenido correspondiente al idioma activo.
 * Idioma por defecto: español. Toggle: botones #lang-es / #lang-en.
 */

(function () {
  'use strict';

  /* ── Estado global ───────────────────────────── */
  let DATA = null;
  let LANG = localStorage.getItem('sp-lang') || 'es';
  const WA_NUM = (data) => data.wa.number;

  /* ── Helpers ─────────────────────────────────── */
  const t   = (node)   => node?.[LANG] ?? node?.es ?? '';
  const wa  = (msg)    => `https://wa.me/${WA_NUM(DATA)}?text=${encodeURIComponent(msg)}`;
  const waMsg = (tpl, curso) => tpl.replace('{curso}', curso);
  const esc = (s)      => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const attr = (id, a, v) => { const el = document.getElementById(id); if (el) el.setAttribute(a, v); };

  /* ── WhatsApp link builders ──────────────────── */
  function waGen()  { return wa(t(DATA.wa.msg_gen)); }
  function waDemo() { return wa(t(DATA.wa.msg_demo)); }
  function waCurso(curso) {
    return wa(waMsg(t(DATA.wa.msg_curso), curso));
  }

  /* ── SVG icons ───────────────────────────────── */
  const ICONS = {
    whatsapp: `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Z"/></svg>`,
    arrow:    `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
    arrow16:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
    phone:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--coral)"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Z"/></svg>`,
    email:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>`,
    globe:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/></svg>`,
    edu:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    doc:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>`,
    shield:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    world:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--coral)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/></svg>`,
  };

  /* ── RENDER FUNCTIONS ────────────────────────── */

  function renderNav() {
    const d = DATA.nav;
    // Links
    const links = d.links.map(l =>
      `<a class="nav-link" href="${l.href}">${t(l)}</a>`
    ).join('');
    set('nav-links-list', links);
    // CTA
    attr('nav-cta', 'href', waGen());
    set('nav-cta-text', `${ICONS.whatsapp} ${t(d.cta)}`);
    // Back link
    set('nav-back', t(d.back));
  }

  function renderHero() {
    const d = DATA.hero;
    set('hero-kicker', t(d.kicker));
    set('hero-headline', t(d.headline));
    set('hero-headline-alt', t(d.headline_alt));
    set('hero-lead', t(d.lead));
    set('hero-cta-primary', t(d.cta_primary));
    attr('hero-cta-secondary', 'href', waGen());
    set('hero-cta-secondary', t(d.cta_secondary));

    // Stats
    set('hero-stats', d.stats.map(s =>
      `<div>
        <div class="hs-num">${esc(s.num)}<b>${esc(s.suffix)}</b></div>
        <div class="hs-lbl">${esc(t(s))}</div>
      </div>`
    ).join(''));

    // Switcher cards
    set('hero-switcher', d.switcher.map(sw =>
      `<a class="sw-card ${sw.color}" href="${sw.href}">
        <span class="sw-chispa chispa${sw.color === 'marina' ? ' chispa-marina' : ''}">✦</span>
        <div class="sw-body">
          <div class="sw-name">${t(sw.name)}</div>
          <div class="sw-tag">${t(sw.tag)}</div>
        </div>
        <span class="sw-arr">${ICONS.arrow16}</span>
      </a>`
    ).join(''));
  }

  function renderEsencial() {
    const d = DATA.esencial;
    set('esencial-label', `✦ ${t(d.label)}`);
    set('esencial-headline', t(d.headline));
    set('esencial-headline-accent', t(d.headline_accent));
    set('esencial-lead', t(d.lead));

    // Módulos
    set('esencial-modulos', d.modulos.map(m =>
      `<div class="mod-row">
        <div class="mod-num"><span>${esc(m.num)}</span></div>
        <div class="mod-body">
          <h4>${esc(t(m))?.titulo ?? ''}</h4>
          <p>${esc(t(m))?.desc ?? ''}</p>
        </div>
        <div class="mod-hrs"><span>${m.hrs} hrs</span></div>
      </div>`
    ).join('') +
    `<div class="mod-foot">${t(d.modulos_footer)}</div>`
    );

    // Precios
    set('esencial-precios', d.precios.map(p => {
      const badge = p.badge
        ? `<div class="price-badge badge-${p.badge.color}">${t(p.badge)}</div>`
        : '';
      const featClass = p.featured ? 'feat-coral' : '';
      const feats = p.feats.map(f =>
        `<li><span class="chk chk-coral">✦</span> ${esc(t(f))}</li>`
      ).join('');
      const btnClass = p.featured ? 'btn-coral' : 'btn-ghost-coral';
      return `<div class="price-card ${featClass}">
        ${badge}
        <div class="price-name">${esc(t(p.nombre))}</div>
        <div class="price-amount">${esc(p.amount)} <span>${esc(t(p.suffix))}</span></div>
        <ul class="price-feats">${feats}</ul>
        <a class="btn ${btnClass} price-cta" href="${waCurso(p.cta_wa)}" target="_blank" rel="noopener">${esc(t(p.cta))}</a>
      </div>`;
    }).join('') +
    `<p class="price-note">${t(d.precio_nota)}</p>
     <p class="price-note" style="margin-top:4px">${t(d.precio_pm)} <a href="${waGen()}" target="_blank" rel="noopener" style="color:var(--coral);font-weight:700">${t(d.precio_pm_cta)}</a></p>`
    );
  }

  function renderAula() {
    const d = DATA.aula;
    set('aula-badge', t(d.badge));
    set('aula-label', t(d.label));
    set('aula-headline', t(d.headline));
    set('aula-headline-accent', t(d.headline_accent));
    set('aula-lead', t(d.lead));

    // Stats
    set('aula-stats', d.stats.map(s =>
      `<div>
        <div class="as-num">${esc(s.num)}<b>${s[`suffix_${LANG}`]}</b></div>
        <div class="as-lbl">${esc(s[`label_${LANG}`])}</div>
      </div>`
    ).join(''));

    // Timeline módulos
    set('aula-timeline', d.modulos.map(m => {
      const nodeClass = m.type === 'active' ? 'active' : m.type === 'cap' ? 'cap' : '';
      const content = t(m);
      return `<div class="tl-item">
        <div class="tl-node ${nodeClass}">${esc(m.num)}</div>
        <div class="tl-body">
          <h4>${esc(content.titulo)}</h4>
          <p>${esc(content.desc)}</p>
          <span class="tl-hrs">✦ ${m.hrs} hrs</span>
        </div>
      </div>`;
    }).join(''));

    // Portafolio
    set('aula-portafolio-titulo', t(d.portafolio_titulo));
    set('aula-portafolio-items', d.portafolio_items.map(item =>
      `<li><span class="dl-ico">${item.ico}</span> ${esc(t(item))}</li>`
    ).join(''));

    // Demo box
    set('aula-demo-texto', t(d.demo_texto));
    const demoLink = document.getElementById('aula-demo-cta');
    if (demoLink) { demoLink.href = waDemo(); demoLink.textContent = t(d.demo_cta); }

    // Precios
    set('aula-precios', d.precios.map(p => {
      const badge = p.badge
        ? `<div class="price-badge badge-${p.badge.color}">${t(p.badge)}</div>`
        : '';
      const featClass = p.featured ? 'feat-marina' : '';
      const feats = p.feats.map(f =>
        `<li><span class="chk chk-marina">✦</span> ${esc(t(f))}</li>`
      ).join('');
      const btnClass = p.featured ? 'btn-marina' : 'btn-ghost-marina';
      return `<div class="price-card ${featClass}">
        ${badge}
        <div class="price-name">${esc(t(p.nombre))}</div>
        <div class="price-range">${esc(p.range)}</div>
        <p class="price-sub">${esc(t(p.sub))}</p>
        <ul class="price-feats">${feats}</ul>
        <a class="btn ${btnClass} price-cta" href="${waCurso(p.cta_wa)}" target="_blank" rel="noopener">${esc(t(p.cta))}</a>
      </div>`;
    }).join('') +
    `<p class="price-note" style="margin-top:12px">${t(d.precio_nota)}</p>`
    );
  }

  function renderInstructor() {
    const d = DATA.instructor;
    set('inst-label', `✦ ${t(d.label)}`);
    set('inst-nombre', d.nombre);
    set('inst-badge', `<span class="chispa">✦</span> ${t(d.badge)}`);
    set('inst-lead', t(d.lead));
    set('inst-bio', t(d.bio));

    const iconMap = [ICONS.edu, ICONS.doc, ICONS.shield, ICONS.world];
    set('inst-creds', d.credenciales.map((c, i) =>
      `<div class="inst-cred">
        <div class="cred-ic">${iconMap[i] ?? ICONS.edu}</div>
        ${esc(t(c))}
      </div>`
    ).join(''));

    // Foto
    const foto = document.getElementById('inst-foto');
    if (foto) {
      foto.innerHTML = d.foto
        ? `<img src="${d.foto}" alt="${d.nombre}" loading="lazy">`
        : `<span class="placeholder">CC</span>`;
    }
  }

  function renderTestimonios() {
    const d = DATA.testimonios;
    set('test-label', `✦ ${t(d.label)}`);
    set('test-headline', t(d.headline));
    set('test-headline-accent', t(d.headline_accent));
    set('test-lead', t(d.lead));

    set('test-grid', d.items.map(item =>
      `<div class="test-card">
        <div class="stars">${'<span>★</span>'.repeat(5)}</div>
        <blockquote>${esc(item.texto)}</blockquote>
        <div class="test-author">
          <img src="${item.foto}" alt="${esc(item.nombre)}" loading="lazy">
          <div>
            <div class="name">${esc(item.nombre)}</div>
            <div class="role">${esc(t(item.cargo))}</div>
          </div>
        </div>
      </div>`
    ).join(''));
  }

  function renderContacto() {
    const d = DATA.contacto;
    const c = d.datos;
    set('contact-label', `✦ ${t(d.label)}`);
    set('contact-headline', t(d.headline));
    set('contact-headline-accent', t(d.headline_accent));
    set('contact-lead', t(d.lead));

    set('contact-datos', `
      <a href="${waGen()}" target="_blank" rel="noopener">
        <span class="ic">${ICONS.phone}</span>
        <span class="txt">${esc(c.telefono)}</span>
      </a>
      <a href="mailto:${esc(c.email)}">
        <span class="ic">${ICONS.email}</span>
        <span class="txt">${esc(c.email)}</span>
      </a>
      <a href="${esc(c.web_url)}" target="_blank" rel="noopener">
        <span class="ic">${ICONS.globe}</span>
        <span class="txt">${esc(c.web)}</span>
      </a>
    `);

    set('contact-rutas-label', t(d.rutas_label));
    set('contact-rutas', d.rutas.map(r => {
      const href = r.cta_wa ? waCurso(r.cta_wa) : waGen();
      const colorClass = r.color ? `${r.color}` : '';
      return `<a class="route-card ${colorClass}" href="${href}" target="_blank" rel="noopener">
        <span class="route-pip ${r.pip}"></span>
        <div class="route-txt">
          <div class="rn">${esc(t(r.nombre))}</div>
          <div class="rd">${esc(t(r.desc))}</div>
        </div>
        <span class="route-arr">${ICONS.arrow}</span>
      </a>`;
    }).join(''));
  }

  function renderFooter() {
    const d   = DATA.footer;
    const nav = DATA.nav;
    document.getElementById('year').textContent = new Date().getFullYear();
    set('footer-tagline', `<b>✦ ${t(d.tagline_esencial).split('·')[0].trim()}</b> · ${t(d.tagline_esencial).split('·').slice(1).join('·').trim()}<br><b>✦ ${t(d.tagline_aula).split('·')[0].trim()}</b> · ${t(d.tagline_aula).split('·').slice(1).join('·').trim()}`);
    set('footer-copyright', `© <span id="year">${new Date().getFullYear()}</span> ${t(d.copyright)}`);
    set('footer-back', t(d.back_link));
    attr('footer-back-link', 'href', DATA.contacto.datos.web_url);

    // Footer nav links
    set('footer-nav-links', nav.links.map(l =>
      `<a href="${l.href}">${t(l)}</a>`
    ).join(''));

    // Footer contact
    const c = DATA.contacto.datos;
    set('footer-contact-links', `
      <a href="${waGen()}" target="_blank" rel="noopener">${esc(c.telefono)}</a>
      <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>
      <a href="${esc(c.web_url)}" target="_blank" rel="noopener">${esc(c.web)}</a>
    `);
  }

  /* ── MAIN RENDER ─────────────────────────────── */
  function renderAll() {
    renderNav();
    renderHero();
    renderEsencial();
    renderAula();
    renderInstructor();
    renderTestimonios();
    renderContacto();
    renderFooter();
    updateLangButtons();
  }

  /* ── LANG TOGGLE ─────────────────────────────── */
  function updateLangButtons() {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const isActive = btn.dataset.langBtn === LANG;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    document.documentElement.lang = LANG;
  }

  function setLang(lang) {
    LANG = lang;
    localStorage.setItem('sp-lang', lang);
    renderAll();
  }

  /* ── NAV TOGGLE ──────────────────────────────── */
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const links  = document.getElementById('navLinksWrap');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    links.addEventListener('click', e => {
      if (e.target.classList.contains('nav-link')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initLangBtns() {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
    });
  }

  /* ── BOOT ────────────────────────────────────── */
  async function init() {
    try {
      const res = await fetch('assets/data/content.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      DATA = await res.json();
      renderAll();
      initNav();
      initLangBtns();
    } catch (err) {
      console.error('[SúperProfe render.js] Error cargando content.json:', err);
      // Muestra un mensaje de error amigable en el body
      document.body.innerHTML = `
        <div style="font-family:sans-serif;padding:40px;color:#20242F;max-width:500px;margin:0 auto">
          <h2>Error cargando el sitio</h2>
          <p>El archivo <code>assets/data/content.json</code> no pudo cargarse.</p>
          <p style="color:#888;font-size:14px">Este sitio debe servirse desde un servidor HTTP. No puede abrirse como archivo local (<code>file://</code>).</p>
        </div>`;
    }
  }

  document.addEventListener('DOMContentLoaded', init);

})();
