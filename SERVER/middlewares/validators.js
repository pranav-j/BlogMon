const { check, validationResult } = require('express-validator');

// Validation rules for signup
const validateSignup = [
  // Email validation
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  // Password validation: minimum length, at least one uppercase, one lowercase, one number, and one special character
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character')
    .trim(),

  // Name validation: not empty, only letters and spaces allowed
  check('name')
    .not().isEmpty()
    .withMessage('Name is required')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Name must contain only letters and spaces')
    .trim()
    .escape(),

  // Bio validation: not empty, must not contain any potentially harmful characters
  check('bio')
    .not().isEmpty()
    .withMessage('Bio is required')
    .trim()
    .escape(),

  // Handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('SignUp validation error...............');  
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('SignUp validated...............');
    next();
  }
];

// Validation rules for login
const validateLogin = [
  // Email validation
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  // Password validation: must exist
  check('password')
    .exists()
    .withMessage('Password is required')
    .trim(),

  // Handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('LogIn validation error...............');
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('LogIn validated...............');
    next();
  }
];

const validateBlog = [
    check('title')
      .optional()
      .not().isEmpty()
      .withMessage('Title must not be empty')
      .trim()
      .escape(),
  
    check('content')
      .optional()
      .not().isEmpty()
      .withMessage('Content must not be empty'),
    //   .trim()
    //   .escape(),
  
    check('category')
      .optional()
      .not().isEmpty()
      .withMessage('Category must not be empty')
      .trim()
      .escape(),
  
    check('author_id')
      .optional()
      .not().isEmpty()
      .withMessage('Author ID must not be empty')
      .isMongoId()
      .withMessage('Invalid Author ID')
      .trim()
      .escape(),
  
    check('author_name')
      .optional()
      .not().isEmpty()
      .withMessage('Author name must not be empty')
      .trim()
      .escape(),
  
    // Handle validation result
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Blog validation error...............');
        return res.status(400).json({ errors: errors.array() });
      }
      console.log('Blog validated...............');
      next();
    }
];

const validateAddComment = [
    check('blogId')
      .not().isEmpty()
      .withMessage('Blog ID is required')
      .isMongoId()
      .withMessage('Invalid Blog ID')
      .trim()
      .escape(),
  
    check('userId')
      .not().isEmpty()
      .withMessage('User ID is required')
      .isMongoId()
      .withMessage('Invalid User ID')
      .trim()
      .escape(),
  
    check('userName')
      .not().isEmpty()
      .withMessage('User name is required')
      .trim()
      .escape(),
  
    check('content')
      .not().isEmpty()
      .withMessage('Content is required')
      .trim()
      .escape(),
  
    // Handle validation result
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Comment validation error...............');
        return res.status(400).json({ errors: errors.array() });
      }
      console.log('Comment validated...............');
      next();
    }
];

const validateAddCommentReply = [
    check('commentId')
      .not().isEmpty()
      .withMessage('Comment ID is required')
      .isMongoId()
      .withMessage('Invalid Comment ID')
      .trim()
      .escape(),
  
    check('userId')
      .not().isEmpty()
      .withMessage('User ID is required')
      .isMongoId()
      .withMessage('Invalid User ID')
      .trim()
      .escape(),
  
    check('userName')
      .not().isEmpty()
      .withMessage('User name is required')
      .trim()
      .escape(),
  
    check('content')
      .not().isEmpty()
      .withMessage('Content is required')
      .trim()
      .escape(),
  
    // Handle validation result
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('Comment-reply validation error...............');
        return res.status(400).json({ errors: errors.array() });
      }
      console.log('Comment-reply validated...............');
      next();
    }
];

module.exports = {
  validateSignup,
  validateLogin,
  validateBlog,
  validateAddComment,
  validateAddCommentReply
};
