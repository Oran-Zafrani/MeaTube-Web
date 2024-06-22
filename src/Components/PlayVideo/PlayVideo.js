import React from 'react';
import './PlayVideo.css';
import video from '../../assets/videos/who_does_plant.mp4';
// Import any necessary modules or dependencies here

// Define your component or function here
function PlayVideo() {
    // Add your code here
    return (
        <div className='play-video'>
            <video src={video} controls autoPlay muted></video>
            <h3>Oran Plays CS:GO</h3>
            <div className='play-video-info'>
                <p>1.2k views &bull; 2 days ago</p>
                <div>
                    <span><i class="bi bi-hand-thumbs-up-fill"></i> 254</span>
                    <span><i class="bi bi-hand-thumbs-down-fill"></i> 31</span>
                    <span><i class="bi bi-share-fill"></i> Share</span>
                </div>
            </div>
            <hr />
            <div className='publisher'>
                <img src='https://via.placeholder.com/50' alt='publisher' />
                <div>
                    <p>Oran Zafrani</p>
                    <span>2M subsribers</span>
                </div>
                <button>Subscribe</button>
            </div>
            <div className='vid-description'>
                <p>video of oran playin cs:go</p>
                <hr />
                <h4>130 Comments</h4>





                //components for comment
                <div className='comment'>
                    <img src='https://via.placeholder.com/50' alt='commenter' />
                    <div>
                        <h3>John Doe <span>1 day ago</span></h3>
                        <p>It looks fun!!</p>
                        <div className='comment-action'>
                            <i class="bi bi-hand-thumbs-up-fill"></i>
                            <span>15</span>
                            <i class="bi bi-hand-thumbs-down-fill"></i>
                        </div>
                    </div>
                </div>
                <div className='comment'>
                    <img src='https://via.placeholder.com/50' alt='commenter' />
                    <div>
                        <h3>John Cena <span>1 day ago</span></h3>
                        <p>Awesome!!</p>
                        <div className='comment-action'>
                            <i class="bi bi-hand-thumbs-up-fill"></i>
                            <span>495</span>
                            <i class="bi bi-hand-thumbs-down-fill"></i>
                        </div>
                    </div>
                </div>
                <div className='comment'>
                    <img src='https://via.placeholder.com/50' alt='commenter' />
                    <div>
                        <h3>John wick <span>1 day ago</span></h3>
                        <p>Call me in the next time!!</p>
                        <div className='comment-action'>
                            <i class="bi bi-hand-thumbs-up-fill"></i>
                            <span>45</span>
                            <i class="bi bi-hand-thumbs-down-fill"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayVideo;