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


            <div className='side-video-list'>
                <img src='https://picsum.photos/id/50/640/360' alt='' />
                <div className='vid-info'>
                    <h3>Oran plays another game</h3>
                    <p>Oran Zafrani</p>
                    <p>132K views</p>
                </div>
            </div>

            <div className='side-video-list'>
                <img src='https://picsum.photos/id/550/640/360' alt='' />
                <div className='vid-info'>
                    <h3>Oran plays another game2</h3>
                    <p>Oran Zafrani</p>
                    <p>132K views</p>
                </div>
            </div>

            <div className='side-video-list'>
                <img src='https://picsum.photos/id/530/640/360' alt='' />
                <div className='vid-info'>
                    <h3>Oran plays another game3</h3>
                    <p>Oran Zafrani</p>
                    <p>132K views</p>
                </div>
            </div>

            <div className='side-video-list'>
                <img src='https://picsum.photos/id/520/640/360' alt='' />
                <div className='vid-info'>
                    <h3>Oran plays another game4</h3>
                    <p>Oran Zafrani</p>
                    <p>132K views</p>
                </div>
            </div>

            <div className='side-video-list'>
                <img src='https://picsum.photos/id/510/640/360' alt='' />
                <div className='vid-info'>
                    <h3>Oran plays another game5</h3>
                    <p>Oran Zafrani</p>
                    <p>132K views</p>
                </div>
            </div>
        </div>
    )
}
