import React, { Component, PropTypes } from "react";
import CustomSeekBar from "../components/CustomSeekBar";
import { Bar } from "react-chartjs-2";

import { fetchSongWaveform } from "../actions/SongActions";
import { changeCurrentPercent, setIsSeeking } from "../actions/PlayerActions";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object,
    playSong: PropTypes.func.isRequired, //the function to load the song from the given playlist and play it.
    song: PropTypes.object.isRequired,
    songId: PropTypes.number.isRequired
};

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

class WaveformSeekBar extends Component {
    constructor(props) {
        super(props);
        const { dispatch, song, songId } = this.props;
        if (!song.waveform) {
            dispatch(fetchSongWaveform(songId, song));
        }

        this.state = {
            waveformData: {
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
                   data: empty
               }]
            }
        };
        this.chartPostDraw = this.chartPostDraw.bind(this);
        this.chartPostEvent = this.chartPostEvent.bind(this);
        this.handleOnSeek = this.handleOnSeek.bind(this);
        this.handleSeekFinished = this.handleSeekFinished.bind(this);
    }
    componentDidMount() {
        //this.chart.
    }
    componentWillReceiveProps(nextProps) {
        const { song } = nextProps;
        const { waveformData } = this.state;
        const { waveform } = song;
        if (waveform) {
            this.setState({
                waveformData: {
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
                }
            });
        }
    }
    chartPostDraw(chartInstance, easing) {
        console.log("drawing after");
        const { player } = this.props;
        const { percent } = player;
        let ctx = chartInstance.chart.ctx;
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        //ctx.rect(0, 0, chartInstance.chart.canvas.width * percent, chartInstance.chart.canvas.height);
        ctx.rect(0, 0, 100, 100);
        ctx.fill();
        ctx.restore();

    }
    chartPostEvent(chartInstance, event) {

    }

    handleOnSeek(percent) {
        const { dispatch, playSong, player, song } = this.props;
        if (!player.isSeeking) {
            dispatch(setIsSeeking(true));
        }
        if (isNaN(percent)) {
            throw new Error("encountered NaN on seek");
        }
        playSong(percent);
    }

    handleSeekFinished(percent) {
        const { dispatch, player, songId } = this.props;
        dispatch(setIsSeeking(false));
    }

    render() {
        const { player, song } = this.props;
        const { percent } = player;
        const { waveformData } = this.state;
        return (
            <CustomSeekBar
                className="song-waveform"
                initialProgress={percent}
                isVertical={false}
                onSeek={this.handleOnSeek}
                seekFinished={this.handleSeekFinished}
            >
                <Bar
                    data={waveformData}
                    options={chartOptions}
                    ref={(chart) => { this.chart = chart; }}
                />
            </CustomSeekBar>
        );
    }
}

WaveformSeekBar.propTypes = propTypes;

export default WaveformSeekBar;
