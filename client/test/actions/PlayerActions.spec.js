import expect from 'expect';
import * as actions from '../../src/actions/PlayerActions';
import types from '../../src/constants/ActionTypes';

describe("changeCurrentPercent", () => {
    it("should create a CHANGE_CURRENT_PERCENT action", () => {
        expect(actions.changeCurrentPercent(0.5), {
            type: types.CHANGE_CURRENT_PERCENT,
            percent: 0.5,
            outOfSync: false
        });
        expect(actions.changeCurrentPercent(1.0, true), {
            type: types.CHANGE_CURRENT_PERCENT,
            percent: 1.0,
            outOfSync: true
        });
    });
});

describe("changePlayingSong", () => {
    it("should create a CHANGE_PLAYING_SONG action", () => {
        expect(actions.changePlayingSong(0), {
            type: types.CHANGE_PLAYING_SONG,
            songIndex: 0,
            percent: 0
        });
        expect(actions.changePlayingSong(1, 0.5), {
            type: types.CHANGE_PLAYING_SONG,
            songIndex: 1,
            percent: 0.5
        });
    });
});

describe("changeSelectedPlaylists", () => {
    it("should add a new playlist to selectedPlaylistIds", () => {
        const selectedPlaylistIds = [1,2,3,4];
        const newPlaylistAction = actions.changeSelectedPlaylists(selectedPlaylistIds, 5);
        expect(newPlaylistAction.type, types.CHANGE_SELECTED_PLAYLISTS);
        expect(newPlaylistAction.selectedPlaylistIds).toEqual([1,2,3,4,5]);
    });
    it("should move existing playlist to end of selectedPlaylistIds", () => {
        const selectedPlaylistIds = [1,2,3,4,5];
        const newPlaylistAction = actions.changeSelectedPlaylists(selectedPlaylistIds, 1);
        expect(newPlaylistAction.type, types.CHANGE_SELECTED_PLAYLISTS);
        expect(newPlaylistAction.selectedPlaylistIds).toEqual([2,3,4,5,1]);
    });
});
