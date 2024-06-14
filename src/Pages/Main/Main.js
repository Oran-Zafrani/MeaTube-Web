import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Theme/ThemeContext';

function MovieView() {
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useContext(ThemeContext); // Added darkMode here

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <div id="left-menu">
                <ul>
                    <li><a href="#">Menu Item 1</a></li>
                    <li><a href="#">Menu Item 2</a></li>
                    <li><a href="#">Menu Item 3</a></li>
                </ul>
            </div>

            <div id="search">
                <input type="text" placeholder="Search..." />
            </div>

            <div id="movie-list">
                <div className="movie-item">
                    <h1>Movie Title</h1>
                    <p>Movie Description</p>
                </div>
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

export default MovieView;