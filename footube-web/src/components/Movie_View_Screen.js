import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

 

// This is a functional component named MovieView
function MovieView() {
    // useNavigate is a hook from react-router-dom that allows navigation between routes
    const navigate = useNavigate();

 
    // The component returns a JSX element which is rendered to the DOM
    return (
            <div>
                <div id="left-menu">
                    <ul>
                        <li><a href="#">Menu Item 1</a></li>
                        <li><a href="#">Menu Item 2</a></li>
                        <li><a href="#">Menu Item 3</a></li>
                    </ul>
                </div>
                
                <div id="search">
                    {/* This is where you can add your search bar */}
                    <input type="text" placeholder="Search..." />
                </div>
                
                <div id="movie-list">
                    {/* This is where you can add your scrolling movie list */}
                    <div className="movie-item">
                        <h1>Movie Title</h1>
                        <p>Movie Description</p>
                    </div>
                    {/* Repeat the above div for each movie in your list */}
                </div>

                <div id="login">
                    <button onClick={() => navigate('/Login')}>Login</button>
                </div>

                <div id="login">
                    <button onClick={() => navigate('/Login')}>Dark Mode</button>
                </div>

            </div>
    );
}

export default MovieView;