// Importing necessary modules and components
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Theme/ThemeProvider';


// Importing the pages components
import Movie_View_Screen from './components/Movie_View_Screen';
import LoginPage from './components/Login_Screen';
import AddMoviePage from './components/Add_Movie_Screen';
import MovieListPage from './components/Movie_List_Screen';
import RegistrationPage from './components/Registration_Screen';

// The main App component
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="App">
              <Routes>
                {/* The Route for the Movie_View_Screen is set to the root path ("/") */}
                {/* This means that the Movie_View_Screen will be the first to render when the app starts */}
                <Route path="/" element={<Movie_View_Screen />} />
                {/* Adding all the other pages */}
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/AddMovie" element={<AddMoviePage />} />
                <Route path="/MovieList" element={<MovieListPage />} />
                <Route path="/Registration" element={<RegistrationPage />} />
              </Routes>
            </div>
          </header>
        </div>
      </Router >
    </ThemeProvider>
  );
}

// Exporting the App component as the default export
export default App;