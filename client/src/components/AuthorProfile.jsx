// Profile of a different Author

import axios from 'axios';
import './authorProfile.css';
import TopBar from "./TopBar";
import ArticleCard from './ArticleCard';
import { useParams } from 'react-router-dom';


import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';


const AuthorProfile = () => {
    // const author = useSelector((state) => state.auth.user);
    const [ blogs, setBlogs ] = useState([]);
    const [ error, setError ] = useState(null);
    const { authorId, authorName } = useParams();
    // const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async() => {
            try {
                // const response = await axios.get(`/get-blogs/${authorId}`);
                const response = await axios.get(`http://localhost:3535/get-blogs/${authorId}`);
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setError('Failed to fetch articles');
            }
        }

        if(authorId) {
            fetchBlogs();
            // console.log(blogs);
        }
    }, [authorId]);


    if(error) {
        return(
            <div>error</div>
        )
    }

    return(
        <div className="profile">
            <TopBar />
            <h2>{authorName}</h2>
            <div className="blog-list">                
                {blogs.map(blog => (
                    <div className="blog-wrapper">
                        <ArticleCard key={blog._id} blog={blog}/>
                    </div>
                ))}                
            </div>
        </div>
    )
}

export default AuthorProfile;