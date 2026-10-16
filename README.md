<!-- BEGIN public-repo-header -->
<div align="center">

# ai-explorer-framework

<a href="https://github.com/blackmath88/ai-explorer-framework/tree/main/docs"><img alt="Documentation" src="https://img.shields.io/badge/docs-guide-16796f?style=flat"></a>
<a href="https://github.com/blackmath88/ai-explorer-framework/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/blackmath88/ai-explorer-framework?style=flat&amp;color=737373"></a>

</div>
<!-- END public-repo-header -->

Static GitHub Pages viewer for the **AI Explorer Framework**, driven entirely by JSON files in `docs/data`.

## Content model (source of truth)

- `docs/data/framework-working-space.json` = untouched reference source.
- `docs/data/framework-overview.json` = entry point for the viewer (identity, north star, principles, phases, module index, selected proof IDs, roadmap).
- `docs/data/framework-map.json` = phase and stage structure.
- `docs/data/glossary.json` = lightweight framework terms.
- `docs/data/modules/*.json` = module detail files (purpose, rationale, phase fit, principles, methods, maturity, related links).
- `docs/data/patterns/*.json` = reusable operating patterns derived conservatively from source.
- `docs/data/exercises/*.json` = runnable exercises derived from activity library.
- `docs/data/cases/*.json` = proof-point case files with confidence/caution preserved.

## Local preview

Run a static server from repo root:

```bash
python3 -m http.server 8000
```

Open: <http://localhost:8000/docs/>

## GitHub Pages publish (/docs)

1. Push repository to GitHub.
2. Go to **Settings → Pages**.
3. Set:
   - **Source**: Deploy from a branch
   - **Branch**: main (or default)
   - **Folder**: `/docs`
4. Save.

The site is fully static (vanilla HTML/CSS/JS, no backend).
