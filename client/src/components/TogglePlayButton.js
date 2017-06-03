import React, { Component, PropTypes } from "react";
import { toggleIsPlaying } from "../actions/PlayerActions";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isSmall: PropTypes.bool
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
        const { isPlaying, isSmall } = this.props;
        let baseClass = "toggle-play-button";
        if (isSmall) {
            baseClass = "small-toggle-play-button";
        }
        return (
            <div
                className={`${baseClass} active ${isPlaying ? "is-playing" : ""}`}
                onClick={this.togglePlay}
            >
                <i className={`${baseClass}-icon ion-radio-waves`} />
                <i className={`${baseClass}-icon ion-ios-play`} />
            </div>
        );
    }
}

TogglePlayButton.propTypes = propTypes;

export default TogglePlayButton;
