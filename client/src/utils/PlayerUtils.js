/*
 * PlayerUtils.js
 * A collection of functions to manipulate audio player related state.
 */

export function getPlayingSongId(player, playlists) {
    if (player.currentSongIndex !== null) {
        const currPlaylistKey = player.selectedPlaylistIds[player.selectedPlaylistIds.length - 1];
        const currPlaylist = playlists[currPlaylistKey];
        return currPlaylist.items[player.currentSongIndex];
    }

    return null;
}

export function getPlayingPlaylist(player) {
    if (player.selectedPlaylistIds.length === 0) {
        return null;
    }

    return player.selectedPlaylistIds[player.selectedPlaylistIds.length - 1];
}
