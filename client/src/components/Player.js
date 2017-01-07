import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import SeekBar from "../components/SeekBar";

import { changeCurrentTime, changeSong, setIsPlaying, toggleIsPlaying } from "../actions/PlayerActions";
import { formatSeconds, formatStreamUrl } from "../utils/FormatUtils";
import { getImageUrl } from "../utils/SongUtils";
import { CHANGE_TYPES } from "../constants/SongConstants";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    playingSongId: PropTypes.number.isRequired,
    playlists: PropTypes.object.isRequired,
    song: PropTypes.object,
    songs: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired
};

/*
Player Component

The bar at the bottom of the app containing audio player controls. Also encapsulates the actual audio playing HTML element.
*/

class Player extends Component {
    constructor(props) {
        super(props);

        const { song } = props;
        const previousVolumeLevel = 1; //Number.parseFloat(LocalStorageUtils.get("volume"));
        /*
        State of the audio playback for the current song.
        Note that song changes should ALWAYS update props rather than state.
        */
        this.state = {
            duration: 0, //duration lives in state, not props b/c we don't know song duration until song has been loaded by the HTMLAudio.
            muted: false,
            repeat: false,
            shuffle: false,
            volume: previousVolumeLevel || 1
        };
        this._audio = new Audio(formatStreamUrl(song.stream_url));

        this.handleEnded = this.handleEnded.bind(this);
        this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
        this.handleLoadStart = this.handleLoadStart.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.onSeekVolume = this.onSeekVolume.bind(this);
        this.onSeekTime = this.onSeekTime.bind(this);
        this.seekTimeFinished = this.seekTimeFinished.bind(this);
        this.seekVolumeFinished = this.seekVolumeFinished.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
        this.toggleRepeat = this.toggleRepeat.bind(this);
        this.toggleShuffle = this.toggleShuffle.bind(this);
    }

    componentDidMount() {
        this._audio.addEventListener("ended", this.handleEnded, false);
        this._audio.addEventListener("loadedmetadata", this.handleLoadedMetadata, false);
        this._audio.addEventListener("loadstart", this.handleLoadStart, false);
        this._audio.addEventListener("pause", this.handlePause, false);
        this._audio.addEventListener("play", this.handlePlay, false);
        this._audio.addEventListener("timeupdate", this.handleTimeUpdate, false);
        this._audio.addEventListener("volumechange", this.handleVolumeChange, false);
        this._audio.volume = this.state.volume;
        this._audio.play();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.playingSongId && prevProps.playingSongId === this.props.playingSongId) {
            return;
        }
        const { song } = this.props;
        this._audio.src = formatStreamUrl(song.stream_url);
    }

    componentWillUnmount() {
        this._audio.removeEventListener("ended", this.handleEnded, false);
        this._audio.removeEventListener("loadedmetadata", this.handleLoadedMetadata, false);
        this._audio.removeEventListener("loadstart", this.handleLoadStart, false);
        this._audio.removeEventListener("pause", this.handlePause, false);
        this._audio.removeEventListener("play", this.handlePlay, false);
        this._audio.removeEventListener("timeupdate", this.handleTimeUpdate, false);
        this._audio.removeEventListener("volumechange", this.handleVolumeChange, false);
    }

    changeSong(changeType) {
        const { dispatch } = this.props;
        dispatch(changeSong(changeType));
    }

    /*
     * function handleEnded
     * Handle the event fired when the current song ends.
     */
    handleEnded() {
        if (this.state.repeat) {
            this._audio.play();
        } else if (this.state.shuffle) {
            this.changeSong(CHANGE_TYPES.SHUFFLE);
        } else {
            this.changeSong(CHANGE_TYPES.NEXT);
        }
    }

    /*
     * function handleLoadedMetadata
     * Handle when the audio player has successfully loaded song metadata.
     */
    handleLoadedMetadata() {
        this.setState({
            duration: Math.floor(this._audio.duration)
        });
    }

    /*
     * function handleLoadStart
     * Handle when the player begins to load something.
     */
    handleLoadStart() {
        const { dispatch } = this.props;
        dispatch(changeCurrentTime(0));
        this.setState({
            duration: 0
        });
    }

    handlePause() {
        const { dispatch } = this.props;
        dispatch(setIsPlaying(false));
    }

    handlePlay() {
        const { dispatch } = this.props;
        dispatch(setIsPlaying(true));
    }

    /*
     * function handleTimeUpdate
     * Handle a time update event from the HTMLAudioElement.
     */
    handleTimeUpdate(e) {
        const { dispatch, player } = this.props;
        const currentTime = Math.floor(this._audio.currentTime);
        if (currentTime === player.currentTime) {
            return;
        }

        dispatch(changeCurrentTime(currentTime));
    }

    /*
     * function handleVolumeChange
     * Handle a volume changed event from the HTMLAudioElement.
     */
    handleVolumeChange(e) {
        const volume = this._audio.volume;
        //LocalStorageUtils.set("volume", volume);
        this.setState({
            volume
        });
    }

    /*
     * function onSeekTime
     * Handle when the user moves the mouse pointer to seek through the track.
     * @param   percent     A number between 0.0 and 1.0 indicating seek progress.
     */
    onSeekTime(percent) {
        const { dispatch } = this.props;
        dispatch(changeCurrentTime(Math.floor(percent * this.state.duration)));
    }

    /*
     * function onSeekTime
     * Handle when the user moves the mouse pointer to change the volume.
     * @param   percent     A number between 0.0 and 1.0 indicating volume bar percent.
     */
    onSeekVolume(percent) {
        this.setState({
            volume: percent
        });
        this._audio.volume = percent;
    }

    /*
     * function seekTimeFinished
     * Handle when the user finishes seeking through the track.
     * @param   percent     A number between 0.0 and 1.0 indicating seek progress.
     */
    seekTimeFinished(percent) {
        const { player } = this.props;
        const { currentTime } = this.props;
        this._audio.currentTime = currentTime;
    }

    /*
     * function seekVolumeFinished
     * Handle when the user finishes changing volume.
     * @param   percent     A number between 0.0 and 1.0 indicating volume percent.
     */
    seekVolumeFinished(percent) {
        this.setState({
            volume: percent
        });
        this._audio.volume = percent;
    }

    toggleMute() {
        this._audio.muted = !this._audio.muted;
        this.setState({
            muted: this._audio.muted
        });
    }

    /*
     * function togglePlay
     * Toggle audio playback.
     */
    togglePlay() {
        const { isPlaying } = this.props.player;
        if (isPlaying) {
            this._audio.pause();
        } else {
            this._audio.play();
        }
        //event handlers will do global state dispatches...
    }

    /*
     * function toggleRepeat
     * Toggle whether to repeat the current track after finishing playback.
     */
    toggleRepeat() {
        this.setState({
            repeat: !this.state.repeat
        });
    }

    /*
     * function toggleShuffle
     * Toggle shuffle playback mode.
     */
    toggleShuffle() {
        this.setState({
            shuffle: !this.state.shuffle
        });
    }

    render() {
        const { dispatch, player, playingSongId, songs, users } = this.props;
        const { isPlaying, currentTime } = player;
        const { duration, muted, volume } = this.state;
        const song = songs[playingSongId];
        const user = users[song.user_id];
        const prevFunc = this.changeSong.bind(this, CHANGE_TYPES.PREV);
        const nextFunc = this.changeSong.bind(
            this,
            this.state.shuffle ? CHANGE_TYPES.SHUFFLE : CHANGE_TYPES.NEXT
        );

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
                        <div className="player-section player-info">
                            <img
                                className="player-image"
                                src={getImageUrl(song.artwork_url)}
                            />
                            //
                            //TODO: SongDetails component
                            //
                        </div>
                        <div className="player-section">
                            <div
                                className="player-button"
                                onClick={prevFunc}
                            >
                                <i className="icon ion-ios-rewind" />
                            </div>
                            <div
                                className="player-button"
                                onClick={this.togglePlay}
                            >
                                <i className={isPlaying ? "icon ion-ios-pause" : "icon ion-ios-play"} />
                            </div>
                            <div
                                className="player-button"
                                onClick={nextFunc}
                            >
                                <i className="icon ion-ios-fastforward" />
                            </div>
                        </div>
                        <div className="player-section player-seek">
                            <div className="player-seek-bar-wrap">
                                <SeekBar
                                    barClassName="player-seek-duration-bar"
                                    containerClassName="player-seek-bar"
                                    initialProgress={currentTime/duration}
                                    isVertical={false}
                                    onSeek={this.onSeekTime}
                                    seekFinished={this.seekTimeFinished}
                                    thumbClassName="player-seek-handle"
                                />
                            </div>
                        </div>
                        <div className="player-time">
                            <span>{formatSeconds(currentTime)}</span>
                            <span className="player-time-divider"></span>
                            <span>{formatSeconds(duration)}</span>
                        </div>
                        <div className="player-section">
                            <div
                                className={`player-button ${this.state.repeat ? "active" : ""}`}
                                onClick={this.toggleRepeat}
                            >
                                <i className="icon ion-loop" />
                            </div>
                            <div
                                className={`player-button ${this.state.shuffle ? "active" : ""}`}
                                onClick={this.toggleShuffle}
                            >
                                <i className="icon ion-shuffle" />
                            </div>
                        </div>
                        //
                        //TODO: Playlist popover menu
                        //
                        <div
                            className="player-button player-volume-button"
                            onClick={this.toggleMute}
                        >
                            {volumeIcon}
                        </div>
                        <div className="player-volume">
                            <div className="player-seek-bar-wrap">
                                <SeekBar
                                    barClassName="player-seek-duration-bar"
                                    containerClassName="player-seek-bar"
                                    initialProgress={this.state.volume}
                                    isVertical={false}
                                    onSeek={this.onSeekVolume}
                                    seekFinished={this.seekVolumeFinished}
                                    thumbClassName="player-seek-handle"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Player.propTypes = propTypes;

export default Player;
