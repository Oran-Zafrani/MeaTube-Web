import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VideoCard from '../../Components/Feed/VideoCard';
import { openDB } from 'idb';
import '../Main/Main.css';

function User_Videos() {
  const [videos, setVideos] = useState([]);
  const { channel } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserVideos() {
      const allVideos = await getVideos();
      const userVideos = allVideos.filter(video => video.channel === channel);
      setVideos(userVideos);
    }

    fetchUserVideos();
  }, [channel]);

  return (
      <div className='container'>
        <div className='feed'>
          {videos.map((video, key) => (
            <VideoCard key={key} vidCard={video} />
          ))}
        </div>
      </div>
  );
}

async function getVideos() {
  const db = await openDB('MeaTubeDB');
  const tx = db.transaction('videos', 'readonly');
  const store = tx.objectStore('videos');
  const allVideos = await store.getAll();
  return allVideos;
}

export default User_Videos;