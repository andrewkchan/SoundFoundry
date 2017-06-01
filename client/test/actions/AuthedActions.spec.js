import expect from 'expect';
//SoundCloud API requires browser! doesn't work in node.
//import * as actions from '../../src/actions/AuthedActions';
import types from '../../src/constants/ActionTypes';
//
// describe("appendLike", () => {
//     it("should create an APPEND_LIKE action", () => {
//         const songId = 5;
//         expect(actions.appendLike(songId), {
//             type: types.APPEND_LIKE,
//             songId
//         });
//     });
// });
//
// describe("receiveAccessToken", () => {
//     it("should create a RECEIVE_ACCESS_TOKEN action", () => {
//         const accessToken = "DEADBEEF";
//         expect(actions.receiveAccessToken(accessToken), {
//             type: types.RECEIVE_ACCESS_TOKEN,
//             accessToken
//         });
//     });
// });
//
// describe("receiveAuthedPlaylists", () => {
//     it("should create a RECEIVE_AUTHED_PLAYLISTS action", () => {
//         const playlists = {
//             "playlist1": {
//                 items: [1]
//             },
//             "playlist2": {
//                 items: [4]
//             },
//         };
//         const songs = {
//             "1": {
//                 title: "song one",
//                 user_id: "1"
//             },
//             "4": {
//                 title: "song four",
//                 user_id: "1"
//             }
//         };
//         const users = {
//             "1": {
//                 name: "genericuser"
//             }
//         };
//         expect(actions.receiveAuthedPlaylists(playlists, songs, users), {
//             type: types.RECEIVE_AUTHED_PLAYLISTS,
//             playlists,
//             songs,
//             users
//         });
//     });
// });
//
// describe("receiveAuthedUser", () => {
//     it("should create a RECEIVE_AUTHED_USER action", () => {
//         const user = {
//             name: "yee",
//             id: "0"
//         };
//         expect(actions.receiveAuthedUser(user), {
//             type: types.RECEIVE_AUTHED_USER,
//             user
//         });
//     });
// });
