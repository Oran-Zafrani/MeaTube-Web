import React, { useState, useContext, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { openDB } from 'idb';
import './Add_Video.css';

function AddMovie() {
  const navigate = useNavigate();
  const formRef = useRef();

  // Declare state variables for the function handleSumbit that will be field by the user
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [category, setCategory] = useState('');
  const [channel, setchannel] = useState('');

  // We want to make sure that the user get the massage just one time becasue react is render the page multiple times
  let check_for_first_time_logedin = true;
  // Check if user is logged in

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    console.log('loggedInUser:', user);
    if (check_for_first_time_logedin && user === 'null') {
      check_for_first_time_logedin = false;
      alert('User is not logged in, please login first!');
      console.log('Navigating to /login');
      navigate('/login');
    } else {
      setLoggedInUser(user);
    }

    const fetchDisplayName = async () => {
      try{
      const db = await openDB('MeaTubeDB');
      const transaction = db.transaction(["users"], "readonly");
      const objectStore = transaction.objectStore("users");
      const logedinUserdata = await objectStore.get(user);
      setchannel(logedinUserdata.displayName);
      } catch (error) {
        console.error('Could not fetch user data if the user isnot loggin yet it ok:', error);
      }
    };
  
    fetchDisplayName(); 
  }, [navigate]);


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
    if (!title || !description || !videoFile || !previewImage || !category) {
      alert('Please fill all fields before submitting.');
      return;
    }

    let newVideo = {
      title,
      description,
      category,
      videoFile,
      previewImage,
      channel,
      username: loggedInUser,
      uploadTime: new Date().toISOString(),
      views: 0,
      likes: 0,
      dislikes: 0,
      comments: 0,
      commentsLink: [],
    };

    console.log('newVideo:', newVideo);

    try {
      const db = await openDB('MeaTubeDB');
      const tx = db.transaction('videos', 'readwrite');
      const store = tx.objectStore('videos');
      await store.add(newVideo);
      await tx.complete;
      alert('Video saved successfully!');
      formRef.current.reset();
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setPreviewImage(null);
      setCategory('');

    } catch (error) {
      console.error('Could not save the video to IndexedDB:', error);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 `}>
      <Form className="login-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="left">
          <h1 className="text-2xl font-semibold">Add Video</h1>
          <p className="text-zinc">to add a new movie to MeaTube</p>
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
            <Form.Label className="block text-sm font-medium text-zinc">Upload Video</Form.Label>
            <Form.Control type="file" accept="video/*" onChange={handleVideoChange} className="input-field" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Preview Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="input-field" />
          </Form.Group>
          <div className="flex justify-end">
            <Button variant="primary" type="submit" className="submit-button">Add Movie</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default AddMovie;