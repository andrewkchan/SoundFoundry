import React, { Component, PropTypes } from "react";
import Link from "../components/Link";
import SongHeart from "../components/SongHeart";
import TogglePlayButtonContainer from "../containers/TogglePlayButtonContainer";
import WaveformSeekBarContainer from "../containers/WaveformSeekBarContainer";

import { IMAGE_SIZES } from "../constants/SongConstants";
import { formatSongTitle } from "../utils/FormatUtils";
import { getImageUrl } from "../utils/SongUtils";


const propTypes = {
    authed: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    playSong: PropTypes.func.isRequired,
    song: PropTypes.object.isRequired, //song object to display
    user: PropTypes.object.isRequired //user object of the author of the song
};

class SongCard extends Component {
    render() {
        const { authed, dispatch, isActive, playSong, song, user } = this.props;
        const isLiked = Boolean(song.id in authed.likes && authed.likes[song.id] === 1);
        const image = getImageUrl(song.artwork_url, IMAGE_SIZES.LARGE);

        //set toggle play icon based on whether this song is active or not
        let togglePlayIcon = null;
        if (isActive) {
            togglePlayIcon = <TogglePlayButtonContainer />;
        }
        else {
            togglePlayIcon = (
                <div className="toggle-play-button" onClick={() => { playSong(); }}>
                    <i className="toggle-play-button-icon ion-ios-play" />
                </div>
            );
        }

        return (
            <div className="card song-card">
                <Link
                    dispatch={dispatch}
                    route={{ path: ["songs", song.id] }}
                    title={song.title}
                >
                    <div className="song-card-image" style={{ backgroundImage: `url(${image})`}}>
                    </div>
                </Link>
                <div className="song-card-body">
                    <div className="song-card-header">
                        <div className="song-card-title-container">
                            <div className="song-card-user clearfix">
                                <img
                                    className="song-card-user-image"
                                    src={getImageUrl(user.avatar_url)}
                                />                        
                            </div>
                        </div>
                    </div>
                    {togglePlayIcon}
                    <SongHeart
                        authed={authed}
                        className="song-card-heart"
                        dispatch={dispatch}
                        isLiked={isLiked}
                        songId={song.id}
                    />
                </div>
            </div>
        );
    }
}

SongCard.propTypes = propTypes;

export default SongCard;
