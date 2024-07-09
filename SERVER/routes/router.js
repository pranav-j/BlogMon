const express = require('express');
const router = express.Router();

// const { getBlogs, getBlogsByAuthor, getBlogsByCategory, deleteBlog, likeBlog, addComment, addComentReply, getComments, getBlogById, uploadBlogImage, upload, createBlog, editBlog, signup, login } = require('../controllers/controller.js');

const { 
    getBlogs, 
    getBlogsByAuthor, 
    getBlogsByCategory, 
    deleteBlog, 
    likeBlog, 
    addComment, 
    addComentReply, 
    getComments, 
    getBlogById, 
    uploadBlogImage, 
    createBlog, 
    editBlog, 
    signup,
    login 
} = require('../controllers/controller.js');

const { upload } = require('../utils/s3Utils.js');

router.get('/get-blogs', getBlogs);

router.get('/get-blogs/:author_id', getBlogsByAuthor);

router.get('/get-blogs-by-category/:category', getBlogsByCategory);

router.get('/blog/:id', getBlogById);

router.put('/edit-blog/:id', editBlog);

router.post('/like-blog/:id', likeBlog);

router.post('/add-comment', addComment);

router.post('/add-coment-reply', addComentReply);

router.get('/get-comments/:blogId', getComments);

router.delete('/blog/:id', deleteBlog);

router.post('/content-img-upload', upload.single('imageInsertion'), uploadBlogImage);

router.post('/create-article', createBlog);

router.post('/signup', upload.single('profilePic'), signup);

router.post('/login', login);

module.exports = router;