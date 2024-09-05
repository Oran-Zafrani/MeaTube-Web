import React, { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import VideoCard, { formatViews } from '../../Components/Feed/VideoCard';
import ServerAPI from '../../ServerAPI';
import '../Main/Main.css';
import './User_Videos.css';

function User_Videos() {
  const [videos, setVideos] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username: channel_name } = useParams();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const user = await ServerAPI.getUserByChannelName(channel_name);
        const allVideos = await ServerAPI.getVideosByUsername(user.username);
        
        setUserInfo({
          displayName: user.displayName,
          subscribers: user.subscribers,
          videoCount: allVideos.length,
          image: user.image
        });
        setVideos(allVideos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [channel_name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='container'>
      <div className="flex items-center mb-4">
        <img src={userInfo.image || "https://placehold.co/80x80"} alt="Channel Logo" className="channel-logo" />
        <div>
          <h1 className="text-primary">{userInfo.displayName}</h1>
          <p className="text-muted">{formatViews(userInfo.subscribers)} subscribers | {userInfo.videoCount} videos</p>
        </div>
      </div>
      <div className="mt-4">
        <hr className="full-width-line" />
      </div>
      <div className='feed'>
        {videos.map((video, key) => (
          <VideoCard key={key} vidCard={video} />
        ))}
      </div>
    </div>
  );
}

export default User_Videos;