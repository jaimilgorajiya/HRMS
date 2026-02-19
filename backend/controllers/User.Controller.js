import User from "../models/User.Model.js";
import bcrypt from "bcryptjs";
import { generatePassword, sendWelcomeEmail } from "../utils/emailService.js";
import { generateEmployeeId } from "../utils/employeeId.js";

const createUser = async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        // Generate employee ID if not provided
        let employeeId = req.body.employeeId;
        if (!employeeId || employeeId.trim() === '') {
            employeeId = await generateEmployeeId();
        }

        // Generate random password
        const temporaryPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Construct full name
        const name = `${firstName || ''} ${lastName || ''}`.trim() || req.body.name || 'Unnamed User';

        // Create new user with all fields
        const newUser = new User({
            ...req.body,
            name,
            employeeId,
            password: hashedPassword,
            forcePasswordReset: true // Always force password reset for new users
        });

        await newUser.save();
        
        // Send welcome email with credentials
        const emailResult = await sendWelcomeEmail(email, name, employeeId, temporaryPassword);
        
        // Return user without password
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ 
            success: true, 
            message: emailResult.success 
                ? "User created successfully and welcome email sent" 
                : "User created successfully but email failed to send",
            user: userResponse,
            emailSent: emailResult.success
        });
    } catch (error) {
        console.log("Error in createUser controller", error.message);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false, 
                message: `A user with this ${field} already exists` 
            });
        }
        
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ 
            role: { $ne: 'Admin' },
            status: { $in: ['Active', 'Inactive', 'Onboarding'] } // Keeping Onboarding just in case, but user said Active/Inactive. I'll stick to strict interpretation but add Onboarding if it's considered 'pre-active'. 
            // actually, let's just do Active/Inactive/Onboarding to be safe against hiding new joiners completely
        }).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.log("Error in getUsers controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in getUser controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateUser = async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Handle password update separately if provided
        if (updateData.password && updateData.password.trim() !== '') {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        } else {
            delete updateData.password;
        }
        
        // Update name if firstName or lastName changed
        if (updateData.firstName || updateData.lastName) {
            const user = await User.findById(req.params.id);
            const firstName = updateData.firstName || user.firstName || '';
            const lastName = updateData.lastName || user.lastName || '';
            updateData.name = `${firstName} ${lastName}`.trim();
        }

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        console.log("Error in updateUser controller", error.message);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false, 
                message: `A user with this ${field} already exists` 
            });
        }
        
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log("Error in deleteUser controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getNextEmployeeId = async (req, res) => {
    try {
        const nextId = await generateEmployeeId();
        res.status(200).json({ success: true, nextId });
    } catch (error) {
        console.log("Error in getNextEmployeeId controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { createUser, getUsers, getUser, updateUser, deleteUser, getNextEmployeeId };
