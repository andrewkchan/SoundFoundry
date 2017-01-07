import types from "../constants/ActionTypes";

const initialState = {
    currentSongIndex: null,
    currentTime: 0,
    isPlaying: false,
    selectedPlaylistIds: [] //list of playlist IDs loaded in the player. the currently playing playlist is indicated by the LAST element of this list
};

export default function player(state = initialState, action) {
    switch (action.type) {
        case types.CHANGE_CURRENT_TIME:
            return { ...state, currentTime: action.time };

        case types.CHANGE_PLAYING_SONG:
            return { ...state, currentSongIndex: action.songIndex };

        case types.CHANGE_SELECTED_PLAYLISTS:
            return { ...state, selectedPlaylistIds: action.selectedPlaylistIds };

        case types.RESET_AUTHED:
            return { ...initalState };

        case types.SET_IS_PLAYING:
            return { ...state, isPlaying: action.isPlaying };

        case types.TOGGLE_IS_PLAYING:
            return { ...state, isPlaying: !state.isPlaying };

        default:
            return state;
    }
}
