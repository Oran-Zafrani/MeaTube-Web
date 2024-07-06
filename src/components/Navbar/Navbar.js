import React, { useEffect, useRef, useState } from 'react';
import logo from '../../assets/images/meatube_logo_with_text.png';
import defaultProfilePic from '../../assets/images/guest_image.png'; 
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { openDB } from 'idb';
import Darkmode from './Darkmode';

const Navbar = ({ setSidebar, setIsChecked, setSearch, loggedInUser, setLoggedInUser }) => {
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(defaultProfilePic); // State to manage profile picture
    const [searchString, setSearchString] = useState('');
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                buttonRef.current.click();
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = await openDB('MeaTubeDB');
                if (!db.objectStoreNames.contains('users')) {
                    throw new Error("Object store 'users' does not exist.");
                }
                const transaction = db.transaction(["users"], "readonly");
                const objectStore = transaction.objectStore("users");
                const channelData = await objectStore.get(loggedInUser);

                if (channelData && channelData.image) {
                    setProfilePic(channelData.image);
                } else {
                    console.log('No user data found for channel:', loggedInUser);
                    setProfilePic(defaultProfilePic);
                }
            } catch (error) {
                setProfilePic(defaultProfilePic);
            }
        };

        fetchUserData();
    }, [loggedInUser]);

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
        setLoggedInUser(null); // Reset the logged in user
        localStorage.setItem('loggedInUser', 'null'); // Reset the logged in user
        setProfilePic(defaultProfilePic); // Reset profile picture to default on logout
        // Refresh the page to reflect the changes
        const refreshPage = () => {
            window.location.reload();
          };
          refreshPage();
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        setSearch(searchString); // Update the string state with the input value
        setSearchString(''); // Clear the input field after submission
      };
    
      const handleInputChange = (e) => {
        setSearchString(e.target.value); // Update the input value as the user types
      };

    return (
        <div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
            <nav className='flex-div'>
                <div className='nav-left flex-div'>
                    <i className="bi bi-list" onClick={() => setSidebar(prev => prev === false ? true : false)}></i>
                    <img className='logo' onClick={() => {setSearch(''); navigate('/')}} src={logo} alt='logo'/>
                </div>

                <div className='nav-middle flex-div'>
                    <div className='search-box flex-div'>
                        <input type='text' value={searchString} onChange={handleInputChange} placeholder='Search' />
                        <button ref={buttonRef} type="submit" onClick={handleSearchSubmit}><i className="bi bi-search"></i></button>
                    </div>
                </div>

                <div className='nav-right flex-div'>
                    <Darkmode  handleChange={() => setIsChecked(prev => prev === false ? true : false)} />
                    <i className="bi bi-upload" onClick={() => navigate('/AddMovie')} ></i>
                    <i className="bi bi-bell"></i>
                    {loggedInUser && <i className="bi bi-box-arrow-left" onClick={handleLogout}></i>}
                    <img className='profile' src={profilePic} onClick={checkLoggedIUser} alt='profile-pic'/>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;