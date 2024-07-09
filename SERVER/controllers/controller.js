const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken');
const path = require('path');
const env = require('dotenv');
const crypto = require('crypto');

// const aws = require('aws-sdk');
// const multerS3 = require('multer-s3');
const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { uploadFileToS3 } = require('../utils/s3Utils');

const { Blog } = require('../models/BlogModel');
const User = require('../models/UserModel');
const Comment = require('../models/CommentModel');

// SIGNUP------------------------------------------------------------------------------------------------

// const signup = async(req, res) => {
//     const { email, password, name } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if(existingUser) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }

//         const newUser = new User({ name, email, password });
//         const createdUser = await newUser.save();
//         if(createdUser) {
//             console.log('User created...............');
//         }
//         res.status(201).json({ message: 'User created successfully..........' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to create user' });
//     }
// };

const signup = async (req, res) => {
  const { email, password, name, bio } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    let profilePicUrl = '';
    if (req.file) {
      profilePicUrl = await uploadFileToS3(req.file, 'profile-pics');
    }

    const newUser = new User({ name, email, password, bio, profilePic: profilePicUrl });
    const createdUser = await newUser.save();
    if (createdUser) {
      console.log('User created...............');
    }
    res.status(201).json({ message: 'User created successfully..........' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// LOGIN------------------------------------------------------------------------------------------------

const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if(!user) {
          console.log('User doesn\'t exist...............');
          return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
          console.log('Logged in in...............');
          return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        console.log(`${user._id} Logged in...............`);
        res.cookie('token', token, { httpOnly: true });
        res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.log('Login failed...............');
        res.status(500).json({ error: 'Failed to login' });
    }
}

// -------------------------------------------------------------------------------------------------------------
// Set storage engine------------------------------------------------------------------------------------------------

// const storage = multer.diskStorage({
//     destination: './img-uploads/',
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// // Init upload
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10000000 }, // Limit filesize to 10MB
//     fileFilter: (req, file, cb) => {
//       checkFileType(file, cb);
//     }
// }).single('image');

// // Check file type
// function checkFileType(file, cb) {
//     const filetypes = /jpeg|jpg|png|gif/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);
  
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb('Error: Images Only!');
//     }
// };

// // UPLOAD IMAGE IN BLOG------------------------------------------------------------------------------------------------

// const uploadImage = (req, res) => {
//   console.log('FILE 0...............', req.file);
//   upload(req, res, (err) => {
//       if (err) {
//         res.status(400).json({ error: err });
//       } else {
//         if (req.file == undefined) {
//           res.status(400).json({ error: 'No file selected' });
//         } else {
//           console.log('FILE 1...............', req.file);
//           console.log('Image uploaded...............');
//           // res.status(200).json({ url: `http://localhost:3535/img-uploads/${req.file.filename}` });
//           res.status(200).json({ url: `/img-uploads/${req.file.filename}` });
//         }
//       }
//   });
// };

// -------------------------------------------------------------------------------------------------------------
// S3 SETUP-----------------------------------------------------------------------------------------------------

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
  }
})

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};


// Generate unique file name
function generateUniqueFileName(originalName) {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const uniqueSuffix = crypto.randomBytes(8).toString('hex');
  return `${baseName}-${uniqueSuffix}${ext}`;
}

// UPLOAD IMAGE IN BLOG
// const uploadImage = async (req, res) => {
//   try {
//     const uniqueFileName = generateUniqueFileName(req.file.originalname);
//     const params = {
//       Bucket: 'blog-images-kidiloski',
//       Key: `blog-image-embedings/${uniqueFileName}`,
//       Body: req.file.buffer,
//       ContentType: req.file.mimetype
//     };

//     const uploadImgToS3Command = new PutObjectCommand(params);
//     await s3.send(uploadImgToS3Command);

//     const imageUrl = `https://${params.Bucket}.s3.ap-south-1.amazonaws.com/${params.Key}`;
//     res.status(200).json({ url: imageUrl });
//   } catch (err) {
//     console.error('Error uploading image:', err);
//     res.status(500).json({ error: 'Failed to upload image' });
//   }
// };

// UPLOAD IMAGE IN BLOG------------------------------------------------------------------------------------------------

const uploadBlogImage = async (req, res) => {
  try {
    const imageUrl = await uploadFileToS3(req.file, 'blog-image-embedings');
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};


// -------------------------------------------------------------------------------------------------------------
// CREATE A BLOG------------------------------------------------------------------------------------------------

const createBlog = async (req, res) => {
    const { title, content, category, author_id, author_name } = req.body;
  
    try {
      const newArticle = new Blog({
        title,
        content,
        category,
        author_id,
        author_name,
        date: new Date()
      });
      await newArticle.save();
      console.log('New Blog added...............');
      res.status(201).json(newArticle);
    } catch (error) {
      console.error('Error saving the article:', error);
      res.status(500).json({ error: 'Failed to create article' });
    }
};

// EDIT A BLOG------------------------------------------------------------------------------------------------

const editBlog = async (req, res) => {
    const{ id } = req.params;
    const { title, content, category, author_id, author_name } = req.body;
    try {
      const editedBlog = await Blog.findByIdAndUpdate(
        id,
        { title, content, category, author_id, author_name },
        { new: true }
      );
      console.log(`Blog ${id} updated...............`);
      res.status(200).json(editedBlog);
    } catch (error) {
      console.error('Error updating the blog:', error);
      res.status(500).json({ error: 'Failed to update the blog' });
    }
};



// GET BLOGS------------------------------------------------------------------------------------------------

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        console.log('Home page rendered...............');
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error getting the articles:', error);
        res.status(500).json({ error: 'Failed to get articles' });
    }
};

// GET BLOGS BY ID------------------------------------------------------------------------------------------------

const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if(!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    console.log(`${id} Blog fetched...............`);
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error getting the blog:', error);
    res.status(500).json({ error: 'Failed to get the blog' });
  }
};

// GET BLOGS BY AUTHOR------------------------------------------------------------------------------------------------

const getBlogsByAuthor = async (req, res) => {
  const { author_id } = req.params;
  try {
    const blogs = await Blog.find({ author_id: author_id });
    console.log(`Blogs of ${author_id} fetched...............`);
    // console.log(blogs);
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error getting blogs:', error);
    res.status(500).json({ error: 'Failed to get blogs' });
  }
};

// DELETE BLOGS ------------------------------------------------------------------------------------------------

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Blog.findByIdAndDelete(id);
    if(deleted) {
      console.log(`${id} Blog deleted...............`);
      res.status(200).json({ message: 'Blog deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

// GET BLOGS BY CATEGORY------------------------------------------------------------------------------------------------

const getBlogsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const blogs = await Blog.find({ category: category });
    console.log(`${category} blogs fetched...............`);
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error getting blogs by category:', error);
    res.status(500).json({ error: 'Failed to get blogs by category' });
  }
};

// LIKE BLOGS -------------------------------------------------------------------------------------------------------------

const likeBlog = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  // console.log('USER:', userId);
  try {
    const blog = await Blog.findById(id);
    const likedUserIndex = blog.likedBy.indexOf(userId);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if(likedUserIndex === -1) {
      // User hasn't liked the blog yet, so like it
      blog.likes += 1;
      console.log(`Blog ${id} liked by ${userId}...............`);
      blog.likedBy.push(userId);
    } else {
      // User has already liked the blog, so unlike it
      blog.likes -= 1;
      console.log(`Blog ${id} unliked by ${userId}...............`);
      blog.likedBy.splice(likedUserIndex, 1);
    }

    // blog.likes += 1;
    // console.log(`Blog ${id} liked...............`);
    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error liking the blog:', error);
    res.status(500).json({ error: 'Failed to like the blog' });
  }
};

// ADD COMMENT -------------------------------------------------------------------------------------------------------------

const addComment = async (req, res) => {
  const { blogId, userId, userName, content } = req.body;
  try {
    const newComment = new Comment({
      blogId,
      userId,
      userName,
      content,
      date: new Date()
    });
    await newComment.save();
    console.log(`Comment added on ${blogId} by ${userId} ${userName}...............`);
    res.status(200).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// ADD REPLY TO COMMENT -------------------------------------------------------------------------------------------------------------

const addComentReply = async (req, res) => {
  const { commentId, userId, userName, content } = req.body;
  try {
    const comment = await Comment.findById(commentId);

    const newReply = {
      userId,
      userName,
      content,
      date: new Date(),
    };

    comment.replies.push(newReply);
    await comment.save();
    console.log(`${userId} ${userName} replied to ${commentId}...............`);
    res.status(200).json(comment);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
}

// GET COMMENT -------------------------------------------------------------------------------------------------------------

const getComments = async(req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.find({ blogId });
    console.log(`Comments fetched for ${blogId}...............`);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// ------------------------------------------------------------------------------------------------------------

module.exports = {
    getBlogs,
    getBlogById,
    getBlogsByCategory,
    deleteBlog,
    likeBlog,
    addComment,
    addComentReply,
    getComments,
    getBlogsByAuthor,
    uploadBlogImage,
    // uploadImage,
    createBlog,
    editBlog,
    signup,
    login,
};