import types from "../constants/ActionTypes";

const initialState = {
    currentSongIndex: null, //index of the currently playing song in the current playlist. NOT the ID of the song.
    percent: 0, //(between 0.0 and 1.0) how much of the current song we have played so far
    isPlaying: false,
    isSeeking: false,
    outOfSync: false, //for components to affirmatively change the current time of the player. when TRUE, audio player will change to currentTime.
    selectedPlaylistIds: [] //list of playlist IDs loaded in the player. the currently playing playlist is indicated by the LAST element of this list
};

export default function player(state = initialState, action) {
    switch (action.type) {
        case types.CHANGE_CURRENT_PERCENT:
            return { ...state, percent: action.percent, outOfSync: action.outOfSync };

        case types.CHANGE_PLAYING_SONG:
            return { ...state, currentSongIndex: action.songIndex, percent: action.percent, outOfSync: true };

        case types.CHANGE_SELECTED_PLAYLISTS:
            return { ...state, selectedPlaylistIds: action.selectedPlaylistIds };

        case types.RESET_AUTHED:
            return { ...initialState };

        case types.SET_IS_PLAYING:
            return { ...state, isPlaying: action.isPlaying };

        case types.SET_IS_SEEKING:
            return { ...state, isSeeking: action.isSeeking };

        case types.TOGGLE_IS_PLAYING:
            return { ...state, isPlaying: !state.isPlaying };

        default:
            return state;
    }
}
