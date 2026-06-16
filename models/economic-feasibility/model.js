import { axisOptions, bindInputs, number, plotConfig, plotLayoutBase, readChecked, readNumber, renderPlot } from '../../assets/shared.js';

const inputIds = ['cost', 'benefit', 'discount-rate', 'duration', 'lock-axes'];

// Calculate NPV for a given rate
function calcNPV(cost, benefit, rate, duration) {
  let pvBenefit = 0;
  for (let t = 1; t <= duration; t++) {
    pvBenefit += benefit / Math.pow(1 + rate, t);
  }
  return {
    pvCost: cost,
    pvBenefit: pvBenefit,
    npv: pvBenefit - cost
  };
}

// Bisection method to estimate IRR
function calcIRR(cost, benefit, duration) {
  let low = 0.0;
  let high = 1.0;
  for (let i = 0; i < 50; i++) {
    let mid = (low + high) / 2;
    if (calcNPV(cost, benefit, mid, duration).npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

function renderMetrics(bc, npv, irr, fyrr) {
  const isViable = bc >= 1.0;
  const statusColor = isViable ? '#759f6f' : '#9d3b3b'; // Shared green/red
  
  document.getElementById('metrics').innerHTML = `
    <div class="metric"><small>B/C Ratio</small><strong style="color: ${statusColor}">${number(bc, 2)}</strong></div>
    <div class="metric"><small>NPV</small><strong style="color: ${statusColor}">${number(npv, 1)}</strong></div>
    <div class="metric"><small>IRR</small><strong>${number(irr * 100, 2)}%</strong></div>
    <div class="metric"><small>FYRR</small><strong>${number(fyrr * 100, 2)}%</strong></div>
  `;
}

function render() {
  const cost = readNumber('cost');
  const benefit = readNumber('benefit');
  const rate = readNumber('discount-rate') / 100;
  const duration = readNumber('duration');
  const locked = readChecked('lock-axes');

  const { pvCost, pvBenefit, npv } = calcNPV(cost, benefit, rate, duration);
  const bc = pvBenefit / pvCost;
  const irr = calcIRR(cost, benefit, duration);
  const fyrr = benefit / cost; // Assuming Year 1 benefit applies to total PV cost

  const years = Array.from({ length: duration + 1 }, (_, i) => i);
  let currentCumulative = -cost;
  const cumulativeData = [currentCumulative];
  
  for (let t = 1; t <= duration; t++) {
    currentCumulative += benefit / Math.pow(1 + rate, t);
    cumulativeData.push(currentCumulative);
  }

  const breakEvenTrace = {
    x: [0, duration],
    y: [0, 0],
    mode: 'lines',
    line: { color: '#dfd9cf', width: 2, dash: 'dash' },
    hoverinfo: 'skip'
  };

  const cumulativeTrace = {
    type: 'scatter',
    mode: 'lines',
    name: 'Cumulative NPV',
    x: years,
    y: cumulativeData,
    line: { color: '#305c8a', width: 3 },
    hovertemplate: 'Year %{x}<br>Cum. NPV: %{y:,.1f}<extra></extra>',
  };

  renderPlot('chart', [breakEvenTrace, cumulativeTrace], {
    ...plotLayoutBase,
    ...axisOptions({
      locked,
      xRange: [0, 50],
      yRange: [-5000, 10000],
      xTitle: 'Year',
      yTitle: 'Cumulative NPV',
    }),
    showlegend: false,
  }, plotConfig);

  renderMetrics(bc, npv, irr, fyrr);
}

bindInputs(inputIds, render, {
  cost: (value) => number(value, 0),
  benefit: (value) => number(value, 0),
  'discount-rate': (value) => `${number(value, 1)}%`,
  duration: (value) => `${number(value, 0)}`,
});
render();