import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Nav from "../components/Nav";

const propTypes = {
    isMobile: PropTypes.bool
};

class NavContainer extends Component {
    render() {
        return <Nav {...this.props} />;
    }
}

NavContainer.propTypes = propTypes;

function mapStateToProps(state) {
    const { authed, env, navigator, playlists, player, songs, users } = state;
    const { isMobile } = env;

    const { currentSongIndex, selectedPlaylistIds } = player;
    let song = null;
    if (currentSongIndex !== null) {
        const currentSongId = playlists[selectedPlaylistIds[selectedPlaylistIds.length - 1]].items[currentSongIndex];
        song = songs[currentSongId];
    }

    return {
        authed,
        authedPlaylists: playlists,
        isMobile,
        navigator,
        player,
        songs,
        song
    };
}

export default connect(mapStateToProps)(NavContainer);
