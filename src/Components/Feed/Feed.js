import React, { useState, useEffect } from 'react';
import './Feed.css';
import FeedJson from '../../../src/assets/jsons/Feed.json';
import VideoCard from './VideoCard';
import { openDB } from 'idb';

function Feed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      const videos = await getVideos();
      setVideos(videos);
    }

    fetchVideos();
  }, []);

  return (
    <div className='feed'>
      {videos.map((video, key) => (
        <VideoCard key={key} vidCard={video} />
      ))}
    </div>
  );
}

export async function getVideos() {
  const db = await openDB('meatubeDB', 1);
  const tx = db.transaction('videos', 'readonly');
  const store = tx.objectStore('videos');
  const allVideos = await store.getAll();
  return [...FeedJson, ...allVideos];
}
export default Feed;