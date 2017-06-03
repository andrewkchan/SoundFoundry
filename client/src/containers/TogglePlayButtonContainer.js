import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import TogglePlayButton from "../components/TogglePlayButton";

const propTypes = {
    isSmall: PropTypes.bool
};

class TogglePlayButtonContainer extends Component {
    render() {
        return <TogglePlayButton {...this.props} />;
    }
}

TogglePlayButtonContainer.propTypes = propTypes;

function mapStateToProps(state) {
    const { player } = state;
    const { isPlaying } = player;

    return {
        isPlaying
    };
}

export default connect(mapStateToProps)(TogglePlayButtonContainer);
