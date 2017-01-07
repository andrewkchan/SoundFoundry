import React, { Component, PropTypes } from "react";
import { toggleIsPlaying } from "../actions/PlayerActions";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired
};

class TogglePlayButton extends Component {
    constructor() {
        super();
        this.togglePlay = this.togglePlay.bind(this);
    }

    togglePlay() {
        const { dispatch, isPlaying } = this.props;
        dispatch(toggleIsPlaying());
    }

    render() {
        const { isPlaying } = this.props;
        return (
            <div
                className={`toggle-play-button active ${isPlaying ? "is-playing" : ""}`}
                onClick={this.togglePlay}
            >
                <i className="toggle-play-button-icon ion-radio-waves" />
                <i className="toggle-play-button-icon ion-ios-play" />
            </div>
        );
    }
}

TogglePlayButton.propTypes = propTypes;

export default TogglePlayButton;
