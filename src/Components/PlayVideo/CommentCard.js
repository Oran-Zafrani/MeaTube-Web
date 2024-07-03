import React from 'react'
import { parseUploadTime } from '../Feed/VideoCard'
import { openDB } from 'idb';

export const CommentCard = ({ comment, index, loggedInUser, videoId }) => {
    // Placeholder functions for handling edit and delete actions
    const handleEditComment = () => {

        // Implement edit logic here
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
            <div>
                <h3>{comment.displayName} <span>{parseUploadTime(comment.timestamp)}</span></h3>
                <p>{comment.commentText}</p>
                <div className='comment-action'>
                    <i className="bi bi-hand-thumbs-up-fill"></i>
                    <span>{comment.likesNum}</span>
                    <i className="bi bi-hand-thumbs-down-fill"></i>
                    <span>{comment.dislikesNum}</span>
                    {/* Conditional rendering based on whether the logged-in user is the comment author */}
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
