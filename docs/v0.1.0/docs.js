// LineSight Documentation Engine v2
// Monochrome design & nested routing

const PAGE_ORDER = [];
const PAGE_LABELS = {};

const METHOD_ORDER = {
    // Shared first
    'fit': 1,
    
    // Linear
    'explain_coefficients': 2,
    'show_equation': 3,
    'explain_fit': 4,
    'plot_fit': 5,
    'plot_residuals': 6,
    'plot_loss_curve': 7,
    'animate_training': 8,
    'plot_loss_surface': 9,
    'plot_gradient_vectors': 10,
    'animate_loss_surface_path': 11,
    'plot_prediction_intervals': 12,
    'plot_sensitivity_analysis': 13,
    'compare_learning_rates': 14,
    
    // Multiple
    'plot_prediction_plane': 6,
    'plot_partial_regression': 7,
    'plot_feature_importance': 8,
    'plot_correlation_matrix': 9,
    'plot_multicollinearity': 10,
    'plot_residual_heatmap': 11,
    
    // Polynomial
    'plot_basis_functions': 6,
    'animate_degree_increase': 7,
    
    // Ridge
    'explain_regularization': 2,
    'plot_coefficient_shrinkage': 3,
    'plot_effective_degrees_of_freedom': 4,
    'plot_bias_variance_tradeoff': 5,
    'plot_constraint_region': 6,
    'animate_regularization': 7,
    
    // Lasso
    'plot_feature_elimination': 4,
    'plot_sparsity_path': 5,
    'animate_coordinate_descent': 7,
    
    // ElasticNet
    'plot_l1_l2_balance': 4,
    'animate_l1_ratio_sweep': 5,
    
    // Logistic
    'explain_boundary': 2,
    'plot_sigmoid': 3,
    'plot_decision_boundary': 4,
    'plot_probability_surface': 5,
    'plot_confusion_matrix': 6,
    'plot_roc_curve': 7,
    'plot_calibration_curve': 8,
    'plot_threshold_sensitivity': 9,
    'plot_log_odds': 10,
    'animate_boundary': 11
};

function initPageOrder() {
    PAGE_ORDER.length = 0; // Clear array
    
    PAGE_ORDER.push('getting-started');
    PAGE_LABELS['getting-started'] = 'Getting Started';

    PAGE_ORDER.push('guide/regressions');
    PAGE_LABELS['guide/regressions'] = 'Regressions';

    // Add models and their unique functions
    for (const [modelName, modelObj] of Object.entries(API_DATA.MODELS)) {
        PAGE_ORDER.push(`model/${modelName}`);
        PAGE_LABELS[`model/${modelName}`] = modelName.replace(/([A-Z])/g,' $1').trim();

        const fnNames = Object.keys(modelObj.unique_functions || {});
        fnNames.sort((a, b) => {
            const oa = METHOD_ORDER[a] || 999;
            const ob = METHOD_ORDER[b] || 999;
            if (oa !== ob) return oa - ob;
            return a.localeCompare(b);
        });

        for (const fnName of fnNames) {
            const route = `model/${modelName}/${fnName}`;
            PAGE_ORDER.push(route);
            PAGE_LABELS[route] = `${fnName}()`;
        }
    }

    // Add core methods
    for (const fnName of Object.keys(API_DATA.CORE_METHODS)) {
        PAGE_ORDER.push(`core/${fnName}`);
        PAGE_LABELS[`core/${fnName}`] = `${fnName}()`;
    }

    PAGE_ORDER.push('exceptions');
    PAGE_LABELS['exceptions'] = 'Troubleshooting';
}

document.addEventListener('DOMContentLoaded', () => {
    initPageOrder();
    buildSidebar();
    initSearch();
    initNavbar();
    initMobileMenu();
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
});

function initNavbar() {
    const nb = document.getElementById('navbar');
    if (!nb) return;
    window.addEventListener('scroll', () => nb.classList.toggle('scrolled', window.scrollY > 40), {passive:true});
}
function initMobileMenu() {
    const t = document.getElementById('nav-menu-toggle');
    const n = document.getElementById('nav-links');
    if (t && n) t.addEventListener('click', () => n.classList.toggle('open'));
}

// ── Sidebar ──
function buildSidebar() {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;
    let h = '';
    h += sidebarGroup('Guides', [
        {route:'getting-started', label:'Getting Started'},
        {route:'guide/regressions', label:'Regressions'},
        {route:'exceptions', label:'Troubleshooting'}
    ]);
    
    // Models Category with nested collapsible items
    let modelsHtml = '<div class="sidebar-category"><div class="sidebar-category-title">Models</div>';
    for (const [modelName, modelObj] of Object.entries(API_DATA.MODELS)) {
        const displayName = modelName.replace(/([A-Z])/g,' $1').trim();
        const modelRoute = `model/${modelName}`;
        modelsHtml += `
            <div class="sidebar-model-group" data-model="${modelName}">
                <a class="sidebar-fn-link sidebar-model-link" href="#${modelRoute}" data-route="${modelRoute}">${displayName}</a>
                <div class="sidebar-model-sublinks">
        `;
        
        const fnNames = Object.keys(modelObj.unique_functions || {});
        fnNames.sort((a, b) => {
            const oa = METHOD_ORDER[a] || 999;
            const ob = METHOD_ORDER[b] || 999;
            if (oa !== ob) return oa - ob;
            return a.localeCompare(b);
        });
        
        for (const fnName of fnNames) {
            const fnRoute = `model/${modelName}/${fnName}`;
            modelsHtml += `<a class="sidebar-fn-link sidebar-sub-link" href="#${fnRoute}" data-route="${fnRoute}">${fnName}()</a>`;
        }
        
        modelsHtml += `
                </div>
            </div>
        `;
    }
    modelsHtml += '</div>';
    h += modelsHtml;

    const coreLinks = Object.keys(API_DATA.CORE_METHODS).map(f => ({
        route: `core/${f}`, label: `${f}()`
    }));
    h += sidebarGroup('Core API (Shared)', coreLinks);
    nav.innerHTML = h;
}

function sidebarGroup(title, items) {
    let h = `<div class="sidebar-category"><div class="sidebar-category-title">${title}</div>`;
    items.forEach(i => {
        h += `<a class="sidebar-fn-link" href="#${i.route}" data-route="${i.route}">${i.label}</a>`;
    });
    return h + '</div>';
}

// ── Search ──
function initSearch() {
    const inp = document.getElementById('sidebar-search-input');
    if (!inp) return;
    inp.addEventListener('input', () => {
        const q = inp.value.toLowerCase().trim();
        document.querySelectorAll('.sidebar-fn-link').forEach(link => {
            const r = link.dataset.route || '';
            let match = !q || link.textContent.toLowerCase().includes(q);
            
            if (!match && r.startsWith('model/')) {
                const parts = r.split('/');
                const modelName = parts[1];
                const fnName = parts[2];
                const m = API_DATA.MODELS[modelName];
                if (m) {
                    if (fnName) {
                        const fn = m.unique_functions[fnName];
                        if (fn) {
                            match = (fn.longDesc||'').toLowerCase().includes(q) || (fn.shortDesc||'').toLowerCase().includes(q);
                        }
                    } else {
                        match = (m.conceptTheory||'').toLowerCase().includes(q) || (m.learningObjective||'').toLowerCase().includes(q);
                    }
                }
            }
            if (!match && r.startsWith('core/')) {
                const fn = API_DATA.CORE_METHODS[r.split('/')[1]];
                if (fn) match = (fn.longDesc||'').toLowerCase().includes(q) || (fn.shortDesc||'').toLowerCase().includes(q);
            }
            link.classList.toggle('hidden', !match);
        });

        // Toggle visibility of parent group if it contains visible sublinks
        document.querySelectorAll('.sidebar-model-group').forEach(group => {
            const sublinks = group.querySelectorAll('.sidebar-sub-link:not(.hidden)');
            const parentLink = group.querySelector('.sidebar-model-link');
            const hasVisibleSublinks = sublinks.length > 0;
            const parentMatch = parentLink && !parentLink.classList.contains('hidden');
            
            if (parentMatch || hasVisibleSublinks) {
                if (parentLink) parentLink.classList.remove('hidden');
                group.style.display = 'block';
                const container = group.querySelector('.sidebar-model-sublinks');
                if (container) {
                    if (q) {
                        container.classList.add('expanded');
                    } else {
                        const hash = window.location.hash.replace('#','');
                        const activeModel = hash.split('/')[1];
                        if (activeModel === group.dataset.model) {
                            container.classList.add('expanded');
                        } else {
                            container.classList.remove('expanded');
                        }
                    }
                }
            } else {
                if (parentLink) parentLink.classList.add('hidden');
                group.style.display = 'none';
            }
        });
    });
}

// ── Router ──
function handleRoute() {
    const hash = window.location.hash.replace('#','');
    const main = document.getElementById('docs-main');
    if (!main) return;
    
    // Reset active link styles
    document.querySelectorAll('.sidebar-fn-link').forEach(l => l.classList.remove('active'));
    
    // Highlight the active link in sidebar
    const activeLink = document.querySelector(`.sidebar-fn-link[data-route="${hash}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Collapse all model groups
    document.querySelectorAll('.sidebar-model-sublinks').forEach(container => {
        container.classList.remove('expanded');
    });
    
    if (hash.startsWith('model/')) {
        const parts = hash.split('/');
        const modelName = parts[1];
        const fnName = parts[2]; // can be undefined
        
        // Expand the active model's group
        const group = document.querySelector(`.sidebar-model-group[data-model="${modelName}"]`);
        if (group) {
            const sublinks = group.querySelector('.sidebar-model-sublinks');
            if (sublinks) sublinks.classList.add('expanded');
            // If we are on a sublink, also highlight the parent link to show context
            const parentLink = group.querySelector('.sidebar-model-link');
            if (parentLink && fnName) {
                parentLink.classList.add('active-parent'); // custom hint styling
            }
        }
        
        const model = API_DATA.MODELS[modelName];
        if (model) {
            if (fnName) {
                const fn = model.unique_functions[fnName];
                main.innerHTML = fn ? renderModelFnPage(modelName, fnName, fn) : '<p>Function not found.</p>';
            } else {
                main.innerHTML = renderModelPage(modelName, model);
            }
        } else {
            main.innerHTML = '<p>Model not found.</p>';
        }
    } else if (hash.startsWith('core/')) {
        const fn = API_DATA.CORE_METHODS[hash.split('/')[1]];
        main.innerHTML = fn ? renderCoreFnPage(hash.split('/')[1], fn) : '<p>Not found.</p>';
    } else if (hash === 'getting-started') {
        main.innerHTML = renderGettingStarted();
    } else if (hash === 'guide/regressions') {
        main.innerHTML = renderRegressionsGuide();
    } else if (hash === 'exceptions') {
        main.innerHTML = renderExceptions();
    } else {
        main.innerHTML = renderLanding();
    }
    main.scrollTop = 0; window.scrollTo(0,0);
}

// ── Landing ──
function renderLanding() {
    return `<div class="docs-landing">
        <h1 class="docs-landing-title">LineSight Documentation</h1>
        <p class="docs-landing-subtitle">A glass-box regression library for students and educators. Select a topic from the sidebar or start with the guides below.</p>
        <div class="landing-btn-row">
            <a href="#getting-started" class="btn-doc btn-doc-primary">Getting Started</a>
            <a href="#guide/regressions" class="btn-doc btn-doc-secondary">Browse Models</a>
        </div>
    </div>`;
}

// ── Model Page (Landing Page for a specific Model) ──
function renderModelPage(modelName, model) {
    const displayName = modelName.replace(/([A-Z])/g,' $1').trim();
    let h = `<div class="fn-page">`;
    h += breadcrumb(['Models', displayName]);

    h += `<div class="fn-title-block"><h1 style="font-size:2.2rem;font-weight:800;letter-spacing:-0.02em;color:#111;margin-bottom:10px;">${displayName}</h1>`;
    h += `<p class="fn-short-desc">${esc(model.conceptTheory||'')}</p></div>`;

    // Concept diagram
    if (model.visualDiagram_path) {
        h += section('Concept Diagram', imgOrPlaceholder(model.visualDiagram_path, displayName+' concept'));
    }

    if (model.learningObjective)
        h += section('Learning Objective', `<p class="fn-long-desc">${esc(model.learningObjective)}</p>`);
    if (model.implementationStrategy)
        h += section('Implementation Strategy', `<p class="fn-long-desc">${esc(model.implementationStrategy)}</p>`);

    // Unique functions as list of links
    const uFns = model.unique_functions || {};
    if (Object.keys(uFns).length) {
        h += `<div class="fn-section"><h3 class="fn-section-title">Unique Methods</h3>`;
        h += `<p class="fn-long-desc">Select a method below to view its mathematical formulation, parameter options, internal steps, and visualization examples:</p>`;
        
        const fnNames = Object.keys(uFns);
        fnNames.sort((a, b) => {
            const oa = METHOD_ORDER[a] || 999;
            const ob = METHOD_ORDER[b] || 999;
            if (oa !== ob) return oa - ob;
            return a.localeCompare(b);
        });

        h += `<div class="fn-inherited-list">`;
        fnNames.forEach(name => {
            const fn = uFns[name];
            h += `
                <a class="fn-inherited-item" href="#model/${modelName}/${name}">
                    <span class="fn-inherited-name">${name}()</span>
                    <span class="fn-inherited-desc">${esc(fn.shortDesc || 'Model function.')}</span>
                </a>
            `;
        });
        h += `</div></div>`;
    }

    // Shared / Inherited Methods
    const defaultShared = ['predict', 'score', 'get_training_history', 'summary', 'refit', 'show', 'save'];
    h += section('Shared Core Methods', renderInherited(defaultShared));

    // Notebook download button
    const nbPath = `../../LineSight_Interactive_Tutorial.ipynb`;
    h += section('Interactive Example',
        `<a href="${nbPath}" download="LineSight_Interactive_Tutorial.ipynb" target="_blank" class="fn-notebook-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Download Jupyter Example Notebook
        </a>`);

    h += renderNextPrev(`model/${modelName}`);
    h += `</div>`;
    return h;
}

// ── Model Function Sub-Page ──
function renderModelFnPage(modelName, fnName, fn) {
    const modelDisplayName = modelName.replace(/([A-Z])/g,' $1').trim();
    let h = `<div class="fn-page">`;
    h += breadcrumb(['Models', modelDisplayName, `${fnName}()`]);
    h += `<div class="fn-title-block">
        <div class="fn-signature"><span class="fn-name-highlight">${esc(fn.signature||fnName+'()')}</span></div>
        ${fn.source ? `<div class="fn-meta-badges"><span class="fn-badge">${esc(fn.source)}</span></div>` : ''}
        <p class="fn-short-desc">${esc(fn.shortDesc||'')}</p>
    </div>`;
    h += renderFnBody(fn);
    h += renderNextPrev(`model/${modelName}/${fnName}`);
    h += `</div>`;
    return h;
}

// ── Core Function Page ──
function renderCoreFnPage(fnName, fn) {
    let h = `<div class="fn-page">`;
    h += breadcrumb(['Core API', `${fnName}()`]);
    h += `<div class="fn-title-block">
        <div class="fn-signature"><span class="fn-name-highlight">${esc(fn.signature||fnName+'()')}</span></div>
        ${fn.source ? `<div class="fn-meta-badges"><span class="fn-badge">${esc(fn.source)}</span></div>` : ''}
        <p class="fn-short-desc">${esc(fn.shortDesc||'')}</p>
    </div>`;
    h += renderFnBody(fn, true);
    h += renderNextPrev(`core/${fnName}`);
    h += `</div>`;
    return h;
}

// ── Shared function body renderer ──
function renderFnBody(fn, isCore = false) {
    let h = '';
    if (fn.longDesc)
        h += section('Description', `<div class="fn-long-desc">${formatDesc(fn.longDesc)}</div>`);

    if (fn.mathFormula)
        h += section('Mathematical Formula', `<div class="fn-math-block">${esc(fn.mathFormula)}</div>`);

    if (fn.parameters && fn.parameters.length)
        h += section('Parameters', renderParamsTable(fn.parameters));

    if (fn.returns)
        h += section('Returns', `<div class="fn-returns-block"><div class="fn-returns-type">${esc(fn.returns.type)}</div><div class="fn-returns-desc">${formatDesc(fn.returns.desc)}</div></div>`);

    if (fn.raises && fn.raises.length)
        h += section('Raises', renderErrorBoxes(fn.raises));

    if (fn.warns && fn.warns.length)
        h += section('Warnings', renderWarnBoxes(fn.warns));

    if (fn.internalSteps && fn.internalSteps.length)
        h += section('How It Works Internally', renderSteps(fn.internalSteps));

    if (fn.example)
        h += section('Example', codeBlock(fn.example));

    if (fn.outputImage)
        h += section('Example Output', renderOutputImg(fn.outputImage, fn.name||''));

    if (!isCore && fn.seeAlso && fn.seeAlso.length)
        h += section('See Also', renderSeeAlso(fn.seeAlso));

    return h;
}

// ── Guide Pages ──
function renderGettingStarted() {
    return `<div class="fn-page">
        ${breadcrumb(['Guides','Getting Started'])}
        <div class="fn-title-block"><h1 style="font-size:2.2rem;font-weight:800;color:#111;">Getting Started</h1></div>
        ${section('Installation','<p class="fn-long-desc">Install LineSight from PyPI:</p>'+codeBlock('pip install linesight','bash'))}
        ${section('Quickstart','<p class="fn-long-desc">LineSight uses a scikit-learn style API across all models.</p>'+codeBlock(`from linesight import LinearRegression
import numpy as np

X = np.array([[1],[2],[3],[4],[5]])
y = np.array([2.1, 4.0, 5.8, 8.1, 9.9])

model = LinearRegression(learning_rate=0.01, epochs=1000)
model.fit(X, y)

print(model.show_equation())   # y = 1.9800x + 0.1200
model.plot_fit(X, y)           # visualize the fit
metrics = model.score(X, y)    # evaluate performance
model.summary()                # print training summary`))}
        ${renderNextPrev('getting-started')}
    </div>`;
}

function renderRegressionsGuide() {
    const rows = [
        ['LinearRegression',    'MSE only',       'None',       'No',      'Baseline linear relationship'],
        ['RidgeRegression',     'MSE + L2',       'α·Σwᵢ²',    'No',      'Multicollinearity in features'],
        ['LassoRegression',     'MSE + L1',       'α·Σ|wᵢ|',   'Yes',     'Automatic feature selection'],
        ['ElasticNetRegression','MSE + L1 + L2',  'α·blend',    'Partial', 'Mixed datasets'],
        ['LogisticRegression',  'Log Loss',       'None',       'No',      'Binary classification'],
    ];
    let tableRows = rows.map(r =>
        `<tr>${r.map((c,i) => i===0 ? `<td><a href="#model/${c}" style="font-family:var(--font-mono);font-weight:600;color:#111;text-decoration:none;">${c}</a></td>` : `<td>${c}</td>`).join('')}</tr>`
    ).join('');

    const sharedFns = ['predict','score','get_training_history','summary','refit','show','save','plot_actual_vs_predicted','plot_learning_curve'];

    const modelFnMap = {
        LinearRegression: ['fit','show_equation','explain_coefficients','explain_fit','plot_fit','plot_residuals','plot_loss_curve','animate_training','plot_loss_surface','plot_gradient_vectors','plot_prediction_intervals','plot_sensitivity_analysis'],
        MultipleLinearRegression: ['fit', 'plot_fit', 'plot_prediction_plane', 'plot_partial_regression', 'plot_feature_importance', 'plot_correlation_matrix', 'plot_multicollinearity', 'plot_residual_heatmap'],
        RidgeRegression: ['fit','explain_regularization','plot_coefficient_shrinkage','plot_effective_degrees_of_freedom','plot_bias_variance_tradeoff','plot_constraint_region','animate_regularization','plot_residuals'],
        LassoRegression: ['fit','explain_regularization','plot_coefficient_shrinkage','plot_feature_elimination','plot_sparsity_path','plot_constraint_region','animate_coordinate_descent','plot_residuals'],
        ElasticNetRegression: ['fit','explain_regularization','plot_coefficient_shrinkage','plot_l1_l2_balance','animate_l1_ratio_sweep','plot_residuals'],
        LogisticRegression: ['fit','explain_boundary','plot_sigmoid','plot_decision_boundary','plot_probability_surface','plot_confusion_matrix','plot_roc_curve','plot_calibration_curve','plot_threshold_sensitivity','plot_log_odds','animate_boundary','plot_residuals'],
    };

    let fnMapHtml = Object.entries(modelFnMap).map(([model, fns]) =>
        `<div class="fn-map-section">
            <div class="fn-map-title">${model}</div>
            <div class="fn-map-list">${fns.map(f =>
                `<a class="fn-map-tag" href="#model/${model}/${f}">${f}()</a>`
            ).join('')}</div>
        </div>`
    ).join('');

    return `<div class="fn-page">
        ${breadcrumb(['Guides','Regressions'])}
        <div class="fn-title-block"><h1 style="font-size:2.2rem;font-weight:800;color:#111;">Regression Models</h1>
        <p class="fn-short-desc">LineSight provides 5 models. Each builds upon the previous by adding a new constraint. This page shows how all models relate and which methods they share.</p></div>
        ${section('Model Comparison', `<table class="comparison-table">
            <thead><tr><th>Model</th><th>Loss</th><th>Penalty Term</th><th>Sparsity</th><th>Best For</th></tr></thead>
            <tbody>${tableRows}</tbody>
        </table>`)}
        ${section('Shared Methods (All Models)', `<div class="fn-map-list">${sharedFns.map(f=>`<a class="fn-map-tag" href="#core/${f}">${f}()</a>`).join('')}</div>`)}
        ${section('Model-Specific Functions', fnMapHtml)}
        ${renderNextPrev('guide/regressions')}
    </div>`;
}

function renderExceptions() {
    const errs = [
        ['LineSightGradientError','Gradients exploded to NaN/Inf during training.','Your <code>learning_rate</code> is too high. Reduce it (e.g., 0.1 → 0.01) or normalize your features with <code>StandardScaler</code>.'],
        ['LineSightShapeError','Mismatch between X and y shapes, or wrong feature count at predict time.','Ensure <code>X.shape[0] == y.shape[0]</code>. Reshape 1D arrays: <code>X.reshape(-1, 1)</code>.'],
        ['LineSightNotFittedError','A method was called before <code>fit()</code>.','Always call <code>model.fit(X, y)</code> before <code>predict()</code>, <code>score()</code>, or any visualization.'],
        ['LineSightConvergenceWarning','Model reached max epochs but loss was still decreasing.','Increase <code>epochs</code> or slightly raise <code>learning_rate</code>.'],
        ['LineSightDataWarning','<code>store_history=False</code> — training history is empty.','Re-instantiate the model with <code>store_history=True</code> and refit.'],
    ];
    let boxes = errs.map(([name, cause, fix]) => `
        <div class="fn-error-box" style="margin-bottom:12px;">
            <div class="fn-box-header"><span class="fn-box-icon-error">⚠</span><span class="fn-box-exception">${name}</span></div>
            <div class="fn-box-condition"><strong>Cause:</strong> ${cause}</div>
            <div class="fn-box-condition"><strong>Fix:</strong> ${fix}</div>
        </div>`).join('');
    return `<div class="fn-page">
        ${breadcrumb(['Guides','Troubleshooting'])}
        <div class="fn-title-block"><h1 style="font-size:2.2rem;font-weight:800;color:#111;">Exceptions & Troubleshooting</h1>
        <p class="fn-short-desc">Reference for every custom error and warning raised by LineSight, with plain-English causes and fixes.</p></div>
        ${section('Error Reference', boxes)}
        ${renderNextPrev('exceptions')}
    </div>`;
}

// ── Helpers ──
function breadcrumb(parts) {
    let h = `<div class="fn-breadcrumb"><a href="#">Docs</a>`;
    parts.forEach(p => { h += `<span class="separator">›</span><span class="current">${p}</span>`; });
    return h + '</div>';
}

function section(title, content) {
    return `<div class="fn-section"><h3 class="fn-section-title">${title}</h3>${content}</div>`;
}

function renderParamsTable(params) {
    let rows = params.map(p => `<tr>
        <td><span class="param-name">${esc(p.name)}</span>${p.required ? '<span class="param-required">required</span>' : ''}</td>
        <td><span class="param-type">${esc(p.type)}</span></td>
        <td><span class="param-default">${p.default != null ? esc(String(p.default)) : '—'}</span></td>
        <td>${formatDesc(p.desc)}</td>
    </tr>`).join('');
    return `<table class="fn-params-table"><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderErrorBoxes(raises) {
    return '<div class="fn-error-list">' + raises.map(r => `
        <div class="fn-error-box">
            <div class="fn-box-header"><span class="fn-box-icon-error">⚠</span><span class="fn-box-exception">${esc(r.exception)}</span></div>
            <div class="fn-box-condition">${esc(r.condition)}</div>
            <div class="fn-box-message">${esc(r.message)}</div>
        </div>`).join('') + '</div>';
}

function renderWarnBoxes(warns) {
    return '<div class="fn-warn-list">' + warns.map(w => `
        <div class="fn-warn-box">
            <div class="fn-box-header"><span class="fn-box-icon-warn">ℹ</span><span class="fn-box-exception">${esc(w.warning)}</span></div>
            <div class="fn-box-condition">${esc(w.condition)}</div>
            <div class="fn-box-message">${esc(w.message)}</div>
        </div>`).join('') + '</div>';
}

function renderSteps(steps) {
    return `<ol class="fn-steps-list">${steps.map(s=>`<li class="fn-step-item">${formatDesc(s)}</li>`).join('')}</ol>`;
}

function renderSeeAlso(refs) {
    return `<div class="fn-see-also">${refs.map(r => {
        const isCoreMethod = API_DATA.CORE_METHODS[r];
        const route = isCoreMethod ? `core/${r}` : r;
        return `<a class="fn-see-also-link" href="#${route}">${r}()</a>`;
    }).join('')}</div>`;
}

function renderInherited(fns) {
    const descs = {
        predict:'Generate predictions using the fitted model.',
        score:'Compute regression metrics (R², RMSE, MAE, MSE).',
        get_training_history:'Return the TrainingHistory object from the last fit.',
        summary:'Print a complete model training summary.',
        refit:'Reset all state and retrain from scratch on new data.',
        show:'Display a figure or animation in the current environment.',
        save:'Export a figure or animation to PNG, GIF, or MP4.',
        plot_actual_vs_predicted:'Scatter plot of true vs predicted values.',
        plot_learning_curve:'Train/validation score vs dataset size curve.'
    };
    return `<div class="fn-inherited-list">${fns.map(f => `
        <a class="fn-inherited-item" href="#core/${f}">
            <span class="fn-inherited-name">${f}()</span>
            <span class="fn-inherited-desc">${descs[f]||'Shared core method.'}</span>
        </a>`).join('')}</div>`;
}

function renderOutputImg(src, name) {
    return `<div class="fn-output-image-wrapper">
        <img src="${src}" alt="${esc(name)} output" class="fn-output-img" loading="lazy"
             onerror="this.parentElement.innerHTML='<div class=fn-img-placeholder>Output image — run generate_all_monochrome_assets.py to populate</div>'">
    </div>`;
}

function imgOrPlaceholder(src, alt) {
    return `<img src="${src}" alt="${esc(alt)}" class="fn-concept-img" loading="lazy"
        onerror="this.parentElement.innerHTML='<div class=fn-img-placeholder>Concept diagram — run generate_all_monochrome_assets.py to populate</div>'">`;
}

function placeholder(text) {
    return `<div class="fn-img-placeholder">${text}</div>`;
}

function renderNextPrev(currentRoute) {
    const idx = PAGE_ORDER.indexOf(currentRoute);
    const prev = idx > 0 ? PAGE_ORDER[idx-1] : null;
    const next = idx < PAGE_ORDER.length-1 ? PAGE_ORDER[idx+1] : null;
    let h = `<div class="fn-page-nav">`;
    if (prev) {
        h += `<a class="fn-nav-btn" style="justify-content: center;" href="#${prev}"><span class="fn-nav-btn-title">← Previous</span></a>`;
    } else { h += `<span class="fn-nav-placeholder"></span>`; }
    if (next) {
        h += `<a class="fn-nav-btn" style="text-align:right; justify-content: center;" href="#${next}"><span class="fn-nav-btn-title">Next →</span></a>`;
    } else { h += `<span class="fn-nav-placeholder"></span>`; }
    return h + `</div>`;
}

function codeBlock(code, lang='python') {
    const highlighted = lang === 'python' ? highlightCode(code) : `<span style="color:#CCCCCC">${esc(code)}</span>`;
    return `<div class="fn-code-block">
        <div class="fn-code-actions">
            <button class="fn-code-btn btn-settings" title="Settings">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
            <button class="fn-code-btn btn-copy" onclick="copyCode(this)" title="Copy Code">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
        </div>
        <pre class="fn-code-body"><code>${highlighted}</code></pre>
    </div>`;
}

function copyCode(btn) {
    const code = btn.closest('.fn-code-block').querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="#22C55E" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        setTimeout(() => btn.innerHTML = orig, 2000);
    });
}

function highlightCode(raw) {
    const lines = raw.split('\n');
    return lines.map(line => {
        const commentMatch = line.match(/^(.*?)(#.*)$/);
        if (commentMatch) {
            return processNonComment(commentMatch[1]) + `<span class="hl-cmt">${esc(commentMatch[2])}</span>`;
        }
        return processNonComment(line);
    }).join('\n');
}

function processNonComment(line) {
    const parts = [];
    let remaining = line;
    const strRe = /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/;
    let m;
    while ((m = strRe.exec(remaining)) !== null) {
        if (m.index > 0) parts.push({type:'code', val: remaining.slice(0, m.index)});
        parts.push({type:'str', val: m[0]});
        remaining = remaining.slice(m.index + m[0].length);
    }
    if (remaining) parts.push({type:'code', val: remaining});

    return parts.map(p => {
        if (p.type === 'str') return `<span class="hl-str">${esc(p.val)}</span>`;
        let s = esc(p.val);
        s = s.replace(/\b(import|from|def|class|return|if|else|elif|for|in|while|with|as|try|except|raise|not|and|or|is|None|True|False|print|self|np|plt|os|sys)\b/g, '<span class="hl-kw">$1</span>');
        s = s.replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-num">$1</span>');
        return s;
    }).join('');
}

function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatDesc(str) {
    if (!str) return '';
    
    // Normalize newlines to \n
    let text = str.replace(/\r\n/g, '\n');
    let lines = text.split('\n');
    let formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        // Check if the current line consists entirely of dashes or equals (and is at least 3 chars long)
        // indicating that the previous line was a header
        if (i > 0 && /^[=-]{3,}$/.test(line)) {
            let prevIdx = formattedLines.length - 1;
            if (prevIdx >= 0) {
                formattedLines[prevIdx] = `<h5 class="fn-desc-subheading">${formattedLines[prevIdx]}</h5><div class="fn-desc-section-content">`;
            }
            continue;
        }
        
        let s = esc(lines[i]);
        s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
        s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // List items
        if (/^\s*[-\*]\s+/.test(lines[i])) {
            let content = lines[i].replace(/^\s*[-\*]\s+/, '');
            s = `<li class="fn-desc-li">${formatDescInline(content)}</li>`;
        }
        // No legacy parameter line formatting — rely entirely on renderParamsTable for the modern UI.
        
        formattedLines.push(s);
    }
    
    let html = '';
    let inList = false;
    let inSection = false;
    
    for (let i = 0; i < formattedLines.length; i++) {
        let line = formattedLines[i];
        
        if (line.startsWith('<li')) {
            if (!inList) {
                html += '<ul class="fn-desc-ul">';
                inList = true;
            }
            html += line;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            
            if (line.includes('<h5 class="fn-desc-subheading">')) {
                if (inSection) {
                    html += '</div>';
                }
                inSection = true;
                html += line;
            } else if (line.trim() === '') {
                html += '<br><br>';
            } else {
                html += line + ' ';
            }
        }
    }
    
    if (inList) html += '</ul>';
    if (inSection) html += '</div>';
    
    return `<div class="fn-desc-wrapper">${html}</div>`;
}

function formatDescInline(str) {
    let s = esc(str);
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return s;
}
