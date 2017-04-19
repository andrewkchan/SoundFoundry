import Chart from "chart.js";

const chartOptions = {
    animation: false,
    maintainAspectRatio: false,
    legend: {
        display: false
    },
    tooltips: {
        enabled: false
    },
    scales: {
        yAxes: [{
            display: false
        }],
        xAxes: [{
            display: false
        }]
    }
};
const empty = Array.apply(null, new Array(100)).map(Number.prototype.valueOf, 0);
const emptyLabels = Array.apply(null, new Array(100)).map(() => { return ""; });

const getCanvas = function(width, height) {
    let canvas = null;
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.style.display = "none";
        document.body.append(canvas);
    }
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

export function getWaveformImageUrl(waveform, width, height) {
    const ctx = getCanvas(width, height).getContext("2d");
    const waveformData = {
        labels: emptyLabels,
        datasets: [{
            label: "White",
            backgroundColor: '#ADF4E4',
            borderColor: '#ADF4E4',
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#B2F4E5',
            pointRadius: 0,
            borderWidth: 1,
            lineTension: 0.2,
            data: waveform.samples
        }]
   };
   const chart = new Chart(ctx, {
       type: "bar",
       data: waveformData,
       options: chartOptions
   });
   let output = chart.toBase64Image();
   return output;
}

export function plotWaveform(waveform, canvas) {
    const ctx = canvas.getContext("2d");
    const points = waveform.samples;
    const spacingW = 2;
    const pointW = (canvas.offsetWidth / points.length);
    const barW = pointW - spacingW;
    const maxPoint = points.reduce((a, b) => { return Math.max(a,b); });

    ctx.fillStyle = "#ADF4E4";
    points.forEach((amplitude, i) => {
        ctx.fillRect(pointW * i, canvas.offsetHeight, barW, -(amplitude / maxPoint) * canvas.offsetHeight);
    });
}
