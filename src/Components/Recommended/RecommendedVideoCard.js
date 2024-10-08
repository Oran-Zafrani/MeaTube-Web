import React from 'react'
import { Link } from 'react-router-dom';
import { formatViews } from '../Feed/VideoCard';


export const RecommendedVideoCard = ({RecommendedVideo}) => {

    return (
        <Link to={`/watch/${RecommendedVideo._id}`} className='side-video-list' onClick={()=> window.scrollTo(0,0)}>
            <div className='img-container'>
            <img src={RecommendedVideo.previewImage} alt='' />
            </div>
            <div className='vid-info'>
                <h3>{RecommendedVideo.title}</h3>
                <p>{RecommendedVideo.channel}</p>
                <p>{formatViews(RecommendedVideo.views)} views</p>
            </div>
        </Link>
    )
}

export default RecommendedVideoCard;