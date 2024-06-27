import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { openDB } from 'idb';
import './PlayVideo.css';
import { parseUploadTime } from '../../Components/Feed/VideoCard';


// Define your component or function here
function PlayVideo() {
    const [videoSrc, setVideoSrc] = useState('');
    const { videoId } = useParams();
    const [video, setVideo] = useState(null); // Add a new state variable for the video object
    const [subscriberCount, setSubscriberCount] = useState('Loading...');
    const [userImage, setUserImage] = useState('defaultImagePath.jpg');
    const [userInteraction, setUserInteraction] = useState(0); // 0: none, 1: like, 2: dislike
    const NONE = 0, LIKE = 1, DISLIKE = 2;


    useEffect(() => {
        async function fetchVideo() {
            try {
                console.log('Fetching video for ID:', videoId);
                const db = await openDB('meatubeDB', 1);
                const tx = db.transaction('videos', 'readonly');
                const store = tx.objectStore('videos');
                const allVideos = await store.getAll();
                const video = allVideos.find(v => v.id === Number(videoId));
                console.log("video info: ", video); // Check if the video was found
                if (video && video.videoFile) {
                    setVideoSrc(video.videoFile);
                    setVideo(video); // Update the video state variable
                } else {
                    console.log('No video found or video has no URL');
                }
            } catch (error) {
                console.error('Failed to fetch video:', error);
            }
        }

        async function fetchUploadedUserData(channel) {
            try {
                const db = await openDB('MeaTubeDB', 1);
                if (!db.objectStoreNames.contains('users')) {
                    throw new Error("Object store 'users' does not exist.");
                }
                const transaction = db.transaction(["users"], "readonly");
                const objectStore = transaction.objectStore("users");
                const channelData = await objectStore.get(channel);
                console.log('Channel data fetched:', channelData);

                if (channelData && Number.isInteger(channelData.subscribers)) {
                    setSubscriberCount(`${channelData.subscribers} subscribers`);
                } else {
                    setSubscriberCount('No subscribers data');
                }

                if (channelData && channelData.image) {
                    setUserImage(channelData.image);
                } else {
                    setUserImage('defaultImagePath.jpg');
                }
            } catch (error) {
                console.error('Failed to fetch subscriber count:', error);
                setSubscriberCount('Failed to load data');
            }
        }

        async function fetchLogedInUserData() {
            const loggedInUser = localStorage.getItem('loggedInUser');
            if (!(loggedInUser === 'null')) {
                const db = await openDB('MeaTubeDB', 1);
                if (!db.objectStoreNames.contains('users')) {
                    throw new Error("Object store 'users' does not exist.");
                }
                const transaction = db.transaction(["users"], "readonly");
                const objectStore = transaction.objectStore("users");
                const logedinUserdata = await objectStore.get(loggedInUser);
                console.log('Logged in user:', logedinUserdata);
                // Check if the user like or dislike the video and set the state variable
                if (logedinUserdata.likedVideos.includes(Number(videoId))) {
                    console.log('Logged in user liked the video');
                    setUserInteraction(LIKE);
                } else if (logedinUserdata.dislikedVideos.includes(Number(videoId))) {
                    console.log('Logged in user disliked the video');
                    setUserInteraction(DISLIKE);
                } else {
                    console.log('Logged in user has no interaction with the video');
                    setUserInteraction(NONE);
                }
            }
        }

        async function fetchData() {
            await fetchVideo();
            if (video && video.channel) {
                await fetchUploadedUserData(video.channel);
                await fetchLogedInUserData();
            }
        }

        fetchData();
    }, [videoId, video?.channel]);

    const handleLike = async () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser || loggedInUser === 'null') {
            alert('Please log in to like videos.');
            return;
        }
        let updatedVideo = { ...video };
        if (userInteraction !== LIKE) {
            // Visualize the like
            setUserInteraction(LIKE);
            updatedVideo.likes = (updatedVideo.likes || 0) + 1;
            setVideo(updatedVideo);
            // Update the video likes on the database
            await updateVideoLikes(Number(videoId), true); // true for like
            await updateUserInteraction(Number(videoId), LIKE);
        } else {
            // If already liked, clicking again will remove the like
            setUserInteraction(NONE);
            updatedVideo.likes = (updatedVideo.likes || 0) - 1;
            setVideo(updatedVideo);
            // Update the video likes on the database
            await updateVideoLikes(Number(videoId), false); // false to decrease like
            await updateUserInteraction(Number(videoId), NONE);
        }
    };

    const handleDislike = async () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser === 'null') {
            alert('Please log in to dislike videos.');
            return;
        }
        let updatedVideo = { ...video };
        if (userInteraction !== DISLIKE) {
            // visoalize the dislike
            setUserInteraction(DISLIKE);
            updatedVideo.dislikes = (updatedVideo.dislikes || 0) + 1;
            setVideo(updatedVideo);
            // update the video dislikes on the database
            await updateVideoDislikes(Number(videoId), true); // true for dislike
            await updateUserInteraction(Number(videoId), DISLIKE);
        } else {
            // If already disliked, clicking again will remove the dislike
            setUserInteraction(NONE);
            updatedVideo.dislikes = (updatedVideo.dislikes || 0) - 1;
            setVideo(updatedVideo);
            await updateVideoDislikes(Number(videoId), false); // false to decrease dislike
            await updateUserInteraction(Number(videoId), NONE);
        }
    };

    // Increment or decrement the number of likes based on isLike. ture ++, flase --
    const updateVideoLikes = async (videoId, isLike) => {
        const db = await openDB('meatubeDB', 1);
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
        const db = await openDB('meatubeDB', 1);
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
            const db = await openDB('MeaTubeDB', 1); // Corrected database name
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



    return (
        <div className='play-video'>
            {videoSrc && <video src={videoSrc} controls autoPlay muted></video>}
            {!videoSrc && <p>Loading video...</p>}

            {video ? (
                <>
                    <h3>{video.title}</h3>
                    <div className='play-video-info'>
                        <p>{video.views} views &bull; {parseUploadTime(video.uploadTime)}</p>
                        <div>
                            <span className={userInteraction === LIKE ? "bi bi-hand-thumbs-up-fill like-selected" : "bi bi-hand-thumbs-up-fill"} onClick={handleLike}>{video.likes}</span>
                            <span className={userInteraction === DISLIKE ? "bi bi-hand-thumbs-down-fill dislike-selected" : "bi bi-hand-thumbs-down-fill"} onClick={handleDislike}>{video.dislikes}</span>
                            <span><i className="bi bi-share-fill"></i> Share</span>
                        </div>
                    </div>
                    <hr />
                    <div className='publisher'>
                        <img src={userImage} alt='publisher' />
                        <div>
                            <p>{video.channel}</p>
                            {/** need a think how to do that!!! */}
                            <span>{subscriberCount} </span>
                        </div>
                        <button>Subscribe</button>
                    </div>
                    <div className='vid-description'>
                        <p>{video.description}</p>
                        <hr />
                        <h4>{video.comments} Comments</h4>
                    </div>
                    <div className='comment'>
                        <img src='https://via.placeholder.com/50' alt='commenter' />
                        <div>
                            <h3>John Doe <span>1 day ago</span></h3>
                            <p>It looks fun!!</p>
                            <div className='comment-action'>
                                <i className="bi bi-hand-thumbs-up-fill"></i>
                                <span>15</span>
                                <i className="bi bi-hand-thumbs-down-fill"></i>
                            </div>
                        </div>
                    </div>
                    <div className='comment'>
                        <img src='https://via.placeholder.com/50' alt='commenter' />
                        <div>
                            <h3>John Cena <span>1 day ago</span></h3>
                            <p>Awesome!!</p>
                            <div className='comment-action'>
                                <i className="bi bi-hand-thumbs-up-fill"></i>
                                <span>495</span>
                                <i className="bi bi-hand-thumbs-down-fill"></i>
                            </div>
                        </div>
                    </div>
                    <div className='comment'>
                        <img src='https://via.placeholder.com/50' alt='commenter' />
                        <div>
                            <h3>John Wick <span>1 day ago</span></h3>
                            <p>Call me in the next time!!</p>
                            <div className='comment-action'>
                                <i className="bi bi-hand-thumbs-up-fill"></i>
                                <span>45</span>
                                <i className="bi bi-hand-thumbs-down-fill"></i>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>Video information is loading...</p>
            )}
        </div>
    );
}

export default PlayVideo;