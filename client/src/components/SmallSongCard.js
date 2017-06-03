import React, { Component, PropTypes } from "react";
import Link from "../components/Link";
import SongHeart from "../components/SongHeart";
import TogglePlayButtonContainer from "../containers/TogglePlayButtonContainer";

import { IMAGE_SIZES } from "../constants/SongConstants";
import { formatSongTitle } from "../utils/FormatUtils";
import { getImageUrl } from "../utils/SongUtils";


const propTypes = {
    authed: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    playSong: PropTypes.func.isRequired,
    song: PropTypes.object, //song object to display, will display placeholder if not present
    user: PropTypes.object  //user object of the author of the song, will display placeholder if not present
};

class SmallSongCard extends Component {
    render() {
        const { authed, dispatch, isActive, playSong, song, user } = this.props;

        const isLiked = Boolean(song.id in authed.likes && authed.likes[song.id] === 1);
        const image = getImageUrl(song.artwork_url, IMAGE_SIZES.MEDIUM);

        //set toggle play icon based on whether this song is active or not
        let togglePlayIcon = null;
        if (isActive) {
            togglePlayIcon = <TogglePlayButtonContainer isSmall={true} />;
        }
        else {
            togglePlayIcon = (
                <div className="small-toggle-play-button" onClick={() => { playSong(); }}>
                    <i className="small-toggle-play-button-icon ion-ios-play" />
                </div>
            );
        }

        return (
            <div className="card small-song-card">
                <Link
                    dispatch={dispatch}
                    route={{ path: ["songs", song.id] }}
                    title={song.title}
                >
                    <div className="small-song-card-image" style={{ backgroundImage: `url(${image})`}}>
                    </div>
                </Link>
                <div className="small-song-card-body">
                    <div className="small-song-card-title-container">
                        <div className="small-song-card-user clearfix">
                            <img
                                className="small-song-card-user-image"
                                src={getImageUrl(user.avatar_url)}
                            />
                            <div className="small-song-card-details">
                                <div className="small-song-card-user-username">
                                    {user.username}
                                </div>
                                <Link
                                    className="small-song-card-title"
                                    dispatch={dispatch}
                                    route={{ path: ["songs", song.id] }}
                                    title={song.title}
                                >
                                    {formatSongTitle(song.title)}
                                </Link>
                            </div>
                        </div>
                    </div>
                    {togglePlayIcon}
                    <SongHeart
                        authed={authed}
                        className="small-song-card-heart"
                        dispatch={dispatch}
                        isLiked={isLiked}
                        songId={song.id}
                    />
                </div>
            </div>
        );
    }
}

SmallSongCard.propTypes = propTypes;

export default SmallSongCard;
