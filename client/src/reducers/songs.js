import types from "../constants/ActionTypes";

const initialState = {};

export default function songs(state = initialState, action) {
    if (action.songs) {
        return { ...state, ...action.songs };
    } else {
        switch (action.type) {
            case types.RECEIVE_SONG_WAVEFORM:
                return {
                    ...state,
                    [action.songId]: {
                        ...state[action.songId],
                        waveform: action.waveform
                    }
                };
            default:
                return state;
        }
    }
}
