import { axisOptions, bindInputs, number, plotConfig, plotLayoutBase, readChecked, readNumber, renderPlot } from '../../assets/shared.js';

const alternatives = [
  { key: 'car', name: 'Car', cost: 8.5, asc: 0.4 },
  { key: 'transit', name: 'Transit', cost: 3.2, asc: 0.0 },
  { key: 'bike', name: 'Bike', cost: 0.4, asc: -0.2 },
];

const inputIds = ['beta-time', 'beta-cost', 'car-time', 'transit-time', 'bike-time', 'lock-axes'];

function softmax(values) {
  const max = Math.max(...values);
  const exp = values.map((value) => Math.exp(value - max));
  const total = exp.reduce((sum, value) => sum + value, 0);
  return exp.map((value) => value / total);
}

function currentRows() {
  const betaTime = readNumber('beta-time');
  const betaCost = readNumber('beta-cost');
  const utilities = alternatives.map((alt) => (
    alt.asc + betaTime * readNumber(`${alt.key}-time`) + betaCost * alt.cost
  ));
  const probabilities = softmax(utilities);
  return alternatives.map((alt, index) => ({
    ...alt,
    time: readNumber(`${alt.key}-time`),
    utility: utilities[index],
    probability: probabilities[index],
  }));
}

function renderMetrics(rows) {
  document.getElementById('metrics').innerHTML = rows.map((row) => `
    <div class="metric">
      <small>${row.name}</small>
      <strong>${number(row.probability * 100, 1)}%</strong>
    </div>
  `).join('');
}

function renderTable(rows) {
  document.getElementById('utility-table').innerHTML = rows.map((row) => `
    <tr>
      <td>${row.name}</td>
      <td>${number(row.time, 0)}</td>
      <td>${number(row.cost, 1)}</td>
      <td>${number(row.utility, 3)}</td>
      <td>${number(row.probability * 100, 1)}%</td>
    </tr>
  `).join('');
}

function render() {
  const rows = currentRows();
  const locked = readChecked('lock-axes');
  renderPlot('chart', [{
    type: 'bar',
    x: rows.map((row) => row.name),
    y: rows.map((row) => row.probability),
    marker: { color: ['#305c8a', '#759f6f', '#a96f4b'] },
    hovertemplate: '%{x}<br>Probability: %{y:.1%}<extra></extra>',
  }], {
    ...plotLayoutBase,
    ...axisOptions({
      locked,
      xRange: [-0.5, 2.5],
      yRange: [0, 1],
      xTitle: 'Alternative',
      yTitle: 'Choice probability',
      yaxis: { tickformat: '.0%' },
    }),
  }, plotConfig);
  renderMetrics(rows);
  renderTable(rows);
}

bindInputs(inputIds, render, {
  'beta-time': (value) => number(value, 3),
  'beta-cost': (value) => number(value, 2),
  'car-time': (value) => `${number(value, 0)} min`,
  'transit-time': (value) => `${number(value, 0)} min`,
  'bike-time': (value) => `${number(value, 0)} min`,
});
render();
