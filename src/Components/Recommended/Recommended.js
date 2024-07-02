import React, { useEffect, useState } from 'react'
import './Recommended.css'
import { getVideos } from '../Feed/Feed.js'
import { RecommendedVideoCard } from './RecommendedVideoCard.js'

export const Recommended = () => {
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        async function fetchVideos() {
          const videos = await getVideos();
          setVideos(videos);
        }
    
        fetchVideos();
      }, []);
    return (
        <div className='recommended'>
            <>
                {videos.map((video, key) => (
                <RecommendedVideoCard key={key} RecommendedVideo={video} />
                ))}
            </>

        </div>
    )
}
