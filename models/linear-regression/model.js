document.addEventListener("DOMContentLoaded", () => {
    const weightInput = document.getElementById('weight');
    const biasInput = document.getElementById('bias');
    const weightVal = document.getElementById('weight-val');
    const biasVal = document.getElementById('bias-val');
    const plotDiv = document.getElementById('plot');

    // 거리(x, km)와 소요 시간(y, 분)
    const distances = [1.2, 2.0, 2.5, 3.1, 4.0, 4.5, 5.2, 6.0, 7.5, 8.0];
    const actualTimes = [8, 9, 11, 10, 14, 12, 16, 15, 19, 17];

    function updatePlot() {
        const w = parseFloat(weightInput.value);
        const b = parseFloat(biasInput.value);
        
        weightVal.textContent = w.toFixed(1);
        biasVal.textContent = b.toFixed(1);

        const predictedTimes = distances.map(x => w * x + b);

        const scatterTrace = {
            x: distances,
            y: actualTimes,
            mode: 'markers',
            type: 'scatter',
            name: '실제 운행 데이터',
            marker: { size: 8, color: '#2c3e50' }
        };

        const lineTrace = {
            x: distances,
            y: predictedTimes,
            mode: 'lines',
            type: 'scatter',
            name: '예측 회귀선',
            line: { color: '#e74c3c', width: 2 }
        };

        const layout = {
            autosize: true, 
            margin: { t: 20, b: 40, l: 40, r: 20 },
            xaxis: { title: '운행 거리 (km)' },
            yaxis: { title: '소요 시간 (분)' },
            legend: { orientation: 'h', y: -0.2 }
        };

        const config = { responsive: true, displayModeBar: false };

        Plotly.react(plotDiv, [scatterTrace, lineTrace], layout, config);
    }

    weightInput.addEventListener('input', updatePlot);
    biasInput.addEventListener('input', updatePlot);

    updatePlot();
});