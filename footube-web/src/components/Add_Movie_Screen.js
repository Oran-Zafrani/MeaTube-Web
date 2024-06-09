import React from 'react';
import { Button, Form } from 'react-bootstrap';

function AddMovie() {
  return (
    <Form>
      <Form.Group>
        <Form.Label>Movie Title</Form.Label>
        <Form.Control type="text" placeholder="Enter movie title" />
      </Form.Group>

      <Form.Group>
        <Form.Label>Movie Description</Form.Label>
        <Form.Control type="text" placeholder="Enter movie description" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Movie
      </Button>
    </Form>
  );
}

export default AddMovie;