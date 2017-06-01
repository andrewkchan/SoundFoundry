import expect from 'expect';
import player from '../../src/reducers/player';
import types from '../../src/constants/ActionTypes';

describe("player", () => {
    const initialState = {
        currentSongIndex: null,
        percent: 0,
        isPlaying: false,
        isSeeking: false,
        outOfSync: false,
        selectedPlaylistIds: []
    };
    const someState = {
        currentSongIndex: 1,
        percent: 0.2223,
        isPlaying: true,
        isSeeking: false,
        outOfSync: false,
        selectedPlaylistIds: ["ODESZA", "chill", "Phay"]
    };
    it("should return initial state", () => {
        expect(player(undefined, {}), initialState);
    })
    it("should handle CHANGE_CURRENT_PERCENT action", () => {
        const inputAction = {
            type: types.CHANGE_CURRENT_PERCENT,
            percent: 0.5,
            outOfSync: true
        };
        expect(player(someState, inputAction), {
            currentSongIndex: 1,
            percent: 0.5,
            isPlaying: true,
            isSeeking: false,
            outOfSync: true,
            selectedPlaylistIds: ["ODESZA", "chill", "Phay"]
        });
    });
    it("should handle CHANGE_PLAYING_SONG action", () => {
        const inputAction = {
            type: types.CHANGE_PLAYING_SONG,
            percent: 0.1,
            songIndex: 3
        };
        expect(player(someState, inputAction), {
            currentSongIndex: 3,
            percent: 0.1,
            isPlaying: true,
            isSeeking: false,
            outOfSync: true,
            selectedPlaylistIds: ["ODESZA", "chill", "Phay"]
        });
    });
    it("should handle CHANGE_SELECTED_PLAYLISTS action", () => {
        const inputAction = {
            type: types.CHANGE_SELECTED_PLAYLISTS,
            selectedPlaylistIds: ["whatever"]
        };
        expect(player(someState, inputAction), {
            currentSongIndex: 1,
            percent: 0.2223,
            isPlaying: true,
            isSeeking: false,
            outOfSync: false,
            selectedPlaylistIds: ["whatever"]
        });
    });
    it("should go back to initial state on RESET_AUTHED action", () => {
        expect(player(someState, {
            type: types.RESET_AUTHED
        }), initialState);
    });
    it("should handle SET_IS_PLAYING action", () => {
        const inputAction = {
            type: types.SET_IS_PLAYING,
            isPlaying: false
        };
        expect(player(someState, inputAction), {
            currentSongIndex: 1,
            percent: 0.2223,
            isPlaying: false,
            isSeeking: false,
            outOfSync: false,
            selectedPlaylistIds: ["ODESZA", "chill", "Phay"]
        });
    });
    it("should handle SET_IS_SEEKING action", () => {
        const inputAction = {
            type: types.SET_IS_SEEKING,
            isSeeking: true
        };
        expect(player(someState, inputAction), {
            currentSongIndex: 1,
            percent: 0.2223,
            isPlaying: true,
            isSeeking: true,
            outOfSync: false,
            selectedPlaylistIds: ["ODESZA", "chill", "Phay"]
        });
    });
    it("should handle TOGGLE_IS_PLAYING action", () => {
        const inputAction = {
            type: types.TOGGLE_IS_PLAYING,
        };
        expect(player(someState, inputAction), {
            currentSongIndex: 1,
            percent: 0.2223,
            isPlaying: false,
            isSeeking: false,
            outOfSync: false,
            selectedPlaylistIds: ["ODESZA", "chill", "Phay"]
        });
    });
});
