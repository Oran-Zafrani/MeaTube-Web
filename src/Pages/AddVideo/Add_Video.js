import React, { useState, useContext, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ThemeContext } from '../../Theme/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './Add_Video.css';

function AddMovie() {
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();
    const formRef = useRef();

    // Declare state variables for the function handleSumbit that will be field by the user
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

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
    }, [navigate]);


    const handleSubmit = (event) => {
        event.preventDefault();
        // Check if all fields are filled
        if (!title || !description || !videoFile || !previewImage) {
            alert('Please fill all fields before submitting.');
            return;
        }

        // Get the current videos array from localStorage. If there are no videos, create an empty array
        let videos = JSON.parse(localStorage.getItem('videos')) || [];

        // Create a new video object
        let newVideo = {
            // If there are no videos, set the videoId to 1. Otherwise, set it to the length of the videos array + 1
            "videoId": videos.length + 1,
            "title": title,
            "description": description,
            "videoFile": videoFile,
            "previewImage": previewImage,
            "username": loggedInUser,
            "uploadTime": new Date().toISOString(),
            "views": 0,
            "likes": 0,
            "dislikes": 0,
            "comments": 0,
            "commentsLink": []
        };

        // Add the new video to the videos array
        videos.push(newVideo);

        // Save the updated videos array back to localStorage
        localStorage.setItem('videos', JSON.stringify(videos));

        // Alert the user that the video was saved successfully
        alert('Video saved successfully!');
        formRef.current.reset();

        // Clear the form fields
        setTitle('');
        setDescription('');
        setVideoFile(null);
        setPreviewImage(null);
    };

    return (
        <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
            <Form ref={formRef} onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Movie Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter movie title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Movie Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter movie description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload Video</Form.Label>
                    <Form.Control type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Preview Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setPreviewImage(e.target.files[0])} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Add Movie
                </Button>
            </Form>
            <div />
        </div>
    );
}

export default AddMovie;