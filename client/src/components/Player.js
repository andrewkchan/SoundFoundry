import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";

import SeekBar from "../components/SeekBar";
import PlayerSongInfo from "../components/PlayerSongInfo";

import { changeCurrentPercent, changeSong, setIsPlaying, setIsSeeking, toggleIsPlaying } from "../actions/PlayerActions";
import { formatSeconds, formatStreamUrl } from "../utils/FormatUtils";

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

const VOLUME_SCALE = 0.6; //full volume hurts my ears...

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
        this._audio.volume = this.state.volume * VOLUME_SCALE;
        const { player } = this.props;
        if (player.isPlaying) {
            this._audio.play();
        }
    }

    componentDidUpdate(prevProps) {
        const { dispatch, song, player } = this.props;
        //handle any time updates that may have occurred
        let time = Math.floor(player.percent * (song.duration / 1000.0));
        if (prevProps.playingSongId !== this.props.playingSongId) {
            this._audio.src = formatStreamUrl(song.stream_url);
            if (player.outOfSync && !player.isSeeking) {
                this._audio.currentTime = time;
                dispatch(changeCurrentPercent(player.percent, false));
            }
        } else if (player.outOfSync) {
            this._audio.currentTime = time;
            dispatch(changeCurrentPercent(player.percent, false)); //turn off outOfSync flag
        }
        //handle playing and pausing updates
        if (!player.isPlaying) {
            this._audio.pause();
        } else {
            this._audio.play();
        }
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
        //empty
    }

    /*
     * function handleLoadStart
     * Handle when the player begins to load something.
     */
    handleLoadStart() {
        const { dispatch } = this.props;
        dispatch(changeCurrentPercent(0.0));
    }

    handlePause() {
        // const { dispatch } = this.props;
        // dispatch(setIsPlaying(false));
    }

    handlePlay() {
        // const { dispatch } = this.props;
        // dispatch(setIsPlaying(true));
    }

    /*
     * function handleTimeUpdate
     * Handle a time update event from the HTMLAudioElement. Don't change time if currently out of sync with the desired time.
     */
    handleTimeUpdate(e) {
        const { dispatch, player, song } = this.props;
        const currentTime = Math.floor(this._audio.currentTime);
        if (player.outOfSync) {
            return;
        }

        dispatch(changeCurrentPercent(currentTime / (song.duration / 1000.0)));
    }

    /*
     * function handleVolumeChange
     * Handle a volume changed event from the HTMLAudioElement.
     */
    handleVolumeChange(e) {
        const volume = this._audio.volume / VOLUME_SCALE;
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
        const { dispatch, player } = this.props;
        if (!player.isSeeking) {
            dispatch(setIsSeeking(true));
        }
        dispatch(changeCurrentPercent(percent, true));
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
        this._audio.volume = percent * VOLUME_SCALE;
    }

    /*
     * function seekTimeFinished
     * Handle when the user finishes seeking through the track.
     * @param   percent     A number between 0.0 and 1.0 indicating seek progress.
     */
    seekTimeFinished(percent) {
        // const { player } = this.props;
        const { dispatch } = this.props;
        dispatch(setIsSeeking(false));
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
        this._audio.volume = percent * VOLUME_SCALE;
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
        const { dispatch, player } = this.props;
        const { isPlaying } = player;
        if (isPlaying) {
            //this._audio.pause();
            dispatch(setIsPlaying(false));
        } else {
            //this._audio.play();
            dispatch(setIsPlaying(true));
        }
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
        const { dispatch, player, playingSongId, songs, song, users } = this.props;
        const { isPlaying, percent } = player;
        const { muted, volume } = this.state;
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
                        <PlayerSongInfo
                            className="player-section start"
                            dispatch={dispatch}
                            song={song}
                            user={user}
                        />
                        <div className="player-middle">
                            <div className="player-middle-section">
                                <div
                                    className={`player-button ${this.state.shuffle ? "active" : ""}`}
                                    onClick={this.toggleShuffle}
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
                                <div
                                    className={`player-button ${this.state.repeat ? "active" : ""}`}
                                    onClick={this.toggleRepeat}
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
                                        onSeek={this.onSeekTime}
                                        progressClassName="player-seek-duration-bar"
                                        seekFinished={this.seekTimeFinished}
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
                                onClick={this.toggleMute}
                            >
                                {volumeIcon}
                            </div>
                            <div className="player-volume">
                                <div className="player-seek-bar-wrap">
                                    <SeekBar
                                        barClassName="player-seek-bar"
                                        containerClassName="player-seek-container"
                                        initialProgress={this.state.volume}
                                        isVertical={false}
                                        onSeek={this.onSeekVolume}
                                        progressClassName="player-seek-duration-bar"
                                        seekFinished={this.seekVolumeFinished}
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

Player.propTypes = propTypes;

export default Player;
