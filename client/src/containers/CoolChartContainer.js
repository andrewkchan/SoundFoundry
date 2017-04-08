import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import CoolChart from "../components/CoolChart";

const propTypes = {
    isMobile: PropTypes.bool,
    className: PropTypes.string,
    inverted: PropTypes.bool
};

class CoolChartContainer extends Component {
    render() {
        return <CoolChart {...this.props} />;
    }
}

CoolChartContainer.propTypes = propTypes;

function mapStateToProps(state) {
    const { player } = state;

    return {
        player
    };
}

export default connect(mapStateToProps)(CoolChartContainer);
