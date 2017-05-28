import types from "../constants/ActionTypes";

export const initialRoute = { path: ["songs"], query: { q: "chill" } };
const initialState = { route: initialRoute };

export default function navigator(state = initialState, action) {
    switch (action.type) {
        case types.CHANGE_PATH:
            return { ...state, route: action.route };

        default:
            return state;
    }
}
