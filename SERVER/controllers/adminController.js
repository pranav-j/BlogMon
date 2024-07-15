const { Blog } = require('../models/BlogModel');
const User = require('../models/UserModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        console.log('Fetched all Users...............');
        res.status(200).json(users);
    } catch (error) {
        console.log('Failed to fetch all Users...............');
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const deleteBlogAdmin = async(req, res) => {
    const { id } = req.params;
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if(!deletedBlog) return res.status(404).json({ error: 'Blog not found' });
        console.log(`${id} Blog deleted by ADMIN...............`);
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.log('Failed to delete blog by ADMIN...............');
        res.status(500).json({ error: 'Failed to delete blog' });
    }
};

const suspendUser = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.isSuspended = !user.isSuspended;
        await user.save();
        console.log('User suspended...............');
        res.status(200).json({ message: 'User suspension status updated' });
    } catch (error) {
        console.log('Failed to suspend user by ADMIN...............');
        res.status(500).json({ error: 'Failed to update user suspension status' });
    }
}

module.exports = {
    getAllUsers,
    deleteBlogAdmin,
    suspendUser
};