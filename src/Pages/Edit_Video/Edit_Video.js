import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ServerAPI from '../../ServerAPI';
import './Edit_Video.css';
import { jwtDecode } from 'jwt-decode';

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [ channel, setchannel] = useState('');
  const [username, setUsername] = useState('');

  const formRef = useRef();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
      
        // Set the fields from the video data
        const videoData = await ServerAPI.getVideoById(id);
        Promise.all([videoData]).then((values) => {
          setTitle(values[0].title);
          setDescription(values[0].description);
          setCategory(values[0].category);
          setVideoFile(values[0].videoFile);
          setPreviewImage(values[0].previewImage);
        });


        // Get the username from the token
        const token = localStorage.getItem('loggedInUserToken');
        if (!token) {
          throw new Error('No token found');
        }
    
        const decodedToken = jwtDecode(token);
        const username = decodedToken.username;
        setUsername(username);
        setchannel(decodedToken.displayName);
    
        // Check if the user is authorized to edit the video
        if (videoData && videoData.username !== username) {
          alert('You are not authorized to edit this video!');
          navigate('/');
        }




      } catch (error) {
        console.error('Error fetching video data or decoding token:', error);
        alert('Failed to fetch video data or unauthorized access.');
        navigate('/');
      }
    };
    fetchVideoData();
  }, [id, navigate]);


  // handleVideoChange function is used to change the video file to url
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // handleImageChange function is used to change the image file to url
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setPreviewImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !description || !category) {
      alert('Please fill all fields before submitting.');
      return;
    }
    try {
      const updatedVideoData = {
        title,
        description,
        videoFile,
        previewImage,
        channel,
        category,
        username,
      };

      ServerAPI.updateVideo(id, updatedVideoData);
      alert('Video updated successfully!');
      navigate('/watch/' + id, { replace: true });
    } catch (error) {
      console.error('Could not update the video:', error);
    }
  };

  const handleDelete = async () => {
    try {
      ServerAPI.deleteVideoById(id);
      alert('Video deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Could not delete the video:', error);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 `}>
      <Form className="login-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="left">
          <h1 className="text-2xl font-semibold">Edit Video</h1>
          <p className="text-zinc">to update an existing movie on MeaTube</p>
        </div>
        <div className="right">
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Movie Title</Form.Label>
            <Form.Control type="text" placeholder="Enter movie title" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Movie Description</Form.Label>
            <Form.Control type="text" placeholder="Enter movie description" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Category</Form.Label>
            <Form.Control type="text" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Upload new video for changing the current video</Form.Label>
            <Form.Control type="file" accept="video/*" onChange={handleVideoChange} className="input-field" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Upload new image for changing the current image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="input-field" />
          </Form.Group>
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleDelete} className="submit-button">Delete</Button>
            <Button variant="primary" onClick={() => navigate(-1)} className="submit-button">Back</Button>
            <Button variant="primary" type="submit" className="submit-button">Update Movie</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default EditMovie;