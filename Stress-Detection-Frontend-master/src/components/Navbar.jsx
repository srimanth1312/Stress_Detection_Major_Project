import React from 'react'
import "../styles/Navbar.css"
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className='nav'>
        <Link className="logo link" to="/">
            MultiModal Emotion Recognition system.
        </Link>
        <div className="links">
            <Link to="/" className="link">Home</Link>
            <Link to="/about" className="link">About</Link>
            <Link onClick={() => window.location = 'mailto:d.ruthwikreddy9@gmail.com'} className="link">Contact</Link>
        </div>
    </div>
  )
}

export default Navbar