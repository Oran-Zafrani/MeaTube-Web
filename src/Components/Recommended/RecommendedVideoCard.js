import React from 'react'
import { Link } from 'react-router-dom';
import { formatViews } from '../Feed/VideoCard';
export const RecommendedVideoCard = (RecommendedVideo) => {

    

    const video = RecommendedVideo.RecommendedVideo;
    return (
        <Link to={`watch/${video.id}`} className='side-video-list'>
            <img src={video.previewImage} alt='' />
            <div className='vid-info'>
                <h3>{video.title}</h3>
                <p>{video.channel}</p>
                <p>{formatViews(video.views)} views</p>
            </div>
        </Link>
    )
}

export default RecommendedVideoCard;