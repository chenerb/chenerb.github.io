const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['home', 'research', 'experience', 'leadership', 'awards'];

window.addEventListener('DOMContentLoaded', () => {
    const copy = {
        en: {
            academic: 'Academic', life: 'Life', pageStyle: 'Page style', about: 'About', research: 'Research', experience: 'Experience', leadership: 'Leadership', awards: 'Awards',
            researchTitle: 'Research & projects', experienceTitle: 'Internship experience', leadershipTitle: 'Leadership & service', awardsTitle: 'Honors & awards',
            university: 'Shanghai Jiao Tong University', affiliationSeparator: ', ', license: 'License', skip: 'Skip to content',
            navigation: 'Main navigation', toggle: 'Toggle navigation', contact: 'Contact links', language: 'Page language', portrait: 'Portrait of Feiyang Chen',
            description: 'Feiyang Chen — Information Engineering undergraduate at Shanghai Jiao Tong University. Multi-sensor fusion, AI agents, research projects, internships, and awards.',
            loading: 'Loading English content…', loaded: 'Page language: English.', retry: 'Retry',
            error: 'The selected language could not be loaded. Please try again.', unavailable: 'Content could not be loaded. Use Retry above.'
        },
        zh: {
            academic: '学术', life: '生活', pageStyle: '页面风格', about: '个人简介', research: '研究项目', experience: '实习经历', leadership: '学生工作', awards: '荣誉奖项',
            researchTitle: '研究与竞赛项目', experienceTitle: '实习经历', leadershipTitle: '学生工作与社会服务', awardsTitle: '荣誉与奖项',
            university: '上海交通大学', affiliationSeparator: ' · ', license: '开源许可', skip: '跳至正文',
            navigation: '主导航', toggle: '展开或收起导航', contact: '联系方式', language: '页面语言', portrait: '陈飞扬个人照片',
            description: '陈飞扬，上海交通大学信息工程专业本科生。研究与实践方向涵盖多传感器融合、AI 智能体、计算机视觉及嵌入式系统。',
            loading: '正在加载中文内容…', loaded: '页面已切换为中文。', retry: '重试',
            error: '所选语言暂时无法加载，请重试。', unavailable: '内容暂时无法加载，请使用上方的重试按钮。'
        }
    };
    const main = document.getElementById('main-content');
    const status = document.getElementById('site-status');
    const announcement = document.getElementById('language-status');
    const buttons = [...document.querySelectorAll('[data-language]')];
    const containers = section_names.map(name => document.getElementById(`${name}-md`));
    const cache = new Map();
    let currentLanguage = null;
    let failedLanguage = null;
    let mathQueue = Promise.resolve();
    let renderVersion = 0;
    // Accessing localStorage itself can throw in restricted browser contexts.
    let storage;
    try { storage = window.localStorage; } catch { /* Optional persistence. */ }

    function refreshNavigation() {
        if (!window.bootstrap?.ScrollSpy) return;
        bootstrap.ScrollSpy.getOrCreateInstance(document.body, {
            target: '#mainNav', rootMargin: '0px 0px -40%'
        }).refresh();
    }
    async function fetchText(path) {
        const response = await fetch(path, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
        return response.text();
    }
    async function loadBundle(language) {
        if (!cache.has(language)) {
            const directory = language === 'zh' ? `${content_dir}zh/` : content_dir;
            const texts = await Promise.all([config_file, ...section_names.map(name => `${name}.md`)].map(file => fetchText(directory + file)));
            const config = jsyaml.load(texts[0]);
            if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error('Invalid site configuration.');
            cache.set(language, { config, sections: texts.slice(1).map(markdown => marked.parse(markdown)) });
        }
        await mathQueue;
        return cache.get(language);
    }
    function translateChrome(language) {
        const text = copy[language];
        document.querySelectorAll('[data-page-link]').forEach(link => { link.href = `${link.dataset.pageLink}?lang=${language}`; });
        const url = new URL(location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url);
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
        document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = text[el.dataset.i18n]; });
        document.querySelectorAll('[data-i18n-label]').forEach(el => { el.setAttribute('aria-label', text[el.dataset.i18nLabel]); });
        document.querySelector('.profile-photo img').alt = text.portrait;
        document.querySelector('meta[name="description"]').content = text.description;
        buttons.forEach(button => { button.setAttribute('aria-pressed', String(button.dataset.language === language)); });
    }
    // Match the same paragraph/heading in both translations, rather than a pixel
    // position that would move the reader when the translated text changes height.
    function readingPosition() {
        if (window.scrollY < 1) return null;
        const line = document.getElementById('mainNav').getBoundingClientRect().bottom + 24;
        for (const section of document.querySelectorAll('main section')) {
            const items = [...section.querySelectorAll('h1, h2, h3, p, li')];
            const index = items.findIndex(el => el.getBoundingClientRect().bottom > line);
            if (index !== -1) return { section: section.id, index, top: items[index].getBoundingClientRect().top };
        }
        return null;
    }
    function applyBundle(bundle, language) {
        const firstRender = currentLanguage === null;
        const position = firstRender ? null : readingPosition();
        const version = ++renderVersion;
        window.MathJax?.typesetClear?.(containers);
        Object.entries(bundle.config).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element && value != null && typeof value !== 'object') element.innerHTML = String(value);
        });
        containers.forEach((container, index) => {
            container.innerHTML = bundle.sections[index];
            container.setAttribute('aria-busy', 'false');
        });
        translateChrome(language);
        currentLanguage = language;
        failedLanguage = null;
        status.hidden = true;
        status.replaceChildren();
        refreshNavigation();
        if (position) {
            const target = document.getElementById(position.section).querySelectorAll('h1, h2, h3, p, li')[position.index];
            if (target) window.scrollBy({ top: target.getBoundingClientRect().top - position.top, behavior: 'instant' });
        } else if (firstRender && section_names.includes(location.hash.slice(1))) {
            document.getElementById(location.hash.slice(1)).scrollIntoView({ behavior: 'instant' });
        }
        mathQueue = mathQueue.then(async () => {
            if (!window.MathJax || version !== renderVersion) return;
            await MathJax.startup.promise;
            if (version === renderVersion) await MathJax.typesetPromise(containers);
        }).catch(error => console.warn('Math typesetting could not be completed.', error)).finally(refreshNavigation);
    }
    const switcher = HomepageLanguage.createSwitcher({
        load: loadBundle,
        apply: applyBundle,
        remember: language => storage?.setItem(HomepageLanguage.storageKey, language),
        pending(busy, language) {
            main.setAttribute('aria-busy', String(busy));
            document.querySelector('.language-switch').setAttribute('aria-busy', String(busy));
            buttons.forEach(button => button.classList.toggle('is-loading', busy && button.dataset.language === language));
            announcement.textContent = busy ? copy[language].loading : (currentLanguage && !failedLanguage ? copy[currentLanguage].loaded : '');
        },
        failed(error, language) {
            console.warn('Language content could not be loaded.', error);
            failedLanguage = language;
            const displayLanguage = currentLanguage || language;
            const text = copy[displayLanguage];
            if (!currentLanguage) {
                translateChrome(language);
                containers.forEach(container => {
                    const fallback = document.createElement('p');
                    fallback.textContent = text.unavailable;
                    container.replaceChildren(fallback);
                    container.setAttribute('aria-busy', 'false');
                });
            }
            const message = document.createElement('p');
            message.textContent = text.error;
            const retry = document.createElement('button');
            retry.type = 'button';
            retry.className = 'content-retry';
            retry.textContent = text.retry;
            retry.addEventListener('click', () => {
                retry.disabled = true;
                switcher.change(failedLanguage);
            });
            status.replaceChildren(message, retry);
            status.hidden = false;
        }
    });
    buttons.forEach(button => button.addEventListener('click', () => switcher.change(button.dataset.language)));
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarResponsive = document.getElementById('navbarResponsive');
    document.querySelectorAll('#navbarResponsive .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.bootstrap?.Collapse && window.getComputedStyle(navbarToggler).display !== 'none') {
                bootstrap.Collapse.getOrCreateInstance(navbarResponsive, { toggle: false }).hide();
            }
        });
    });
    marked.use({ mangle: false, headerIds: false });
    switcher.change(HomepageLanguage.preferredLanguage(storage, navigator.languages || [navigator.language], new URLSearchParams(location.search).get('lang')));
});
