import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { getOffsetLeft, getOffsetTop } from "../utils/MouseUtils";

const propTypes = {
    initialProgress: PropTypes.number,          //(should be between 0.0 and 1.0 inclusive) the initial progress of the seekbar.
    isVertical: PropTypes.bool,                 //whether or not the seekbar is vertical. by default will be false.
    onSeek: PropTypes.func.isRequired,          //the callback with param (progress: Number) called whenever the mouse moves and thumb displaces.
    seekFinished: PropTypes.func.isRequired,     //the callback with param (progress: Number) to be called when seeking stops
    totalLength: PropTypes.number.isRequired
};

/*
 * Component CustomSeekBar
 * A more versatile seek bar than SeekBar; takes in a single child component and turns that component into a seekable component.
 * For example: Given an HTML canvas element as a child, CustomSeekBar will give that canvas element seekbar functionality.
 *
 * NOTE: relevant (0 padding, 0 margin) style rules should be set for class .custom-seekbar-wrapper
 */
class CustomSeekBar extends Component {
    constructor(props) {
        super(props);

        if (props.children.length != 1) {
            throw new Error("CustomSeekBar component requires exactly 1 child!");
        }

        const initialProgress = this.props.initialProgress ? this.props.initialProgress : 0.0;
        if (initialProgress > 1.0 || initialProgress < 0.0) {
            throw new Error("Cannot have progress of more than 1.0 or less than 0.0");
        }

        this.state = {
            barPos: 0,
            isSeeking: false,
            progress: initialProgress,
        }

        this.bindSeekEvents = this.bindSeekEvents.bind(this);
        this.handleClickSeek = this.handleClickSeek.bind(this);
        this.handleSeekMouseDown = this.handleSeekMouseDown.bind(this);
        this.handleSeekMouseMove = this.handleSeekMouseMove.bind(this);
        this.handleSeekMouseUp = this.handleSeekMouseUp.bind(this);
        this.unbindSeekEvents = this.unbindSeekEvents.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { isSeeking } = this.state;
        const initialProgress = nextProps.initialProgress ? nextProps.initialProgress : this.state.progress;
        if (isSeeking || initialProgress === this.state.progress) {
            return;
        } else if (initialProgress > 1.0 || initialProgress < 0.0) {
            throw new Error("Cannot have progress of more than 1.0 or less than 0.0");
        }

        this.setState({
            progress: initialProgress
        });
    }

    /*
     * function bindSeekEvents
     * Subscribe to mouse events that we use to track how the user drags this draggable item.
     */
    bindSeekEvents() {
        document.addEventListener("mouseup", this.handleSeekMouseUp);
        document.addEventListener("mousemove", this.handleSeekMouseMove);
    }

    handleClickSeek(e) {
        const { isVertical, onSeek, seekFinished, totalLength } = this.props;
        const { barPos, isSeeking } = this.state;
        let percent;
        if (isVertical) {
            percent = (e.clientY - barPos) / totalLength;
        } else {
            percent = (e.clientX - barPos) / totalLength;
        }
        if (isSeeking) {
            this.setState({
                isSeeking: false
            });
        }
        onSeek(percent);
        seekFinished(percent);
    }

    handleSeekMouseDown() {
        this.setState({
            isSeeking: true
        }, () => {
            this.bindSeekEvents();
        });
    }

    handleSeekMouseMove(e) {
        const { isVertical, onSeek, totalLength } = this.props;
        const { barPos, isSeeking } = this.state;
        if (isSeeking) {
            let diff;
            if (isVertical) {
                diff = e.clientY - barPos;
            } else {
                diff = e.clientX - barPos;
            }

            const pos = diff < 0 ? 0 : diff;
            let percent = pos / totalLength;
            percent = percent > 1.0 ? 1.0 : percent;
            this.setState({
                progress: percent
            }, () => { onSeek(this.state.progress); });
        }
    }

    handleSeekMouseUp() {
        const { seekFinished } = this.props;
        const { isSeeking } = this.state;
        if (isSeeking) {
            this.setState({
                isSeeking: false
            }, () => {
                seekFinished(this.state.progress);
                this.unbindSeekEvents();
            });
        }
    }

    unbindSeekEvents() {
        document.removeEventListener("mouseup", this.handleSeekMouseUp);
        document.removeEventListener("mousemove", this.handleSeekMouseMove);
    }

    render() {
        const { children } = this.props;
        return (
            <div className="custom-seekbar-wrapper" onClick={this.handleClickSeek} onMouseDown={this.handleSeekMouseDown}>
                {children[0]}
            </div>
        );
    }
}

CustomSeekBar.propTypes = propTypes;

export default CustomSeekBar;
