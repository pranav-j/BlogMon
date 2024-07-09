const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    replies: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            userName: { type: String, required: true },
            content: { type: String, required: true },
            date: { type: Date, default: Date.now },
        }
    ]
})

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;