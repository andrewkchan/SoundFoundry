import React, { Component, PropTypes } from "react";
import CustomSeekBar from "../components/CustomSeekBar";
import Waveform from "../utils/waveform";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object,
    song: PropTypes.object.isRequired,
    songId: PropTypes.number.isRequired
}

class WaveformSeekBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            waveform: null;
        }
    }

    componentDidMount() {
        const { song } = this.props;
        this.setState({
            waveform: new Waveform(this.waveformContainer),
            innerColor: "#333"
        });
        waveform.dataFromSoundCloudTrack(song);
    }

    handleOnSeek(percent) {

    }

    handleSeekFinished(percent) {

    }

    render() {
        const { player, song } = this.props;
        const { currentTime } = player;
        const progress = currentTime/(song.duration/1000.0);

        return (
            <CustomSeekBar
                initialProgress={progress}
                isVertical={false}
                onSeek={this.handleOnSeek}
                seekFinished={this.handleSeekFinished}
                totalLength={/*====FIXME====*/}
            >
                <div className="song-waveform" ref={(waveformContainer) => { this.waveformContainer = waveformContainer; }}>
                </div>
            </CustomSeekBar>
        );
    }
}

WaveformSeekBar.propTypes = propTypes;

export default WaveformSeekBar;
