

# Feiyang Chen's academic homepage

A personal homepage for Feiyang Chen, an Information Engineering undergraduate at Shanghai Jiao Tong University. The page loads its text from Markdown and YAML files, so content changes do not require a build step.

## Preview locally

From the repository root, run:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser. Use this local server so the page can fetch the content files.

## Update the homepage

- Edit `contents/config.yml` to change the browser title, page title, name, subject, and footer text.
- Edit `contents/home.md`, `contents/publications.md`, and `contents/awards.md` to update the biography, research interests, education, publications, and awards.
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
