import types from "../constants/ActionTypes";
import merge from 'lodash/merge';

const initialState = {};

export default function songs(state = initialState, action) {
    if (action.songs) {
        //return { ...state, ...action.songs };
        return merge({}, state, action.songs);
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
            case types.RECEIVE_SONG_COMMENTS:
                return {
                    ...state,
                    [action.songId]: {
                        ...state[action.songId],
                        comments: action.comments
                    }
                };
            default:
                return state;
        }
    }
}
