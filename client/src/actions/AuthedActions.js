import { arrayOf, normalize } from "normalizr";
import Cookies from "js-cookie";
import SC from "soundcloud";

import { fetchSongs, receiveSongs } from "../actions/PlaylistActions";
import { navigateTo } from "../actions/NavActions";

import types from "../constants/ActionTypes";
import { AUTHED_PLAYLIST_SUFFIX } from "../constants/PlaylistConstants";
import { playlistSchema, songSchema, userSchema } from "../constants/schemas";

const COOKIE_PATH = "accessToken";
let refreshTimerId; //internal ID of the timer function, can use it to cancel the refreshing later TODO: move to the store??

export function appendLike(songId) {
    return {
        type: types.APPEND_LIKE,
        songId
    };
}

/*
 * Action fetchAuthedUser
 * Authenticates and fetches the data of the user with the given access token.
 */
function fetchAuthedUser(accessToken, shouldShowStream = true) {
    return dispatch => {
        fetch(`//api.soundcloud.com/me?oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(json => dispatch(setupUser(accessToken, json, shouldShowStream)))
            .catch(err => { throw err; });
    };
}

/*
 * Action fetchLikes
 * Fetch likes data from SoundCloud, which includes the songs being liked,
 * then add the songs to the app and set their liked status accordingly.
 */
function fetchLikes(accessToken) {
    return dispatch => {
        fetch(`//api.soundcloud.com/me/favorites?oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(json => {
                //preprocess (normalize + reduce) the response so it's a list of liked songIds...
                const songs = json.filter(song => song.streamable); //remove non-streamable songs
                const normalized = normalize(songs, arrayOf(songSchema));
                const likes = normalized.result.reduce((obj, songId) => { return {...obj, [songId] : 1}; }, {});
                dispatch(receiveLikes(likes));
                //dispatch receiveSongs action for the songs in the normalized likes, to add the songs to the liked playlist
                dispatch(receiveSongs({
                    songs: normalized.entities.songs,
                    users: normalized.entities.users,
                    songIds: normalized.result,
                    playlistId: `likes${AUTHED_PLAYLIST_SUFFIX}`
                }));
            })
            .catch(err => { throw err; });
    };
}

/*
 * Action fetchNewStreamSongs
 * Look for any new songs not already part of the stream, and add them to the stream.
 */
function fetchNewStreamSongs(url, accessToken) {
    return (dispatch, getState) => {
        const { authed, playlists } = getState();
        //collect the elements of streamSongs and newStreamSongs arrays into their respective hashsets. the key: 1 is arbitrary.
        const streamSongsSet = playlists[`stream${AUTHED_PLAYLIST_SUFFIX}`].items
            .reduce((obj, songId) => { return { ...obj, [songId] : 1 }; }, {});
        const newStreamSongsSet = authed.newStreamSongs
            .reduce((obj, songId) => { return { ...obj, [songId] : 1 }; }, {});

        /*
        Now fetch the new stream songs, preprocess them, and dispatch a reception action.
        */
        return fetch(url)
            .then(response => response.json())
            .then(json => {
                const collection = json.collection
                    .map(song => song.origin)
                    .filter(song => song.kind === "track" //we only care about songs we don't have! check that the fetched songs are NOT in our sets of songs.
                        && song.streamable
                        && !(song.id in streamSongsSet)
                        && !(song.id in newStreamSongsSet));
                return { futureUrl: `${json.future_href}&oauth_token=${accessToken}`, collection };
            })
            .then(data => {
                const normalized = normalize(data.collection, arrayOf(songSchema));
                //dispatch a receiveNewStreamSongs action.
                dispatch(receiveNewStreamSongs({
                    songs: normalized.entities.songs,
                    users: normalized.entities.users,
                    songIds: normalized.result,
                    futureUrl: data.futureUrl
                }));
            })
            .catch(err => { throw err; });
    };
}

/*
 * Action fetchPlaylists
 * Fetch playlists associated with the authed user.
 */
function fetchPlaylists(accessToken) {
    return dispatch => {
        fetch(`//api.soundcloud.com/me/playlists?oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(json => {
                const normalized = normalize(json, arrayOf(playlistSchema));
                //add the playlists as well as songs and users referenced in the playlists to the app.
                dispatch(receiveAuthedPlaylists(normalized.result, normalized.entities.songs, normalized.entities.users));
                normalized.result.forEach(playlistId => {
                    const playlist = normalized.entities.playlists[playlistId];
                    dispatch(receiveSongs({
                        songs: {}, //we already added the songs in the receiveAuthedPlaylists, no need to re-add
                        users: {}, //ditto
                        songIds: playlist.tracks,
                        playlistId: playlist.title + AUTHED_PLAYLIST_SUFFIX,
                        nextUrl: playlist.nextUrl,
                        futureUrl: playlist.futureUrl
                    }));
                });
            })
            .catch(err => { throw err; });
    };
}

/*
 * Action fetchStream
 * Fetch the songs in the main stream and receive them in a specific stream playlist.
 */
function fetchStream(accessToken) {
    return dispatch => {
        dispatch(initInterval(accessToken));
        dispatch(fetchSongs(
            `//api.soundcloud.com/me/activities/tracks/affiliated?limit=50&oauth_token=${accessToken}`,
            `stream${AUTHED_PLAYLIST_SUFFIX}`
        ));
    };
}

/*
 * Ret: Action initAuth
 * Attempts to authenticate the user if they have an access token, else do nothing.
 */
export function initAuth() {
    return dispatch => {
        const accessToken = Cookies.get(COOKIE_PATH);
        if (accessToken) {
            /*
            If an access token already exists (indicating user has a SC account), go ahead and
            authenticate the user with SoundCloud.
            */
            return dispatch(fetchAuthedUser(accessToken, false));
        }
        return null;
    };
}

export function loginUser(shouldShowStream = true) {
    return dispatch => {
        SC.initialize({
            client_id: CLIENT_ID,
            redirect_uri: `${window.location.protocol}//${window.location.host}/api/callback`
        });

        SC.connect().then(authObj => {
            Cookies.set(COOKIE_PATH, authObj.oauth_token);
            dispatch(fetchAuthedUser(authObj.oauth_token, shouldShowStream));
        }).catch(err => { throw err; });
    };
}

export function logoutUser() {
    return (dispatch, getState) => {
        Cookies.remove(COOKIE_PATH);
        const { authed, playlists, navigator } = getState();
        const { path } = navigator.route;
        const playlistsStr = authed.playlists.map((playlistId) =>
            playlists[playlistId].title + AUTHED_PLAYLIST_SUFFIX
        );

        clearInterval(refreshTimerId);

        if (path[0] === "me") {
            dispatch(navigateTo({ path: ["songs"] }));
        }

        return dispatch(resetAuthed(playlists));
    }
}

export function receiveAccessToken(accessToken) {
    return {
        type: types.RECEIVE_ACCESS_TOKEN,
        accessToken
    };
}

export function receiveAuthedPlaylists(playlists, songs, users) {
    return {
        type: types.RECEIVE_AUTHED_PLAYLISTS,
        songs,
        users,
        playlists
    };
}

export function receiveAuthedUser(user) {
    return {
        type: types.RECEIVE_AUTHED_USER,
        user
    };
}

export function receiveLikes(likes) {
    return {
        type: types.RECEIVE_LIKES,
        likes
    };
}

export function receiveNewStreamSongs({ songs, users, songIds, futureUrl }) {
    return {
        type: types.RECEIVE_NEW_STREAM_SONGS,
        songs,
        users,
        songIds,
        futureUrl
    };
}

function setStreamRefreshInterval(accessToken) {
    return (dispatch, getState) => {
        refreshTimerId = setInterval(() => {
            const playlistKey = `stream${AUTHED_PLAYLIST_SUFFIX}`;
            const { playlists } = getState();
            const streamPlaylist = playlists[playlistKey];

            if (streamPlaylist.futureUrl) {
                dispatch(fetchNewStreamSongs(streamPlaylist.futureUrl, accessToken));
            } else {
                clearInterval(refreshTimerId);
            }
        }, 60000);
    };
}

/*
 * Performs all necessary dispatches and function calls to setup the webapp personalized for the given user.
 */
function setupUser(accessToken, user, shouldShowStream) {
    return dispatch => {
        dispatch(receiveAccessToken(accessToken));
        dispatch(receiveAuthedUser(user));
        dispatch(fetchLikes(accessToken));
        dispatch(fetchPlaylists(accessToken));
        dispatch(fetchStream(accessToken));
        dispatch(fetchFollowings(accessToken));
        if (shouldShowStream) {
            //change the webapp path to something that reflects the user's stream, ex: .com/me/stream
            dispatch(navigateTo({
                path: ["me", "stream"]
            }));
        }
    };
}
