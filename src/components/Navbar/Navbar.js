import React from 'react';
import logo from '../../assets/images/meatube logo with text.png';
import profilePic from '../../assets/images/guest_image.png';
import './Navbar.css';

const Navbar = () => {
    return (
        <div>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"></link>
            <nav className='flex-div'>
                <div className='nav-left flex-div'>
                    <i class="bi bi-list"></i>
                    <img className='logo' src={logo} alt='logo'/>
                </div>

                <div className='nav-middle flex-div'>
                    <div className='search-box flex-div'>
                        <input type='text' placeholder='Search' />
                        <button type="submit"><i className="bi bi-search"></i></button>
                    </div>
                </div>

                <div className='nav-right flex-div'>
                    <i className="bi bi-upload"></i>
                    <i className="bi bi-bell"></i>
                    <img className='profile' src={profilePic} alt='profile-pic'/>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;