import bcrypt from 'bcryptjs';
import User from '../models/userschema.js';

export const user_signup_controller = async (req, res) => {
    try {
        const { name, email, password, role, image } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            image
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
