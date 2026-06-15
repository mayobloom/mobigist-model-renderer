# Agent Instructions

This repository contains static interactive model pages for Mobigist posts.

## Primary Goals

- Build standalone static model pages that work on GitHub Pages.
- Keep pages iframe-friendly for WordPress embedding.
- Prefer plain HTML, CSS, and JavaScript with CDN libraries.
- Do not introduce build tools, package managers, bundlers, or frameworks unless explicitly requested.
- Keep each model self-contained under `models/<model-slug>/`.

## Repository Structure

```text
assets/
  shared.css
  shared.js
models/
  <model-slug>/
    index.html
    model.js
    style.css
    README.md
    data/ optional
MODEL_TEMPLATE/
  index.html
  model.js
  style.css
  README.md
```

## Model Page Requirements

Every model page should:

- Load `../../assets/shared.css`.
- Load Plotly from CDN unless another library is clearly better.
- Import shared helpers from `../../assets/shared.js`.
- Use `.model-shell` as the page root.
- Include `.model-header` with `.eyebrow`, `h1`, and `.lede`.
- Use `.workspace`, `.controls`, and `.chart-panel` for the main layout.
- Render charts into `.chart` elements.
- Use stable element IDs for controls and chart containers.
- Be responsive on mobile and avoid horizontal overflow.
- Keep controls usable inside a WordPress iframe.

## Coding Rules

- Use semantic HTML and accessible labels for all controls.
- Keep model formulas and assumptions in each model `README.md`.
- Store sample datasets under `data/` when needed.
- Use lowercase kebab-case slugs, for example `queue-mm1` or `logit-mode-choice`.
- Avoid global CSS changes outside model-specific `style.css` unless the change is reusable across all models.
- Avoid duplicating helpers already available in `assets/shared.js`.
- Do not commit generated build output.

## WordPress Embed Compatibility

Model pages are commonly embedded with:

```text
https://mayobloom.github.io/mobigist-model-renderer/models/<model-slug>/
```

When designing pages:

- Avoid fixed viewport heights.
- Keep important controls near the top.
- Prefer responsive chart heights from shared CSS.
- Make slider, select, and button controls touch-friendly.
- Ensure the page remains useful when displayed in a 520-760px tall iframe.

## Validation

Before finishing changes:

- Run `node --check` on every changed `.js` file.
- If a local server is available, test with `python3 -m http.server 8090`.
- Check desktop and mobile widths when UI changes are significant.
