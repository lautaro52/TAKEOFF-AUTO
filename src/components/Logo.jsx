import React from 'react';
import './Logo.css';

const Logo = ({ variant = 'light' }) => {
    return (
        <div className={`takeoff-logo ${variant}`}>
            <span className="take">TAKE</span>
            <span className="off">OFF</span>
            <span className="auto-container">
                <span className="auto">AUTO</span>
            </span>
        </div>
    );
};

export default Logo;
