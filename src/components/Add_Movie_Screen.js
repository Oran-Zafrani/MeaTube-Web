import React, { useState, useContext } from 'react'; // Importing React and useState hook from react
import { Button, Form } from 'react-bootstrap';
import { ThemeContext } from '../Theme/ThemeContext';

function AddMovie() {
    const { darkMode } = useContext(ThemeContext);

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <Form>
                <Form.Group>
                    <Form.Label>Movie Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter movie title" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Movie Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter movie description" />
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