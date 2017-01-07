import types from "../constants/ActionTypes";
import { CHANGE_TYPES } from "../constants/SongConstants";

/*
 * Action changeCurrentTime
 * Scrub through the currently playing track to the given time.
 */
export function changeCurrentTime(time) {
    return {
        type: types.CHANGE_CURRENT_TIME,
        time
    };
}

/*
 * Action changePlayingSong
 * Change the currently playing song to the given index in the current playlist.
 */
export function changePlayingSong(songIndex) {
    return {
        type: types.CHANGE_PLAYING_SONG,
        songIndex
    };
}

/*
 * Action changeSelectedPlaylists
 * Change the currently playing playlist by ID, adding it to the list of selected playlist IDs if not already in it.
 */
export function changeSelectedPlaylists(selectedPlaylistIds, playlistId) {
    console.log("dispatched changeSelectedPlaylists action for playlistId" + playlistId);
    const index = selectedPlaylistIds.indexOf(playlistId);

    //if playlist is currently in list of playlists, move it to the tail end of the list.
    if (index > -1) {
        selectedPlaylistIds.splice(index, 1);
    }
    selectedPlaylistIds.push(playlistId);

    return {
        type: types.CHANGE_SELECTED_PLAYLISTS,
        selectedPlaylistIds
    };
}

/*
 * Action changeSong
 * Change the currently playing song according to the CHANGE_TYPES enum changeType, which indicates 1 of the following:
 *  1. Skip to next song
 *  2. Skip to previous song
 *  3. Shuffle songs
 */
export function changeSong(changeType) {
    return (dispatch, getState) => {
        const { player, playlists } = getState();
        const { currentSongIndex, selectedPlaylistIds } = player;
        const currentPlaylistId = selectedPlaylistIds[selectedPlaylistIds.length - 1];

        let nextSongIndex;
        if (changeType === CHANGE_TYPES.NEXT) {
            nextSongIndex = currentSongIndex + 1;
        } else if (changeType === CHANGE_TYPES.PREV) {
            nextSongIndex = currentSongIndex - 1;
        } else if (changeType === CHANGE_TYPES.SHUFFLE) {
            nextSongIndex = Math.floor((Math.random() * playlists[currentPlaylistId].items.length - 1) + 0);
        }

        if (nextSongIndex >= playlists[currentPlaylistId].items.length || nextSongIndex < 0) {
            return null;
        }

        return dispatch(changePlayingSong(nextSongIndex));
    };
}

/*
 * Action playSong
 * Play the song indexed by songIndex from the provided playlist.
 */
export function playSong(playlistId, songIndex) {
    return (dispatch, getState) => {
        console.log("dispatched playsong action for index " + songIndex);
        dispatch(changeCurrentTime(0));

        const { player } = getState();
        const { selectedPlaylistIds } = player;
        const len = selectedPlaylistIds.length;
        //do we have to load a new playlist?
        if (len === 0 || selectedPlaylistIds[len - 1] !== playlistId) {
            dispatch(changeSelectedPlaylists(selectedPlaylistIds, playlistId));
        }
        //set the current song to the given index in the playlist
        dispatch(changePlayingSong(songIndex));
    };
}

export function setIsPlaying(isPlaying) {
    return {
        type: types.SET_IS_PLAYING,
        isPlaying
    };
}

export function toggleIsPlaying() {
    return {
        type: types.TOGGLE_IS_PLAYING
    };
}
