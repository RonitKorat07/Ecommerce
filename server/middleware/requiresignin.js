import jwt from 'jsonwebtoken';

const requiresignin = (req, res, next) => {
    // Get token from Authorization header
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Extract token if it starts with 'Bearer '
        const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

        // Verify the token
        const decoded = jwt.verify(actualToken, process.env.JWT);

        // Attach user information to request object
        req.user = decoded;

        // Move to the next middleware or route handler
        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

export default requiresignin;
