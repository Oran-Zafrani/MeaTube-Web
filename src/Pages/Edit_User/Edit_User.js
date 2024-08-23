import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { openDB } from 'idb';
import './Edit_User.css';

function EditUser() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [image, setImage] = useState(null);

  const formRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      const db = await openDB('MeaTubeDB');
      const tx = db.transaction('users', 'readonly');
      const store = tx.objectStore('users');
      const user = await store.get(username);

      if (user) {
        setPassword(user.password);
        setDisplayName(user.displayName);
        setImage(user.image);
      } else {
        alert('User not found!');
        navigate('/');
      }
    };
    fetchUserData();
  }, [username, navigate]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password || !passwordConfirmation || !displayName || !image) {
      alert('All fields must be filled out!');
      return;
    }

    if (password !== passwordConfirmation) {
      alert('Passwords do not match!');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert('Password is not complex enough! Please choose another password according to password details.');
      return;
    }

    try {
      const db = await openDB('MeaTubeDB');
      const tx = db.transaction('users', 'readwrite');
      const store = tx.objectStore('users');
      const existingUserData = await store.get(username);

      if (!existingUserData) {
        alert('User not found.');
        return;
      }

      const updatedUserData = {
        ...existingUserData,
        password,
        displayName,
        image,
      };

      await store.put(updatedUserData);
      await tx.complete;
      alert('User updated successfully!');
      navigate(`/profile/${username}`, { replace: true });
    } catch (error) {
      console.error('Could not update the user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(username);
      alert('User deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Could not delete the user:', error);
    }
  };

  async function deleteUser(username) {
    const db = await openDB('MeaTubeDB');
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    await store.delete(username);
    await tx.complete;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 `}>
      <Form className="login-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="left">
          <h1 className="text-2xl font-semibold">Edit User</h1>
          <p className="text-zinc">to update an existing user on MeaTube</p>
        </div>
        <div className="right">
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Display Name</Form.Label>
            <Form.Control type="text" placeholder="Enter display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input-field" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Password</Form.Label>
            <Form.Control type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm new password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="input-field" />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-zinc">Upload new image for changing the current image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} className="input-field" />
          </Form.Group>
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleDelete} className="submit-button">Delete</Button>
            <Button variant="primary" onClick={() => navigate(-1)} className="submit-button">Back</Button>
            <Button variant="primary" type="submit" className="submit-button">Update User</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default EditUser;