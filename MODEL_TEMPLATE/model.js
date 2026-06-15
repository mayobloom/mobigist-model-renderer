import { bindInputs, number, plotConfig, plotLayoutBase, readNumber } from '../../assets/shared.js';

const inputIds = ['alpha', 'beta'];

function series(alpha, beta) {
  const x = Array.from({ length: 101 }, (_, index) => index / 10);
  const y = x.map((value) => alpha + beta * value);
  return { x, y };
}

function renderMetrics(alpha, beta) {
  document.getElementById('metrics').innerHTML = `
    <div class="metric"><small>Alpha</small><strong>${number(alpha, 2)}</strong></div>
    <div class="metric"><small>Beta</small><strong>${number(beta, 2)}</strong></div>
    <div class="metric"><small>y at x=10</small><strong>${number(alpha + beta * 10, 2)}</strong></div>
  `;
}

function render() {
  const alpha = readNumber('alpha');
  const beta = readNumber('beta');
  const data = series(alpha, beta);

  Plotly.react('chart', [{
    type: 'scatter',
    mode: 'lines',
    x: data.x,
    y: data.y,
    line: { color: '#305c8a', width: 3 },
    hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}<extra></extra>',
  }], {
    ...plotLayoutBase,
    xaxis: { ...plotLayoutBase.xaxis, title: 'x' },
    yaxis: { ...plotLayoutBase.yaxis, title: 'y' },
    showlegend: false,
  }, plotConfig);

  renderMetrics(alpha, beta);
}

bindInputs(inputIds, render, {
  alpha: (value) => number(value, 1),
  beta: (value) => number(value, 1),
});
render();
