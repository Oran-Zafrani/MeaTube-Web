// Importing necessary modules and components
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Theme/ThemeProvider';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importing the pages
import Main from './Pages/Main/Main';
import LoginPage from './Pages/Login/Login_Screen';
import AddMoviePage from './Pages/AddVideo/Add_Video';
import Watch_Video from './Pages/Video/Watch_Video';
import RegistrationPage from './Pages/Register/Registration_Screen';
import Edit_Video from './Pages/Edit_Video/Edit_Video';
import Edit_User from './Pages/Edit_User/Edit_User';
import User_Videos from './Pages/User_Videos/User_Videos';
import { openDB } from 'idb';
import FeedJson from '../src/assets/jsons/Feed.json';
import UsersJson from '../src/assets/jsons/Users.json';


// Importing the components
import Navbar from './Components/Navbar/Navbar';

function initializeDB() {
  // Delete the database if it already exists
    var DBDeleteRequest = window.indexedDB.deleteDatabase("MeaTubeDB");
    DBDeleteRequest.onerror = function () {
      console.log("Error deleting database.");
    };
  return openDB('MeaTubeDB', 4, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'username' });
      }
      if (oldVersion < 4) {
        var store = transaction.objectStore('videos');

        FeedJson.map((video) => {
          store.add(video);
        })

        store = transaction.objectStore('users');

        UsersJson.map((user) => {
          store.add(user);
        })
      }
    },
  })
    .then(db => {
      console.log("Database initialized successfully");
      return db; // Return db for further operations if needed
    })
    .catch(error => {
      console.error("Database error: ", error);
      throw error; // Rethrow or handle error as needed
    });
}

// The main App component
function App() {
  const [sidebar, setSidebar] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [searchString, setSearchString] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);


  // Using the useEffect hook to set the loggedInUser to null when the app starts
  useEffect(() => {
    const init = async () => {
      localStorage.setItem('loggedInUser', null);

      await initializeDB();
      setDbInitialized(true);
    };
    init();
  }, []);

  // If the database is not initialized, display a loading message
  if (!dbInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ThemeProvider>
        <Router>
          <div className="App" data-theme={isDark ? "dark" : "light"}>
            <header className="App-header">
              <div className="App">

                <div>
                  <Navbar setSidebar={setSidebar} setIsChecked={setIsDark} setSearch={setSearchString} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </div>
                <Routes>
                  {/* The Route for the Movie_View_Screen is set to the root path ("/") */}
                  {/* This means that the Movie_View_Screen will be the first to render when the app starts */}
                  <Route path="/" element={<Main sidebar={sidebar} searchString={searchString} />} />
                  {/* Adding all the other pages */}
                  <Route path="/Login" element={<LoginPage setLoggedIn={setLoggedInUser} />} />
                  <Route path="/AddMovie" element={<AddMoviePage />} />
                  <Route path="/MovieList" element={<Watch_Video />} />
                  <Route path="/Registration" element={<RegistrationPage />} />
                  <Route path="/watch/:videoId" element={<Watch_Video />} />
                  <Route path="/watch/:id/edit" element={<Edit_Video />} />
                  <Route path="/Edit_User/:username" element={<Edit_User />} />
                  <Route path="/User_Videos/:channel" element={<User_Videos />} />
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