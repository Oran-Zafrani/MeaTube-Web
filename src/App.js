// Importing necessary modules and components
import './App.css';
import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Theme/ThemeProvider';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Importing the pages
import Main from './Pages/Main/Main';
import LoginPage from './Pages/Login/Login_Screen';
import AddMoviePage from './Pages/AddVideo/Add_Video';
import Watch_Video from './Pages/Video/Watch_Video';
import RegistrationPage from './Pages/Register/Registration_Screen';
import { openDB } from 'idb';
import FeedJson from '../src/assets/jsons/Feed.json';

// Importing the components
import Navbar from './Components/Navbar/Navbar';

function initializeDB() {
  return openDB('MeaTubeDB', 4, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'username' });
      }
      if (oldVersion < 4) {
        const store = transaction.objectStore('videos');
        const sampleVideo = {
          title: 'Sample Video',
          description: 'A random video for demonstration purposes',
          category: 'Demo',
          videoFile: 'sample.mp4',
          previewImage: 'sample.jpg',
          channel: 'Sample Channel',
          uploadTime: new Date().toISOString(),
          views: 0,
          likes: 0,
          dislikes: 0,
          comments: 0,
          commentsLink: [],
        };
        FeedJson.map((video) => {
          store.add(video);
        })
        store.add(sampleVideo);
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
                <Navbar setSidebar={setSidebar} setIsChecked={setIsDark} setSearch={setSearchString} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
              </div>
              <Routes>
                {/* The Route for the Movie_View_Screen is set to the root path ("/") */}
                {/* This means that the Movie_View_Screen will be the first to render when the app starts */}
                <Route path="/" element={<Main sidebar={sidebar} searchString={searchString} />} />
                {/* Adding all the other pages */}
                <Route path="/Login" element={<LoginPage setLoggedIn={setLoggedInUser}/>} />
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