import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { ThemeContext } from '../Theme/ThemeContext';

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [displayName, setDisplayName] = useState(""); // New state for display name
  const [imageUrl, setImageUrl] = useState(""); // New state for image URL
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }

    const data = { username, password, displayName, imageUrl }; // Include display name and image URL in data
    const response = await axios.post('/api/auth/register', data);
    // handle response
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
      </Form.Group>

      <Form.Group>
        <Form.Label>Display Name</Form.Label>
        <Form.Control type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Enter display name" /> {/* New input field for display name */}
      </Form.Group>

      <Form.Group>
        <Form.Label>Image URL</Form.Label>
        <Form.Control type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Enter image URL" /> {/* New input field for image URL */}
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      </Form.Group>

      <Form.Group>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} placeholder="Confirm Password" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
      <div/>
      </div >
  );
}

export default Registration;