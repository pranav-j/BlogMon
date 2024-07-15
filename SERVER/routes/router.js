const express = require('express');
const router = express.Router();

const { getAllUsers, deleteBlogAdmin, suspendUser } = require('../controllers/adminController.js');

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

const { userAuth } = require('../middlewares/userAuth.js');

const { adminAuth } = require('../middlewares/adminAuth.js');

const { validateLogin, validateSignup, validateBlog, validateAddComment, validateAddCommentReply } = require('../middlewares/validators.js')

const { upload } = require('../utils/s3Utils.js');

router.get('/get-blogs', getBlogs);

router.get('/sidebar-data', getSideBarData);

router.get('/get-blogs/:author_id', getBlogsByAuthor);

router.get('/get-blogs-by-category/:category', getBlogsByCategory);

router.get('/blog/:id', getBlogById);

router.put('/edit-blog/:id', userAuth, validateBlog, editBlog);

router.post('/like-blog/:id', userAuth, likeBlog);

router.post('/add-comment', userAuth, validateAddComment, addComment);

router.post('/add-coment-reply', userAuth, validateAddCommentReply, addComentReply);

router.get('/get-comments/:blogId', getComments);

router.delete('/blog/:id', userAuth, deleteBlog);

router.post('/content-img-upload', userAuth, upload.single('imageInsertion'), uploadBlogImage);

router.post('/create-article', userAuth, validateBlog, createBlog);

router.post('/signup', upload.single('profilePic'), validateSignup, signup);

router.post('/login', validateLogin, login);

router.post('/logout', logout);

router.get('/search-blogs', searchBlogs)

// ADMIN --------------------------------------------

router.get('/admin/users', adminAuth, getAllUsers);

router.delete('/admin/blog/:id', adminAuth, deleteBlogAdmin);

router.put('/admin/suspend-user/:id', adminAuth, suspendUser);

module.exports = router;