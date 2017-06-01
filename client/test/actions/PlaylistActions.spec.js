import expect from 'expect';
import * as actions from '../../src/actions/PlaylistActions';
import types from '../../src/constants/ActionTypes';

describe('receiveSongs', () => {
    it('should create RECEIVE_SONGS action', () => {
        const songs = {1: {name: 'Say My Name'}, 2: {name: 'IPlayUListen'}};
        const songIds = [1, 2];
        const playlistId = 'ODESZA';
        const users = {};
        expect(actions.receiveSongs({
            songs,
            users,
            songIds,
            playlistId
        })).toEqual({
          type: types.RECEIVE_SONGS,
          users,
          futureUrl: undefined,
          nextUrl: undefined,
          playlistId,
          songs,
          songIds
        });
    });
});

describe("removeUnlikedSongs", () => {
    it("should create REMOVE_UNLIKED_SONGS action", () => {
        const songIds = [1, 2];

        expect(actions.removeUnlikedSongs(songIds)).toEqual({
          type: types.REMOVE_UNLIKED_SONGS,
          songs: songIds
        });
    });
});

describe("requestSongs", () => {
    it("should create REQUEST_SONGS action", () => {
        const playlistId = "ODESZA";

        expect(actions.requestSongs(playlistId)).toEqual({
          type: types.REQUEST_SONGS,
          playlistId
        });
    });
});

describe("shouldFetchSongs", () => {
    it("should determine whether given playlist can fetch more songs", () => {
        const playlists = {
            "ODESZA": {
                isFetching: false,
                nextUrl: "http://example.com",
                futureUrl: null,
                items: [1,2,3]
            },
            "Phay": {
                isFetching: true,
                nextUrl: "http://example.com",
                futureUrl: null,
                items: [4,5,6]
            },
            "Khary": {
                isFetching: true,
                nextUrl: null,
                futureUrl: null,
                items: [7]
            },
            "IAMSU": {
                isFetching: false,
                nextUrl: null,
                futureUrl: null,
                items: [8]
            }
        };

        expect(actions.shouldFetchSongs(playlists, "Nonexistent playlist")).toEqual(true);
        expect(actions.shouldFetchSongs(playlists, "ODESZA")).toEqual(true);
        expect(actions.shouldFetchSongs(playlists, "Phay")).toEqual(false);
        expect(actions.shouldFetchSongs(playlists, "Khary")).toEqual(false);
        expect(actions.shouldFetchSongs(playlists, "IAMSU")).toEqual(false);
    });
});
