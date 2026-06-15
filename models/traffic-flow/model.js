import { bindInputs, integer, number, plotConfig, plotLayoutBase, readNumber } from '../../assets/shared.js';

const inputIds = ['free-speed', 'jam-density', 'critical-density', 'greenberg-c'];
const modelSelect = document.getElementById('model');
const equations = {
  greenshields: 'v = vf * (1 - k / kj)',
  greenberg: 'v = c * ln(kj / k)',
  underwood: 'v = vf * exp(-k / k0)',
};

function densityGrid(kj) {
  return Array.from({ length: 120 }, (_, index) => {
    const ratio = (index + 1) / 121;
    return Math.max(0.1, ratio * kj);
  });
}

function speed(model, k, params) {
  if (model === 'greenshields') {
    return Math.max(0, params.vf * (1 - k / params.kj));
  }
  if (model === 'greenberg') {
    return Math.max(0, params.c * Math.log(params.kj / k));
  }
  return Math.max(0, params.vf * Math.exp(-k / params.k0));
}

function argMax(values) {
  return values.reduce((best, value, index) => (value > values[best] ? index : best), 0);
}

function render() {
  const model = modelSelect.value;
  const params = {
    vf: readNumber('free-speed'),
    kj: readNumber('jam-density'),
    k0: readNumber('critical-density'),
    c: readNumber('greenberg-c'),
  };
  const k = densityGrid(params.kj);
  const v = k.map((density) => speed(model, density, params));
  const q = k.map((density, index) => density * v[index]);
  const bestIndex = argMax(q);

  document.getElementById('equation').textContent = equations[model];

  Plotly.react('speed-chart', [{
    type: 'scatter',
    mode: 'lines',
    x: k,
    y: v,
    line: { color: '#305c8a', width: 3 },
    hovertemplate: 'Density: %{x:.1f}<br>Speed: %{y:.1f}<extra></extra>',
  }], {
    ...plotLayoutBase,
    margin: { ...plotLayoutBase.margin, t: 22 },
    xaxis: { ...plotLayoutBase.xaxis, title: 'Density k (veh/km)' },
    yaxis: { ...plotLayoutBase.yaxis, title: 'Speed v (km/h)' },
    showlegend: false,
  }, plotConfig);

  Plotly.react('flow-chart', [
    {
      type: 'scatter',
      mode: 'lines',
      x: k,
      y: q,
      line: { color: '#759f6f', width: 3 },
      hovertemplate: 'Density: %{x:.1f}<br>Flow: %{y:.0f}<extra></extra>',
    },
    {
      type: 'scatter',
      mode: 'markers',
      x: [k[bestIndex]],
      y: [q[bestIndex]],
      marker: { color: '#9d3b3b', size: 10 },
      hovertemplate: 'Capacity density: %{x:.1f}<br>Capacity: %{y:.0f}<extra></extra>',
    },
  ], {
    ...plotLayoutBase,
    margin: { ...plotLayoutBase.margin, t: 22 },
    xaxis: { ...plotLayoutBase.xaxis, title: 'Density k (veh/km)' },
    yaxis: { ...plotLayoutBase.yaxis, title: 'Flow q (veh/h)' },
    showlegend: false,
  }, plotConfig);

  document.getElementById('metrics').innerHTML = `
    <div class="metric"><small>Capacity</small><strong>${integer(q[bestIndex])}</strong></div>
    <div class="metric"><small>Critical density</small><strong>${number(k[bestIndex], 1)}</strong></div>
    <div class="metric"><small>Speed at capacity</small><strong>${number(v[bestIndex], 1)}</strong></div>
  `;
}

modelSelect.addEventListener('change', render);
bindInputs(inputIds, render, {
  'free-speed': (value) => `${integer(value)} km/h`,
  'jam-density': (value) => `${integer(value)} veh/km`,
  'critical-density': (value) => `${integer(value)} veh/km`,
  'greenberg-c': (value) => `${integer(value)} km/h`,
});
render();
