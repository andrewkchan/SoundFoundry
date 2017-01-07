import { combineReducers } from "redux";
import authed from "../reducers/authed";
import env from "../reducers/env";
import navigator from "../reducers/navigator";
import player from "../reducers/player";
import playlists from "../reducers/playlists";
import songs from "../reducers/songs";
import users from "../reducers/users";

const rootReducer = combineReducers({
    authed,
    env,
    navigator,
    player,
    playlists,
    songs,
    users
});

export default rootReducer;
