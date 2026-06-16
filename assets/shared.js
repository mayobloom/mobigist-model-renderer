export function readNumber(id) {
  return Number(document.getElementById(id).value);
}

export function readChecked(id) {
  return document.getElementById(id)?.checked ?? false;
}

export function syncOutput(id, formatter = (value) => value) {
  const input = document.getElementById(id);
  const output = document.querySelector(`[data-output="${id}"]`);
  if (input && output) output.textContent = formatter(Number(input.value));
}

export function bindInputs(ids, render, formatters = {}) {
  ids.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    const update = () => {
      syncOutput(id, formatters[id]);
      render();
    };
    input.addEventListener('input', update);
    input.addEventListener('change', update);
    syncOutput(id, formatters[id]);
  });
}

export function number(value, digits = 2) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

export function integer(value) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });
}

export const plotConfig = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ['lasso2d', 'select2d'],
};

export const plotLayoutBase = {
  paper_bgcolor: '#fbfaf7',
  plot_bgcolor: '#ffffff',
  margin: { l: 54, r: 24, t: 28, b: 50 },
  font: {
    family: 'Inter, system-ui, sans-serif',
    size: 12,
    color: '#26231f',
  },
  xaxis: {
    gridcolor: '#eee9e1',
    zerolinecolor: '#d8d1c8',
  },
  yaxis: {
    gridcolor: '#eee9e1',
    zerolinecolor: '#d8d1c8',
  },
};

export function axisOptions({
  locked,
  xRange,
  yRange,
  xTitle,
  yTitle,
  xaxis = {},
  yaxis = {},
}) {
  const xLock = locked ? { range: xRange, autorange: false } : { autorange: true };
  const yLock = locked ? { range: yRange, autorange: false } : { autorange: true };

  return {
    xaxis: {
      ...plotLayoutBase.xaxis,
      ...xaxis,
      title: xTitle,
      ...xLock,
    },
    yaxis: {
      ...plotLayoutBase.yaxis,
      ...yaxis,
      title: yTitle,
      ...yLock,
    },
  };
}

function axisRelayout(layout) {
  return Object.entries(layout).reduce((updates, [axisName, axis]) => {
    if (!/^[xy]axis\d*$/.test(axisName) || !axis) return updates;

    if (axis.autorange === true) {
      updates[`${axisName}.autorange`] = true;
    } else if (Array.isArray(axis.range)) {
      updates[`${axisName}.autorange`] = false;
      updates[`${axisName}.range`] = axis.range;
    }

    return updates;
  }, {});
}

export function renderPlot(target, traces, layout, config = plotConfig) {
  return Plotly.react(target, traces, layout, config).then((plot) => {
    const updates = axisRelayout(layout);
    if (Object.keys(updates).length === 0) return plot;
    return Plotly.relayout(plot, updates);
  });
}
