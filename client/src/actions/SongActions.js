import { getWaveformUrl, pruneWaveformSamples } from "../utils/SongUtils";
import types from "../constants/ActionTypes";

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

function receiveSongWaveform(waveform, songId) {
    return {
        type: types.RECEIVE_SONG_WAVEFORM,
        waveform,
        songId
    };
}
