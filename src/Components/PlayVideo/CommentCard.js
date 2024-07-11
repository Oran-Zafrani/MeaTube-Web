import React, { useState } from 'react';
import { formatViews, parseUploadTime } from '../Feed/VideoCard';
import { openDB } from 'idb';


export const CommentCard = ({ comment, index, loggedInUser, videoId }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedCommentText, setEditedCommentText] = useState(comment.commentText);

    const handleEditComment = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSaveEditedComment = async () => { 
        const db = await openDB('MeaTubeDB');
        if (!db.objectStoreNames.contains('videos')) {
            console.error("Object store 'videos' does not exist in commentcaed handle Delete.");
            return;
        }
        const tx = db.transaction('videos', 'readwrite');
        const store = tx.objectStore('videos');
        const allVideos = await store.getAll();
        const video = allVideos.find(v => v.id === Number(videoId));
        if (!video) {
            console.error('Video not found.');
            return;
        }
        video.commentsLink = video.commentsLink.map(c => {
            if (c.id === comment.id) {
                c.commentText = editedCommentText;
            }
            return c;
        }
        );
        await store.put(video);
        await tx.done;
        console.log('Comment edited and saved successfully.');
        setIsEditMode(false);
    };

    const handleLike = async () => {
        alert('like botton is not implemented yet');
    };

    const handleDislike = async () => {
        alert('dislike botton is not implemented yet');
    };



    const handleDeleteComment = async () => {
        const db = await openDB('MeaTubeDB');
        if (!db.objectStoreNames.contains('videos')) {
            console.error("Object store 'videos' does not exist in commentcaed handle Delete.");
            return;
        }
        const tx = db.transaction('videos', 'readwrite');
        const store = tx.objectStore('videos');
        const allVideos = await store.getAll();
        const video = allVideos.find(v => v.id === Number(videoId));
        if (!video) {
            console.error('Video not found.');
            return;
        }
        video.comments--;
        console.log('Comment:', comment);
        video.commentsLink = video.commentsLink.filter(c => c.id !== comment.id);
        console.log('Video:', video);
        await store.put(video);
        await tx.done;
        console.log('Comment deleted successfully.'); 
    };

    return (
        <div className='comment' key={index}>
            <img src={comment.userImage} alt='commenter' className="commenter-image" />
            <div >
                <h3>{comment.displayName} <span>{parseUploadTime(comment.timestamp)}</span></h3>
                { isEditMode ? (
                    <>
                    <div className='add-comment-container'>
                        <input value={editedCommentText} onChange={(e) => setEditedCommentText(e.target.value)} className="add-comment-input"/>
                        <button className="add-comment-button" onClick={handleSaveEditedComment}>Done</button>
                        </div>
                    </>
                ) : (
                    <p>{comment.commentText}</p>
                )}
                <div className='comment-action'>
                    <i className="bi bi-hand-thumbs-up-fill" onClick={handleLike}></i>
                    <span>{formatViews(comment.likesNum)}</span>
                    <i className="bi bi-hand-thumbs-down-fill" onClick={handleDislike}></i>
                    <span>{formatViews(comment.dislikesNum)}</span>
                    {loggedInUser === comment.userName && (
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
