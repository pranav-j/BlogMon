import React, { useState } from "react";
import axios from 'axios';
import "./topBar.css"
import logo from '../images/BlogMon.webp';

import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/authSlice";
import { setSearchTerm, clearSearchTerm } from "../redux/searchSlice"

import { Link } from "react-router-dom";

const TopBar = () => {
    const user = useSelector((state) => state.auth.user);
    const dispach = useDispatch();
    const [ searchInput, setSearchInput ] = useState('');

    const handleLogout = async () => {
        try {
            // await axios.post('/logout', {}, { withCredentials: true });
            await axios.post('http://localhost:3535/logout', {}, { withCredentials: true });
            dispach(clearUser());
        } catch (error) {
            console.error('Failed to logout', error);
        }        
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispach(setSearchTerm(searchInput));
    };

    const clearSearchTermOnLogoClick = () => {
        dispach(clearSearchTerm());
    }

    return(
        <header className="top-bar">
            <Link to="/" className="logo-link" onClick={clearSearchTermOnLogoClick}>
                <div className="logo">
                    <img src={logo} alt="LOGO"/>
                    <h1>BlogMon</h1>
                </div>
            </Link>
            <nav>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit">🔍</button>
                </form>
                {/* <div>
                    {user ? (
                        <>
                        <Link to="/create-blog">Write</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                        </>
                    )}

                </div> */}
                <div>
                    {user ? (
                        <>
                        {user.isAdmin ? (
                            <>
                            <Link to="/admin-panel">Admin Panel</Link>
                            </>
                        ) : (
                            <>
                            <Link to="/create-blog">Write</Link>
                            <Link to="/profile">Profile</Link>
                            </>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default TopBar;