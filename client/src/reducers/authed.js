import types from "../constants/ActionTypes";

const initialState = {
    accessToken: null, //access Token of the currently authed user.
    followings: {}, //set of users followed by the currently authed user.
    likes: {}, //set of songs liked by the currently authed user.
    newStreamSongs: [], //??
    playlists:[], //playlist IDs associated with the currently authed user in the app.
    user: null //ID of the currently authed user.
};

export default function authed(state = initialState, action) {
    switch (action.type) {
        case types.RECEIVE_ACCESS_TOKEN:
            return { ...state, accessToken: action.accessToken };

        case types.RECEIVE_AUTHED_USER:
            return { ...state, user: action.user };

        case types.RECEIVE_AUTHED_FOLLOWINGS:
            return { ...state, followings: action.users };

        case types.RECEIVE_AUTHED_PLAYLISTS:
            return { ...state, playlists: action.playlists };

        case types.RECEIVE_LIKES:
            return { ...state, likes: action.likes };

        case types.RECEIVE_NEW_STREAM_SONGS:
            return { ...state, newStreamSongs: [...action.songIds, ...state.newStreamSongs] };

        case types.RESET_AUTHED:
            return { ...initialState };

        case types.SET_FOLLOWING:
            return { ...state, followings: { ...state.followings, [action.userId]: action.followings } };

        case types.SET_LIKE:
            return { ...state, likes: {...state.likes, [action.songId]: action.liked } };

        case types.UNSHIFT_NEW_STREAM_SONGS:
            return { ...state, newStreamSongs: [] };

        default:
            return state;
    }
}
