import React, { Component, PropTypes } from "react";
import SmallSongCard from "../components/SmallSongCard";

import { playSong } from "../actions/PlayerActions";

const propTypes = {
    authed: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    endIndex: PropTypes.number,                 //the index of the item after the last item in the playlist to be displayed
    playingSongId: PropTypes.number,
    playlistId: PropTypes.string.isRequired,
    playlists: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired,         //the set of all existing songs, not just those in this playlist
    startIndex: PropTypes.number,               //the index of the first item in the given playlist to be displayed
    users: PropTypes.object.isRequired
};

/*
SongCards Component

A list of small song cards. TODO: infinite scroll
*/
class SmallSongCards extends Component {
    constructor(props) {
        super(props);
        this.playSong = this.playSong.bind(this);
        this.renderSongs = this.renderSongs.bind(this);
    }
    /*
     * playSong
     * Plays the song at the given index of this playlist.
     * @param   i   -The index in the playlist to play.
     * @param   percent -The percent at which to begin playback
     */
    playSong(i, percent = 0) {
        const { dispatch, playlistId } = this.props;
        dispatch(playSong(playlistId, i, percent));
    }
    renderSongs(start, end) {
        const { authed,
                dispatch,
                playingSongId,
                playlistId,
                playlists,
                songs,
                users
        } = this.props;
        const playlist = playlists[playlistId];
        if (!playlist) {
            return null;
        }
        start = start ? start : 0;
        end = end ? end : playlist.items.length;
        const songCards = playlist.items.slice(start, end).map((songId, i) => {
            const song = songs[songId];
            const user = users[song.user_id];
            return (
                <div className="songs-row" key={i}>
                    <SmallSongCard
                        authed={authed}
                        dispatch={dispatch}
                        isActive={playingSongId === songId}
                        playSong={this.playSong.bind(this, i + start)}
                        song={song}
                        user={user}
                    />
                </div>
            );
        });
        return songCards;
    }
    render() {
        const { startIndex, endIndex } = this.props;

        return (
            <div className="small-song-cards">
                {this.renderSongs(startIndex, endIndex)}
            </div>
        );
    }
}

SmallSongCards.propTypes = propTypes;

export default SmallSongCards;
