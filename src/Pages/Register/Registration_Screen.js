import React, { useState, useContext, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ThemeContext } from '../../Theme/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [image, setImage] = useState(null);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Initialize IndexedDB
  useEffect(() => {
    if (!window.indexedDB) {
      alert("Your browser doesn't support a stable version of IndexedDB. Some features will not be available.");
    } else {
      const request = window.indexedDB.open("MeaTubeDB");

      request.onerror = (event) => {
        console.error("Database error: ", event.target.errorCode);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("users", { keyPath: "username" });
        objectStore.createIndex("username", "username", { unique: true });
      };
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !passwordConfirmation || !displayName || !image) {
      alert("All fields must be filled out!");
      return;
    }

    if (password !== passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      alert("Password must be at least 8 characters long and contain both letters and numbers!");
      return;
    }

    const dbRequest = window.indexedDB.open("MeaTubeDB");
    
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["users"], "readwrite");
      const objectStore = transaction.objectStore("users");

      const getRequest = objectStore.get(username);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          alert("User already exists!");
        } else {
          const data = { username, password, displayName, image, subscribers: 0, likedVideos: [], dislikedVideos: [] };
          const addRequest = objectStore.add(data);

          addRequest.onsuccess = () => {
            alert('User registered successfully');
            navigate('/Login');
          };

          addRequest.onerror = (event) => {
            console.error("Error adding data: ", event.target.error);
          };
        }
      };

      getRequest.onerror = (event) => {
        console.error("Error reading data: ", event.target.error);
      };
    };

    dbRequest.onerror = (event) => {
      console.error("Error opening database: ", event.target.errorCode);
    };
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 ${darkMode ? 'dark-mode' : ''}`}>
    <Form className="login-form" onSubmit={handleSubmit}>
      <div className="left">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-semibold">Register</h1>
        </div>
        <p className="text-zinc">to create a new MeaTube account</p>
      </div>
      <div className="right">
        <Form.Group className="mb-4">
          <Form.Label className="block text-sm font-medium text-zinc">Username</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} className="input-field" placeholder="Enter username" />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="block text-sm font-medium text-zinc">Display Name</Form.Label>
          <Form.Control type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="input-field" placeholder="Enter display name" />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="block text-sm font-medium text-zinc">Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="Password" />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="block text-sm font-medium text-zinc">Confirm Password</Form.Label>
          <Form.Control type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} className="input-field" placeholder="Confirm Password" />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="block text-sm font-medium text-zinc">Image</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} className="input-field" />
        </Form.Group>

        <div className="flex justify-end ">
          <Button variant="primary" onClick={() => navigate('/Login')} className="text-blue-btn">Already have an account?</Button>
          <Button variant="primary" type="submit" className="submit-button">Register</Button>
        </div>
      </div>
    </Form>
  </div>
  );
}

export default Registration;