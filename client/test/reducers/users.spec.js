import expect from 'expect';
import users from '../../src/reducers/users';
import types from '../../src/constants/ActionTypes';

describe("users reducer", () => {
    it("should return the initial state", () => {
        expect(users(undefined, { type: types.TOGGLE_IS_PLAYING }), {});
    });
    it("should handle any action with users", () => {
        const inputState = {
            "1": {
                name: "Jack",
                id: "1"
            }
        };
        const inputAction = {
            type: types.RECEIVE_USER,
            users: {
                "2": {
                    name: "Jill",
                    id: "2"
                }
            }
        };
        expect(users(inputState, inputAction)).toEqual({
            "1": {
                name: "Jack",
                id: "1"
            },
            "2": {
                name: "Jill",
                id: "2"
            }
        });
    });
    it("should replace existing users with same ID", () => {
        const inputState = {
            "1": {
                name: "Jack",
                id: "1"
            }
        };
        const inputAction = {
            type: types.RECEIVE_USER,
            users: {
                "1": {
                    name: "John",
                    id: "1"
                }
            }
        };
        expect(users(inputState, inputAction)).toEqual({
            "1": {
                name: "John",
                id: "1"
            }
        });
    })
});
