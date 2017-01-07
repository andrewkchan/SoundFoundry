import React, { Component, PropTypes } from "react";
import Link from "../components/Link";
import Popover from "../components/Popover";

import { loginUser, logoutUser } from "../actions/AuthedActions";
import { getImageUrl } from "../utils/SongUtils";

const propTypes = {
    authed: PropTypes.object.isRequired,
    authedPlaylists: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired
};

class Nav extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    /*
     * function getPlaylistFromRoute()
     * Get the playlist title specified by the current URL.
     */
    getPlaylistFromRoute() {
        const { authedPlaylists, navigator } = this.props;
        const { path } = navigator.route;

        if (path[0] === "me"
        && path[1] === "playlists"
        && path[2] in authedPlaylists) {
            return authedPlaylists[path[2]].title;
        }

        return "playlists";
    }

    login(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(loginUser());
    }

    logout(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(logoutUser());
    }

    renderLikesLink() {
        const { authed, dispatch, navigator } = this.props;
        const { route } = navigator;
        if (!authed.user) {
            return null;
        }

        return (
            <div className="nav-nav-item">
                <Link
                    className={`nav-nav-user-link ${(route.path[1] === "likes" ? "active" : "")}`}
                    dispatch={dispatch}
                    route={{ path: ["me", "likes"] }}
                >
                    <span className="nav-nav-user-link-text">Likes</span>
                </Link>
            </div>
        );
    }

    renderNavUser() {
        const { authed } = this.props;

        /*
        If there is an authenticated user, display a logout button when profile pic is clicked on.
        Else display a generic profile pic and login button when it is clicked.
        */
        let popoverButton;
        let profilePic;
        if (authed.user) {
            popoverButton = (<a href="#" onClick={this.logout}>Log out</a>);
            profilePic = (
                <img
                    className="nav-authed-image"
                    src={getImageUrl(authed.user.avatar_url)}
                />
            );
        } else {
            popoverButton = (<a href="#" onClick={this.login}>Sign in</a>);
            profilePic = (<i className="icon ion-person" />);
        }
        return (
            <Popover className="nav-user">
                <div className="nav-user-link">
                    {profilePic}
                    <i className="icon ion-chevron-down" />
                    <i className="icon ion-chevron-up" />
                </div>
                <div className="nav-user-popover popover-content">
                    <ul className="nav-user-popover-list">
                        <li className="nav-user-popover-item">
                            {popoverButton}
                        </li>
                    </ul>
                </div>
            </Popover>
        );
    }

    renderStreamLink() {
        const { authed, dispatch, navigator } = this.props;
        const { route } = this.props;
        const hasNewStreamSongs = authed.newStreamSongs.length > 0;
        if (!authed.user) {
            return null;
        }

        return (
            <div className="nav-nav-item">
                <Link
                    className={`nav-nav-user-link ${route.path[1] === "stream" ? "active" : ""}`}
                    dispatch={dispatch}
                    route={{ path: ["me", "stream"] }}
                >
                    {hasNewStreamSongs ? <div className="nav-nav-user-link indicator" /> : null}
                    <span className="nav-nav-user-link-text">Stream</span>
                </Link>
            </div>
        );
    }

    render() {
        const { dispatch } = this.props;
        return (
            <div className="nav">
                <div className="container clearfix">
                    <div className="nav-logo">
                        <i className="icon ion-radio-waves" />
                    </div>
                    <div className="nav-nav float-left">
                        <div className="nav-nav-item">
                            <Link
                                className="nav-nav-item-link active"
                                dispatch={dispatch}
                                route={{ path: ["songs"] }}
                            >
                                SoundFoundry
                            </Link>
                        </div>
                    </div>
                    {this.renderStreamLink()}
                    {this.renderLikesLink()}
                </div>
                <div className="nav-nav float-right">
                    <div className="nav-nav-item">
                        (SEARCH PLACEHOLDER)
                    </div>
                    <div className="nav-nav-item">
                        {this.renderNavUser()}
                    </div>
                </div>
            </div>
        );
    }
}

Nav.propTypes = propTypes;

export default Nav;
