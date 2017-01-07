import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Songs from "../components/Songs";

import { fetchSongsIfNeeded } from "../actions/PlaylistActions";
import { getPlayingSongId } from "../utils/PlayerUtils";

const propTypes = {
    isMobile: PropTypes.bool
};

class SongsContainer extends Component {
    render() {
        return <Songs {...this.props} />;
    }
}

SongsContainer.propTypes = propTypes;

function mapStateToProps(state) {
    const { authed, env, navigator, player, playlists, songs, users } = state;
    const { height, isMobile } = env;
    const { query } = navigator.route;
    const playingSongId = getPlayingSongId(player, playlists);

    const time = query && query.t ? query.t : null; //the current time of the song being played, if reflected in the URL
    let playlistId = query && query.q ? query.q : "house"; //the playlist currently being played, "house" (genre) if none
    if (time) {
        playlistId = `${playlist} - ${time}`;
    }

    return {
        authed,
        height,
        isMobile,
        playingSongId,
        playlistId,
        playlists,
        scrollFunc: fetchSongsIfNeeded.bind(null, playlistId),
        songs,
        time,
        users
    };
}

export default connect(mapStateToProps)(SongsContainer);
