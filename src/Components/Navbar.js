import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { isAdmin, isLoggedIn } from './utils/localStorage';
import { clearToken } from './utils/clearToken';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn] = useState(isLoggedIn());
  const [admin] = useState(isAdmin());

  const logout = () => {
    clearToken();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <nav className='navbar'>
      <ul className='nav-links'>
        <li className='nav-link'><Link to="/">Home</Link></li>
        {loggedIn ? (
          admin ? (
            <>
              <li className='nav-link'><Link to="/ManageUser">Manage Users</Link></li>
              <li className='nav-link'><Link to="/Logs">Logs</Link></li>
              <li className='nav-link'><Link to="/" onClick={logout}>Logout</Link></li>
            </>
          ) : (
            <>
              <li className='nav-link'><Link to="/Upload">Upload</Link></li>
              <li className='nav-link'><Link to="/View">View</Link></li>
              <li className='nav-link'><Link to="/" onClick={logout}>Logout</Link></li>
            </>
          )
        ) : (
          <li className='nav-link'><Link to="/Login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

// CSS in the same file
const styles = `
.navbar {
  background-color: #1e1e2f;
  padding: 20px;
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 30px;
}

.nav-link a {
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.nav-link a:hover {
  background-color: #ff6f61;
  color: #fff;
}

.nav-link a.active {
  background-color: #ff6f61;
  color: #fff;
}

.nav-link a:active {
  background-color: #ff3b30;
}

.navbar ul {
  margin: 0;
  padding: 0;
  display: flex;
  gap: 15px;
}

`;

// Inject the styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
