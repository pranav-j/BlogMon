// import axios from 'axios';
// import React, { useState } from 'react';

// import ('./signup.css');

// const Signup = () => {
//     const [ email, setEmail ] = useState('');
//     const [ password, setPassword ] = useState('');
//     const [ name, setName ] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // const response = await axios.post('/signup', { email, password, name });
//             const response = await axios.post('http://localhost:3535/signup', { email, password, name });
//             console.log(response.data);
//         } catch (error) {
//             console.error('Failed to signup', error);
//         }
//         // console.log('Signup...........', { email, password, name });
//     }

//     return(
//         <div className='signup'>
//             <form onSubmit={handleSubmit}>
//                 <h1>SignUp</h1>
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
//                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
//                 <button type="submit">Signup</button>
//             </form>

//         </div>
//     );
// };

// export default Signup;

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ('./signup.css');

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

    return (
        <div className='signup'>
            <form onSubmit={handleSubmit}>
                <h1>SignUp</h1>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" required />
                <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} accept="image/*" />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;
