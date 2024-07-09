import React from "react";
import "./topBar.css"
import logo from '../images/BlogMon.webp';

import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/authSlice";

import { Link } from "react-router-dom";

const TopBar = () => {
    const user = useSelector((state) => state.auth.user);
    const dispach = useDispatch();

    const handleLogout = () => {
        dispach(clearUser());
    };

    return(
        <header className="top-bar">
            <Link to="/" className="logo-link">
                <div className="logo">
                    <img src={logo} alt="LOGO"/>
                    <h1>BlogMon</h1>
                </div>
            </Link>
            <nav>
                <div className="search-bar">
                    <input type="text" name="" id="" placeholder="Search..."/>
                    <button type="submit">🔍</button>
                </div>
                <div>
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

                </div>
            </nav>
        </header>
    )
}

export default TopBar;

