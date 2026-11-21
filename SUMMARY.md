Project: Feliz Stay 1001 — 6-language i18n (feat/i18n-6lang)

What was done
- Added shared internationalization assets used by all pages:
  - assets/i18n.js: common language initializer and applier
  - assets/i18n.css: shared language switcher styles
- Refactored every HTML page to use the shared assets and a single-language URL per page (no per-language copies):
  - index.html: removed page-specific language switcher code; wired I18N.init to update static labels and chat UI (status, placeholder, welcome, chips). Preserved Wi‑Fi SSID/password and QR behavior unchanged.
  - access/index.html: removed inline language handling; added shared i18n assets and data-lang buttons; initialized translations via I18N.
  - taxi/index.html: same as above.
  - how-to-open/index.html: same as above. Note: this page explicitly states that door/box codes are sent after registration; no codes are present on page.
  - emergency/index.html: same as above.
  - house-rules/index.html: same as above.
  - laundry/index.html: same as above.
  - circuit-breaker/index.html: same as above.
  - trash/index.html: same as above.
  - nearby-shops/index.html: same as above.
  - equipment/index.html: previously empty — added a minimal 6-language stub page with a short placeholder message and switcher.
  - parking/index.html: previously empty — added a minimal 6-language stub page with a short placeholder message and switcher.

Behavior
- Language switcher buttons exist on every page and now use shared styling and JS.
- Selected language persists in localStorage under key felizStayLang.
- On first visit, language defaults to browser language if in [en, ja, zh, ko, fr, es]; otherwise defaults to English.
- URLs remain unchanged; single HTML per page.

Content Safeguards
- Wi‑Fi information (SSID/password and QR) on index.html remains exactly as provided.
- No key numbers, lock codes, keybox codes, or access codes are present in any page. If such content is required in future, it should be sent privately; the current pages contain no codes.

Flags / Notes
- equipment/index.html and parking/index.html placeholders have been replaced with formal content sourced from main branch pages (pre-6-language inline implementation) while keeping the shared i18n mechanism (assets/i18n.js) and the repo’s 6-language switcher.
- Source: main:equipment/index.html and main:parking/index.html (texts for sofa bed, A/C, TV, hot water, stove, microwave, washlet; and parking policy). No additional items were added beyond what exists on main.
- No key numbers or access codes were present on the referenced main pages; none were added. If any are discovered later, they should not be included on pages and should be recorded here only.
- Some pages retain their original non-i18n styles; language switcher styles are now governed by assets/i18n.css for consistency.
