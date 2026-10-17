const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function api() {
    const file = path.join(__dirname, '../static/js/language.js');
    const context = {};
    if (fs.existsSync(file)) vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
    assert.ok(context.HomepageLanguage, 'Language switching is not implemented');
    return context.HomepageLanguage;
}
function deferred() {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
}
test('saved preference wins over browser language; unsupported preferences fall back safely', () => {
    const { preferredLanguage } = api();
    assert.equal(preferredLanguage({ getItem: () => 'en' }, ['zh-CN']), 'en');
    assert.equal(preferredLanguage({ getItem: () => 'zh' }, ['en-US']), 'zh');
    assert.equal(preferredLanguage({ getItem: () => 'fr' }, ['zh-TW']), 'zh');
    assert.equal(preferredLanguage({ getItem: () => null }, ['fr-FR', 'en']), 'en');
});
test('blocked storage still allows browser-language detection', () => {
    assert.equal(api().preferredLanguage({ getItem() { throw new Error('blocked'); } }, ['zh-CN']), 'zh');
});
test('language changes only after the complete requested content is ready', async () => {
    const gate = deferred(); let visible = 'English'; let saved;
    const switcher = api().createSwitcher({ load: () => gate.promise, apply: b => { visible = b; }, remember: l => { saved = l; } });
    const pending = switcher.change('zh');
    assert.equal(visible, 'English');
    gate.resolve('中文'); await pending;
    assert.equal(visible, '中文'); assert.equal(saved, 'zh');
});
test('a late response cannot overwrite the most recent language choice', async () => {
    const gates = { zh: deferred(), en: deferred() }; let visible, saved;
    const switcher = api().createSwitcher({ load: l => gates[l].promise, apply: b => { visible = b; }, remember: l => { saved = l; } });
    const old = switcher.change('zh'); const latest = switcher.change('en');
    gates.en.resolve('English'); await latest;
    gates.zh.resolve('中文'); await old;
    assert.equal(visible, 'English'); assert.equal(saved, 'en');
});
test('failed translation preserves current content and preference, and can be retried', async () => {
    let fail = true, visible = 'English', saved = 'en', errors = 0;
    const switcher = api().createSwitcher({ load: async () => { if (fail) throw new Error('HTTP 503'); return '中文'; }, apply: b => { visible = b; }, remember: l => { saved = l; }, failed: () => { errors++; } });
    await switcher.change('zh');
    assert.equal(visible, 'English'); assert.equal(saved, 'en'); assert.equal(errors, 1);
    fail = false; await switcher.change('zh');
    assert.equal(visible, '中文'); assert.equal(saved, 'zh');
});
test('storage write failure does not turn a successful switch into a content error', async () => {
    let visible, errors = 0;
    const switcher = api().createSwitcher({ load: async () => '中文', apply: b => { visible = b; }, remember() { throw new Error('blocked'); }, failed: () => { errors++; } });
    await switcher.change('zh');
    assert.equal(visible, '中文'); assert.equal(errors, 0);
});
test('obsolete failures do not show errors or clear the current loading state', async () => {
    const gates = { zh: deferred(), en: deferred() }; let busy, errors = 0;
    const switcher = api().createSwitcher({ load: l => gates[l].promise, apply() {}, pending: state => { busy = state; }, failed: () => { errors++; } });
    const old = switcher.change('zh'); const latest = switcher.change('en');
    gates.zh.reject(new Error('old failure')); await old;
    assert.equal(errors, 0); assert.equal(busy, true);
    gates.en.resolve('English'); await latest; assert.equal(busy, false);
});
test('explicit page-link language survives navigation even with blocked storage', () => {
    const { preferredLanguage } = api();
    const blocked = { getItem() { throw new Error('blocked'); } };
    assert.equal(preferredLanguage(blocked, ['en-US'], 'zh'), 'zh');
    assert.equal(preferredLanguage({ getItem: () => 'zh' }, ['zh-CN'], 'en'), 'en');
    assert.equal(preferredLanguage({ getItem: () => 'zh' }, ['en'], 'invalid'), 'zh');
});
