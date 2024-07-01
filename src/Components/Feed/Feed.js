import React, { useState, useEffect } from 'react';
import './Feed.css';
import FeedJson from '../../../src/assets/jsons/Feed.json';
import VideoCard from './VideoCard';
import { openDB } from 'idb';

function Feed(searchString) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      let videos = await getVideos();
      videos = handleSearch(videos, searchString.searchString);
      setVideos(videos);
    }

    fetchVideos();
  }, [searchString]);

  return (
    <div className='feed'>
      {videos.map((video, key) => (
        <VideoCard key={key} vidCard={video} />
      ))}
    </div>
  );
}


function handleSearch(videos, searchStr) {
  if (searchStr === null || searchStr === undefined || searchStr === '') {
    return videos;
  }
  const searchString = String(searchStr).toLowerCase();
  return videos.filter((video) => {
    return video.title.toLowerCase().includes(searchString);
  });
}

export async function getVideos() {
  const db = await openDB('MeaTubeDB');
  const tx = db.transaction('videos', 'readonly');
  const store = tx.objectStore('videos');
  const allVideos = await store.getAll();
  return [...FeedJson, ...allVideos];
}
export default Feed;