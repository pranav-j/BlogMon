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
    login,
    logout,
    getSideBarData,
    searchBlogs,
} = require('../controllers/controller.js');

const { userAuth } = require('../middlewares/userAuth.js')

const { upload } = require('../utils/s3Utils.js');

router.get('/get-blogs', getBlogs);

// router.get('/sidebar-data', userAuth, getSideBarData);       //For testing userAuth
router.get('/sidebar-data', getSideBarData);

router.get('/get-blogs/:author_id', getBlogsByAuthor);

router.get('/get-blogs-by-category/:category', getBlogsByCategory);

router.get('/blog/:id', getBlogById);

router.put('/edit-blog/:id', userAuth, editBlog);

router.post('/like-blog/:id', userAuth, likeBlog);

router.post('/add-comment', userAuth, addComment);

router.post('/add-coment-reply', userAuth, addComentReply);

router.get('/get-comments/:blogId', getComments);

router.delete('/blog/:id', userAuth, deleteBlog);

router.post('/content-img-upload', userAuth, upload.single('imageInsertion'), uploadBlogImage);

router.post('/create-article', userAuth, createBlog);

router.post('/signup', upload.single('profilePic'), signup);

router.post('/login', login);

router.post('/logout', logout);

router.get('/search-blogs', searchBlogs)

module.exports = router;