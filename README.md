# Mobigist Model Renderer

Static interactive model pages for Mobigist posts.

Each model is a standalone GitHub Pages-compatible page that can be embedded in
WordPress with an iframe or a future shortcode plugin.

## Structure

```text
assets/
  shared.css
  shared.js
models/
  manifest.json
  <model-slug>/
    index.html
    model.js
    style.css
    README.md
```

The root page reads `models/manifest.json` and renders the model cards from
that metadata. Add a model to the manifest when it should appear on the main
page.

## Embedding

Use the deployed GitHub Pages URL for each model folder:

```text
https://<user>.github.io/mobigist-model-renderer/models/traffic-flow/
```

The pages are static and use CDN-loaded Plotly for chart rendering.
