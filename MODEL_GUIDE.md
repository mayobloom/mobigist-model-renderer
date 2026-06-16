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

8. Add the model to `models/manifest.json` so it appears on the main page.

   ```json
   {
     "slug": "linear-regression",
     "category": "Mobility Data Analysis",
     "title": "Simple Linear Regression",
     "description": "Explore how slope and intercept affect prediction error."
   }
   ```

   Keep `slug` identical to the folder name under `models/`.

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
    <aside class="controls">
      <p class="formula">y = f(x; parameters)</p>
      ...
    </aside>
    <section class="chart-panel">
      <div id="chart" class="chart"></div>
      <div id="metrics" class="metric-grid"></div>
    </section>
  </section>
</main>
```

Match the existing page language, indentation, control structure, typography,
and spacing conventions unless a model has an explicit reason to differ. Prefer
shared control markup:

```html
<div class="control-group">
  <div class="control-row">
    <label for="alpha">Alpha</label>
    <output data-output="alpha"></output>
  </div>
  <input id="alpha" type="range" min="0" max="1" step="0.01" value="0.5">
</div>
```

Keep model-specific CSS limited to truly model-specific additions. Do not
override shared control typography, spacing, alignment, or chart sizing unless
the model README documents why.

When a model has a compact core formula, show it near the top of `.controls`
using the shared `.formula` pattern.

## Shared Helpers

Use helpers from `assets/shared.js`:

- `readNumber(id)`
- `syncOutput(id, formatter)`
- `bindInputs(ids, render, formatters)`
- `number(value, digits)`
- `integer(value)`
- `plotConfig`
- `plotLayoutBase`
- `readChecked(id)`
- `axisOptions(options)`
- `renderPlot(target, traces, layout, config)`

Load each model script as an ES module:

```html
<script type="module" src="./model.js"></script>
```

Import shared helpers explicitly in `model.js`. Do not load
`../../assets/shared.js` as a plain non-module script.

Example:

```js
import { bindInputs, number, plotConfig, plotLayoutBase, readNumber, renderPlot } from '../../assets/shared.js';

function render() {
  const alpha = readNumber('alpha');
  renderPlot('chart', traces, layout, plotConfig);
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

Use the shared `renderPlot()` helper rather than direct `Plotly.react()` or
`Plotly.newPlot()` calls inside repeated render functions.

Use shared layout defaults:

```js
renderPlot('chart', traces, {
  ...plotLayoutBase,
  xaxis: { ...plotLayoutBase.xaxis, title: 'X label' },
  yaxis: { ...plotLayoutBase.yaxis, title: 'Y label' },
}, plotConfig);
```

Use shared `plotConfig` for Plotly charts unless a model has a documented reason
to override it in `README.md`. Use shared `renderPlot()` instead of direct
`Plotly.react()` calls so common axis behavior is applied consistently.

For Plotly charts, include a shared axis lock control:

```html
<label class="checkbox-row" for="lock-axes">
  <input id="lock-axes" type="checkbox" checked>
  Lock x/y axes
</label>
```

Then pass model-specific fixed ranges through `axisOptions()`:

```js
const locked = readChecked('lock-axes');

renderPlot('chart', traces, {
  ...plotLayoutBase,
  ...axisOptions({
    locked,
    xRange: [0, 100],
    yRange: [0, 1],
    xTitle: 'X label',
    yTitle: 'Y label',
  }),
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

Confirm the root page shows the new model card from `models/manifest.json`.

For JavaScript syntax checks:

```bash
node --check assets/shared.js
node --check models/<slug>/model.js
```
