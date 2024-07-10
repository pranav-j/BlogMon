const jwt =  require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const token = req.cookies.token;
    // console.log('COOKIE.............', req.cookies);

    if(!token) {
        return res.status(401).json({error: 'Please Signup/Login'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

module.exports = { userAuth };