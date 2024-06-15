import React from 'react';
import './Sidebar.css';
import beef from '../../assets/images/cow.svg';
import chicken from '../../assets/images/chicken.svg';
import lamb from '../../assets/images/sheep.svg';
import pork from '../../assets/images/pig.svg';
import fish from '../../assets/images/fish.svg';
import vegan from '../../assets/images/vegan.svg';

function Sidebar({sidebar}) {
    return (
        <div className={`sidebar ${sidebar? '':'small-sidebar'}`}>
            <div className='shortcut-links'>

                <div className='side-link'>
                    <img src={beef} alt=""/><p>Beef</p>
                </div>
                
                <div className='side-link'>
                    <img src={chicken} alt=""/><p>Chicken</p>
                </div>

                <div className='side-link'>
                    <img src={lamb} alt=""/><p>Lamb</p>
                </div>

                <div className='side-link'>
                    <img src={pork} alt=""/><p>Pork</p>
                </div>

                <div className='side-link'>
                    <img src={fish} alt=""/><p>Fish</p>
                </div>

                <div className='side-link'>
                    <img src={vegan} alt=""/><p>Vegan</p>
                </div>

                <hr />

            </div>
            <div className='subscribed-list'>
                <h3>Subscribed</h3>
                {/* implement sub list */}  
            </div>
        </div>
    );
}

export default Sidebar;