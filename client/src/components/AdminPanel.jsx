// import TopBar from "./TopBar";


// const AdminPanel = () => {
//     return (
//         <div className="admin-panel">
//             <TopBar />
//         </div>
//     )
// }

// export default AdminPanel;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminPanel.css';
import TopBar from "./TopBar";
import ArticleCard from './ArticleCard';
import DeleteModal from './DeleteModal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPanel = () => {
    const admin = useSelector((state) => state.auth.user);
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const [selectedTab, setSelectedTab] = useState('blogs'); // Default tab
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async() => {
            try {
                const response = await axios.get('http://localhost:3535/get-blogs', { withCredentials: true });
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching articles:', error);
                setError('Failed to fetch articles');
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3535/admin/users', { withCredentials: true });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users');
            }
        };

        if (admin && admin.isAdmin) {
            fetchBlogs();
            fetchUsers();
        }
    }, [admin]);

    // const handleEdit = (blogId) => {
    //     navigate(`/edit-blog/${blogId}`);
    // };

    const handleDelete = async () => {
        try {
            const deleted = await axios.delete(`http://localhost:3535/blog/${blogToDelete}`, { withCredentials: true });
            if (deleted) {
                setBlogs(blogs.filter(blog => blog._id !== blogToDelete));
                closeDeleteModal();
            }
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    const openDeleteModal = (blogId) => {
        setBlogToDelete(blogId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setBlogToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleSuspendUser = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:3535/suspend-user/${userId}`, {}, { withCredentials: true });
            if (response.status === 200) {
                setUsers(users.map(user => user._id === userId ? { ...user, suspended: true } : user));
            }
        } catch (error) {
            console.error('Error suspending user:', error);
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="admin-panel">
            <TopBar />
            <div className="tab-selector">
                <h2>Admin Panel</h2>
                <div className="tabs">
                    <button onClick={() => setSelectedTab('blogs')} className={selectedTab === 'blogs' ? 'active' : ''}>Blogs</button>
                    <button onClick={() => setSelectedTab('users')} className={selectedTab === 'users' ? 'active' : ''}>Users</button>
                </div>
            </div>

            {selectedTab === 'blogs' && (
                <div className="blog-list">
                    {blogs.map(blog => (
                        <div className="blog-wrapper" key={blog._id}>
                            <ArticleCard blog={blog} />
                            <div className="blog-actions">
                                {/* <button onClick={() => handleEdit(blog._id)}>Edit</button> */}
                                <button onClick={() => openDeleteModal(blog._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selectedTab === 'users' && (
                <div className="user-list">
                    {users.map(user => (
                        <div className="user-wrapper" key={user._id}>
                            <div className="user-card">
                                <img src={user.profilePic || 'https://robohash.org/default.png'} alt={user.name} />
                                <div className="user-info">
                                    <h3>{user.name}</h3>
                                    <p>{user.bio}</p>
                                    <p>{user.email}</p>
                                    <button onClick={() => handleSuspendUser(user._id)} disabled={user.suspended}>
                                        {user.suspended ? 'Suspended' : 'Suspend User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <DeleteModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete} />
        </div>
    );
};

export default AdminPanel;
