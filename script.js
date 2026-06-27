document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. MOBILE MENU NAVIGATION
    // ==========================================================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking on any link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) toggleMenu();
        });
    });

    // Header shadow on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // ==========================================================================
    // 2. INTERACTIVE TABS SYSTEM (HTML / CSS / JS Sections)
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLang = btn.getAttribute('data-lang');

            // Update Tab Buttons state
            tabButtons.forEach(button => {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Update Panels Visibility
            tabPanels.forEach(panel => {
                if (panel.getAttribute('id') === `tab-${targetLang}`) {
                    panel.classList.add('active');
                    panel.removeAttribute('hidden');
                } else {
                    panel.classList.remove('active');
                    panel.setAttribute('hidden', '');
                }
            });
        });
    });

    // Link Footer Category Links to switch Top Tabs dynamically
    const footerTabLinks = document.querySelectorAll('.footer-col a[data-tab]');
    footerTabLinks.forEach(fLink => {
        fLink.addEventListener('click', (e) => {
            const targetTab = fLink.getAttribute('data-tab');
            const correspondingBtn = document.getElementById(`btn-${targetTab}`);
            if (correspondingBtn) {
                correspondingBtn.click();
            }
        });
    });

    // ==========================================================================
    // 3. LIVE CODE SANDBOX (COMPILER ENGINE)
    // ==========================================================================
    const codeEditor = document.getElementById('codeEditor');
    const lineNumbers = document.getElementById('lineNumbers');
    const runBtn = document.getElementById('runBtn');
    const clearBtn = document.getElementById('clearBtn');
    const previewFrame = document.getElementById('previewFrame');
    const previewStatus = document.getElementById('previewStatus');

    // Code Templates Data
    const templates = {
        html: `<!-- واجهة تجريبية بسيطة -->\n<div class="welcome-card">\n    <h1>مرحباً بك في المحرر! 👋</h1>\n    <p>عدّل على هذا الكود واضغط على زر تشغيل لرؤية النتيجة الحية.</p>\n    <button onclick="showAlert()">اضغط هنا</button>\n</div>`,
        css: `/* تابع للمثال أعلاه: غيّر التصميم كما تحب */\nbody {\n    background: #111827;\n    color: #ffffff;\n    font-family: sans-serif;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 90vh;\n    margin: 0;\n}\n.welcome-card {\n    background: #1f2937;\n    padding: 2rem;\n    border-radius: 12px;\n    text-align: center;\n    box-shadow: 0 10px 25px rgba(0,0,0,0.5);\n    border: 2px solid #4ecdc4;\n}\nbutton {\n    background: #4ecdc4;\n    border: none;\n    padding: 0.6rem 1.5rem;\n    font-weight: bold;\n    border-radius: 6px;\n    cursor: pointer;\n}`,
        js: `// كود جافا سكريبت تفاعلي\nfunction showAlert() {\n    alert("رائع! الكود يعمل بنجاح تفاعلي كامل على منصتك 🚀");\n}`
    };

    // Load initial HTML template to sandbox
    codeEditor.value = templates.html;

    // Synchronize Line Numbers
    const updateLineNumbers = () => {
        const lines = codeEditor.value.split('\n').length;
        let lineNumbersHTML = '';
        for (let i = 1; i <= lines; i++) {
            lineNumbersHTML += `${i}<br>`;
        }
        lineNumbers.innerHTML = lineNumbersHTML;
    };
    
    codeEditor.addEventListener('input', updateLineNumbers);
    updateLineNumbers(); // running on load

    // Sandbox execution compiler logic
    const runCode = () => {
        previewStatus.textContent = "جاري التشغيل...";
        previewStatus.style.backgroundColor = "rgba(255, 183, 3, 0.1)";
        previewStatus.style.color = "var(--accent-js)";

        const userCode = codeEditor.value;
        
        // Build an isolated document context inside iframe
        const frameContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <style>
                    ${templates.css}
                </style>
            </head>
            <body>
                ${userCode}
                <script>
                    ${templates.js}
                <\/script>
            </body>
            </html>
        `;

        try {
            const blob = new Blob([frameContent], { type: 'text/html' });
            previewFrame.src = URL.createObjectURL(blob);
            
            setTimeout(() => {
                previewStatus.textContent = "جاهز";
                previewStatus.style.backgroundColor = "rgba(78, 205, 196, 0.1)";
                previewStatus.style.color = "var(--primary)";
            }, 400);
        } catch (error) {
            previewStatus.textContent = "خطأ في الكود";
            previewStatus.style.backgroundColor = "rgba(255, 95, 86, 0.1)";
            previewStatus.style.color = "#ff5f56";
        }
    };

    runBtn.addEventListener('click', runCode);
    
    // Clear editor workspace
    clearBtn.addEventListener('click', () => {
        codeEditor.value = '';
        updateLineNumbers();
        previewFrame.src = 'about:blank';
    });

    // Template Selector buttons implementation
    document.getElementById('tplHtml').addEventListener('click', () => { codeEditor.value = templates.html; updateLineNumbers(); runCode(); });
    document.getElementById('tplCss').addEventListener('click', () => { codeEditor.value = templates.css; updateLineNumbers(); runCode(); });
    document.getElementById('tplJs').addEventListener('click', () => { codeEditor.value = templates.js; updateLineNumbers(); runCode(); });

    // Auto run once at initialization
    runCode();

    // ==========================================================================
    // 4. INTERACTIVE FAQ ACCORDION SYSTEM
    // ==========================================================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other active open accordions (Optional UI Polish)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.style.maxHeight = null;
                    otherQuestion.nextElementSibling.setAttribute('hidden', '');
                }
            });

            // Toggle current accordion panel
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.removeAttribute('hidden');
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
                // dynamic defer hidden to sync smooth transform sliding transition animation
                setTimeout(() => {
                    if(question.getAttribute('aria-expanded') === 'false') answer.setAttribute('hidden', '');
                }, 300);
            }
        });
    });

    // ==========================================================================
    // 5. FOOTER AUTO DYNAMIC YEAR
    // ==========================================================================
    const footerYear = document.getElementById('footerYear');
    if(footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});
