import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VideoCard from '../../Components/Feed/VideoCard';
import { openDB } from 'idb';
import '../Main/Main.css';

function User_Videos() {
  const [videos, setVideos] = useState([]);
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserVideos() {
      const allVideos = await getVideos();
      const userVideos = allVideos.filter(video => video.username === username);
      setVideos(userVideos);
    }

    fetchUserVideos();
  }, [username]);

  return (
    <div>
      <div className='container'>
        <div className='feed'>
          {videos.map((video, key) => (
            <VideoCard key={key} vidCard={video} />
          ))}
        </div>
      </div>

      <div id="login">
        <button onClick={() => navigate('/Login')}>Login</button>
      </div>

      <div id="AddMovie">
        <button onClick={() => navigate('/AddMovie')}>AddMovie</button>
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