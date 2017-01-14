import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import WaveformSeekBar from "../components/WaveformSeekBar";

const propTypes = {
    player: PropTypes.object,
    songs: PropTypes.object.isRequired,
    songId: PropTypes.number.isRequired //the ID of the song associated with this waveform
}

class WaveformSeekBarContainer extends Component {
    render() {
        const { dispatch, player, songs, songId } = this.props;
        const song = songs[songId];
        return <WaveformSeekBar { dispatch, player, song, songId } />;
    }
}

function mapStateToProps(state) {
    const { player, songs } = state;
    return {
        player,
        songs
    };
}

export default connect(mapStateToProps)(WaveformSeekBarContainer);
