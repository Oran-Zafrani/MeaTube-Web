import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServerAPI from '../../ServerAPI';
import './Feed.css';

const VideoCard = ({ vidCard }) => {
  const navigate = useNavigate();
  const video = vidCard;
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const user = await ServerAPI.getUserByUsername(video.username);
        const image = user.image;
        if (image) {
          setUserImage(image);
        }
      } catch (error) {
        console.error('Error fetching user image:', error);
        // Optionally, you can set an error state or a default image here
      }
    };
    fetchUserImage();
  }, [video.username]);

  return (
    <div className='card'>
      <Link to={`watch/${video.id}`} onClick={() => window.scrollTo(0, 0)}>
        <img src={video.previewImage} alt='' />
        <h2>{video.title}</h2>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={userImage} onClick={() => navigate(`/User_Videos/${video.channel}`)} style={{ cursor: 'pointer' }} alt='profileforvideocardspic' className="profileforvideocardspic" />
        <div>
          <h3 onClick={() => navigate(`/User_Videos/${video.channel}`)} style={{ cursor: 'pointer' }}> {video.channel} </h3>
          <p>{formatViews(video.views)} Views &bull; {parseUploadTime(video.uploadTime)}</p>
        </div>
      </div>
    </div>
  );
};

// formatViews function to format the views
export function formatViews(views) {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });

  return formatter.format(views);
}

// Define a function to parse the upload time: TIME FORMAT IS ISO 8601
export function parseUploadTime(dateTime) {
  const uploadDate = new Date(dateTime);
  const currentDate = new Date();

  const diffInSeconds = Math.floor((currentDate - uploadDate) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} days ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} months ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} years ago`;
  }
}

const uploadTime = "2023-05-01T10:30:00Z";
const formattedTime = parseUploadTime(uploadTime);
console.log(formattedTime);

export default VideoCard;