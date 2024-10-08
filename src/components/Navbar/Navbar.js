import React, { useEffect, useRef, useState } from 'react';
import logo from '../../assets/images/meatube_logo_with_text.png';
import defaultProfilePic from '../../assets/images/guest_image.png';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import ServerAPI from '../../ServerAPI';
import Darkmode from './Darkmode';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ setSidebar, setIsChecked, setSearch }) => {
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(defaultProfilePic); // State to manage profile picture
    const [searchString, setSearchString] = useState('');
    const [displayName, setDisplayName] = useState('');
    const buttonRef = useRef(null);
    const [loggedInUser, setLoggedInUser] = useState(null);

    let username;

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
                const decodedToken = jwtDecode(localStorage.getItem('loggedInUserToken'));
                setLoggedInUser(localStorage.getItem('loggedInUserToken'));
                username = decodedToken.username;
                const channelData = await ServerAPI.getUserByUsername(username);
                if (channelData && channelData.image) {
                    setProfilePic(channelData.image);
                    setDisplayName(channelData.displayName);
                } else {
                    console.log('No user data found for channel:', loggedInUser);
                    setProfilePic(defaultProfilePic);
                }
            } catch (error) {
                cleanUserData();
            }
        };

        fetchUserData();
    }, [localStorage.getItem('loggedInUserToken')]);

    const checkLoggedIUser = () => {
        try {
        const loggedInUser = localStorage.getItem('loggedInUserToken');
        if (loggedInUser === null || loggedInUser === 'null') {
            navigate('/Login');
        } else {
            const decodedToken = jwtDecode(localStorage.getItem('loggedInUserToken'));
            username = decodedToken.username;
            navigate(`/Edit_User/${username}`);
        }} catch (error) {
            cleanUserData();
            navigate('/Login');
        }
    };

    // Function to handle logout (assuming you have one)
    const handleLogout = () => {
        // Perform logout operations...
        cleanUserData();
        navigate('/'); // Redirect to the home page after logout
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        setSearch(searchString); // Update the string state with the input value
        setSearchString(''); // Clear the input field after submission
    };

    const handleInputChange = (e) => {
        setSearchString(e.target.value); // Update the input value as the user types
    };

    function cleanUserData() {
        localStorage.setItem('loggedInUserToken', 'null');
        localStorage.setItem('loggedInUserDetails', 'null');
        setLoggedInUser(null);
        setProfilePic(defaultProfilePic);
        setDisplayName(null);
    }

    return (
        <div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
            <nav className='flex-div'>
                <div className='nav-left flex-div'>
                    <i className="bi bi-list" onClick={() => setSidebar(prev => prev === false ? true : false)}></i>
                    <img className='logo' onClick={() => { setSearch(''); navigate('/') }} src={logo} alt='logo' />
                </div>

                <div className='nav-middle flex-div'>
                    <div className='search-box flex-div'>
                        <input type='text' value={searchString} onChange={handleInputChange} placeholder='Search' />
                        <button ref={buttonRef} type="submit" onClick={handleSearchSubmit}><i className="bi bi-search"></i></button>
                    </div>
                </div>

                <div className='nav-right flex-div'>
                    <Darkmode handleChange={() => setIsChecked(prev => prev === false ? true : false)} />
                    <i className="bi bi-upload" onClick={() => navigate('/AddMovie')} ></i>
                    <i className="bi bi-bell"></i>
                    {loggedInUser && <Link to="/"><i className="bi bi-box-arrow-left" onClick={handleLogout}></i></Link>}
                    {loggedInUser && <p className='logged-in-quote'> Hi {displayName}!</p>}
                    <img className='profile' src={profilePic} onClick={checkLoggedIUser} alt='profile-pic' />
                </div>
            </nav>
        </div>
    );
};

export default Navbar;