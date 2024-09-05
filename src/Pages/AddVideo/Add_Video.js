import React, { useState, useContext, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ServerAPI from '../../ServerAPI';
import { jwtDecode } from 'jwt-decode';
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
    const token = localStorage.getItem('loggedInUserToken');
    try {
      const decodedToken = jwtDecode(token);
      const user = decodedToken.username;
      setLoggedInUser(user);
    } catch (error) {
      if (check_for_first_time_logedin) {
        console.error('Invalid token:', error);
        alert('User is not logged in, please login first!');
        navigate('/login');
        check_for_first_time_logedin = false;
      }
    }


    const fetchDisplayName = async () => {
      try {
        const logedinUserdata = await ServerAPI.getUserByUsername(loggedInUser);
        setchannel(logedinUserdata.displayName);
      } catch (error) {
        console.error('Could not fetch user data if the user is not logged in yet it is ok:', error);
      }
    };

    fetchDisplayName();
  }, [navigate, loggedInUser]);


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
    };

    console.log('newVideo:', newVideo);

    try {
      ServerAPI.addVideo(newVideo, localStorage.getItem('loggedInUserToken'));
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