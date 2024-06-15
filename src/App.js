// Importing necessary modules and components
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Theme/ThemeProvider';

// Importing the pages
import Main from './Pages/Main/Main';
import LoginPage from './Pages/Login/Login_Screen';
import AddMoviePage from './Pages/AddVideo/Add_Video';
import Watch_Video from './Pages/Video/Watch_Video';
import RegistrationPage from './Pages/Register/Registration_Screen';

// Importing the components
import Navbar from './Components/Navbar/Navbar';


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
                <Route path="/MovieList" element={<Watch_Video />} />
                <Route path="/Registration" element={<RegistrationPage />} />
                <Route path="/watch/:videoId" element={<Watch_Video />} />
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