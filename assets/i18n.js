/*
  Minimal shared i18n helper for static pages
  - Looks for elements with:
      data-i18n       -> sets textContent
      data-i18n-html  -> sets innerHTML (use carefully)
      data-i18n-alt   -> sets alt attribute
  - Exposes I18N.init({ strings, onChange })
  - Manages .lang-btn [data-lang] buttons, localStorage, <html lang>
*/
(function () {
  const SUPPORTED = ['en', 'ja', 'zh', 'ko', 'fr', 'es'];
  const STORAGE_KEY = 'felizStayLang';

  function mapBrowserLang() {
    try {
      const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      if (nav.startsWith('ja')) return 'ja';
      if (nav.startsWith('zh')) return 'zh';
      if (nav.startsWith('ko')) return 'ko';
      if (nav.startsWith('fr')) return 'fr';
      if (nav.startsWith('es')) return 'es';
      return 'en';
    } catch { return 'en'; }
  }

  function loadSavedLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  }

  function setHtmlLang(lang) {
    try { document.documentElement.setAttribute('lang', lang); } catch {}
  }

  function syncButtons(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', (btn.getAttribute('data-lang') || '').toLowerCase() === lang);
    });
  }

  function apply(strings, lang) {
    const t = strings && strings[lang];
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key in t) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key in t) el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const key = el.getAttribute('data-i18n-alt');
      if (key in t) el.setAttribute('alt', t[key]);
    });
  }

  function detectInitialLang(strings) {
    const saved = loadSavedLang();
    const candidate = saved || mapBrowserLang();
    if (SUPPORTED.includes(candidate) && (!strings || strings[candidate])) return candidate;
    // Fallback to 'en' or first available in strings
    if (strings) {
      for (const code of SUPPORTED) { if (strings[code]) return code; }
    }
    return 'en';
  }

  function wireButtons(strings, setLangFn) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const code = (btn.getAttribute('data-lang') || '').toLowerCase();
      if (!SUPPORTED.includes(code)) return;
      btn.addEventListener('click', () => setLangFn(code));
    });
  }

  function init(opts) {
    const strings = opts && opts.strings ? opts.strings : (window.I18N_STRINGS || window.STRINGS || window.S || window.UI_STRINGS || null);
    const onChange = typeof opts?.onChange === 'function' ? opts.onChange : null;
    let current = detectInitialLang(strings);

    function setLang(lang) {
      if (!SUPPORTED.includes(lang)) return;
      current = lang;
      saveLang(lang);
      setHtmlLang(lang);
      syncButtons(lang);
      if (strings) apply(strings, lang);
      if (onChange) onChange(lang);
    }

    // Expose for pages that still call window.setLang
    if (!window.setLang) window.setLang = (lang) => setLang(lang);

    // Ensure buttons use data-lang
    document.querySelectorAll('.lang-btn[onclick]').forEach(btn => {
      // If page still has inline onclick like setLang('en', this), infer lang code from text or aria-label
      if (!btn.getAttribute('data-lang')) {
        const al = (btn.getAttribute('aria-label') || btn.textContent || '').trim().toLowerCase();
        const guess = SUPPORTED.find(code => al.startsWith(code) || al.includes(code));
        if (guess) btn.setAttribute('data-lang', guess);
      }
      btn.removeAttribute('onclick');
    });

    wireButtons(strings, setLang);
    // Initial apply
    setLang(current);
  }

  window.I18N = { init, apply };
})();
