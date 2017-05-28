import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import SongCard from "../components/SongCard";

import { getPlayingSongId } from "../utils/PlayerUtils";

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
        //
        //TODO: fetch song and related songs if needed!!!
        //
    }
    render() {
        const { authed, dispatch, player, playlists, songs, songId, users } = this.props;
        const song = songs[songId];
        const isActive = getPlayingSongId(player, playlists) === song.id;
        const user = users[song.user_id];


        //
        //
        //TODO: working play song function and related songs!!!
        //
        //


        return (
            <div className="content">
                <div className="container">
                    <SongCard
                        authed={authed}
                        dispatch={dispatch}
                        isActive={isActive}
                        playSong={() => { return null; }}
                        song={song}
                        user={user}
                    />
                </div>
            </div>
        );
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
