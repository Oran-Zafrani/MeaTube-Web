import React from 'react';
import './Feed.css';
import FeedJson from '../../../src/assets/jsons/Feed.json';
import VideoCard from './VideoCard';
// Import any necessary modules or components

const VideoList = FeedJson.map((video, key) => {
    return <VideoCard key={key} vidCard={video} />;});

// Define your component or function
function Feed() {
    // Add your code here
    return (
        
        <div className='feed'>
            {VideoList}     
        </div>
    );
}

export default Feed;