const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['home', 'publications', 'awards'];

window.addEventListener('DOMContentLoaded', () => {
    const loadingSections = new Set();
    let mathQueue = Promise.resolve();

    function refreshNavigation() {
        if (!document.getElementById('mainNav') || !window.bootstrap?.ScrollSpy) return;
        bootstrap.ScrollSpy.getOrCreateInstance(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        }).refresh();
    }

    async function fetchText(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
        return response.text();
    }

    async function loadConfig() {
        try {
            const config = jsyaml.load(await fetchText(content_dir + config_file));
            if (!config || typeof config !== 'object' || Array.isArray(config)) {
                throw new Error('Site configuration must be a mapping.');
            }
            Object.entries(config).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (!element) {
                    console.warn(`Unknown site configuration key: ${key}`);
                    return;
                }
                if (value != null && typeof value !== 'object') {
                    element.innerHTML = String(value);
                }
            });
        } catch (error) {
            console.warn('Site configuration could not be loaded.', error);
            const status = document.getElementById('site-status');
            if (status) {
                status.textContent = 'Site details could not be loaded. Default information is shown.';
                status.hidden = false;
            }
        }
        refreshNavigation();
    }

    function typesetSection(container) {
        if (!window.MathJax) return;
        // Queue dynamic typesetting so sections never compete during startup.
        mathQueue = mathQueue.then(async () => {
            await MathJax.startup.promise;
            await MathJax.typesetPromise([container]);
        }).catch(error => {
            console.warn('Math typesetting could not be completed.', error);
        }).finally(refreshNavigation);
    }

    async function loadSection(name) {
        const container = document.getElementById(`${name}-md`);
        if (!container || loadingSections.has(name)) return;
        loadingSections.add(name);
        container.setAttribute('aria-busy', 'true');
        const retry = container.querySelector('.content-retry');
        if (retry) retry.disabled = true;

        let loaded = false;
        try {
            const markdown = await fetchText(`${content_dir}${name}.md`);
            container.innerHTML = marked.parse(markdown);
            loaded = true;
        } catch (error) {
            console.warn(`The ${name} section could not be loaded.`, error);
            container.innerHTML = `<div class="content-error" role="status">
                <p>This section could not be loaded. Please try again.</p>
                <button type="button" class="content-retry" data-section="${name}">Retry</button>
            </div>`;
        } finally {
            container.setAttribute('aria-busy', 'false');
            loadingSections.delete(name);
            refreshNavigation();
        }
        // A math error must never replace successfully loaded Markdown.
        if (loaded) typesetSection(container);
    }

    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarResponsive = document.getElementById('navbarResponsive');
    document.querySelectorAll('#navbarResponsive .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarToggler && navbarResponsive && window.bootstrap?.Collapse &&
                window.getComputedStyle(navbarToggler).display !== 'none') {
                bootstrap.Collapse.getOrCreateInstance(navbarResponsive, { toggle: false }).hide();
            }
        });
    });

    document.addEventListener('click', event => {
        const retry = event.target.closest('.content-retry');
        if (retry && section_names.includes(retry.dataset.section)) {
            loadSection(retry.dataset.section);
        }
    });

    marked.use({ mangle: false, headerIds: false });
    refreshNavigation();
    loadConfig();
    section_names.forEach(loadSection);
});
