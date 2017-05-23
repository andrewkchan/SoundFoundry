import React, { Component, PropTypes } from "react";
import { navigateTo } from "../actions/NavActions";

const propTypes = {
    dispatch: PropTypes.func.isRequired,
};

class NavSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: ""
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
    }
    handleOnChange(e) {
        this.setState({
            query: e.currentTarget.value
        });
    }
    handleOnKeyPress(e) {
        if (e.charCode === 13) {
            const { dispatch } = this.props;
            const { query } = this.state;
            if (query !== "") {
                dispatch(navigateTo({ path: ["songs"], query: { q: query } }));
            }
        }
    }

    render() {
        const { query } = this.state;
        return (
            <div className="nav-search">
                <i className="icon ion-search" />
                <input
                    className="nav-search-input"
                    placeholder="SEARCH"
                    onChange={this.handleOnChange}
                    onKeyPress={this.handleOnKeyPress}
                    type="text"
                    value={query}
                />
            </div>
        );
    }
}

NavSearch.propTypes = propTypes;

export default NavSearch;
