import React, { useState, useContext, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Theme/ThemeContext';
import './Login_Screen.css';

// Login component
function Login() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Initialize IndexedDB
    if (!window.indexedDB) {
      console.log("Your browser doesn't support IndexedDB.");
      return;
    }

    const request = window.indexedDB.open("MeaTubeDB");

    request.onerror = (event) => {
      console.error("Database error: ", event.target.errorCode);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create an objectStore for this database
      const objectStore = db.createObjectStore("users", { keyPath: "username" });
      objectStore.createIndex("password", "password", { unique: false });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please fill in all fields!");
      return;
    }

    const dbRequest = window.indexedDB.open("MeaTubeDB");

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["users"], "readonly");
      const objectStore = transaction.objectStore("users");
      const userRequest = objectStore.get(username);

      userRequest.onsuccess = () => {
        const userData = userRequest.result;
        if (!userData) {
          alert("User does not exist!");
          return;
        }
        if (password !== userData.password) {
          alert("Incorrect password!");
          return;
        }
        alert('User logged in successfully');

        // Save logged-in user to local storage
        localStorage.setItem('loggedInUser', username);

        // Navigate to home page
        navigate('/');
      };
    };

    dbRequest.onerror = (event) => {
      console.error("Error opening database: ", event.target.errorCode);
    };
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


