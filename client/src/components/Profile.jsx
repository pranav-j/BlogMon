// Profile of the logged in user

import axios from 'axios';
import './profile.css';
import TopBar from "./TopBar";
import ArticleCard from './ArticleCard';
import DeleteModal from './DeleteModal';


import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const author = useSelector((state) => state.auth.user);
    const [ blogs, setBlogs ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false);
    const [ blogToDelete, setBlogToDelete ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async() => {
            try {
                // const response = await axios.get(`/get-blogs/${author.id}`);
                const response = await axios.get(`http://localhost:3535/get-blogs/${author.id}`);
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setError('Failed to fetch articles');
            }
        }

        if(author) {
            fetchBlogs();
            // console.log(blogs);
        }
    }, [author]);

    const handleEdit = (blogId) => {
        navigate(`/edit-blog/${blogId}`);
    };

    const handleDelete = async () => {
        try {
            // const deleted = await axios.delete(`/blog/${blogToDelete}`);
            const deleted = await axios.delete(`http://localhost:3535/blog/${blogToDelete}`);
            if(deleted) {
                setBlogs(blogs.filter(blog => blog._id !== blogToDelete));
            }
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    }

    const openDeleteModal = (blogId) => {
        setBlogToDelete(blogId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setBlogToDelete(null);
        setIsDeleteModalOpen(false);
    }

    if(error) {
        return(
            <div>error</div>
        )
    }

    return(
        <div className="profile">
            <TopBar />
            <h2>{author.name}</h2>
            <div className="blog-list">                
                {blogs.map(blog => (
                    <div className="blog-wrapper">
                        <ArticleCard key={blog._id} blog={blog}/>
                        <div className="blog-actions">
                            <button onClick={() => handleEdit(blog._id)}>Edit</button>
                            <button onClick={() => openDeleteModal(blog._id)}>Delete</button>
                        </div>
                    </div>
                ))}                
            </div>
            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete}/>
        </div>
    )
}

export default Profile;