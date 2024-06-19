import React, { useEffect } from 'react';
import logo from '../../assets/images/meatube logo with text.png';
import profilePic from '../../assets/images/guest_image.png';
import './Navbar.css';
import { useNavigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Navbar = ({setSidebar}) => {
    const navigate = useNavigate();

    const checkUser = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser == 'null') {
            navigate('/Login');
        } else {
            alert('User is already logged in');
        }
    };

    return (
        <div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
            <nav className='flex-div'>
                <div className='nav-left flex-div'>
                    <i className="bi bi-list" onClick={() => setSidebar(prev=>prev===false ? true : false)}></i>
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
                    <img className='profile' src={profilePic} onClick={checkUser} alt='profile-pic'/>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;