import { arrayOf, normalize } from "normalizr";
import { changePlayingSong } from "../actions/PlayerActions";
import { constructCategoryUrl } from "../utils/SongUtils";

import { songSchema } from "../constants/schemas";
import types from "../constants/ActionTypes";

/*
 * action fetchSongs
 * Fetches a list of songs from the given URL and places them in the playlist enumerated by playlistId.
 * @param   url         The SoundCloud API endpoint from which to request the songs.
 * @param   playlistId  The id of the playlist to put the songs in.
 */
export function fetchSongs(url, playlistId) {
    return (dispatch, getState) => {
        const { authed } = getState();
        dispatch(requestSongs(playlistId));

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                /*
                Set pagination URLs nextUrl and futureUrl.
                */
                let nextUrl = null;
                let futureUrl = null;
                if (json.next_href) {
                    nextUrl = json.next_href;
                    nextUrl += (authed.accessToken ? `oauth_token=${authed.accessToken}` : "");
                }

                if (json.future_href) {
                    futureUrl = json.future_href;
                    futureUrl += (authed.accessToken ? `oauth_token=${authed.accessToken}` : "");
                }

                /*
                Preprocess the songs in the playlist and normalize the results.
                */
                const songs = json.collection
                    .map(song => song.origin || song)
                    .filter(song => {
                        return song.streamable && song.kind == "track"; //we only want streamable songs!
                    });

                const normalized = normalize(songs, arrayOf(songSchema));
                const songIds = normalized.result.reduce((arr, songId) => {
                    if (arr.indexOf(songId) === -1) {
                        arr.push(songId); //no duplicate songs in our playlist - only unique ones.
                    }

                    return arr;
                }, []);

                dispatch(receiveSongs({
                    songs: normalized.entities.songs,
                    users: normalized.entities.users,
                    songIds: songIds,
                    playlistId: playlistId,
                    nextUrl: nextUrl,
                    futureUrl: futureUrl
                }));
            })
            .catch(err => { throw err; });
    };
}

export function fetchSongsIfNeeded(playlistId) {
    return (dispatch, getState) => {
        const { playlists } = getState();
        if (shouldFetchSongs(playlists, playlistId)) {
            const nextUrl = getNextUrl(playlists, playlistId);
            return dispatch(fetchSongs(nextUrl, playlistId));
        }
    };
}

function getNextUrl(playlists, playlistId) {
    const activePlaylist = playlists[playlistId];
    if (!activePlaylist || activePlaylist.nextUrl === false) {
        return constructCategoryUrl(playlistId);
    }

    return activePlaylist.nextUrl;
}

/*
 * Action receiveSongs
 * Add the given songIds to the playlist with id playlistId, also adding the necessary entities.
 * @param   songs       An object with keys == songIds and values == song entities
 * @param   users       An object with keys == userIds and values == user entities
 * @param   songIds     A list of songIds to add to the playlist
 * @param   playlistId  The ID of the playlist to add the songs to
 * @param   nextUrl     String URL of the next page of the playlist
 * @param   futureUrl   String URL of the URL to poll new songs of the playlist from
 */
export function receiveSongs({ songs, users, songIds, playlistId, nextUrl, futureUrl }) {
    return {
        type: types.RECEIVE_SONGS,
        futureUrl,
        nextUrl,
        playlistId,
        songIds,
        songs,
        users
    };
}

export function removeUnlikedSongsPre() {
    return (dispatch, getState) => {
        const LIKES_PLAYLIST_KEY = `likes${AUTHED_PLAYLIST_SUFFIX}`;
        const { authed, player, playlists } = getState();
        const { currentSongIndex } = player;
        const playingPlaylist = getPlayingPlaylist(player);

        const likedSongs = playlists[LIKES_PLAYLIST_KEY].items
            .filter(songId => songId in authed.likes && authed.likes[songId] == 1);

        //if currently playing a song we want to remove, stop playing it.
        if (playingPlaylist === LIKES_PLAYLIST_KEY && currentSongIndex >= likedSongs.length) {
            dispatch(changePlayingSong(null));
        }

        dispatch(removeUnlikedSongs(likedSongs));
    };
}

/*
 * Action removedUnlikedSongs
 * Prune all unliked songs.
 * @param   songs   The liked song IDs that we want to keep. All other songs are pruned.
 */
function removeUnlikedSongs(songs) {
    return {
        type: types.REMOVE_UNLIKED_SONGS,
        songs
    };
}

function requestSongs(playlistId) {
    return {
        type: types.REQUEST_SONGS,
        playlistId
    };
}

/*
 * shouldFetchSongs
 * @return  Whether the given playlist ID needs to be fetched or not.
 */
function shouldFetchSongs(playlists, playlistId) {
    const activePlaylist = playlists[playlistId];
    if (!activePlaylist || (!activePlaylist.isFetching && (activePlaylist.nextUrl !== null))) {
        return true;
    }
    return false;
}
