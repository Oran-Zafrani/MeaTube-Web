import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Theme/ThemeContext';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Feed from '../../Components/Feed/Feed';
import './Main.css';

function Main({sidebar}) {
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useContext(ThemeContext); // Added darkMode here
    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <>
                < Sidebar sidebar={sidebar} />
            </>          
            <div className = {`container ${sidebar ? '' : 'large-container'}`}>
                    <Feed />
            </div>

            <div id="login">
                <button onClick={() => navigate('/Login')}>Login</button>
            </div>

            <div id="theme-toggle">
                <button onClick={toggleTheme}>
                    {darkMode ? 'Regular Mode' : 'Dark Mode'}
                </button>
            </div>


            <div id="AddMovie">
                <button onClick={() => navigate('/AddMovie')}>AddMovie</button>
            </div>
        </div>
    );
}

export default Main;