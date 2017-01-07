import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { getOffsetLeft, getOffsetTop } from "../utils/MouseUtils";

const propTypes = {
    barClassName: PropTypes.string,         //the class attributes of the progress bar HTML element, which grows with progress
    containerClassName: PropTypes.string,   //the class attributes of the progress bar container HTML element
    initialProgress: PropTypes.number,      //(should be between 0.0 and 1.0 inclusive) the initial progress of the seekbar.
    isVertical: PropTypes.bool,             //whether or not the seekbar is vertical. by default will be false.
    onSeek: PropTypes.func.isRequired,      //the callback with param (progress: Number) called whenever the mouse moves and thumb displaces.
    seekFinished: PropTypes.func.isRequired, //the callback with param (progress: Number) to be called when seeking stops
    thumbClassName: PropTypes.string        //class attributes of the thumb HTML element
};

/*
 * Component SeekBar
 * A reusable UI component defining a bar with a draggable thumb. The user can drag the thumb vertically or horizontally (as defined in props),
 * or simply click on a part of the bar to seek through a predefined range of values. When the user stops seeking, the corresponding value indicated
 * by the thumb is passed to the callback seekFinished().
 *
 * Note: this component requires specific CSS settings for .seek-bar-progress and .seek-bar-thumb to display correctly.
 */
class SeekBar extends Component {
    constructor(props) {
        super(props);

        this.handleClickSeek = this.handleClickSeek.bind(this);
        this.handleSeekMouseDown = this.handleSeekMouseDown.bind(this);
        this.handleSeekMouseMove = this.handleSeekMouseMove.bind(this);
        this.handleSeekMouseUp = this.handleSeekMouseUp.bind(this);

        const initialProgress = this.props.initialProgress ? this.props.initialProgress : 0.0;
        if (initialProgress < 0.0 || initialProgress > 1.0) {
            throw new Error("Cannot have progress of more than 1.0 or less than 0.0");
        }

        this.state = {
            progress: initialProgress, //a Number with value from 0.0 to 1.0 indicating seek progress.
            isSeeking: false,
            totalLength: 1 //length in px of the container element
        };
    }

    componentDidMount() {
        const seekBarContainer = ReactDOM.findDOMNode(this.refs.seekBarContainer);
        this.setState({
            totalLength: this.props.isVertical ? seekBarContainer.offsetHeight : seekBarContainer.offsetWidth
        });
    }

    componentWillReceiveProps(nextProps) {
        const initialProgress = nextProps.initialProgress ? nextProps.initialProgress : 0.0;
        if (initialProgress === this.state.progress) {
            return;
        } else if (initialProgress < 0.0 || initialProgress > 1.0) {
            throw new Error("Cannot have progress of more than 1.0 or less than 0.0");
        }

        this.setState({
            progress: initialProgress
        });
    }

    handleClickSeek(e) {
        const { isVertical, onSeek, seekFinished } = this.props;
        const { totalLength } = this.state;
        let percent;
        if (isVertical) {
            percent = (e.clientY - getOffsetTop(e.currentTarget)) / totalLength;
        } else {
            percent = (e.clientX - getOffsetLeft(e.currentTarget)) / totalLength;
        }
        onSeek(percent);
        seekFinished(percent);
    }

    handleSeekMouseDown() {
        console.log("seek mouse down");
        this.setState({
            isSeeking: true
        });
    }

    handleSeekMouseMove(e) {
        console.log("seek mouse move");
        const { isVertical, onSeek } = this.props;
        const { totalLength, isSeeking } = this.state;
        if (isSeeking) {
            let diff;
            if (isVertical) {
                diff = e.clientY - getOffsetTop(e.target);
            } else {
                diff = e.clientX - getOffsetLeft(e.target);
            }

            const pos = diff < 0 ? 0 : diff;
            console.log("seek mouse pos:" + pos);
            let percent = pos / totalLength;
            this.setState({
                progress: percent
            }, () => { onSeek(this.state.progress); });
        }
    }

    handleSeekMouseUp() {
        console.log("seek mouse up");
        const { seekFinished } = this.props;
        const { isSeeking } = this.state;
        if (isSeeking) {
            this.setState({
                isSeeking: false
            }, () => { seekFinished(this.state.progress); });
        }
    }

    stopMouseClick(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const { barClassName, containerClassName, thumbClassName } = this.props;
        const { progress } = this.state;
        const progressLength = progress * 100;

        return (
            <div
                className={`seek-bar-container ${containerClassName}`}
                onClick={this.handleClickSeek}
                ref="seekBarContainer"
            >
                <div
                    className={`seek-bar-progress ${barClassName}`}
                    style={{ width: `${progressLength}%`}}
                >
                    <div
                        className={`seek-bar-thumb ${thumbClassName}`}
                        onClick={this.stopMouseClick}
                        onMouseDown={this.handleSeekMouseDown}
                        onMouseUp={this.handleSeekMouseUp}
                        onMouseMove={this.handleSeekMouseMove}
                    >
                    </div>
                </div>
            </div>
        );
    }
}

SeekBar.propTypes = propTypes;

export default SeekBar;
