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
  multinomial-logit/
  eoq/
  traffic-flow/
```

## Embedding

Use the deployed GitHub Pages URL for each model folder:

```text
https://<user>.github.io/mobigist-model-renderer/models/traffic-flow/
```

The pages are static and use CDN-loaded Plotly for chart rendering.
