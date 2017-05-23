import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import Player from "../components/Player";

import { changeCurrentPercent, changeSong, setIsPlaying, setIsSeeking, toggleIsPlaying } from "../actions/PlayerActions";
import { formatSeconds, formatStreamUrl } from "../utils/FormatUtils";
import { getPlayingSongId } from "../utils/PlayerUtils";

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
Player Container

Encapsulates the all state related to audio playback, such as volume and the actual HTML audio element.
Note we treat audio playback state as presentational state! What we store globally is audio playback *metadata*.
*/

class PlayerContainer extends Component {
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
        this.onSeekVolumeFunc = this.onSeekVolumeFunc.bind(this);
        this.onSeekTimeFunc = this.onSeekTimeFunc.bind(this);
        this.onSeekTimeFinishedFunc = this.onSeekTimeFinishedFunc.bind(this);
        this.onSeekVolumeFinishedFunc = this.onSeekVolumeFinishedFunc.bind(this);
        this.toggleMuteFunc = this.toggleMuteFunc.bind(this);
        this.togglePlayFunc = this.togglePlayFunc.bind(this);
        this.toggleRepeatFunc = this.toggleRepeatFunc.bind(this);
        this.toggleShuffleFunc = this.toggleShuffleFunc.bind(this);
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
     * function onSeekTimeFunc
     * Handle when the user moves the mouse pointer to seek through the track.
     * @param   percent     A number between 0.0 and 1.0 indicating seek progress.
     */
    onSeekTimeFunc(percent) {
        const { dispatch, player } = this.props;
        if (!player.isSeeking) {
            dispatch(setIsSeeking(true));
        }
        dispatch(changeCurrentPercent(percent, true));
    }

    /*
     * function onSeekTimeFunc
     * Handle when the user moves the mouse pointer to change the volume.
     * @param   percent     A number between 0.0 and 1.0 indicating volume bar percent.
     */
    onSeekVolumeFunc(percent) {
        this.setState({
            volume: percent
        });
        this._audio.volume = percent * VOLUME_SCALE;
    }

    /*
     * function onSeekTimeFinishedFunc
     * Handle when the user finishes seeking through the track.
     * @param   percent     A number between 0.0 and 1.0 indicating seek progress.
     */
    onSeekTimeFinishedFunc(percent) {
        // const { player } = this.props;
        const { dispatch } = this.props;
        dispatch(setIsSeeking(false));
    }

    /*
     * function onSeekVolumeFinishedFunc
     * Handle when the user finishes changing volume.
     * @param   percent     A number between 0.0 and 1.0 indicating volume percent.
     */
    onSeekVolumeFinishedFunc(percent) {
        this.setState({
            volume: percent
        });
        this._audio.volume = percent * VOLUME_SCALE;
    }

    toggleMuteFunc() {
        this._audio.muted = !this._audio.muted;
        this.setState({
            muted: this._audio.muted
        });
    }

    /*
     * function togglePlayFunc
     * Toggle audio playback.
     */
    togglePlayFunc() {
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
     * function toggleRepeatFunc
     * Toggle whether to repeat the current track after finishing playback.
     */
    toggleRepeatFunc() {
        this.setState({
            repeat: !this.state.repeat
        });
    }

    /*
     * function toggleShuffleFunc
     * Toggle shuffle playback mode.
     */
    toggleShuffleFunc() {
        this.setState({
            shuffle: !this.state.shuffle
        });
    }

    render() {
        const { dispatch, player, song, users } = this.props;
        const { muted, volume, repeat, shuffle } = this.state;
        const user = users[song.user_id];
        const prevFunc = this.changeSong.bind(this, CHANGE_TYPES.PREV);
        const nextFunc = this.changeSong.bind(
            this,
            this.state.shuffle ? CHANGE_TYPES.SHUFFLE : CHANGE_TYPES.NEXT
        );

        return (
            <Player
                dispatch={dispatch}
                muted={muted}
                nextFunc={nextFunc}
                onSeekTimeFinishedFunc={this.onSeekTimeFinishedFunc}
                onSeekVolumeFinishedFunc={this.onSeekVolumeFinishedFunc}
                onSeekTimeFunc={this.onSeekTimeFunc}
                onSeekVolumeFunc={this.onSeekVolumeFunc}
                player={player}
                prevFunc={prevFunc}
                repeat={repeat}
                song={song}
                shuffle={shuffle}
                toggleMuteFunc={toggleMuteFunc}
                togglePlayFunc={togglePlayFunc}
                toggleRepeatFunc={toggleRepeatFunc}
                toggleShuffleFunc={toggleShuffleFunc}
                user={user}
                volume={volume}
            />
        );
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
