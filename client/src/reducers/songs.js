const initialState = {};

export default function songs(state = initialState, action) {
    if (action.songs) {
        return { ...state, ...action.songs };
    } else {
        return state;
    }
}
