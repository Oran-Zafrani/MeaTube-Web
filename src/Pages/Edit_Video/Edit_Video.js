import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { openDB } from 'idb';
import './Edit_Video.css';
import { getVideos } from '../../Components/Feed/Feed';

function EditMovie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const formRef = useRef();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const allVideos = await getVideos();
        const video = allVideos.find(v => v.id === Number(id));
        if (video) {
          setTitle(video.title);
          setDescription(video.description);
          setCategory(video.category);
          setVideoFile(video.videoFile);
          setPreviewImage(video.previewImage);
        } else {
          alert('Video not found!');
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to fetch video data:', error);
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
      const db = await openDB('MeaTubeDB');
      const tx = db.transaction('videos', 'readwrite');
      const store = tx.objectStore('videos');
      // Retrieve the existing video data
      const existingVideoData = await store.get(Number(id));
      if (!existingVideoData) {
        alert('Video not found.');
        return;
      }
      // Update the fields in the existing video data
      const updatedVideoData = {
        ...existingVideoData,
        title,
        description,
        category,
        videoFile,
        previewImage,
        // Keep other data unchanged
      };
      // Put the updated object back into the database
      await store.put(updatedVideoData);
      await tx.complete;
      alert('Video updated successfully!');
      navigate('/watch/' + id, { replace: true });
    } catch (error) {
      console.error('Could not update the video:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVideo(id); 
      alert('Video deleted successfully!');
      navigate('/'); 
    } catch (error) {
      console.error('Could not delete the video:', error);
    }
  };

  async function deleteVideo(id) {
    const db = await openDB('MeaTubeDB');
    const tx = db.transaction('videos', 'readwrite');
    const store = tx.objectStore('videos');
    await store.delete(Number(id));
    await tx.complete;
  }

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