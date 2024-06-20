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
    <div className={`min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 ${darkMode ? 'dark-mode' : ''}`}>
      <Form className="login-form" onSubmit={handleSubmit}>
        <div className="left">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-semibold">Sign in</h1>
          </div>
          <p className="text-zinc">to continue to MeaTube</p>
        </div>
        <div className="right">
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Username</Form.Label>
            <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} className="input-field" placeholder="Enter username" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Password</Form.Label>
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="Password" />
          </Form.Group>

          <div className="flex justify-between items-center mb-4">
            <a href="#" className="text-blue" onClick={(e) => { e.preventDefault(); alert("Not implemented this page yet"); }}>Forgot password?</a>
          </div>

          <p className="text-sm text-zinc mb-4" onClick={(e) => { e.preventDefault(); alert("Not implemented this page yet"); }}>Not your computer? Use Guest mode to sign in privately. <a href="#" className="text-blue">Learn more about using Guest mode</a></p>

          <div className="flex justify-end ">
            <Button variant="primary" onClick={() => navigate('/Registration')} className="text-blue-btn">Create account</Button>
            <Button variant="primary" type="submit" className="submit-button">Login</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Login; // Exporting Login component


