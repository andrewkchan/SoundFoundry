import React, { Component, PropTypes } from "react";
import { Line } from "react-chartjs-2";

const propTypes = {
    player: PropTypes.object.isRequired,
    className: PropTypes.string,
    inverted: PropTypes.bool
};

var randNumber0 = function() {
    return ( Math.floor(Math.random() * 11) + 10);
};
var randNumber1 = function() {
    return ( Math.floor(Math.random() * 10) + 9);
};
var randNumber2 = function() {
    return ( Math.round(Math.random() * 9) + 8);
};

const sectionPlot0 = {
   labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', ''],
   datasets: [{
       label: "White",
       backgroundColor: '#FFFFFF',
       borderColor: '#FFFFFF',
       pointBackgroundColor: '#FFFFFF',
       pointBorderColor: '#EDEDED',
       pointRadius: 0,
       borderWidth: 1,
       lineTension: 0.2,
       data: [randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2(), randNumber2()]
   }, {
       label: "Light",
       backgroundColor: '#ADF4E4',
       borderColor: '#ADF4E4',
       pointBackgroundColor: '#FFFFFF',
       pointBorderColor: '#B2F4E5',
       pointRadius: 0,
       borderWidth: 1,
       lineTension: 0.2,
       data: [randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1(), randNumber1()]
   }, {
       label: "Dark",
       backgroundColor: '#FEE2EA',
       borderColor: '#FEE2EA',
       pointBackgroundColor: '#FFFFFF',
       pointBorderColor: '#DDDDDD',
       pointRadius: 0,
       borderWidth: 0.5,
       lineTension: 0.2,
       data: [randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0(), randNumber0()]
   }]
};

const chartOptions = {
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

class CoolChart extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { player } = this.props;
        return (
            <Line data={sectionPlot0} options={chartOptions} height={50} />
        );
    }
}

export default CoolChart;
