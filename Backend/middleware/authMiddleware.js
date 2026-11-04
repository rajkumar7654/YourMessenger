const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        // Header se token lo
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // Token verify karo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // User ID ko request object mein daalo
        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = {
    verifyToken
};
