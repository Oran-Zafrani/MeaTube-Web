import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Feed from '../../Components/Feed/Feed';
import './Main.css';

function Main({sidebar, searchString}) {
    const navigate = useNavigate();
    return (
        <div>
            <>
                < Sidebar sidebar={sidebar} />
            </>          
            <div className = {`container ${sidebar ? '' : 'large-container'}`}>
                    <Feed searchString={searchString}/>
            </div>

            <div id="login">
                <button onClick={() => navigate('/Login')}>Login</button>
            </div>

            <div id="AddMovie">
                <button onClick={() => navigate('/AddMovie')}>AddMovie</button>
            </div>
        </div>
    );
}

export default Main;