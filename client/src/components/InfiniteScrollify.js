import React, { Component, PropTypes } from "react";

/*
Exports a function that can be called on any react component in order to provide a infinitely scrollable element.

TODO: Migrate this functionality from a mixin to something a little less unwieldy.
*/

export default function(InnerComponent) {
    class InfiniteScrollComponent extends Component {
        constructor(props) {
            super(props);
            this.onScroll = this.onScroll.bind(this);
        }

        componentDidMount() {
            window.addEventListener("scroll", this.onScroll, false);
        }

        componentWillUnmount() {
            window.removeEventListener("scroll", this.onScroll, false);
        }

        /*
         * Called when the user scrolls.
         */
        onScroll() {
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
                //dispatch the class scroll function.
                const { dispatch, scrollFunc } = this.props;
                dispatch(scrollFunc());
            }
        }

        render() {
            return <InnerComponent {...this.props} />;
        }
    }

    InfiniteScrollComponent.propTypes = {
        dispatch: PropTypes.func.isRequired,
        scrollFunc: PropTypes.func.isRequired
    };

    return InfiniteScrollComponent;
}
