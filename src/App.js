// Importing necessary modules and components
import './App.css';
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './Theme/ThemeProvider';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ServerAPI from './ServerAPI';
import FeedJson from '../src/assets/jsons/Feed.json';
import UsersJson from '../src/assets/jsons/Users.json';

// Importing the pages
import Main from './Pages/Main/Main';
import LoginPage from './Pages/Login/Login_Screen';
import AddMoviePage from './Pages/AddVideo/Add_Video';
import Watch_Video from './Pages/Video/Watch_Video';
import RegistrationPage from './Pages/Register/Registration_Screen';
import Edit_Video from './Pages/Edit_Video/Edit_Video';
import Edit_User from './Pages/Edit_User/Edit_User';
import User_Videos from './Pages/User_Videos/User_Videos';

// Importing the components
import Navbar from './Components/Navbar/Navbar';

const AppRoutes = React.memo(({ sidebar, searchString }) => (
  <Routes>
    <Route path="/" element={<Main sidebar={sidebar} searchString={searchString} />} />
    <Route path="/Login" element={<LoginPage />} />
    <Route path="/AddMovie" element={<AddMoviePage />} />
    <Route path="/MovieList" element={<Watch_Video />} />
    <Route path="/Registration" element={<RegistrationPage />} />
    <Route path="/watch/:videoId" element={<Watch_Video />} />
    <Route path="/watch/:id/edit" element={<Edit_Video />} />
    <Route path="/Edit_User/:username" element={<Edit_User />} />
    <Route path="/User_Videos/:username" element={<User_Videos />} />
  </Routes>
));

// The main App component
function App() {
  const [sidebar, setSidebar] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [searchString, setSearchString] = useState(null);

  useEffect(() => {
    // make sure that localStorage has loggedInUserToken key
    try {
      const token = localStorage.getItem('loggedInUserToken');
    } catch (error) {
      localStorage.setItem('loggedInUserToken', 'null');
    }
  }, []);

  const memoizedNavbar = useMemo(() => (
    <Navbar setSidebar={setSidebar} setIsChecked={setIsDark} setSearch={setSearchString} />
  ), []);

  return (
    <div>
      <ThemeProvider>
        <Router>
          <div className="App" data-theme={isDark ? "dark" : "light"}>
            <header className="App-header">
              <div className="App">
                <div>
                  {memoizedNavbar}
                </div>
                <AppRoutes sidebar={sidebar} searchString={searchString} />
              </div>
            </header>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
}

// Exporting the App component as the default export
export default App;