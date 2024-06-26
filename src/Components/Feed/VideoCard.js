import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = (vidCard) => {
    const video = vidCard.vidCard;
    return (
        <Link to={`watch/${video.id}`} className='card'>
        <img src={video.previewImage} alt='' />
        <h2>{video.title}</h2>
        <h3>{video.channel}</h3>
        <p>{formatViews(video.views)} &bull; {parseUploadTime(video.uploadTime)}</p>
    </Link> 
    );
};

//formatViews function to format the views
function formatViews(views) {
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