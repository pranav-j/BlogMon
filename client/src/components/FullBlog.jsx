import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './fullBlog.css';
import TopBar from "./TopBar";


const FullBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newReply, setNewReply] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchBlogAndComments = async () => {
            try {
                const[blogData, commentsData] = await Promise.all([
                    axios.get(`http://localhost:3535/blog/${id}`),
                    axios.get(`http://localhost:3535/get-comments/${id}`)

                    // axios.get(`/blog/${id}`),
                    // axios.get(`/get-comments/${id}`)
                ])

                setBlog(blogData.data);
                setComments(commentsData.data);
                setLoading(false);
                // console.log(comments);
            } catch (error) {
                console.error('Error fetching blog:', error);
                setError('Failed to fetch blog');
                setLoading(false);
            }
        }

        fetchBlogAndComments();
    }, [id]);

    const likeHandler = async() => {
        try {
            console.log('USER ID.............', user.id);
            // const response = await axios.post(`/like-blog/${id}`, { userId: user.id }, { withCredentials: true });
            const response = await axios.post(`http://localhost:3535/like-blog/${id}`, { userId: user.id }, { withCredentials: true });

            setBlog(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    };

    const addCommentHandler = async() => {
        if(!user) {
            alert('Please login to Comment.')
            return;
        }
        try {
            // const response = await axios.post('/add-comment',
            const response = await axios.post('http://localhost:3535/add-comment', 
            {
                blogId: id,
                userId: user.id,
                userName: user.name,
                content: newComment
            },
        {
            withCredentials: true
        });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const addReplyHandler = async() => {
        if (!user) {
            alert('Please log in to reply.');
            return;
        }

        try {
            // const response = await axios.post('/add-coment-reply',
            const response = await axios.post('http://localhost:3535/add-coment-reply', 
            {
                commentId: replyToCommentId,
                userId: user.id,
                userName: user.name,
                content: newReply
            },
        {
            withCredentials: true
        });
            setComments(comments.map(comment => (
                comment._id === replyToCommentId ? response.data : comment
            )));
            setNewReply('');
            setReplyToCommentId(null);
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    // console.log(blog);
    return (
        <>
        <TopBar />
        <div className="full-blog">
            <h1>{blog.title}</h1>
            <div className="meta">
                <span><button onClick={likeHandler}>👍</button>{blog.likes}</span>
                <span>🗨️{comments.length}</span>
            </div>
            <p>
                <Link to={`/author-profile/${blog.author_id}/${blog.author_name}`}><strong>{blog.author_name}</strong></Link>
                <span>{new Date(blog.date).toLocaleDateString()}</span>
             </p>
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            <div className="comment-section">
                <h3>Comments</h3>
                <div className="add-comment">
                    <textarea 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Add a comment"
                    />
                    <button onClick={addCommentHandler}>Submit</button>
                </div>
                {comments.map(comment => (
                    <div key={comment._id} className="comment">
                        <p><strong>{comment.userName}</strong> <span>{new Date(comment.date).toLocaleString()}</span></p>
                        <p>{comment.content}</p>
                        <button onClick={() => setReplyToCommentId(comment._id)}>Reply</button>
                        {comment.replies.map(reply => (
                            <div key={reply._id} className="replys">
                                <p><strong>{reply.userName}</strong> <span>{new Date(reply.date).toLocaleString()}</span></p>
                                <p>{reply.content}</p>
                            </div>
                        ))}
                        {replyToCommentId === comment._id && (
                            <div className="add-reply">
                                <textarea 
                                    value={newReply}
                                    onChange={(e) => setNewReply(e.target.value)}
                                    placeholder="Add reply"
                                />
                                <button onClick={addReplyHandler}>Submit Reply</button>
                            </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
        </>
    )
}

export default FullBlog;