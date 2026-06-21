// ============================================
// LineSight — Documentation Rendering Engine
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    initSearch();
    initNavbar();
    initMobileMenu();

    // Route on initial load
    handleRoute();

    // Route on hash change
    window.addEventListener('hashchange', handleRoute);
});

// ─── Navbar scroll effect ───
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

// ─── Mobile menu ───
function initMobileMenu() {
    const toggle = document.getElementById('nav-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggle || !navLinks) return;
    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
}

// ─── Build Sidebar ───
function buildSidebar() {
    const nav = document.getElementById('sidebar-nav');
    let html = '';

    DOCS_DATA.categories.forEach(cat => {
        html += `<div class="sidebar-category" data-cat="${cat.id}">`;
        html += `<div class="sidebar-category-title">${cat.icon}<span>${cat.name}</span></div>`;
        cat.functions.forEach(fnId => {
            const fn = DOCS_DATA.functions[fnId];
            if (!fn) return;
            html += `<a class="sidebar-fn-link" href="#${fnId}" data-fn="${fnId}">${fn.name}()</a>`;
        });
        html += `</div>`;
    });

    nav.innerHTML = html;
}

// ─── Search ───
function initSearch() {
    const input = document.getElementById('sidebar-search-input');
    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        const links = document.querySelectorAll('.sidebar-fn-link');

        links.forEach(link => {
            const fnId = link.dataset.fn;
            const fn = DOCS_DATA.functions[fnId];
            if (!fn) return;

            const match = query === '' ||
                fn.name.toLowerCase().includes(query) ||
                fn.shortDesc.toLowerCase().includes(query);

            link.classList.toggle('hidden', !match);
        });
    });
}

// ─── Routing ───
function handleRoute() {
    const hash = window.location.hash.replace('#', '');
    const main = document.getElementById('docs-main');

    // Update sidebar active state
    document.querySelectorAll('.sidebar-fn-link').forEach(link => {
        link.classList.toggle('active', link.dataset.fn === hash);
    });

    if (hash && DOCS_DATA.functions[hash]) {
        main.innerHTML = renderFunctionPage(hash);
    } else {
        main.innerHTML = renderLanding();
    }

    // Scroll main to top
    main.scrollTop = 0;
    window.scrollTo(0, 0);
}

// ─── Render Landing Page ───
function renderLanding() {
    let html = `<div class="docs-landing">`;
    html += `<h1 class="docs-landing-title">API Reference</h1>`;
    html += `<p class="docs-landing-subtitle">Comprehensive documentation for every public method in the LineSight library. Each function page includes detailed parameter specifications, return types, error handling, internal implementation notes, and executable examples.</p>`;

    DOCS_DATA.categories.forEach(cat => {
        html += `<div class="docs-cat-section">`;
        html += `<div class="docs-cat-header">`;
        html += `<div class="docs-cat-icon">${cat.icon}</div>`;
        html += `<span class="docs-cat-name">${cat.name}</span>`;
        html += `<span class="docs-cat-desc">${cat.description}</span>`;
        html += `</div>`;
        html += `<div class="docs-fn-grid">`;

        cat.functions.forEach(fnId => {
            const fn = DOCS_DATA.functions[fnId];
            if (!fn) return;
            html += `<a class="docs-fn-card" href="#${fnId}">`;
            html += `<div class="docs-fn-card-name">${fn.name}()</div>`;
            html += `<div class="docs-fn-card-desc">${fn.shortDesc}</div>`;
            html += `<div class="docs-fn-card-models">`;
            fn.models.forEach(m => {
                html += `<span class="docs-fn-card-model">${m}</span>`;
            });
            html += `</div>`;
            html += `</a>`;
        });

        html += `</div></div>`;
    });

    html += `</div>`;
    return html;
}

// ─── Render Function Page ───
function renderFunctionPage(fnId) {
    const fn = DOCS_DATA.functions[fnId];
    if (!fn) return '<p>Function not found.</p>';

    const catObj = DOCS_DATA.categories.find(c => c.id === fn.category);
    const catName = catObj ? catObj.name : fn.category;

    let html = `<div class="fn-page">`;

    // Breadcrumb
    html += `<div class="fn-breadcrumb">`;
    html += `<a href="#" onclick="event.preventDefault(); location.hash='';">API Reference</a>`;
    html += `<span class="separator">›</span>`;
    html += `<span class="current">${fn.name}()</span>`;
    html += `</div>`;

    // Title block
    html += `<div class="fn-title-block">`;
    const sigParts = fn.signature.split(fn.name);
    html += `<div class="fn-signature">${escHtml(sigParts[0] || '')}<span class="fn-name-highlight">${fn.name}</span>${escHtml(sigParts[1] || '')}</div>`;

    html += `<div class="fn-meta-badges">`;
    html += `<span class="fn-badge fn-badge-category">${catName}</span>`;
    fn.models.forEach(m => {
        html += `<span class="fn-badge fn-badge-model">${m}</span>`;
    });
    html += `<span class="fn-badge fn-badge-source">Source: ${fn.source}</span>`;
    html += `</div>`;

    html += `<p class="fn-short-desc">${escHtml(fn.shortDesc)}</p>`;
    html += `</div>`;

    // Description
    if (fn.longDesc) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Description', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z');
        html += `<div class="fn-long-desc">${formatDesc(fn.longDesc)}</div>`;
        html += `</div>`;
    }

    // Parameters
    if (fn.parameters && fn.parameters.length > 0) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Parameters', 'M12 20V10 M18 20V4 M6 20v-4');
        html += `<table class="fn-params-table">`;
        html += `<thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>`;
        html += `<tbody>`;
        fn.parameters.forEach(p => {
            html += `<tr>`;
            html += `<td><span class="param-name">${p.name}</span>${p.required ? '<span class="param-required">required</span>' : ''}</td>`;
            html += `<td><span class="param-type">${escHtml(p.type)}</span></td>`;
            html += `<td><span class="param-default">${p.default !== null && p.default !== undefined ? escHtml(String(p.default)) : '—'}</span></td>`;
            html += `<td><span class="param-desc">${formatInlineCode(escHtml(p.desc))}</span></td>`;
            html += `</tr>`;
        });
        html += `</tbody></table>`;
        html += `</div>`;
    }

    // Returns
    if (fn.returns) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Returns', 'M9 18l6-6-6-6');
        html += `<div class="fn-returns-block">`;
        html += `<div class="fn-returns-type">${escHtml(fn.returns.type)}</div>`;
        html += `<div class="fn-returns-desc">${formatInlineCode(escHtml(fn.returns.desc))}</div>`;
        html += `</div></div>`;
    }

    // Raises
    if (fn.raises && fn.raises.length > 0) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Raises', 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01');
        html += `<div class="fn-error-list">`;
        fn.raises.forEach(r => {
            html += `<div class="fn-error-item">`;
            html += `<div class="fn-error-exception">${escHtml(r.exception)}</div>`;
            html += `<div class="fn-error-condition">${formatInlineCode(escHtml(r.condition))}</div>`;
            html += `<div class="fn-error-message">${escHtml(r.message)}</div>`;
            html += `</div>`;
        });
        html += `</div></div>`;
    }

    // Warns
    if (fn.warns && fn.warns.length > 0) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Warnings', 'M12 9v4 M12 17h.01');
        html += `<div class="fn-error-list">`;
        fn.warns.forEach(w => {
            html += `<div class="fn-error-item warning">`;
            html += `<div class="fn-error-exception">${escHtml(w.warning)}</div>`;
            html += `<div class="fn-error-condition">${formatInlineCode(escHtml(w.condition))}</div>`;
            html += `<div class="fn-error-message">${escHtml(w.message)}</div>`;
            html += `</div>`;
        });
        html += `</div></div>`;
    }

    // Math Formula
    if (fn.mathFormula) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Mathematical Formula', 'M4 7h16 M4 12h16 M4 17h10');
        html += `<div class="fn-math-block">${escHtml(fn.mathFormula)}</div>`;
        html += `</div>`;
    }

    // ─── Input & Output Examples ───
    if (fn.inputExample || fn.outputExample) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Input & Output', 'M4 17l6-6 4 4 6-8 M4 21h16');
        html += renderInputOutput(fn);
        html += `</div>`;
    }

    // ─── Interactive Try-It Window ───
    if (fn.inputExample) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Try It', 'M5 3l14 9-14 9V3z');
        html += renderInteractiveWindow(fnId, fn);
        html += `</div>`;
    }

    // Internal Steps
    if (fn.internalSteps && fn.internalSteps.length > 0) {
        html += `<div class="fn-section">`;
        html += sectionTitle('How It Works Internally', 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z');
        html += `<ol class="fn-steps-list">`;
        fn.internalSteps.forEach(step => {
            html += `<li class="fn-step-item">${formatInlineCode(escHtml(step))}</li>`;
        });
        html += `</ol></div>`;
    }

    // Example
    if (fn.example) {
        html += `<div class="fn-section">`;
        html += sectionTitle('Example', 'M16 18l6-6-6-6 M8 6l-6 6 6 6');
        html += codeBlock(fn.example, 'python');
        html += `</div>`;
    }

    // See Also
    if (fn.seeAlso && fn.seeAlso.length > 0) {
        html += `<div class="fn-section">`;
        html += sectionTitle('See Also', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3');
        html += `<div class="fn-see-also">`;
        fn.seeAlso.forEach(ref => {
            if (DOCS_DATA.functions[ref]) {
                html += `<a class="fn-see-also-link" href="#${ref}">${ref}()</a>`;
            }
        });
        html += `</div></div>`;
    }

    // Back to top
    html += `<a class="fn-back-top" href="#" onclick="event.preventDefault(); location.hash='';">`;
    html += `← Back to API Reference`;
    html += `</a>`;

    html += `</div>`;
    return html;
}

// ─── Render Input/Output Example Panels ───
function renderInputOutput(fn) {
    let html = `<div class="fn-io-container">`;

    // Input panel
    if (fn.inputExample) {
        html += `<div class="fn-io-panel">`;
        html += `<div class="fn-io-header fn-io-header-input"><span class="fn-io-icon"></span> Input</div>`;
        html += `<pre class="fn-io-body"><code>${highlightPython(escHtml(fn.inputExample))}</code></pre>`;
        html += `</div>`;
    }

    // Output panel
    if (fn.outputExample) {
        html += `<div class="fn-io-panel">`;
        html += `<div class="fn-io-header fn-io-header-output"><span class="fn-io-icon"></span> Output</div>`;
        html += `<pre class="fn-io-body"><code>${highlightPython(escHtml(fn.outputExample))}</code></pre>`;
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

// ─── Render Interactive Try-It Window ───
function renderInteractiveWindow(fnId, fn) {
    const editorId = `tryit-editor-${fnId}`;
    const outputId = `tryit-output-${fnId}`;

    let html = `<div class="fn-tryit-window">`;

    // Header
    html += `<div class="fn-tryit-header">`;
    html += `<div class="fn-tryit-title"><span class="fn-tryit-title-icon"></span> Interactive Playground</div>`;
    html += `<div style="display:flex;align-items:center;gap:8px;">`;
    html += `<span class="fn-tryit-badge">Simulated Output</span>`;
    html += `<div class="fn-tryit-actions">`;
    html += `<button class="fn-tryit-btn" onclick="resetTryIt('${fnId}')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Reset</button>`;
    html += `<button class="fn-tryit-btn" onclick="copyTryIt('${fnId}')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>`;
    html += `<button class="fn-tryit-btn fn-tryit-btn-run" onclick="runTryIt('${fnId}')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run</button>`;
    html += `</div></div>`;
    html += `</div>`;

    // Editor
    html += `<div class="fn-tryit-editor">`;
    html += `<textarea id="${editorId}" class="fn-tryit-textarea" spellcheck="false" data-original="${escAttr(fn.inputExample)}">${escHtml(fn.inputExample)}</textarea>`;
    html += `</div>`;

    // Output
    html += `<div class="fn-tryit-output">`;
    html += `<div class="fn-tryit-output-header"><span class="fn-tryit-output-title">Output</span></div>`;
    html += `<pre class="fn-tryit-output-body empty" id="${outputId}">Click ▶ Run to see simulated output...</pre>`;
    html += `</div>`;

    html += `</div>`;
    return html;
}

// ─── Helpers ───

function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatInlineCode(str) {
    // Convert `backtick` to <code> elements
    return str.replace(/`([^`]+)`/g, '<code>$1</code>');
}

function formatDesc(str) {
    // Convert `backtick` to <code>, preserve paragraph breaks
    let escaped = escHtml(str);
    escaped = formatInlineCode(escaped);
    // Convert double newlines to paragraph breaks
    escaped = escaped.replace(/\n\n/g, '</p><p class="fn-long-desc">');
    return `<p class="fn-long-desc">${escaped}</p>`;
}

function sectionTitle(title, pathD) {
    return `<h3 class="fn-section-title"><span class="fn-section-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${pathD}"/></svg></span>${title}</h3>`;
}

function codeBlock(code, lang = 'python') {
    let html = `<div class="fn-code-block">`;
    html += `<div class="fn-code-header">`;
    html += `<span class="fn-code-lang">${lang}</span>`;
    html += `<button class="fn-code-copy" onclick="copyCodeBlock(this)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>`;
    html += `</div>`;
    html += `<pre class="fn-code-body"><code>${highlightPython(escHtml(code))}</code></pre>`;
    html += `</div>`;
    return html;
}

function highlightPython(code) {
    // Keywords
    code = code.replace(/\b(from|import|def|class|return|if|else|elif|for|in|while|with|as|try|except|raise|not|and|or|is|None|True|False|print|self)\b/g,
        '<span class=hl-kw>$1</span>');
    // Strings
    code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g,
        '<span class=hl-str>$&</span>');
    // Comments
    code = code.replace(/(#.*)/g,
        '<span class=hl-cmt>$1</span>');
    // Numbers
    code = code.replace(/\b(\d+\.?\d*)\b/g,
        '<span class=hl-num>$1</span>');
    // Function calls
    code = code.replace(/\.(\w+)\(/g,
        '.<span class=hl-fn>$1</span>(');
    return code;
}

function copyCodeBlock(btn) {
    const codeEl = btn.closest('.fn-code-block').querySelector('.fn-code-body code');
    const text = codeEl.textContent;
    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
        setTimeout(() => {
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
        }, 2000);
    });
}

function escAttr(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '&#10;');
}

// ─── Interactive Playground Functions ───

function runTryIt(fnId) {
    const fn = DOCS_DATA.functions[fnId];
    if (!fn || !fn.outputExample) return;

    const outputEl = document.getElementById(`tryit-output-${fnId}`);
    if (!outputEl) return;

    // Show loading state
    outputEl.className = 'fn-tryit-output-body typing';
    outputEl.textContent = '>>> Running...';

    // Simulate execution delay for realism
    setTimeout(() => {
        outputEl.className = 'fn-tryit-output-body show';
        outputEl.textContent = fn.outputExample;
    }, 600);
}

function resetTryIt(fnId) {
    const editorEl = document.getElementById(`tryit-editor-${fnId}`);
    const outputEl = document.getElementById(`tryit-output-${fnId}`);
    if (!editorEl) return;

    // Restore original code
    const original = editorEl.dataset.original;
    if (original) {
        editorEl.value = original;
    }

    // Reset output
    if (outputEl) {
        outputEl.className = 'fn-tryit-output-body empty';
        outputEl.textContent = 'Click ▶ Run to see simulated output...';
    }
}

function copyTryIt(fnId) {
    const editorEl = document.getElementById(`tryit-editor-${fnId}`);
    if (!editorEl) return;

    navigator.clipboard.writeText(editorEl.value).then(() => {
        // Find the copy button and briefly change its text
        const btn = editorEl.closest('.fn-tryit-window').querySelector('.fn-tryit-btn:nth-child(2)');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 2000);
        }
    });
}
