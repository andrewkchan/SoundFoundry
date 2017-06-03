import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import SongCard from "../components/SongCard";
import Comments from "../components/Comments";
import SmallSongCards from "../components/SmallSongCards";
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
     * @param   percent -The percent progress through the track at which to begin playback
     */
    playSong(i, percent) {
        const { dispatch, songId } = this.props;
        const songPlaylistId = String(songId) + SONG_PLAYLIST_SUFFIX;
        dispatch(playSong(songPlaylistId, i, percent));
    }

    render() {
        const { authed, dispatch, player, playlists, songs, songId, users } = this.props;
        const songPlaylistId = String(songId) + SONG_PLAYLIST_SUFFIX;
        const song = songs[songId];

        if (song) {
            const playingSongId = getPlayingSongId(player, playlists);
            const isActive = playingSongId === song.id;
            const user = users[song.user_id];
            return (
                <div className="content">
                    <div className="container">
                        <SongCard
                            authed={authed}
                            dispatch={dispatch}
                            isActive={isActive}
                            playSong={this.playSong.bind(this, 0)}
                            song={song}
                            user={user}
                        />
                        <div className="song-related-content">
                            <Comments comments={song.comments} />
                            <SmallSongCards
                                authed={authed}
                                dispatch={dispatch}
                                playingSongId={playingSongId}
                                playlistId={songPlaylistId}
                                playlists={playlists}
                                songs={songs}
                                startIndex={1}
                                users={users}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="content">
                    <div className="container">
                        <SongCard
                            authed={authed}
                            dispatch={dispatch}
                            isActive={false}
                            playSong={() => {return;}}
                            song={null}
                            user={null}
                        />
                        <div className="song-related-content">
                            <Comments comments={null} />
                        </div>
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
