import React, { useState, useEffect } from 'react';
import './Feed.css';
import VideoCard from './VideoCard';
import ServerAPI from '../../ServerAPI';

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
  const allVideos = await ServerAPI.getTop20Videos();
  return allVideos;
}
export default Feed;