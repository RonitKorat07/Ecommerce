import User from '../models/userschema.js';
import bcrypt from 'bcryptjs';

export const updateUserProfile = async (req, res) => {
    try {
        const { name, password, oldPassword, image, userId } = req.body;

        // Ensure user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Handle password update if provided
        if (password) {
            // Check if old password is provided and correct
            if (!oldPassword) {
                return res.status(400).json({ success: false, message: 'Current password is required to set a new one' });
            }
            
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Incorrect current password' });
            }

            if (password.length < 6) {
                return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
            }
            
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Update other fields (Email is NOT updated as per user request)
        if (name) user.name = name;
        if (image !== undefined) user.image = image;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                image: updatedUser.image
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Server error during profile update' });
    }
};
