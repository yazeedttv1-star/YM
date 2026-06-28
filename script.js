/* ============================================================
   YM ACADEMY – script.js
   Interactive Engine: Navigation, Tabs, Sandbox, FAQ, Animations
   Vanilla JS – No dependencies – Production Ready
   ============================================================ */

(function () {
  'use strict';

  /* ==================== HEADER: SCROLL SHADOW ==================== */
  const header = document.getElementById('header');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ==================== HAMBURGER MENU ==================== */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  function openNav() {
    hamburger.classList.add('open');
    nav.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('open');
    nav.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    nav.classList.contains('nav-open') ? closeNav() : openNav();
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      nav.classList.contains('nav-open') &&
      !nav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeNav();
    }
  });

  /* ==================== SMOOTH SCROLL FOR ANCHOR LINKS ==================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ==================== FOOTER: DYNAMIC YEAR ==================== */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ==================== FOOTER: TAB LINKS ==================== */
  document.querySelectorAll('[data-tab]').forEach(function (link) {
    link.addEventListener('click', function () {
      const lang = this.getAttribute('data-tab');
      activateTab(lang);
    });
  });

  /* ==================== SCROLL ANIMATIONS (IntersectionObserver) ==================== */
  const animateEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animateEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything if observer not supported
    animateEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ==================== TABS ==================== */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(lang) {
    tabBtns.forEach(function (btn) {
      const isTarget = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabPanels.forEach(function (panel) {
      const isTarget = panel.id === 'tab-' + lang;
      if (isTarget) {
        panel.removeAttribute('hidden');
        // Re-trigger animations inside the panel
        panel.querySelectorAll('[data-animate]').forEach(function (el) {
          el.classList.remove('is-visible');
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              el.classList.add('is-visible');
            });
          });
        });
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateTab(this.getAttribute('data-lang'));
    });

    // Keyboard arrow navigation
    btn.addEventListener('keydown', function (e) {
      const btnsArr = Array.from(tabBtns);
      const idx     = btnsArr.indexOf(this);

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = btnsArr[(idx - 1 + btnsArr.length) % btnsArr.length];
        prev.focus();
        activateTab(prev.getAttribute('data-lang'));
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = btnsArr[(idx + 1) % btnsArr.length];
        next.focus();
        activateTab(next.getAttribute('data-lang'));
      }
    });
  });

  // Initial state: show HTML tab
  activateTab('html');

  /* ==================== FAQ ACCORDION ==================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      const isOpen = this.getAttribute('aria-expanded') === 'true';

      // Close all others
      faqItems.forEach(function (other) {
        if (other !== item) {
          const otherQ = other.querySelector('.faq-question');
          const otherA = other.querySelector('.faq-answer');
          otherQ.setAttribute('aria-expanded', 'false');
          otherA.setAttribute('hidden', '');
        }
      });

      // Toggle current
      if (isOpen) {
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('hidden', '');
      } else {
        question.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
      }
    });

    // Keyboard support
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* ==================== LIVE CODE SANDBOX ==================== */

  const codeEditor   = document.getElementById('codeEditor');
  const lineNumbers  = document.getElementById('lineNumbers');
  const previewFrame = document.getElementById('previewFrame');
  const runBtn       = document.getElementById('runBtn');
  const clearBtn     = document.getElementById('clearBtn');
  const tplHtml      = document.getElementById('tplHtml');
  const tplCss       = document.getElementById('tplCss');
  const tplJs        = document.getElementById('tplJs');
  const previewStatus = document.getElementById('previewStatus');

  /* --- Quick templates --- */
  const TEMPLATES = {
    html: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>مثال HTML</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f0f1a;
      color: #f0f0f8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      gap: 1rem;
    }
    h1 { color: #FF6B35; font-size: 2rem; }
    p  { color: #9898b0; }
    ul { text-align: right; line-height: 2; }
  </style>
</head>
<body>
  <h1>مرحباً بك في YM Academy!</h1>
  <p>هذا مثال على هيكل HTML أساسي</p>
  <ul>
    <li>✅ وسوم HTML الدلالية</li>
    <li>✅ متغيرات CSS مدمجة</li>
    <li>✅ محتوى عربي بالكامل</li>
  </ul>
</body>
</html>`,

    css: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>مثال CSS</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f0f1a;
      color: #f0f0f8;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 1.5rem;
      flex-wrap: wrap;
      padding: 2rem;
    }

    .card {
      background: #111118;
      border: 1px solid #2a2a38;
      border-radius: 16px;
      padding: 1.5rem;
      width: 200px;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
    }

    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    }

    .card.html { border-top: 3px solid #FF6B35; }
    .card.css  { border-top: 3px solid #4ECDC4; }
    .card.js   { border-top: 3px solid #FFE66D; }

    .card-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
    .card-title { font-weight: 700; font-size: 1.1rem; }
    .card-sub   { font-size: 0.82rem; color: #9898b0; margin-top: 0.3rem; }
  </style>
</head>
<body>
  <div class="card html">
    <div class="card-icon">🏗️</div>
    <div class="card-title">HTML</div>
    <div class="card-sub">الهيكل</div>
  </div>
  <div class="card css">
    <div class="card-icon">🎨</div>
    <div class="card-title">CSS</div>
    <div class="card-sub">التصميم</div>
  </div>
  <div class="card js">
    <div class="card-icon">⚡</div>
    <div class="card-title">JavaScript</div>
    <div class="card-sub">التفاعل</div>
  </div>
</body>
</html>`,

    js: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>مثال JavaScript</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f0f1a;
      color: #f0f0f8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 1.5rem;
    }

    h2 { font-size: 1.1rem; color: #9898b0; }

    .counter-display {
      font-size: 5rem;
      font-weight: 800;
      line-height: 1;
      transition: color 0.25s ease, transform 0.15s ease;
    }

    .counter-display.bump {
      transform: scale(1.15);
    }

    .controls {
      display: flex;
      gap: 1rem;
    }

    button {
      padding: 0.7rem 1.8rem;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s;
    }

    button:active { transform: scale(0.94); }

    #dec { background: #FF6B35; color: #fff; }
    #inc { background: #4ECDC4; color: #000; }
    #rst { background: #2a2a38; color: #f0f0f8; }

    .hint {
      font-size: 0.8rem;
      color: #5a5a72;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <h2>عداد تفاعلي بـ JavaScript</h2>
  <div class="counter-display" id="display">0</div>
  <div class="controls">
    <button id="dec">−</button>
    <button id="rst">إعادة</button>
    <button id="inc">+</button>
  </div>
  <p class="hint">جرّب الضغط على الأزرار!</p>

  <script>
    const display = document.getElementById('display');
    let count = 0;

    function update() {
      display.textContent = count;
      display.style.color =
        count > 0 ? '#4ECDC4' :
        count < 0 ? '#FF6B35' : '#f0f0f8';

      display.classList.remove('bump');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => display.classList.add('bump'));
      });

      setTimeout(() => display.classList.remove('bump'), 200);
    }

    document.getElementById('inc').addEventListener('click', () => { count++; update(); });
    document.getElementById('dec').addEventListener('click', () => { count--; update(); });
    document.getElementById('rst').addEventListener('click', () => { count = 0; update(); });
  <\/script>
</body>
</html>`
  };

  /* --- Load template --- */
  function loadTemplate(type) {
    codeEditor.value = TEMPLATES[type];
    updateLineNumbers();
    setStatus('جاهز', 'ready');
    runCode();
  }

  tplHtml.addEventListener('click', function () { loadTemplate('html'); });
  tplCss.addEventListener('click',  function () { loadTemplate('css');  });
  tplJs.addEventListener('click',   function () { loadTemplate('js');   });

  /* --- Line numbers --- */
  function updateLineNumbers() {
    const lines = codeEditor.value.split('\n').length;
    const nums  = [];
    for (let i = 1; i <= lines; i++) nums.push(i);
    lineNumbers.textContent = nums.join('\n');
  }

  // Sync scroll between editor and line numbers
  codeEditor.addEventListener('scroll', function () {
    lineNumbers.scrollTop = this.scrollTop;
  });

  codeEditor.addEventListener('input', updateLineNumbers);

  // Tab key inserts spaces instead of leaving the field
  codeEditor.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end   = this.selectionEnd;
      this.value  = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
      updateLineNumbers();
    }
  });

  /* --- Status badge helper --- */
  function setStatus(text, type) {
    previewStatus.textContent = text;
    previewStatus.style.background =
      type === 'running' ? 'rgba(255,230,109,0.12)' :
      type === 'error'   ? 'rgba(255,95,86,0.12)'   :
                           'rgba(39,200,64,0.12)';
    previewStatus.style.color =
      type === 'running' ? '#FFE66D' :
      type === 'error'   ? '#FF5F56' :
                           '#27C840';
    previewStatus.style.borderColor =
      type === 'running' ? 'rgba(255,230,109,0.25)' :
      type === 'error'   ? 'rgba(255,95,86,0.25)'   :
                           'rgba(39,200,64,0.25)';
  }

  /* --- Run code --- */
  function runCode() {
    const code = codeEditor.value.trim();

    if (!code) {
      setStatus('فارغ', 'ready');
      previewFrame.srcdoc = '';
      return;
    }

    setStatus('يعمل…', 'running');

    // Detect if bare HTML (has <html> tag) or partial snippet
    const isFullPage = /<html[\s>]/i.test(code);

    let output;

    if (isFullPage) {
      output = code;
    } else {
      // Wrap partial snippets with a dark base so they look good
      output = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f0f1a;
      color: #f0f0f8;
      padding: 1.5rem;
      line-height: 1.7;
      min-height: 100vh;
    }
  </style>
</head>
<body>
${code}
</body>
</html>`;
    }

    try {
      previewFrame.srcdoc = output;
      setTimeout(function () { setStatus('مكتمل ✓', 'ready'); }, 400);
    } catch (err) {
      setStatus('خطأ!', 'error');
    }
  }

  runBtn.addEventListener('click', runCode);

  // Run on Ctrl+Enter / Cmd+Enter
  codeEditor.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  });

  /* --- Clear --- */
  clearBtn.addEventListener('click', function () {
    if (codeEditor.value === '') return;
    codeEditor.value = '';
    updateLineNumbers();
    previewFrame.srcdoc = '';
    setStatus('جاهز', 'ready');
    codeEditor.focus();
  });

  /* --- Initial state --- */
  updateLineNumbers();
  loadTemplate('html');

  /* ==================== ACTIVE NAV LINK ON SCROLL ==================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          link.classList.toggle('active-nav', href === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

})();
