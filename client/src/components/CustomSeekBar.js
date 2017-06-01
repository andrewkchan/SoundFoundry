import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { getOffsetLeft, getOffsetTop } from "../utils/MouseUtils";

const propTypes = {
    className: PropTypes.string,                //className to pass down to the container element
    children: PropTypes.object.isRequired,
    initialProgress: PropTypes.number,          //(should be between 0.0 and 1.0 inclusive) the initial progress of the seekbar.
    isVertical: PropTypes.bool,                 //whether or not the seekbar is vertical. by default will be false.
    onMouseOver: PropTypes.func,                //the callback with param (progress: Number) called whenever the mouse is hovering over the seek bar
    onMouseLeave: PropTypes.func,               //TODO
    onSeek: PropTypes.func.isRequired,          //the callback with param (progress: Number) called whenever the mouse moves and thumb displaces.
    seekFinished: PropTypes.func.isRequired,     //the callback with param (progress: Number) to be called when seeking stops
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

        // if (props.children.length != 1) {
        //     throw new Error("CustomSeekBar component requires exactly 1 child!");
        // }

        const initialProgress = this.props.initialProgress ? this.props.initialProgress : 0.0;
        if (initialProgress > 1.0 || initialProgress < 0.0) {
            throw new Error("Cannot have progress of more than 1.0 or less than 0.0");
        }

        this.state = {
            barPosX: 0,
            barPosY: 0,
            isSeeking: false,
            isMouseHovering: false,
            progress: initialProgress,
            totalWidth: 1, //width in px of the seekbar element
            totalLength: 1 //length in px of the seekbar element
        }

        this.bindSeekEvents = this.bindSeekEvents.bind(this);
        this.bindHoverEvents = this.bindHoverEvents.bind(this);
        this.handleClickSeek = this.handleClickSeek.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleSeekMouseDown = this.handleSeekMouseDown.bind(this);
        this.handleSeekMouseMove = this.handleSeekMouseMove.bind(this);
        this.handleSeekMouseUp = this.handleSeekMouseUp.bind(this);
        this.unbindSeekEvents = this.unbindSeekEvents.bind(this);
    }

    componentDidMount() {
        const { children } = this.props;
        const seekBarContainer = this.seekBarContainer;
        if (seekBarContainer != null) {
            this.setState({
                barPosX: getOffsetLeft(seekBarContainer),
                barPosY: getOffsetTop(seekBarContainer) + seekBarContainer.offsetHeight,
                totalWidth: this.props.isVertical ? seekBarContainer.offsetWidth : seekBarContainer.offsetHeight,
                totalLength: this.props.isVertical ? seekBarContainer.offsetHeight : seekBarContainer.offsetWidth
            });
        }
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
    /*
     * function bindHoverEvents
     * Subscribe to mouse events that we use to track how the user moves over this item.
     */
    bindHoverEvents() {
        const { isMouseHovering } = this.state;
        if (!isMouseHovering) {
            this.setState({
                isMouseHovering: true
            }, () => { document.addEventListener("mousemove", this.handleMouseMove); });
        }
    }

    handleClickSeek(e) {
        const { isVertical, onSeek, seekFinished } = this.props;
        const { barPosX, barPosY, isSeeking, totalLength } = this.state;
        let percent;
        if (isVertical) {
            percent = (e.clientY - barPosY) / totalLength;
        } else {
            percent = (e.clientX - barPosX) / totalLength;
        }
        if (isSeeking) {
            this.setState({
                isSeeking: false
            });
        }
        onSeek(percent);
        seekFinished(percent);
    }

    handleMouseOver(e) {
        this.bindHoverEvents();
    }

    /*
     * function handleMouseMove
     * Called whenever the mouse moves over the seekbar element, not necessarily when seeking through the track.
     */
    handleMouseMove(e) {
        const { isVertical, onMouseOver } = this.props;
        if (onMouseOver) {
            const { barPosX, barPosY, isSeeking, totalLength, totalWidth } = this.state;
            const boundingRect = this.seekBarContainer.getBoundingClientRect();

            const diffY = e.clientY - boundingRect.bottom;
            const diffX = e.clientX - boundingRect.left;
            const diff = isVertical ? Math.abs(diffY) : diffX;
            //is the mouse still over the element or not?
            const isMouseHovering = (boundingRect.left < e.clientX && e.clientX < boundingRect.right) &&
                                    (boundingRect.top < e.clientY && e.clientY < boundingRect.bottom);
            if (isMouseHovering) {
                const pos = diff < 0 ? 0 : diff;
                let percent = pos / totalLength;
                percent = percent > 1.0 ? 1.0 : percent;
                onMouseOver(percent);
            } else {
                onMouseOver(0);
                this.unbindHoverEvents();
            }
        }
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
        const { barPosX, barPosY, isSeeking, totalLength } = this.state;
        if (isSeeking) {
            let diff;
            if (isVertical) {
                diff = e.clientY - barPosY;
            } else {
                diff = e.clientX - barPosX;
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
    unbindHoverEvents() {
        this.setState({
            isMouseHovering: false
        }, () => { document.removeEventListener("mousemove", this.handleMouseMove); });
    }

    render() {
        const { children, className } = this.props;
        return (
            <div
                className={`custom-seekbar-wrapper ${className}`}
                onClick={this.handleClickSeek}
                onMouseOver={this.handleMouseOver}
                onMouseDown={this.handleSeekMouseDown}
                ref={(seekBarContainer) => { this.seekBarContainer = seekBarContainer; }}
            >
                {children}
            </div>
        );
    }
}

CustomSeekBar.propTypes = propTypes;

export default CustomSeekBar;
