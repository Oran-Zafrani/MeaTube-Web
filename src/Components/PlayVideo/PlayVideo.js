import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PlayVideo.css';
import { formatViews, parseUploadTime } from '../../Components/Feed/VideoCard';
import defaultImage from '../../assets/images/guest_image.png';
import  CommentSection  from './CommentSection';
import ServerAPI from '../../ServerAPI';

function PlayVideo() {
    const [videoSrc, setVideoSrc] = useState('');
    const { videoId } = useParams();
    const [video, setVideo] = useState(null); 
    const [subscriberCount, setSubscriberCount] = useState('Loading...');
    const [uploadedUserImage, setUserImage] = useState(defaultImage);
    const [userInteraction, setUserInteraction] = useState(0);
    const [loggedInUserJson, setLoggedInUserJson] = useState(null);
    const navigate = useNavigate();

    // Define constants for user interactions
    const NONE = 0, LIKE = 1, DISLIKE = 2;

    const [logedinUserImage, setlogedinUserImage] = useState(defaultImage);
    const [displayName, setDisplayName] = useState('');
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    var videoDetails = null;
    useEffect(() => {
        async function fetchVideo() {
            try {
                videoDetails = await ServerAPI.getVideoById(videoId);
                if (videoDetails && videoDetails.videoFile) {
                    setVideoSrc(videoDetails.videoFile);
                    // Update the video state variable
                    setVideo(videoDetails);

                    if (videoDetails && videoDetails.comments) {
                        setComments(videoDetails.comments);
                    }

                    // Increment the view count - WILL BE MOVED TO SERVER

                } else {
                    console.log('No video found or video has no URL');
                }
            } catch (error) {
                console.error('Failed to fetch video:', error);
            }
        }

        async function fetchUploadedUserData(username) {
            try {

                const channelData = await ServerAPI.getUserByUsername(username);
                    setSubscriberCount(channelData.subscribers);
                    setDisplayName(channelData.displayName);
                    setUserImage(channelData.image);

            } catch (error) {
                console.error('Failed to fetch subscriber count:', error);
                setSubscriberCount('Failed to load data');
            }
        }

        async function fetchLogedInUserData() {
            try {
                const userJson = JSON.parse(localStorage.getItem('loggedInUserDetails'));
                setLoggedInUserJson(userJson);
                if (userJson && userJson !== 'null') {

                    const logedinUserdata = await ServerAPI.getUserByUsername(userJson.username);
                    
                    setlogedinUserImage(logedinUserdata.image);
                    // Check if the user like or dislike the video and set the state variable only once
                    if (videoDetails?.userLiked) {
                        setUserInteraction(LIKE);
                    } else if (videoDetails?.userDisliked) {
                        setUserInteraction(DISLIKE);
                    } else {
                        setUserInteraction(NONE);
                    }
                }
            } catch (e) {
                setLoggedInUserJson(null);
                setlogedinUserImage(defaultImage);

                console.error('Failed to fetch logged in user data:', e);
            }
        }

        async function fetchData() {
            await fetchVideo();
            if (videoDetails && videoDetails.username) {
                await fetchUploadedUserData(videoDetails.username);
                await fetchLogedInUserData();
            }
        }

        fetchData();
    }, [videoId, localStorage.getItem('loggedInUserDetails')]);

    const handleLike = async () => {
        if (!loggedInUserJson || loggedInUserJson === 'null') {
            alert('Please log in to like videos.');
            return;
        }


        try {
            if (userInteraction !== LIKE) {
                if (userInteraction === DISLIKE) {
                    // If the user has disliked the video, clicking like will remove the dislike
                    await updateVideoDislikes(videoId, false); // false to decrease dislike
                    setUserInteraction(NONE);
                }
                // Update the video likes on the database
                await updateVideoLikes(videoId, true); // true for like
                setUserInteraction(LIKE);
            } else {
                // If already liked, clicking again will remove the like
                // Update the video likes on the database
                await updateVideoLikes(videoId, false); // false to decrease like
                setUserInteraction(NONE);
            }
        } catch (error) {
            console.error('Failed to like video:', error);
        }
    };

    const handleDislike = async () => {
        if (loggedInUserJson === 'null' || !loggedInUserJson) {
            alert('Please log in to dislike videos.');
            return;
        }

        try {
            if (userInteraction !== DISLIKE) {
                if (userInteraction === LIKE) {
                    // If the user has liked the video, clicking dislike will remove the like
                    await updateVideoLikes(videoId, false); // false to decrease like
                    setUserInteraction(NONE);
                }
                
                // update the video dislikes on the database
                await updateVideoDislikes(videoId, true); // true for dislike
                setUserInteraction(DISLIKE);
            } else {
                // If already disliked, clicking again will remove the dislike
                await updateVideoDislikes(videoId, false); // false to decrease dislike
                setUserInteraction(NONE);            }
        } catch (error) {
            console.error('Failed to dislike video:', error);
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
        try {
            await ServerAPI.addLike(videoId);
            video.likes++;
            video.userLiked = true;
        } catch (error) {
            if (error.response.data.message.includes('Delete')) {
                video.likes--;
                video.userLiked = false;
            }
        }
    };

    const updateVideoDislikes = async (videoId, isDislike) => {
        try {
            await ServerAPI.addDisLike(videoId);
            video.dislikes++;
            video.userDisliked = true;
        } catch (error) {
            if (error.response.data.message.includes('Delete')) {
                video.dislikes--;
                video.userDisliked = false;
            }
        }
    };

    function hendleSubscribe() {
        alert('didnt implement yet!');
    }

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    async function handleNewComment(commentText) {
        // Check if the user is logged in
        if (!loggedInUserJson || loggedInUserJson === 'null') {
            alert('Please log in to post comments.');
            return;
        }
        // Check if the comment is empty
        if (!commentText.trim()) {
            alert('Comment cannot be empty.');
            return;
        }

        try {
            if (!video) {
                console.error('Video not found.');
                return;
            }
            // Create the comment object
            const comment = {
                videoId: videoId,
                commentText,
                userName: loggedInUserJson.username,
                displayName: loggedInUserJson.displayName,
                userImage: logedinUserImage,
                timestamp: new Date().toISOString(),
                likesNum: 0,
                dislikesNum: 0
            };
            await ServerAPI.addComment(videoId, comment);

            // Add the comment to the video's comments list
            if (!video.comments) {
                video.comments = [comment];
            } else {
                video.comments = [comment, ...video.comments];
            }
            setComments(video.comments);
            // Update the state to reflect the new comment
            setNewComment('');
            // Update the video in the database
            console.log('Comment added successfully');
            // should do!!!!!!, update the UI or state to reflect the new comment
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    }

    // Render the edit button if the logged-in user is the video uploader
    const renderEditButton = () => {
        if (video && video.username === loggedInUserJson?.username) {
            return (
                <Link to={`edit`} className='video-action-button' onClick={() => window.scrollTo(0, 0)}>
                    <i className="bi bi-pencil-square"></i>
                </Link>
            );
        }
        return null;
    };



    return (
        <div className='play-video'>
            
            <div className='video-container'>
                {videoSrc && <video src={videoSrc} controls autoPlay muted></video>}
                {!videoSrc && <p>Loading video...</p>}
            </div>

            {video ? (
                <>
                    <h3>{video.title}</h3>
                    <div className='play-video-info'>
                        <p>{formatViews(video.views)} views &bull; {parseUploadTime(video.uploadTime)}</p>
                        <div >
                            {renderEditButton()}
                            <span className={`video-action-button ${userInteraction === LIKE ? "bi bi-hand-thumbs-up-fill like-selected" : "bi bi-hand-thumbs-up-fill"}`} onClick={handleLike}>{formatViews(video.likes)}</span>
                            <span className={`video-action-button ${userInteraction === DISLIKE ? "bi bi-hand-thumbs-down-fill dislike-selected" : "bi bi-hand-thumbs-down-fill"}`} onClick={handleDislike}>{formatViews(video.dislikes)}</span>
                            <span className='video-action-button' onClick={handleShare}><i className="bi bi-share-fill"></i> Share</span>
                        </div>
                    </div>
                    <hr />
                    <div className='publisher'>
                        <img src={uploadedUserImage} alt='publisher' onClick={() => navigate(`/User_Videos/${displayName}`)} />
                        <div>
                            <p style={{ cursor: 'pointer' }} onClick={() => navigate(`/User_Videos/${displayName}`)}>{video.channel} </p>
                            {/** need a think how to do that!!! */}
                            <span>{formatViews(subscriberCount)} subscribers </span>
                        </div>
                        <button onClick={hendleSubscribe}>Subscribe</button>
                    </div>
                    <div className='vid-description'>
                        <p>{video.description}</p>
                        <hr />
                        <h4>{video.comments.length} Comments</h4>
                    </div>
                    <div className='add-comment-container'>
                        <img src={logedinUserImage} alt='commenter' />
                        <div>
                            <input type="text" placeholder="Add a comment..." className="add-comment-input" value={newComment} onChange={handleCommentChange} />
                            <button className="add-comment-button" onClick={() => handleNewComment(newComment)}>Comment</button>
                        </div>
                    </div>

                    <CommentSection Icomments={comments} />
                </>
            ) : (
                <p>Video information is loading...</p>
            )}
        </div>
    );
}

export default PlayVideo;