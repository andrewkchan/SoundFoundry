import React, { Component, PropTypes } from "react";
import infiniteScrollify from "../components/InfiniteScrollify";
import SongCard from "../components/SongCard";

import { playSong } from "../actions/PlayerActions";

const propTypes = {
    authed: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number,
    playingSongId: PropTypes.number,
    playlistId: PropTypes.string.isRequired,
    playlists: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired
};

/*
SongCards Component

The list of song cards. Watches user scroll state and handles pagination.
*/

class SongCards extends Component {
    constructor(props) {
        super(props);
        /* Set scroll state. */

        this.onScroll = this.onScroll.bind(this);
        this.getScrollState = this.getScrollState.bind(this);

        const { playlistId, playlists } = props;
        const items = playlistId in playlists ? playlists[playlistId].items : [];
        this.state = {
            end: items.length, //the index of the last rendered card in the playlist
            paddingBottom: 0, //the space in px of the invisible spacer element below rendered cards (to maintain infinite scrolling illusion)
            paddingTop: 0, //the space in px of the invisible spacer element above the rendered cards
            start: 0 //the index in the playlist to start rendering cards.
        };
    }

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
    }

    componentWillReceiveProps(nextProps) {
        /* Update state to reflect new feed. */
        const { end, paddingBottom, paddingTop, start } = this.getScrollState(nextProps);
        if (paddingTop !== this.state.paddingTop
        || paddingBottom !== this.state.paddingBottom
        || start !== this.state.start
        || end !== this.state.end) {
            this.setState({
                end, //the index of the last rendered card in the playlist
                paddingBottom, //the space in px of the invisible spacer element below rendered cards (to maintain infinite scrolling illusion)
                paddingTop, //the space in px of the invisible spacer element above the rendered cards
                start //the index in the playlist to start rendering cards.
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }

    onScroll() {
        this.componentWillReceiveProps(this.props);
    }

    /*
    Returns a new state as updated by the user's scrolling.
    */
    getScrollState(props) {
        const { height, playlists, playlistId } = props;
        const items = playlistId in playlists ? playlists[playlistId].items : [];

        const MARGIN_TOP = 20;
        const ROW_HEIGHT = 191.6;
        const ITEMS_PER_ROW = 1;
        const scrollY = window.scrollY;

        let paddingTop = 0;
        let paddingBottom = 0;
        let start = 0;
        let end = items.length;

        //has the user scrolled past the 3 topmost visible rows of cards yet?
        //if so, calculate px to pad the top of the scrollbar
        if ((scrollY - ((ROW_HEIGHT * 3) + (MARGIN_TOP * 2))) > 0) {
            //we keep 2 rows above the viewport, so don't include that in our padding calculations
            const rowsToPad = Math.floor(
                (scrollY - ((ROW_HEIGHT * 2) + (MARGIN_TOP))) / (ROW_HEIGHT + MARGIN_TOP)
            );
            paddingTop = rowsToPad * (ROW_HEIGHT + MARGIN_TOP);
            start = rowsToPad * ITEMS_PER_ROW;
        }

        const rowsOnScreen = Math.ceil(height / (ROW_HEIGHT + MARGIN_TOP));
        //2 rows above viewport + 3 rows below viewport + rows on screen = total rows to show
        const itemsToShow = (rowsOnScreen + 5) * ITEMS_PER_ROW;
        //if the user isn't right at the bottom of the playlist, calculate px to pad the bottom of the scrollbar
        if (items.length > (start + itemsToShow)) {
            end = start + itemsToShow;
            const rowsToPad = Math.ceil((items.length - end) / ITEMS_PER_ROW);
            paddingBottom = rowsToPad * (ROW_HEIGHT + MARGIN_TOP);
        }

        return {
            end,
            paddingBottom,
            paddingTop,
            start
        };
    }

    playSong(index, e) {
        e.preventDefault();
        const { playlistId, dispatch } = this.props;
        dispatch(playSong(playlistId, index));
    }

    renderSongs(start, end) {
        const { authed, dispatch, playlistId, playlists, playingSongId, songs, users } = this.props;
        const items = playlistId in playlists ? playlists[playlistId].items : [];

        const songCards = items.slice(start, end).map((songId, i) => {
            const song = songs[songId];
            const user = users[song.user_id];
            const absoluteIndex = i + start;
            const playSongFunc = this.playSong.bind(this, absoluteIndex);

            return (
                <div className="songs-row" key={`${absoluteIndex}-${songId}`}>
                    <SongCard
                        authed={authed}
                        dispatch={dispatch}
                        isActive={song.id === playingSongId}
                        playSong={playSongFunc}
                        song={song}
                        user={user}
                    />
                </div>
            );
        });

        return songCards;
    }

    render() {
        const { end, paddingBottom, paddingTop, start } = this.state;
        return (
            <div className="content">
                <div className="padder" style={{ height: paddingTop }} />
                {this.renderSongs(start, end)}
                <div className="padder" style={{ height: paddingBottom }} />
            </div>
        );
    }
}

SongCards.propTypes = propTypes;

export default infiniteScrollify(SongCards);
