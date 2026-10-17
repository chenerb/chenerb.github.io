/* Keep language selection and async request ordering independent of the DOM. */
globalThis.HomepageLanguage = (() => {
    const storageKey = 'homepage-language';
    const supported = language => language === 'en' || language === 'zh';
    function preferredLanguage(storage, languages = [], explicitLanguage) {
        if (supported(explicitLanguage)) return explicitLanguage;
        try {
            const saved = storage?.getItem(storageKey);
            if (supported(saved)) return saved;
        } catch { /* Storage may be disabled in private browsing. */ }
        return String(languages[0] || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
    }
    function createSwitcher({ load, apply, pending = () => {}, failed = () => {}, remember = () => {} }) {
        let revision = 0;
        return {
            async change(language) {
                if (!supported(language)) return false;
                const request = ++revision;
                pending(true, language);
                try {
                    const bundle = await load(language);
                    if (request !== revision) return false;
                    apply(bundle, language);
                    try { remember(language); } catch { /* Switching works without persistence. */ }
                    return true;
                } catch (error) {
                    if (request === revision) failed(error, language);
                    return false;
                } finally {
                    if (request === revision) pending(false, language);
                }
            }
        };
    }
    return { storageKey, preferredLanguage, createSwitcher };
})();
