import React, { useState, useContext } from 'react'; // Importing React and useState hook from react
import { ListGroup } from 'react-bootstrap';
import { ThemeContext } from '../../Theme/ThemeContext';
import './Watch_Video.css';
import PlayVideo from '../../Components/PlayVideo/PlayVideo';
import { Recommended } from '../../Components/Recommended/Recommended';

function MovieList() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`play-container ${darkMode ? 'dark-mode' : ''}`}>
        <PlayVideo />
        <Recommended />
    </div>
  );
}

export default MovieList;