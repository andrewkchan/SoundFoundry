import types from "../constants/ActionTypes";
import { AUTHED_PLAYLIST_SUFFIX } from "../constants/PlaylistConstants";

/*
The initial state of each playlist, before songs are fetched/added.
*/
const initialPlaylistState = {
    isFetching: false,
    items: [], //IDs of items in playlist
    futureUrl: false, //URL used to poll for updated results
    nextUrl: false //URL used to get the next page in the (paginated) playlist
};

const LIKES_PLAYLIST_KEY = `likes${AUTHED_PLAYLIST_SUFFIX}`;
const STREAM_PLAYLIST_KEY = `stream${AUTHED_PLAYLIST_SUFFIX}`;

function playlist(state = initialPlaylistState, action) {
    switch (action.type) {
        case types.APPEND_LIKE:
            return { ...state, items: [action.songId, ...state.items] };

        case types.RECEIVE_SONGS:
            return {
                ...state,
                isFetching: false,
                items: [...state.items, ...action.songIds],
                futureUrl: action.futureUrl,
                nextUrl: action.nextUrl
            };

        case types.RECEIVE_NEW_STREAM_SONGS:
            return { ...state, futureUrl: action.futureUrl };

        case types.REMOVE_UNLIKED_SONGS:
            return { ...state, items: [...action.songIds] }; //prune all unliked songs

        case types.REQUEST_SONGS:
            return { ...state, isFetching: true, nextUrl: null };

        case types.UNSHIFT_NEW_STREAM_SONGS:
            return { ...state, items: [...action.songs, ...state.items] };

        default:
            return state;
    }
}

const initialState = {
    [LIKES_PLAYLIST_KEY]: { ...initialPlaylistState },
    [STREAM_PLAYLIST_KEY]: { ...initialPlaylistState }
};

export default function playlists(state = initialState, action) {
    switch (action.type) {
        case types.APPEND_LIKE:
            return { ...state, [LIKES_PLAYLIST_KEY]: playlist(state[LIKES_PLAYLIST_KEY], action) };

        case types.RECEIVE_SONGS:
            return { ...state, [action.playlistId]: playlist(state[action.playlistId], action) };

        case types.RECEIVE_NEW_STREAM_SONGS:
            return { ...state, [STREAM_PLAYLIST_KEY]: playlist(state[STREAM_PLAYLIST_KEY], action) };

        case types.REMOVE_UNLIKED_SONGS:
            return { ...state, [LIKES_PLAYLIST_KEY]: playlist(state[LIKES_PLAYLIST_KEY], action) };

        case types.REQUEST_SONGS:
            return { ...state, [action.playlistId]: playlist(state[action.playlistId], action) };

        case types.RESET_AUTHED: {
            const resetedPlaylists = [...action.playlistIds, STREAM_PLAYLIST_KEY, LIKES_PLAYLIST_KEY];
            const newState = resetedPlaylists.reduce((obj, p) => {
                return {...obj, [p]: initialPlaylistState};
            }, {});
            return {...state, ...newState};
        }

        case types.UNSHIFT_NEW_STREAM_SONGS:
            return { ...state, [STREAM_PLAYLIST_KEY]: playlist(state[STREAM_PLAYLIST_KEY], action) };

        default:
            return state;
    }
}
