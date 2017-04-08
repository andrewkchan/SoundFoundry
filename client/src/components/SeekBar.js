import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { getOffsetLeft, getOffsetTop } from "../utils/MouseUtils";

const propTypes = {
    barClassName: PropTypes.string,         //the class attribute of the bar containing the full seekable length, or the bar containing the progress bar.
    containerClassName: PropTypes.string,   //the class attributes of the container padding around the progress bar.
    initialProgress: PropTypes.number,      //(should be between 0.0 and 1.0 inclusive) the initial progress of the seekbar.
    isVertical: PropTypes.bool,             //whether or not the seekbar is vertical. by default will be false.
    onSeek: PropTypes.func.isRequired,      //the callback with param (progress: Number) called whenever the mouse moves and thumb displaces.
    progressClassName: PropTypes.string,    //the class attributes of the progress bar HTML element, which grows with progress
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

        this.bindSeekEvents = this.bindSeekEvents.bind(this);
        this.handleClickSeek = this.handleClickSeek.bind(this);
        this.handleSeekMouseDown = this.handleSeekMouseDown.bind(this);
        this.handleSeekMouseMove = this.handleSeekMouseMove.bind(this);
        this.handleSeekMouseUp = this.handleSeekMouseUp.bind(this);
        this.unbindSeekEvents = this.unbindSeekEvents.bind(this);

        const initialProgress = this.props.initialProgress ? this.props.initialProgress : 0.0;
        if (initialProgress < 0.0 || initialProgress > 1.0) {
            throw new Error("Cannot have progress of more than 1.0 or less than 0.0");
        }

        this.state = {
            barPos: 0, //position of the bar in the page
            progress: initialProgress, //a Number with value from 0.0 to 1.0 indicating seek progress.
            isSeeking: false,
            totalLength: 1 //length in px of the container element
        };
    }

    componentDidMount() {
        const seekBarContainer = this.seekBarContainer;
        if (seekBarContainer != null) {
            this.setState({
                barPos: this.props.isVertical ? getOffsetTop(seekBarContainer) : getOffsetLeft(seekBarContainer),
                totalLength: this.props.isVertical ? seekBarContainer.offsetHeight : seekBarContainer.offsetWidth
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { isSeeking } = this.state;
        const initialProgress = nextProps.initialProgress ? nextProps.initialProgress : this.state.progress;
        if (isSeeking || initialProgress === this.state.progress) {
            return;
        } else if (initialProgress < 0.0 || initialProgress > 1.0) {
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
        const { isVertical, onSeek, seekFinished } = this.props;
        const { barPos, isSeeking, totalLength } = this.state;
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
        const { isVertical, onSeek } = this.props;
        const { barPos, totalLength, isSeeking } = this.state;
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

    stopMouseClick(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    unbindSeekEvents() {
        document.removeEventListener("mouseup", this.handleSeekMouseUp);
        document.removeEventListener("mousemove", this.handleSeekMouseMove);
    }

    render() {
        const { barClassName, containerClassName, progressClassName, thumbClassName } = this.props;
        const { progress } = this.state;
        const progressLength = progress * 100;

        return (
            <div
                className={`seek-bar-container ${containerClassName}`}
                onClick={this.handleClickSeek}
                ref={(seekBarContainer) => { this.seekBarContainer = seekBarContainer; }}
            >
                <div
                    className={`seek-bar-body ${barClassName}`}
                >
                    <div
                        className={`seek-bar-progress ${progressClassName}`}
                        style={{ width: `${progressLength}%`}}
                    >
                        <div
                            className={`seek-bar-thumb ${thumbClassName}`}
                            onClick={this.stopMouseClick}
                            onMouseDown={this.handleSeekMouseDown}
                        >
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SeekBar.propTypes = propTypes;

export default SeekBar;
