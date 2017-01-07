import React, { Component, PropTypes } from "react";

import { fetchSongsIfNeeded } from "../actions/PlaylistActions";

import SongCards from "../components/SongCards";
import stickify from "../components/stickify";
//import Toolbar from "../components/Toolbar";

const propTypes = {
    authed: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number,
    playingSongId: PropTypes.number,
    playlistId: PropTypes.string,
    playlists: PropTypes.object.isRequired,
    sticky: PropTypes.bool,
    songs: PropTypes.object.isRequired,
    time: PropTypes.number,
    users: PropTypes.object.isRequired
};

/*
Songs Component
A wrapper for the songlist that will fetch songs if needed according to the current feed.
*/

class Songs extends Component {
    componentWillMount() {
        const { dispatch, playlistId, playlists } = this.props;
        //fetch songs if needed according to props
        if (!(playlistId in playlists) || playlists[playlistId].items.length === 0) {
            dispatch(fetchSongsIfNeeded(playlistId));
        }
    }

    componentWillReceiveProps(nextProps) {
        const { dispatch, playlistId, playlists } = this.props;
        //compare current songs and next songs, fetch songs if needed
        if (playlistId != nextProps.playlistId) {
            if (!(nextProps.playlistId in playlists) || playlists[nextProps.playlistId].items.length === 0) {
                dispatch(fetchSongsIfNeeded(nextProps.playlistId));
            }
        }
    }

    render() {
        return (
            <div className={"songs"}>
                <div className="container">
                    <SongCards {...this.props} />
                </div>
            </div>
        )
    }
}

Songs.propTypes = propTypes;

export default stickify(Songs, 50);
