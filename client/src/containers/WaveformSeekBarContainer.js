import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import WaveformSeekBar from "../components/WaveformSeekBar";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object,
    playSong: PropTypes.func.isRequired, //specific function to load the song from an index in a playlist
    songs: PropTypes.object,
    songId: PropTypes.number.isRequired //the ID of the song associated with this waveform. this is actually required to be passed in.
}

class WaveformSeekBarContainer extends Component {
    render() {
        const { dispatch, player, songs, songId } = this.props;
        const song = songs[songId];
        return <WaveformSeekBar { ...this.props } song={song} />;
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
