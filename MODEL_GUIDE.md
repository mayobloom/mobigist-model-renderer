# Model Implementation Guide

This guide is for adding new interactive model pages to the Mobigist model
renderer.

## Add A New Model

1. Choose a short lowercase slug.

   ```text
   queue-mm1
   logit-mode-choice
   traffic-assignment
   regression-residuals
   ```

2. Create a folder under `models/`.

   ```text
   models/<slug>/
     index.html
     model.js
     style.css
     README.md
   ```

3. Start from `MODEL_TEMPLATE/`.

4. Add controls in `index.html`.

5. Implement formulas and rendering in `model.js`.

6. Keep model-specific visual adjustments in `style.css`.

7. Document assumptions, parameters, and formulas in `README.md`.

## Recommended Page Pattern

Use this layout:

```html
<main class="model-shell">
  <header class="model-header">
    <p class="eyebrow">Domain</p>
    <h1>Model Name</h1>
    <p class="lede">Short explanation.</p>
  </header>

  <section class="workspace">
    <aside class="controls">...</aside>
    <section class="chart-panel">
      <div id="chart" class="chart"></div>
      <div id="metrics" class="metric-grid"></div>
    </section>
  </section>
</main>
```

## Shared Helpers

Use helpers from `assets/shared.js`:

- `readNumber(id)`
- `syncOutput(id, formatter)`
- `bindInputs(ids, render, formatters)`
- `number(value, digits)`
- `integer(value)`
- `plotConfig`
- `plotLayoutBase`

Example:

```js
import { bindInputs, number, plotConfig, plotLayoutBase, readNumber } from '../../assets/shared.js';

function render() {
  const alpha = readNumber('alpha');
  Plotly.react('chart', traces, layout, plotConfig);
}

bindInputs(['alpha'], render, {
  alpha: (value) => number(value, 2),
});
render();
```

## Data Files

If a model needs sample observations, place them under `data/`.

```text
models/regression-demo/
  data/
    default.csv
    outliers.json
```

Use CSV for simple tabular data and JSON when metadata or multiple series are
needed.

Do not place private, licensed, or personal data in this public GitHub Pages
repo.

## Plotly Guidance

Use Plotly by default:

```html
<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
```

Use `Plotly.react()` rather than `Plotly.newPlot()` inside repeated render
functions.

Use shared layout defaults:

```js
Plotly.react('chart', traces, {
  ...plotLayoutBase,
  xaxis: { ...plotLayoutBase.xaxis, title: 'X label' },
  yaxis: { ...plotLayoutBase.yaxis, title: 'Y label' },
}, plotConfig);
```

## WordPress Embedding

After GitHub Pages deploys, a model can be embedded in WordPress with:

```text
[interactive_graph src="https://mayobloom.github.io/mobigist-model-renderer/models/<slug>/" height="680" mobile_height="540"]
```

Keep model pages usable inside an iframe. If content is tall, WordPress allows
internal iframe scrolling by default.

## Local Testing

Run a simple static server from the repo root:

```bash
python3 -m http.server 8090
```

Open:

```text
http://localhost:8090/
http://localhost:8090/models/<slug>/
```

For JavaScript syntax checks:

```bash
node --check assets/shared.js
node --check models/<slug>/model.js
```
