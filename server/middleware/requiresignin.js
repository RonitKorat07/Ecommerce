import jwt from 'jsonwebtoken';

const requiresignin = (req, res, next) => {
    // Get token from Authorization header
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user information to request object
        req.user = decoded;

        // Move to the next middleware or route handler
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

export default requiresignin;
