import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VideoCard from '../../Components/Feed/VideoCard';
import ServerAPI from '../../ServerAPI';
import '../Main/Main.css';

function User_Videos() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);
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

  const buttonClass = 'px-4 py-2 rounded';
  const linkClass = 'text-muted-foreground hover:underline';

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

  const allVideos = await ServerAPI.getVideosByUsername();
  return allVideos;
}



export default User_Videos;