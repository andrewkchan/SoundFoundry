import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Player from "../components/Player";

import { getPlayingSongId } from "../utils/PlayerUtils";

const propTypes = {
    isMobile: PropTypes.bool,
    playingSongId: PropTypes.number
};

class PlayerContainer extends Component {
    render() {
        const { isMobile, playingSongId } = this.props;
        if (isMobile) {
            //TODO: return mobile player
        }

        if (playingSongId == null) {
            return <div />;
        }

        return <Player {...this.props} />;
    }
}

PlayerContainer.propTypes = propTypes;

function mapStateToProps(state) {
    const { env, player, playlists, songs, users } = state;
    const { isMobile } = env;
    const playingSongId = getPlayingSongId(player, playlists);
    const song = songs[playingSongId];

    return {
        isMobile,
        player,
        playingSongId,
        playlists,
        song,
        songs,
        users
    };
}

export default connect(mapStateToProps)(PlayerContainer);
