import React, { useState, useContext, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ThemeContext } from '../../Theme/ThemeContext';
import { useNavigate } from 'react-router-dom';

function AddMovie() {
    const { darkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert('User is not loged in, please login first!');
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Do something with title and description
        console.log(title, description);
    };

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Movie Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter movie title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Movie Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter movie description" value={description} onChange={(e) => setDescription(e.target.value)} />
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