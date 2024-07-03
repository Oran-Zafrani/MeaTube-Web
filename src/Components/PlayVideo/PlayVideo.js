import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { openDB } from 'idb';
import './PlayVideo.css';
import { parseUploadTime } from '../../Components/Feed/VideoCard';
import defaultImage from '../../assets/images/guest_image.png';
import { CommentCard } from './CommentCard';




// Define your component or function here
function PlayVideo() {
    const firstTimeToUpdateViews = useRef(true);
    const firstTimeToUpdateUserInteraction = useRef(true);
    const [videoSrc, setVideoSrc] = useState('');
    const { videoId } = useParams();
    const [video, setVideo] = useState(null); // Add a new state variable for the video object
    const [subscriberCount, setSubscriberCount] = useState('Loading...');
    const [uploadedUserImage, setUserImage] = useState(defaultImage);
    const [userInteraction, setUserInteraction] = useState(0);

    // Define constants for user interactions
    const NONE = 0, LIKE = 1, DISLIKE = 2;
    // updatingInteraction state variable to prevent rapid successive updates
    const [updatingInteraction, setUpdatingInteraction] = useState(true);
    const [logedinUserImage, setlogedinUserImage] = useState(defaultImage);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);



    useEffect(() => {
        async function fetchVideo() {
            try {
                const db = await openDB('MeaTubeDB');
                const tx = db.transaction('videos', 'readonly');
                const store = tx.objectStore('videos');
                const allVideos = await store.getAll();
                const video = allVideos.find(v => v.id === Number(videoId));
                if (video && video.videoFile) {
                    setVideoSrc(video.videoFile);
                    // Update the video state variable
                    setVideo(video);

                    if (video && video.commentsLink) {
                        setComments(video.commentsLink);
                    }

                    // Increment the view count
                    if (firstTimeToUpdateViews.current) {
                        video.views = (video.views || 0) + 1;

                        // Update the video in the database
                        const updateTx = db.transaction('videos', 'readwrite');
                        const updateStore = updateTx.objectStore('videos');
                        await updateStore.put(video);
                        await updateTx.complete;
                        firstTimeToUpdateViews.current = false;
                    }
                } else {
                    console.log('No video found or video has no URL');
                }
            } catch (error) {
                console.error('Failed to fetch video:', error);
            }
        }

        async function fetchUploadedUserData(username) {
            try {
                const db = await openDB('MeaTubeDB');
                if (!db.objectStoreNames.contains('users')) {
                    throw new Error("Object store 'users' does not exist.");
                }
                const transaction = db.transaction(["users"], "readonly");
                const objectStore = transaction.objectStore("users");
                const channelData = await objectStore.get(username);
                if (channelData && Number.isInteger(channelData.subscribers)) {
                    setSubscriberCount(`${channelData.subscribers} subscribers`);
                } else {
                    setSubscriberCount('No subscribers data');
                }

                if (channelData && channelData.image) {
                    setUserImage(channelData.image);
                } else {
                    console.log('No image found for the channel');
                }
            } catch (error) {
                console.error('Failed to fetch subscriber count:', error);
                setSubscriberCount('Failed to load data');
            }
        }

        async function fetchLogedInUserData() {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (!(loggedInUser === 'null')) {
                const db = await openDB('MeaTubeDB');
                if (!db.objectStoreNames.contains('users')) {
                    throw new Error("Object store 'users' does not exist.");
                }
                const transaction = db.transaction(["users"], "readonly");
                const objectStore = transaction.objectStore("users");
                const logedinUserdata = await objectStore.get(loggedInUser);
                if (firstTimeToUpdateUserInteraction.current) {
                    // Check if the user like or dislike the video and set the state variable only once
                    if (logedinUserdata.likedVideos.includes(Number(videoId))) {
                        setUserInteraction(LIKE);
                    } else if (logedinUserdata.dislikedVideos.includes(Number(videoId))) {
                        setUserInteraction(DISLIKE);
                    } else {
                        setUserInteraction(NONE);
                    }
                    if (logedinUserdata && logedinUserdata.image) {
                        setlogedinUserImage(logedinUserdata.image);
                    }
                    // setting the first load to false that insures that the views and likes will be updated only once
                    firstTimeToUpdateUserInteraction.current = false;
                    setUpdatingInteraction(false);
                }
            }
        }

        async function fetchData() {
            await fetchVideo();
            if (video && video.username) {
                await fetchUploadedUserData(video.username);
                await fetchLogedInUserData();
            }
        }

        fetchData();
    }, [video, videoId]);

    const handleLike = async () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser || loggedInUser === 'null') {
            alert('Please log in to like videos.');
            return;
        }

        // Prevent rapid successive updates
        if (updatingInteraction) return;
        setUpdatingInteraction(true);

        try {
            if (userInteraction !== LIKE) {
                setUserInteraction(LIKE);
                if (userInteraction === DISLIKE) {
                    // If the user has disliked the video, clicking like will remove the dislike
                    await updateVideoDislikes(Number(videoId), false); // false to decrease dislike
                    await updateUserInteraction(Number(videoId), NONE);
                }
                // Update the video likes on the database
                await updateVideoLikes(Number(videoId), true); // true for like
                await updateUserInteraction(Number(videoId), LIKE);
            } else {
                setUserInteraction(NONE);
                // If already liked, clicking again will remove the like
                // Update the video likes on the database
                await updateVideoLikes(Number(videoId), false); // false to decrease like
                await updateUserInteraction(Number(videoId), NONE);
            }
        } catch (error) {
            console.error('Failed to like video:', error);
        } finally {
            setUpdatingInteraction(false);
        }
    };

    const handleDislike = async () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser === 'null') {
            alert('Please log in to dislike videos.');
            return;
        }
        // Prevent rapid successive updates
        if (updatingInteraction) return;
        setUpdatingInteraction(true);

        try {
            if (userInteraction !== DISLIKE) {
                setUserInteraction(DISLIKE);
                if (userInteraction === LIKE) {
                    // If the user has liked the video, clicking dislike will remove the like
                    await updateVideoLikes(Number(videoId), false); // false to decrease like
                    await updateUserInteraction(Number(videoId), NONE);
                }

                // update the video dislikes on the database
                await updateVideoDislikes(Number(videoId), true); // true for dislike
                await updateUserInteraction(Number(videoId), DISLIKE);
            } else {
                setUserInteraction(NONE);
                // If already disliked, clicking again will remove the dislike

                await updateVideoDislikes(Number(videoId), false); // false to decrease dislike
                await updateUserInteraction(Number(videoId), NONE);
            }
        } catch (error) {
            console.error('Failed to dislike video:', error);
        } finally {
            setUpdatingInteraction(false);
        }
    };

    function handleShare() {
        navigator.clipboard.writeText(window.location.origin + window.location.pathname).then(() => {
            console.log('URL copied to clipboard');
            alert('URL copied to clipboard!');

        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    // Increment or decrement the number of likes based on isLike. ture ++, flase --
    const updateVideoLikes = async (videoId, isLike) => {
        const db = await openDB('MeaTubeDB');
        const tx = db.transaction('videos', 'readwrite');
        const store = tx.objectStore('videos');
        const video = await store.get(Number(videoId));
        if (video) {
            isLike ? video.likes++ : video.likes--;
            await store.put(video); // Update the video record in the database.

        }
        await tx.done; // Close the transaction.
    };

    const updateVideoDislikes = async (videoId, isDislike) => {
        const db = await openDB('MeaTubeDB');
        const tx = db.transaction('videos', 'readwrite');
        const store = tx.objectStore('videos');
        const video = await store.get(Number(videoId));
        if (video) {
            isDislike ? video.dislikes++ : video.dislikes--; // Increment or decrement dislikes based on isDislike.
            await store.put(video);
        }
        await tx.done;
    };

    async function updateUserInteraction(videoId, interaction) {
        try {
            const db = await openDB('MeaTubeDB'); // Corrected database name
            // Ensure the 'users' object store exists before proceeding.
            if (!db.objectStoreNames.contains('users')) {
                console.error("Object store 'users' does not exist.");
                return; // Exit the function if the object store doesn't exist.
            }
            const tx = db.transaction(["users"], "readwrite");
            const store = tx.objectStore('users');
            const loggedInUser = localStorage.getItem('loggedInUser');
            const user = await store.get(loggedInUser);
            if (user) {
                switch (interaction) {
                    case 1: // Like
                        user.likedVideos = [...new Set([...(user.likedVideos || []), Number(videoId)])];
                        break;
                    case 2: // Dislike
                        user.dislikedVideos = [...new Set([...(user.dislikedVideos || []), Number(videoId)])];
                        break;
                    default: // Remove interaction
                        user.likedVideos = (user.likedVideos || []).filter(id => id !== Number(videoId));
                        user.dislikedVideos = (user.dislikedVideos || []).filter(id => id !== Number(videoId));
                }
                await store.put(user);
            }
            await tx.done;
        } catch (error) {
            console.error('Failed to update user interaction:', error);
        }
    }

    function hendleSubscribe() {
        alert('didnt implement yet!');
    }

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    async function handleNewComment(commentText) {
        // Check if the user is logged in
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser || loggedInUser === 'null') {
            alert('Please log in to post comments.');
            return;
        }
        // Check if the comment is empty
        if (!commentText.trim()) {
            alert('Comment cannot be empty.');
            return;
        }

        try {
            const db = await openDB('MeaTubeDB');
            if (!db.objectStoreNames.contains('videos')) {
                console.error("Object store 'videos' does not exist.");
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
            // Create the comment object
            const comment = {
                commentText,
                user: loggedInUser,
                userImage: logedinUserImage,
                timestamp: new Date().toISOString(),
                likesNum: 0,
                dislikesNum: 0
            };
            video.comments++;
            // Add the comment to the video's comments list
            if (!video.commentsLink) {
                video.commentsLink = [comment];
            } else {
                video.commentsLink = [comment, ...video.commentsLink];
            }
            setComment('');
            // Update the video in the database
            await store.put(video);
            await tx.done;
            console.log('Comment added successfully');
            // should do!!!!!!, update the UI or state to reflect the new comment
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    }


    return (
        <div className='play-video'>
            {videoSrc && <video src={videoSrc} controls autoPlay muted></video>}
            {!videoSrc && <p>Loading video...</p>}

            {video ? (
                <>
                    <h3>{video.title}</h3>
                    <div className='play-video-info'>
                        <p>{video.views} views &bull; {parseUploadTime(video.uploadTime)}</p>
                        <div >
                            <span className={`video-action-button ${userInteraction === LIKE ? "bi bi-hand-thumbs-up-fill like-selected" : "bi bi-hand-thumbs-up-fill"}`} onClick={handleLike}>{video.likes}</span>
                            <span className={`video-action-button ${userInteraction === DISLIKE ? "bi bi-hand-thumbs-down-fill dislike-selected" : "bi bi-hand-thumbs-down-fill"}`} onClick={handleDislike}>{video.dislikes}</span>
                            <span className='video-action-button' onClick={handleShare}><i className="bi bi-share-fill"></i> Share</span>
                        </div>
                    </div>
                    <hr />
                    <div className='publisher'>
                        <img src={uploadedUserImage} alt='publisher' />
                        <div>
                            <p>{video.channel}</p>
                            {/** need a think how to do that!!! */}
                            <span>{subscriberCount} </span>
                        </div>
                        <button onClick={hendleSubscribe}>Subscribe</button>
                    </div>
                    <div className='vid-description'>
                        <p>{video.description}</p>
                        <hr />
                        <h4>{video.comments} Comments</h4>
                    </div>
                    <div className='add-comment-container'>
                        <img className="img" src={logedinUserImage} alt='commenter' />
                        <div>
                            <input type="text" placeholder="Add a comment..." className="add-comment-input" value={comment} onChange={handleCommentChange} />
                            <button className="add-comment-button" onClick={() => handleNewComment(comment)}>Comment</button>
                        </div>
                    </div>
                    <div className='comment-container'>
                        {
                            comments.map((comment, index) => (
                                <CommentCard index={index} comment={comment} />
                            ))
                        }
                    </div>

                </>
            ) : (
                <p>Video information is loading...</p>
            )}
        </div>
    );
}

export default PlayVideo;