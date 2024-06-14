import React, { useState, useContext } from 'react'; // Importing React and useState hook from react
import { ListGroup } from 'react-bootstrap';
import { ThemeContext } from '../../Theme/ThemeContext';

function MovieList() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <ListGroup>
        <ListGroup.Item>Movie 1</ListGroup.Item>
        <ListGroup.Item>Movie 2</ListGroup.Item>
        <ListGroup.Item>Movie 3</ListGroup.Item>
      </ListGroup>
      <div />
    </div>
  );
}

export default MovieList;