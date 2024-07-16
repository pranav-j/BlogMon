import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('bio', bio);
        if (profilePic) {
            formData.append('profilePic', profilePic);
        }

        try {
            // const response = await axios.post('/signup', formData, {
            const response = await axios.post('http://localhost:3535/signup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            console.error('Failed to signup', error);
        }
    };

    // return (
    //     <div className='signup'>
    //         <form onSubmit={handleSubmit}>
    //             <h1>SignUp</h1>
    //             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
    //             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
    //             <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
    //             <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" required />
    //             <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} accept="image/*" />
    //             <button type="submit">Signup</button>
    //         </form>
    //     </div>
    // );

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h1 className="signup-title">Sign Up for BlogMon</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                    />
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Bio"
                        required
                    />
                    <div className="file-input-wrapper">
                        <label htmlFor="profilePic" className="file-input-label">
                            Choose Profile Picture
                        </label>
                        <input
                            id="profilePic"
                            type="file"
                            onChange={(e) => setProfilePic(e.target.files[0])}
                            accept="image/*"
                            className="file-input"
                        />
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
