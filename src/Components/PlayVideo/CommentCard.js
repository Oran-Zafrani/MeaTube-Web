import React, { useState, useEffect } from 'react';
import { formatViews, parseUploadTime } from '../Feed/VideoCard';
import ServerAPI from '../../ServerAPI';
import { jwtDecode } from 'jwt-decode';

export const CommentCard = ({ comment, index }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState(comment.commentText);
    const [tokenUserName, setTokenUserName] = useState('');

    // Get the username from the token for validation that the user can edit or delete the comment
    useEffect(() => {
        try {
            const token = localStorage.getItem('loggedInUserToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                setTokenUserName(decodedToken.username);
            }
        } catch (error) {
            setTokenUserName('');
            console.error('Error fetching user data:', error);
        }
    }, []);

    const handleEditComment = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSaveEditedComment = async () => {
        try {
            const response = await ServerAPI.updateComment(comment.id, { commentText: editedCommentText });
            console.log('Comment edited and saved successfully.');
            setIsEditMode(false);
        } catch (error) {
            console.error('Error editing comment:', error);
            const errorMessage = error.response?.data?.message || 'Failed to edit comment.';
            alert(errorMessage);
        }
    };

    const handleLike = async () => {
        alert('Like button is not implemented yet');
    };

    const handleDislike = async () => {
        alert('Dislike button is not implemented yet');
    };

    const handleDeleteComment = async () => {
        try {
            await ServerAPI.deleteComment(comment.id);
            console.log('Comment deleted successfully.');
        } catch (error) {
            console.error('Error deleting comment:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete comment.';
            alert(errorMessage);
        }
    };

    return (
        <div className='comment' key={index}>
            <img src={comment.userImage} alt='commenter' className="commenter-image" />
            <div>
                <h3>{comment.userName} <span>{parseUploadTime(comment.timestamp)}</span></h3>
                {isEditMode ? (
                    <div className='add-comment-container'>
                        <input
                            value={editedCommentText}
                            onChange={(e) => setEditedCommentText(e.target.value)}
                            className="add-comment-input"
                        />
                        <button className="add-comment-button" onClick={handleSaveEditedComment}>Done</button>
                    </div>
                ) : (
                    <p>{comment.commentText}</p>
                )}
                <div className='comment-action'>
                    <i className="bi bi-hand-thumbs-up-fill" onClick={handleLike}></i>
                    <span>{formatViews(comment.likesNum)}</span>
                    <i className="bi bi-hand-thumbs-down-fill" onClick={handleDislike}></i>
                    <span>{formatViews(comment.dislikesNum)}</span>
                    {tokenUserName === comment.userName && (
                        <>
                            <i className="bi bi-pencil-square" onClick={handleEditComment} style={{ cursor: 'pointer' }}></i>
                            <i className="bi bi-trash" onClick={handleDeleteComment} style={{ cursor: 'pointer' }}></i>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};