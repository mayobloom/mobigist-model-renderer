import { bindInputs, integer, number, plotConfig, plotLayoutBase, readNumber } from '../../assets/shared.js';

const inputIds = ['demand', 'order-cost', 'holding-cost', 'unit-cost', 'lead-time'];

function eoq(D, S, H) {
  return Math.sqrt((2 * D * S) / H);
}

function totalCost(Q, D, S, H, C) {
  return D * C + (D / Q) * S + (Q / 2) * H;
}

function render() {
  const D = readNumber('demand');
  const S = readNumber('order-cost');
  const H = readNumber('holding-cost');
  const C = readNumber('unit-cost');
  const L = readNumber('lead-time');
  const qStar = eoq(D, S, H);
  const minQ = Math.max(1, qStar * 0.2);
  const maxQ = qStar * 2.5;
  const steps = 90;
  const quantities = Array.from({ length: steps }, (_, index) => minQ + ((maxQ - minQ) * index) / (steps - 1));
  const costs = quantities.map((Q) => totalCost(Q, D, S, H, C));
  const rop = (D / 365) * L;

  Plotly.react('chart', [
    {
      type: 'scatter',
      mode: 'lines',
      name: 'Total annual cost',
      x: quantities,
      y: costs,
      line: { color: '#305c8a', width: 3 },
      hovertemplate: 'Q: %{x:.0f}<br>Cost: %{y:,.0f}<extra></extra>',
    },
    {
      type: 'scatter',
      mode: 'markers',
      name: 'EOQ',
      x: [qStar],
      y: [totalCost(qStar, D, S, H, C)],
      marker: { color: '#9d3b3b', size: 10 },
      hovertemplate: 'EOQ: %{x:.0f}<br>Cost: %{y:,.0f}<extra></extra>',
    },
  ], {
    ...plotLayoutBase,
    xaxis: { ...plotLayoutBase.xaxis, title: 'Order quantity Q' },
    yaxis: { ...plotLayoutBase.yaxis, title: 'Total annual cost' },
    showlegend: false,
  }, plotConfig);

  document.getElementById('metrics').innerHTML = `
    <div class="metric"><small>EOQ</small><strong>${integer(qStar)}</strong></div>
    <div class="metric"><small>Orders/year</small><strong>${number(D / qStar, 1)}</strong></div>
    <div class="metric"><small>Reorder point</small><strong>${integer(rop)}</strong></div>
  `;
}

bindInputs(inputIds, render, {
  demand: integer,
  'order-cost': (value) => `$${integer(value)}`,
  'holding-cost': (value) => `$${integer(value)}`,
  'unit-cost': (value) => `$${integer(value)}`,
  'lead-time': (value) => `${integer(value)} days`,
});
render();
