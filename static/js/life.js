window.addEventListener('DOMContentLoaded', () => {
    let storage;
    try { storage = window.localStorage; } catch { /* Persistence is optional. */ }
    function changeLanguage(language) {
        if (!['zh', 'en'].includes(language)) return;
        // Anchor the current article while translated paragraphs change height.
        const anchor = [...document.querySelectorAll('article, .personality, .closing')]
            .find(element => element.getBoundingClientRect().bottom > 100);
        const top = anchor?.getBoundingClientRect().top;
        document.querySelectorAll('[data-zh][data-en]').forEach(element => {
            element.textContent = element.dataset[language];
        });
        document.querySelectorAll('[data-label-zh]').forEach(element => {
            element.setAttribute('aria-label', element.dataset[language === 'zh' ? 'labelZh' : 'labelEn']);
        });
        document.querySelectorAll('[data-language]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.language === language));
        });
        document.querySelectorAll('[data-page-link]').forEach(link => {
            link.href = `${link.dataset.pageLink}?lang=${language}`;
        });
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
        document.title = language === 'zh' ? '生活中的陈飞扬 | Feiyang Chen' : 'Life beyond academia | Feiyang Chen';
        document.querySelector('meta[name="description"]').content = language === 'zh'
            ? '认识生活中的陈飞扬：登山、铁三、跑步、主持、话剧，以及不断尝试的新爱好。'
            : 'Meet Feiyang beyond academia: mountains, triathlons, running, hosting, theatre, and the joy of trying something new.';
        const url = new URL(location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url);
        try { storage?.setItem(HomepageLanguage.storageKey, language); } catch { /* Optional. */ }
        if (window.scrollY > 0 && anchor) window.scrollBy({ top: anchor.getBoundingClientRect().top - top, behavior: 'instant' });
        document.getElementById('language-status').textContent = language === 'zh' ? '页面已切换为中文。' : 'Page language: English.';
    }
    document.querySelectorAll('[data-language]').forEach(button => {
        button.addEventListener('click', () => changeLanguage(button.dataset.language));
    });
    changeLanguage(HomepageLanguage.preferredLanguage(storage, navigator.languages || [navigator.language], new URLSearchParams(location.search).get('lang')));
});
