import {
    getWaveformUrl,
    pruneWaveformSamples,
    constructSongUrl,
    constructSongCommentsUrl,
    constructUserSongsUrl
} from "../utils/SongUtils";
import { arrayOf, normalize } from "normalizr";
import { receiveSongs } from "../actions/PlaylistActions";
import { songSchema } from "../constants/schemas";
import types from "../constants/ActionTypes";
import { SONG_PLAYLIST_SUFFIX } from "../constants/PlaylistConstants";

/*
 * Action fetchSongFullContentIfNeeded
 * Fetches all the content of a song if the content has not already been fetched, including the song itself, comments, and related songs.
 * @param   songId  -The id of the song to fetch content for.
 */
export function fetchSongFullContentIfNeeded(songId) {
    return (dispatch, getState) => {
        const { songs, playlists } = getState();
        //if we don't have the song at all (for example if just coming from a song URL)
        //then fetch the full song content
        if (!(songId in songs)) {
            dispatch(fetchSongFullContent(songId));
        } else {
            //if already have the song, check if we have related content for it
            const song = songs[songId];
            const songPlaylistId = String(songId) + SONG_PLAYLIST_SUFFIX;
            if (!(songPlaylistId in playlists)) {
                //do we have playlist of related content?
                dispatch(receiveSongs({
                    songs: {},
                    users: {},
                    songIds: [songId],
                    playlistId: songPlaylistId,
                    nextUrl: null,
                    futureUrl: null
                }));
            }
            if (!("comments" in song)) {
                //do we have the related content itself?
                dispatch(fetchSongRelatedContent(songId, song.user_id, songPlaylistId));
            }
        }
    };
}

/*
 * Action fetchSongFullContent
 * Fetches all the content of a song, including the song itself, comments, and related songs.
 * @param   songId  -The id of the song to fetch content for.
 */
export function fetchSongFullContent(songId) {
    return (dispatch) => {
        const songPlaylistId = String(songId) + SONG_PLAYLIST_SUFFIX;
        return fetch(constructSongUrl(songId))
            .then(response => response.json())
            .then(json => {
                const normalized = normalize(json, songSchema);
                const songTitle = normalized.entities.songs[songId].title;
                const userId = normalized.entities.songs[songId].user_id;
                //receive the song itself
                dispatch(receiveSongs({
                    songs: normalized.entities.songs,
                    users: normalized.entities.users,
                    songIds: [songId],
                    playlistId: songPlaylistId,
                    nextUrl: null,
                    futureUrl: null
                }));
                //then fetch its related content
                dispatch(fetchSongRelatedContent(songId, userId, songPlaylistId));
            })
    };
}
/*
 * Action fetchSongRelatedContent
 * Fetches the related content of a song such as the comments and related songs.
 * @param   songId  -The id of the song to fetch content for.
 * @param   userId  -The id of the author of the song
 * @param   playlistId   -The id of the playlist to put the related songs in
 */
export function fetchSongRelatedContent(songId, userId, playlistId) {
    return (dispatch) => {
        dispatch(fetchSongComments(songId));
        dispatch(fetchRelatedSongs(songId, userId, playlistId));
    };
}
/*
 * Action fetchSongComments
 * Fetches the comments for the given song.
 * @param   songId  -The id of the song to fetch comments for.
 */
export function fetchSongComments(songId) {
    return (dispatch) =>
        fetch(constructSongCommentsUrl(songId))
            .then(response => response.json())
            .then(json => dispatch(receiveSongComments(songId, json)))
            .catch(err => { throw err; });
}
/*
 * Action fetchRelatedSongs
 * Fetches the related songs for a given song.
 * @param   songId  -The id of the given song.
 * @param   userId  -The id of the author of the song
 * @param   playlistId   -The id of the playlist to put related songs in
 */
export function fetchRelatedSongs(songId, userId, playlistId) {
    return (dispatch) =>
        fetch(constructUserSongsUrl(userId))
            .then(response => response.json())
            .then(json => {
                const songs = json.filter((song) => { return song.id !== songId; });
                const normalized = normalize(songs, arrayOf(songSchema));
                dispatch(receiveSongs({
                    songs: normalized.entities.songs,
                    users: normalized.entities.users,
                    songIds: songs.map((song) => { return song.id; }),
                    playlistId: playlistId,
                    nextUrl: null,
                    futureUrl: null
                }));
            })
            .catch(err => { throw err; });
}

/*
 * Action fetchSongWaveform
 * Fetches the raw waveform data for a given song and stores it back in the song object.
 * @param   songId  -The id of the song to fetch the waveform for.
 * @param   song    -The song object corresponding to songId.
 */
export function fetchSongWaveform(songId, song) {
    return (dispatch, getState) => {
        const { waveform_url } = song;

        return fetch(getWaveformUrl(waveform_url))
            .then(response => response.json())
            .then(json => {
                let prunedWaveform = pruneWaveformSamples(json);
                dispatch(receiveSongWaveform(prunedWaveform, songId));
            })
            .catch(err => { throw err; });
    };
}

function receiveSongComments(songId, comments) {
    return {
        type: types.RECEIVE_SONG_COMMENTS,
        comments,
        songId
    };
}

function receiveSongWaveform(waveform, songId) {
    return {
        type: types.RECEIVE_SONG_WAVEFORM,
        waveform,
        songId
    };
}
