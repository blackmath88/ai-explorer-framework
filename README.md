# ai-explorer-framework

A static, JSON-driven framework site designed for GitHub Pages.

## Project structure

- `docs/index.html` – page shell and app mounting points
- `docs/styles.css` – base styles
- `docs/app.js` – vanilla JS renderer that reads JSON data
- `docs/data/` – source-of-truth content files and extension folders

## Local preview

Because the app loads JSON files, run a local static server from the repo root:

```bash
python3 -m http.server 8000
```

Then open:

- <http://localhost:8000/docs/>

## Publish on GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/docs`
3. Save and wait for deployment.

Your site will publish from the `docs/` directory.
