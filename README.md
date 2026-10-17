# Feiyang Chen's academic homepage

**Visit the website: [https://chenerb.github.io/](https://chenerb.github.io/)**

A personal homepage for Feiyang Chen, an Information Engineering undergraduate at Shanghai Jiao Tong University. The page loads its text from Markdown and YAML files, so content changes do not require a build step.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser. Use this local server so the page can fetch the content files.

## Update the homepage

- Edit `contents/config.yml` to change the browser title, page title, name, subject, and footer text.
- Edit `contents/home.md`, `contents/research.md`, `contents/experience.md`, `contents/leadership.md`, and `contents/awards.md` to update the biography, education, skills, research projects, internships, student leadership, and awards.
- Update the email links directly in `index.html`.
- Replace `static/assets/img/photo.png` to change the portrait, or update its image path in `index.html`.
- Edit `static/css/main.css` for the homepage's visual styling. `static/css/styles.css` provides the underlying Bootstrap styles.

To add a section, create its Markdown file in `contents/`, add the matching section container and navigation link in `index.html`, and add its name to `section_names` in `static/js/scripts.js`.

After making changes, check the local page at both desktop and mobile widths. Push the changes to this repository to update the GitHub Pages site.

## Mathematics

MathJax's core is loaded locally from `static/js/tex-svg.js`. Optional TeX extensions are loaded on demand from the version-matched MathJax 3.2.2 CDN. The configuration lives in `index.html`.

Use `$...$` for inline mathematics and `$$...$$` for display mathematics. For LaTeX-style delimiters in Markdown, write `\\(...\\)` or `\\[...\\]`: double the delimiter backslashes so the Markdown parser preserves them for MathJax.

## Credits and license

This site is based on [Sen Li's personal academic website template](https://github.com/senli1073/senli1073.github.io). Its layout draws on [al-folio](https://alshedivat.github.io/al-folio/) as a design reference.

The original template's MIT license and Sen Li's copyright notice are retained in [LICENSE](LICENSE).

## Languages

The header provides a **中文 / EN** language switch. The first visit follows the browser's language; subsequent visits use the saved selection. A language switch preserves the current reading position and updates the complete page without reloading it.

- English content and profile configuration live in `contents/`.
- Chinese content and profile configuration live in `contents/zh/`, using the same filenames and section order. Chinese descriptions use formal résumé language and retain the same dates, responsibilities, and quantitative results as the English version.
- Navigation, accessibility labels, and feedback messages are maintained in the `copy` dictionary in `static/js/scripts.js`.
- Keep corresponding headings and paragraphs aligned in both languages so reading position can be preserved accurately.
- When changing JavaScript or CSS, update the asset version query in `index.html` to avoid stale GitHub Pages browser caches.

Run the language behavior checks with `node --test tests/*.test.cjs`. No package installation is required.

## Academic / Life pages

- [Academic homepage](https://chenerb.github.io/) keeps the résumé-oriented design.
- [Life homepage](https://chenerb.github.io/life.html) presents personal interests, with visual inspiration from [Seán Halpin](https://www.seanhalpin.xyz/) and original SVG illustrations.
- The **Academic / Life** links switch between independent pages and preserve the selected language via `?lang=zh` or `?lang=en`, including when browser storage is unavailable.
- Edit bilingual personal copy in `life.html`: `data-zh` and `data-en` contain matching translations; visible text is the Chinese no-JavaScript fallback.
- Life-page styles and interactions live in `static/css/life.css` and `static/js/life.js`. The academic page does not load these styles.
- Goals use explicit dates (December 2026 half marathon; 2027 standard-distance triathlon). Update these manually when plans change or goals are completed.
