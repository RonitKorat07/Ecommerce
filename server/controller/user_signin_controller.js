import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';  // For creating JWT tokens
import User from '../models/userschema.js';

export const user_signin_controller = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Create JWT token
        const payload = {
            userId: user._id,
            name: user.name,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT, { expiresIn: '1m' });  // expires in 1 hour

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token, // Send token to client
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
