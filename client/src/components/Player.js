import React, { Component, PropTypes } from "react";

import SeekBar from "../components/SeekBar";
import PlayerSongInfo from "../components/PlayerSongInfo";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    muted: PropTypes.bool.isRequired,           //whether volume is muted or not
    nextFunc: PropTypes.func.isRequired,        //callback that skips to the next song
    onSeekTimeFinishedFunc: PropTypes.func.isRequired,  //callback to call when done seeking through the song
    onSeekVolumeFinishedFunc: PropTypes.func.isRequired,    //ballback to call when done seeking through volume bar
    onSeekTimeFunc: PropTypes.func.isRequired,      //callback to call when seeking through the song
    onSeekVolumeFunc: PropTypes.func.isRequired,    //callback to call when seeking through volume bar
    player: PropTypes.object.isRequired,            //object containing global player state
    prevFunc: PropTypes.func.isRequired,        //callback that skips to the previous song
    repeat: PropTypes.bool.isRequired,          //whether "repeat" mode is active or not
    song: PropTypes.object.isRequired,          //the song currently being played
    shuffle: PropTypes.bool.isRequired,         //whether "shuffle" mode is active or not
    toggleMuteFunc: PropTypes.func.isRequired,          //callback that toggles audio volume
    togglePlayFunc: PropTypes.func.isRequired,      //callback that toggles audio playback
    toggleRepeatFunc: PropTypes.func.isRequired,        //callback that toggles repeat mode
    toggleShuffleFunc: PropTypes.func.isRequired,   //callback that toggles shuffle mode
    user: PropTypes.object.isRequired,              //user object rep. author of the song
    volume: PropTypes.number.isRequired,            //(0.0 to 1.0) volume level
};

class Player extends Component {
    render() {
        const {
            dispatch,
            muted,
            nextFunc,
            onSeekTimeFinishedFunc,
            onSeekVolumeFinishedFunc,
            onSeekTimeFunc,
            onSeekVolumeFunc,
            player,
            prevFunc,
            repeat,
            song,
            shuffle,
            toggleMuteFunc,
            togglePlayFunc,
            toggleRepeatFunc,
            toggleShuffleFunc,
            user,
            volume,
        } = this.props;
        const { isPlaying, percent } = player;
        let volumeIcon;
        if (muted || volume === 0) {
            volumeIcon = (<i className="icon ion-android-volume-mute" />);
        } else if (volume === 1) {
            volumeIcon = (
                <div className="player-volume-button-wrap">
                    <i className="icon ion-android-volume-up" />
                    <i className="icon ion-android-volume-mute" />
                </div>
            );
        } else {
            volumeIcon = (
                <div className="player-volume-button-wrap">
                    <i className="icon ion-android-volume-down" />
                    <i className="icon ion-android-volume-mute" />
                </div>
            );
        }

        return (
            <div className="player">
                <div className="container">
                    <div className="player-main">
                        <PlayerSongInfo
                            className="player-section start"
                            dispatch={dispatch}
                            song={song}
                            user={user}
                        />
                        <div className="player-middle">
                            <div className="player-middle-section">
                                <div
                                    className={`player-button ${shuffle ? "active" : ""}`}
                                    onClick={toggleShuffleFunc}
                                >
                                    <i className="icon ion-shuffle" />
                                </div>
                                <div
                                    className="player-button"
                                    onClick={prevFunc}
                                >
                                    <i className="icon ion-ios-rewind" />
                                </div>
                                <div
                                    className="player-button"
                                    onClick={togglePlayFunc}
                                >
                                    <i className={isPlaying ? "icon ion-ios-pause" : "icon ion-ios-play"} />
                                </div>
                                <div
                                    className="player-button"
                                    onClick={nextFunc}
                                >
                                    <i className="icon ion-ios-fastforward" />
                                </div>
                                <div
                                    className={`player-button ${repeat ? "active" : ""}`}
                                    onClick={toggleRepeatFunc}
                                >
                                    <i className="icon ion-loop" />
                                </div>
                            </div>
                            <div className="player-middle-section player-seek">
                                <span>{formatSeconds(Math.floor(percent * (song.duration/1000.0)))}</span>
                                <div className="player-seek-bar-wrap player-seek-duration-bar-wrap">
                                    <SeekBar
                                        barClassName="player-seek-bar"
                                        containerClassName="player-seek-container"
                                        initialProgress={percent}
                                        isVertical={false}
                                        onSeek={onSeekTimeFunc}
                                        progressClassName="player-seek-duration-bar"
                                        seekFinished={onSeekTimeFinishedFunc}
                                        thumbClassName="player-seek-handle"
                                    />
                                </div>
                                <span>{formatSeconds(Math.floor(song.duration / 1000.0))}</span>
                            </div>
                        </div>
                        <div className="player-section end">
                            {/*TODO: playlist popover menu*/}
                            <div
                                className="player-button player-volume-button"
                                onClick={toggleMuteFunc}
                            >
                                {volumeIcon}
                            </div>
                            <div className="player-volume">
                                <div className="player-seek-bar-wrap">
                                    <SeekBar
                                        barClassName="player-seek-bar"
                                        containerClassName="player-seek-container"
                                        initialProgress={volume}
                                        isVertical={false}
                                        onSeek={onSeekVolumeFunc}
                                        progressClassName="player-seek-duration-bar"
                                        seekFinished={onSeekVolumeFinishedFunc}
                                        thumbClassName="player-seek-handle"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
