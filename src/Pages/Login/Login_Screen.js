import React, { useState, useContext } from 'react'; // Importing React and useState hook from react
import { Button, Form } from 'react-bootstrap'; // Importing Button and Form components from react-bootstrap
import axios from 'axios'; // Importing axios for making HTTP requests
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Theme/ThemeContext';

// Login component
function Login() {
  // useNavigate is a hook from react-router-dom that allows navigation between routes
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  // useState hook to manage username and password state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Preventing default form submission behaviour
    const data = { username, password }; // Creating data object with username and password
    const response = await axios.post('/api/auth/login', data); // Making POST request to login API with data
    // handle response
  };

  // Rendering form
  return (
    <div className={darkMode ? 'dark-mode' : ''}>
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
      <div/>
    </div>
  );
}

export default Login; // Exporting Login component