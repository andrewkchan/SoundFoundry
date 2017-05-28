import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import { initAuth } from "../actions/AuthedActions";
import { initEnv } from "../actions/EnvActions";
import { initNav } from "../actions/NavActions";

import NavContainer from "../containers/NavContainer";
import PlayerContainer from "../containers/PlayerContainer";
import SongsContainer from "../containers/SongsContainer";
import SongContainer from "../containers/SongContainer";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    path: PropTypes.array.isRequired
};

class App extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(initAuth()); //authorize the user if he/she exists.
        dispatch(initEnv()); //initialize the app environment according to the device.
        dispatch(initNav()); //set browser back buttons and history to work with the app.
    }

    renderContent() {
        const { path } = this.props;
        switch (path[0]) {
            case "songs":
                switch (path.length) {
                    case 1:
                        return <SongsContainer />;
                    case 2:
                        //TODO:return single song
                        return <SongContainer songId={Number(path[1])} />;
                    default:
                        return null;
                }
            case "users":
                //TODO: return user info
                return null;
            case "me":
                //TODO: return my info
                return null;
            default:
                return <SongsContainer />;
        }
    }

    render() {
        const { height, isMobile, width } = this.props;
        return (
            <div>
                <NavContainer />
                {this.renderContent()}
                <PlayerContainer />
            </div>
        );
    }
}

App.propTypes = propTypes;

function mapStateToProps(state) {
    const { env, navigator } = state;
    const { height, isMobile, width } = env;
    const { path } = navigator.route;

    return {
        height,
        isMobile,
        path,
        width
    };
}

export default connect(mapStateToProps)(App);
