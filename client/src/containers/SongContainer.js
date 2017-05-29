import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import SongCard from "../components/SongCard";
import { SONG_PLAYLIST_SUFFIX } from "../constants/PlaylistConstants";

import { getPlayingSongId } from "../utils/PlayerUtils";
import { playSong } from "../actions/PlayerActions";
import { fetchSongFullContentIfNeeded } from "../actions/SongActions";

const propTypes = {
    authed: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    playlists: PropTypes.object.isRequired,
    songId: PropTypes.number.isRequired,        //input prop: songId
    songs: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
};

class SongContainer extends Component {
    constructor(props) {
        super(props);
        const { dispatch, songId } = this.props;
        dispatch(fetchSongFullContentIfNeeded(songId));

        this.playSong = this.playSong.bind(this);
    }

    /*
     * playSong
     * Plays the song at the given index of this song's related songs playlist.
     * @param   i   -The index of the related songs playlist to play.
     */
    playSong(i) {
        const { dispatch, songId } = this.props;
        const songPlaylistId = String(songId) + SONG_PLAYLIST_SUFFIX;
        dispatch(playSong(songPlaylistId, i));
    }

    render() {
        const { authed, dispatch, player, playlists, songs, songId, users } = this.props;
        const song = songs[songId];

        if (song) {
            const isActive = getPlayingSongId(player, playlists) === song.id;
            const user = users[song.user_id];
            return (
                <div className="content">
                    <div className="container">
                        <SongCard
                            authed={authed}
                            dispatch={dispatch}
                            isActive={isActive}
                            playSong={this.playSong.bind(null, 0)}
                            song={song}
                            user={user}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="content">
                    <div className="container">
                    </div>
                </div>
            );
        }
    }
}

SongContainer.propTypes = propTypes;

function mapStateToProps(state) {
    const { authed, player, playlists, songs, users } = state;

    return {
        authed,
        player,
        playlists,
        songs,
        users,
    };
}

export default connect(mapStateToProps)(SongContainer);
