import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ServerAPI from '../../ServerAPI';
import './Edit_User.css';
import navbar from '../../Components/Navbar/Navbar';

function EditUser() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await ServerAPI.getUserByUsername(username);
        if (user) {
          setPassword(user.password);
          setPasswordConfirmation(user.password);
          setDisplayName(user.displayName);
          setImage(user.image);
        } else {
          alert('User not found!');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data.');
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

  const validateToken = () => {
    const token = localStorage.getItem('loggedInUserToken');
    if (!token || token === 'null') {
      alert('User is not logged in, please login first!');
      navigate('/login');
      return null;
    }
    return token;
  };

  const validateForm = () => {
    if (!password || !passwordConfirmation || !displayName || !image) {
      alert('All fields must be filled out!');
      return false;
    }

    if (password !== passwordConfirmation) {
      alert('Passwords do not match!');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert('Password is not complex enough! Please choose another password according to password details.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const token = validateToken();
    if (!token) return;

    setLoading(true);

    try {
      const updatedUserData = {
        username,
        password,
        displayName,
        image,
      };

      await ServerAPI.updateUser(username, updatedUserData, token);
      alert('User updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Could not update the user:', error);
      alert('Failed to update user, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = validateToken();
    if (!token) return;

    setLoading(true);

    try {
      await ServerAPI.deleteUser(username, token);
      alert('User deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Could not delete the user:', error);
      alert('Failed to delete user, please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <Button variant="primary" onClick={handleDelete} className="submit-button" disabled={loading}>Delete</Button>
            <Button variant="primary" onClick={() => navigate(-1)} className="submit-button" disabled={loading}>Back</Button>
            <Button variant="primary" type="submit" className="submit-button" disabled={loading}>Update User</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default EditUser;