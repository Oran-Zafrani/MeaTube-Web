import React from 'react'
import { Link } from 'react-router-dom';
import { formatViews } from '../Feed/VideoCard';


export const RecommendedVideoCard = ({RecommendedVideo}) => {

    return (
        <Link to={`/watch/${RecommendedVideo.id}`} className='side-video-list' onClick={()=> window.scrollTo(0,0)}>
            <img src={RecommendedVideo.previewImage} alt='' />
            <div className='vid-info'>
                <h3>{RecommendedVideo.title}</h3>
                <p>{RecommendedVideo.channel}</p>
                <p>{formatViews(RecommendedVideo.views)} views</p>
            </div>
        </Link>
    )
}

export default RecommendedVideoCard;