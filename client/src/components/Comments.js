import React, { Component, PropTypes } from "react";

import { getImageUrl } from "../utils/SongUtils";
import { formatSeconds } from "../utils/FormatUtils";

const propTypes = {
    comments: PropTypes.arrayOf(PropTypes.object),  //comments array
};

class Comments extends Component {
    renderComment(comment, i) {
        const user = comment.user;
        const songTime = formatSeconds(Math.round(comment.timestamp/1000.0));
        return (
            <div className="song-comment" key={i}>
                <div
                    className="song-comment-img"
                    style={{ backgroundImage: `url(${getImageUrl(user.avatar_url)})` }}
                />
                <div className="song-comment-body">
                    <div className="song-comment-body-user">
                        {`${user.username} at ${songTime}`}
                    </div>
                    <div className="song-comment-body-text">
                        {comment.body}
                    </div>
                </div>
            </div>
        );
    }
    renderPlaceholderComment() {
        return (
            <div className="song-comment">
                <div className="song-comment-img placeholder"></div>
                <div className="song-comment-body">
                    <div className="song-comment-body-user placeholder">
                    </div>
                    <div className="song-comment-body-text placeholder">
                    </div>
                </div>
            </div>
        );
    }
    render() {
        const { comments } = this.props;
        if (comments) {
            return (
                <div className="card song-comments">
                    <div className="song-comments-header">
                        Comments
                    </div>
                    {comments.map(this.renderComment)}
                </div>
            );
        }
        return (
            <div className="card song-comments">
                <div className="song-comments-header">
                    Comments
                </div>
                    {this.renderPlaceholderComment()}
            </div>
        );
    }
}

Comments.propTypes = propTypes;

export default Comments;
