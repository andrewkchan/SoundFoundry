const initialState = {};

export default function users(state = initialState, action) {
    if (action.users) {
        return { ...state, ...action.users };
    } else {
        return state;
    }
}
