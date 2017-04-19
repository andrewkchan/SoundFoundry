import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import WaveformSeekBar from "../components/WaveformSeekBar";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object,
    playlists: PropTypes.object,
    playSong: PropTypes.func.isRequired, //specific function to load the song from an index in a playlist
    songs: PropTypes.object,
    songId: PropTypes.number.isRequired //the ID of the song associated with this waveform. this is actually required to be passed in.
}

class WaveformSeekBarContainer extends Component {
    render() {
        const { dispatch, player, playlists, songs, songId } = this.props;
        const { currentSongIndex, percent, selectedPlaylistIds } = player;

        const song = songs[songId];

        let currentlyPlayingSongId = null;
        if (currentSongIndex !== null) {
            currentlyPlayingSongId = playlists[selectedPlaylistIds[selectedPlaylistIds.length - 1]].items[currentSongIndex];
        }

        // if the waveform is for the currently playing song, keep it in sync with the player progress.
        const initialProgress = (currentlyPlayingSongId === songId) ? percent : 0;
        return <WaveformSeekBar { ...this.props } song={song} initialProgress={initialProgress} />;
    }
}

function mapStateToProps(state) {
    const { player, playlists, songs } = state;
    return {
        player,
        playlists,
        songs
    };
}

export default connect(mapStateToProps)(WaveformSeekBarContainer);
