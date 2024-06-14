import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Function to check if user is authenticated
// Replace this with your actual authentication check
const isAuthenticated = () => {
  // Check if user is authenticated
  // Return true if user is authenticated, false otherwise
};

// PrivateRoute component
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} /> // Render the component if user is authenticated
      ) : (
        <Redirect to="./Login_Screen" /> // Redirect to login page if user is not authenticated
      )
    }
  />
);

export default PrivateRoute;