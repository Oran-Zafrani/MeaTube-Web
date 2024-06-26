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

    useEffect(() => {
        async function fetchVideo() {
            try {
                console.log('Fetching video for ID:', videoId);
                const db = await openDB('meatubeDB', 1);
                const tx = db.transaction('videos', 'readonly');
                const store = tx.objectStore('videos');
                const allVideos = await store.getAll();
                console.log(videoId); // Check the videoId value and type
                console.log(allVideos); // Inspect the allVideos array
                const video = allVideos.find(v => v.id === Number(videoId));
                console.log(video); // Check if the video was found
                if (video && video.videoFile) {
                    console.log('Video URL found:', video.videoFile);
                    setVideoSrc(video.videoFile);
                    setVideo(video); // Update the video state variable
                } else {
                    console.log('No video found or video has no URL');
                }
            } catch (error) {
                console.error('Failed to fetch video:', error);
            }
        }

        // Fetch user information from the IndexedDB
        async function fetchSubscriberCount(channel) { 
            try {
                const db = await openDB('meatubeDB', 1);
                const tx = db.transaction('channels', 'readonly');
                const store = tx.objectStore('channels');
                const channelData = await store.get(channel);
                if (channelData && channelData.subscribers) {
                    setSubscriberCount(`${channelData.subscribers} subscribers`); // Step 4: Update state
                } else {
                    setSubscriberCount('No subscribers data');
                }
            } catch (error) {
                console.error('Failed to fetch subscriber count:', error);
                setSubscriberCount('Failed to load data');
            }
        }

        fetchVideo();
        if (video && video.channel) {
            fetchSubscriberCount(video.channel); 
        }
    }, [videoId, video?.channel]);

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
                            <span><i className="bi bi-hand-thumbs-up-fill"></i> {video.likes}</span>
                            <span><i className="bi bi-hand-thumbs-down-fill"></i> {video.dislikes}</span>
                            <span><i className="bi bi-share-fill"></i> Share</span>
                        </div>
                    </div>
                    <hr />
                    <div className='publisher'>
                        <img src='https://via.placeholder.com/50' alt='publisher' />
                        <div>
                            <p>{video.channel}</p>
                            {/** need a think how to do that!!! */}
                            <span>{subscriberCount} subscribers</span>
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