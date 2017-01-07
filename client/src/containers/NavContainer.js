import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Nav from "../components/Nav";

const propTypes = {
    isMobile: PropTypes.bool
};

class NavContainer extends Component {
    render() {
        return <Nav {...this.props} />;
    }
}

NavContainer.propTypes = propTypes;

function mapStateToProps(state) {
    const { authed, env, navigator, playlists, songs, users } = state;
    const { isMobile } = env;

    return {
        authed,
        authedPlaylists: playlists,
        isMobile,
        navigator,
        songs
    };
}

export default connect(mapStateToProps)(NavContainer);
