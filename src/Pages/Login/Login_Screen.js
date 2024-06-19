import React, { useState, useContext } from 'react'; // Importing React and useState hook from react
import { Button, Form } from 'react-bootstrap'; // Importing Button and Form components from react-bootstrap
import axios from 'axios'; // Importing axios for making HTTP requests
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Theme/ThemeContext';
import './Login_Screen.css'; 

// Login component
function Login() {
  // useNavigate is a hook from react-router-dom that allows navigation between routes
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);


  // useState hook to manage username and password state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing default form submission behaviour

    // Check if username and password are filled out
    if (!username || !password) {
      alert("Please fill in all fields!");
      return;
    }

    // Check if user exists in local storage
    const storedData = localStorage.getItem(username);
    if (!storedData) {
      alert("User does not exist!");
      return;
    }

    // Parse stored data
    const { password: storedPassword } = JSON.parse(storedData);

    // Check if entered password matches stored password
    if (password !== storedPassword) {
      alert("Incorrect password!");
      return;
    }

    alert('User logged in successfully');

    // Save logged-in user to local storage
    localStorage.setItem('loggedInUser', username);

    // Navigate to home page
    navigate('/');
  };

  // Rendering form
  return (
      <div className={`login ${darkMode ? 'dark-mode' : ''}`}>
        <Form onSubmit={handleSubmit}> {/* Form submission handled by handleSubmit function */}
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" /> {/* Input field for username */}
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /> {/* Input field for password */}
          </Form.Group>

          <Button variant="primary" type="submit"> {/* login button */}
            Login
          </Button>

          <Button variant="primary" onClick={() => navigate('/Registration')}> {/* Navigate to register page when button is clicked */}
            Register
          </Button>

        </Form>
      </div>
  );
}

export default Login; // Exporting Login component