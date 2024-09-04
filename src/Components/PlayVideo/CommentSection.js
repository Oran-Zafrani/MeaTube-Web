import React, { useState, useEffect } from 'react';
import { formatViews, parseUploadTime } from '../Feed/VideoCard';
import ServerAPI from '../../ServerAPI';

const CommentSection = ({Icomments}) => {
    const [comments, setComments] = useState(Icomments);
    var LoggedInUserDetails = JSON.parse(localStorage.getItem('loggedInUserDetails'));

    useEffect(() => {
        setComments(Icomments);
    }, [Icomments]);

    useEffect(() => {
        LoggedInUserDetails = JSON.parse(localStorage.getItem('loggedInUserDetails'));
    }, [localStorage.getItem('loggedInUserDetails')]);

    const handleSaveEditedComment = async (CommentId, NewText) => {
        try {
            await ServerAPI.updateComment(CommentId, { commentText: NewText });
            setComments(comments.map((comment) => {
                if (comment._id === CommentId) {
                    return { ...comment, commentText: NewText };
                } else {
                    return comment;
                }
            }));
            console.log('Comment edited and saved successfully.');
        } catch (error) {
            console.error('Error editing comment:', error);
            const errorMessage = error.response?.data?.message || 'Failed to edit comment.';
            alert(errorMessage);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await ServerAPI.deleteComment(commentId);
            setComments(comments.filter((comment) => comment._id !== commentId));
            console.log('Comment deleted successfully.');
            return;
        } catch (error) {
            console.error('Error deleting comment:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete comment.';
            alert(errorMessage);
        }
    };

    return (
        <div className='comment-container'>
            {comments?.map((comment, index) => {
                const isOwnerLoggedIn = comment.userName === LoggedInUserDetails?.username;
                return (
                    <CommentCard 
                    key={comment._id || index}
                    comment={{...comment, isOwnerLoggedIn}}
                    index={index}
                    onDelete={() => handleDeleteComment(comment._id)}
                    editAPI={(newText) => handleSaveEditedComment(comment._id, newText)}
                    />
                );
                })}
        </div>
    );
};

const CommentCard = ({ comment, index, onDelete, editAPI }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState(comment.commentText);


    const handleEditComment = () => {
        setIsEditMode(!isEditMode);
    };

    const handleLike = async () => {
        alert('Like button is not implemented yet');
    };

    const handleDislike = async () => {
        alert('Dislike button is not implemented yet');
    };
    

    return (
        <div className='comment' key={index}>
            <img src={comment.userImage} alt='commenter' className="commenter-image" />
            <div>
                <h3>{comment.displayName} <span>{parseUploadTime(comment.timestamp)}</span></h3>
                {isEditMode ? (
                    <div className='add-comment-container'>
                        <input
                            value={editedCommentText}
                            onChange={(e) => setEditedCommentText(e.target.value)}
                            className="add-comment-input"
                        />
                        <button className="add-comment-button" onClick={()=>{editAPI(editedCommentText).then(setIsEditMode(false))}}>Done</button>
                    </div>
                ) : (
                    <p>{comment.commentText}</p>
                )}
                <div className='comment-action'>
                    <i className="bi bi-hand-thumbs-up-fill" onClick={handleLike}></i>
                    <span>{formatViews(comment.likesNum)}</span>
                    <i className="bi bi-hand-thumbs-down-fill" onClick={handleDislike}></i>
                    <span>{formatViews(comment.dislikesNum)}</span>
                    {comment.isOwnerLoggedIn && (
                        <>
                            <i className="bi bi-pencil-square" onClick={handleEditComment} style={{ cursor: 'pointer' }}></i>
                            <i className="bi bi-trash" onClick={onDelete} style={{ cursor: 'pointer' }}></i>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentSection;
