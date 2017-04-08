import React, { Component, PropTypes } from "react";
import Link from "../components/Link";

import { getImageUrl } from "../utils/SongUtils";
import { formatSongTitleShort } from "../utils/FormatUtils";

const propTypes = {
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    song: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired //the author of the song
};

class PlayerSongInfo extends Component {
    render() {
        const { className, dispatch, song, user } = this.props;
        return (
            <div className={`${className} player-info`}>
                <img
                    className="player-image"
                    src={getImageUrl(song.artwork_url)}
                />
                <div className="player-info-text">
                    <Link
                        className="player-info-title"
                        dispatch={dispatch}
                        route={{ path: ["songs", song.id] }}
                        title={song.title}
                    >
                        {formatSongTitleShort(song.title)}
                    </Link>
                    <div className="player-info-user">
                        {formatSongTitleShort(user.username)}
                    </div>
                </div>
            </div>
        );
    }
}

PlayerSongInfo.propTypes = propTypes;

export default PlayerSongInfo;
