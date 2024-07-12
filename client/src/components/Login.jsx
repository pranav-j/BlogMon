import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ('./login.css');

const Login = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const dispach = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const response = await axios.post('/login', { email, password }, { withCredentials: true });
            const response = await axios.post('http://localhost:3535/login', { email, password }, { withCredentials: true });
            const { user } = response.data;
            dispach(setUser({ user }));
            navigate('/');
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    return(
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    )
};

export default Login;