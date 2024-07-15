const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const adminAuth = async(req, res, next) => {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({ error: 'Unauthorized...' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        console.log('Is ADMIN...............:', user.isAdmin);

        if(user.isAdmin===true) {
            console.log(`It\'s the ADMIN...............`);
            next();
        } else {
            console.log('Intruder trying to access ADMIN routes...............');
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { adminAuth };