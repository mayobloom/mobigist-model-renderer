export function readNumber(id) {
  return Number(document.getElementById(id).value);
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
    input.addEventListener('input', () => {
      syncOutput(id, formatters[id]);
      render();
    });
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
