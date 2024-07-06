import React, { useState, useContext } from 'react'; // Importing React and useState hook from react
import './Watch_Video.css';
import PlayVideo from '../../Components/PlayVideo/PlayVideo';
import { Recommended } from '../../Components/Recommended/Recommended';

function MovieList() {

  return (
    <div className={`play-container `}>
        <PlayVideo />
        <Recommended />
    </div>
  );
}

export default MovieList;