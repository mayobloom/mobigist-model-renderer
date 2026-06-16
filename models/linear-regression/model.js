import {
  axisOptions,
  bindInputs,
  number,
  plotConfig,
  plotLayoutBase,
  readChecked,
  readNumber,
  renderPlot
} from '../../assets/shared.js';

const inputIds = ['weight', 'bias', 'lock-axes'];

document.addEventListener('DOMContentLoaded', () => {
  const plotDiv = document.getElementById('plot');

  // Distance (x, km) and travel time (y, min).
  const distances = [1.2, 2.0, 2.5, 3.1, 4.0, 4.5, 5.2, 6.0, 7.5, 8.0];
  const actualTimes = [8, 9, 11, 10, 14, 12, 16, 15, 19, 17];

  function updatePlot() {
    const w = readNumber('weight');
    const b = readNumber('bias');

    const lineX = [0, 9];
    const predictedTimes = lineX.map((x) => w * x + b);

    const scatterTrace = {
      x: distances,
      y: actualTimes,
      mode: 'markers',
      type: 'scatter',
      name: 'Observed trips',
      marker: { size: 8, color: '#2c3e50' },
    };

    const lineTrace = {
      x: lineX,
      y: predictedTimes,
      mode: 'lines',
      type: 'scatter',
      name: 'Prediction line',
      line: { color: '#e74c3c', width: 2 },
    };

    const layout = {
      ...plotLayoutBase,
      margin: { t: 20, b: 40, l: 40, r: 20 },
      ...axisOptions({
        locked: readChecked('lock-axes'),
        xRange: [0, 9],
        yRange: [-5, 50],
        xTitle: 'Trip distance (km)',
        yTitle: 'Travel time (min)',
      }),
      legend: { orientation: 'h', y: -0.2 },
    };

    renderPlot(plotDiv, [scatterTrace, lineTrace], layout, plotConfig);
  }

  bindInputs(inputIds, updatePlot, {
    weight: (value) => number(value, 1),
    bias: (value) => number(value, 1),
  });
  updatePlot();
});
