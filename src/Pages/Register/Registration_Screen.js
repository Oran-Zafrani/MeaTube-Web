import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
import ServerAPI from '../../ServerAPI';

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

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
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    if (!passwordRegex.test(password)) {
      alert("Password is not too complex! please choose another password according to password details");
      return;
    }
  
    const data = { username, password, passwordConfirmation, displayName, image };
    console.log('Sending data to server:', data); // Log the data being sent
  
    try {
      const response = await ServerAPI.createUser(data);
      console.log('Server response:', response); // Log the server response
      alert('User registered successfully');
      navigate('/Login');
    } catch (error) {
      console.error('Error during registration:', error); // Log the error
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 'An unexpected error occurred. Please try again later.';
        alert(errorMessage);
      } else {
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <Form className="register-form" onSubmit={handleSubmit}>
        <div className="left">
          <h1 className="text-2xl font-semibold">Register</h1>
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
            <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="must include lowercase, uppercase, digit, one (@$!%*?&), 8+ chars" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Confirm Password</Form.Label>
            <Form.Control type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} className="input-field" placeholder="Confirm Password" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Image</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} className="input-field" />
          </Form.Group>

          <div className="flex justify-end">
            <Button variant="primary" onClick={() => navigate('/Login')} className="text-blue-btn">Already have an account?</Button>
            <Button variant="primary" type="submit" className="submit-button">Register</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default Registration;