// Importing necessary modules and components
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Theme/ThemeProvider';

// Importing the pages components
import Main from './components/Main';
import LoginPage from './components/Login_Screen';
import AddMoviePage from './components/Add_Movie_Screen';
import Watch_Movie from './components/Watch_Movie';
import RegistrationPage from './components/Registration_Screen';
import Navbar from './components/Navbar/Navbar';

// The main App component
function App() {
  return (
    <div>
    <div>
      <Navbar/>
    </div>
    
    <ThemeProvider>

      <Router>
        <div className="App">
          <header className="App-header">
            <div className="App">
              <Routes>
                {/* The Route for the Movie_View_Screen is set to the root path ("/") */}
                {/* This means that the Movie_View_Screen will be the first to render when the app starts */}
                <Route path="/" element={<Main />} />
                {/* Adding all the other pages */}
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/AddMovie" element={<AddMoviePage />} />
                <Route path="/MovieList" element={<Watch_Movie />} />
                <Route path="/Registration" element={<RegistrationPage />} />
              </Routes>
            </div>
          </header>
        </div>
      </Router >
    </ThemeProvider>
    </div>
  );
}

// Exporting the App component as the default export
export default App;