import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/meatube_logo_with_text.png';
import defaultProfilePic from '../../assets/images/guest_image.png'; 
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { openDB } from 'idb';

const Navbar = ({ setSidebar }) => {
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(defaultProfilePic); // State to manage profile picture

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = await openDB('MeaTubeDB', 1);
                if (!db.objectStoreNames.contains('users')) {
                    throw new Error("Object store 'users' does not exist.");
                }
                const transaction = db.transaction(["users"], "readonly");
                const objectStore = transaction.objectStore("users");
                const loggedInUser = localStorage.getItem('loggedInUser'); // Assuming loggedInUser stores the channel/user identifier
                const channelData = await objectStore.get(loggedInUser);

                if (channelData && channelData.image) {
                    setProfilePic(channelData.image);
                } else {
                    console.log('No user data found for channel:', loggedInUser);
                    setProfilePic(defaultProfilePic);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setProfilePic(defaultProfilePic);
            }
        };

        fetchUserData();
    }, []);

    const checkLoggedIUser = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser === 'null') {
            navigate('/Login');
        } else {
            alert('User is already logged in');
        }
    };

    // Function to handle logout (assuming you have one)
    const handleLogout = () => {
        // Perform logout operations...
        setProfilePic(defaultProfilePic); // Reset profile picture to default on logout
    };

    return (
        <div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
            <nav className='flex-div'>
                <div className='nav-left flex-div'>
                    <i className="bi bi-list" onClick={() => setSidebar(prev => prev === false ? true : false)}></i>
                    <img className='logo' onClick={() => navigate('/')} src={logo} alt='logo'/>
                </div>

                <div className='nav-middle flex-div'>
                    <div className='search-box flex-div'>
                        <input type='text' placeholder='Search' />
                        <button type="submit"><i className="bi bi-search"></i></button>
                    </div>
                </div>

                <div className='nav-right flex-div'>
                    <i className="bi bi-upload" onClick={() => navigate('/AddMovie')} ></i>
                    <i className="bi bi-bell"></i>
                    <img className='profile' src={profilePic} onClick={checkLoggedIUser} alt='profile-pic'/>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;