import User from "../models/User.Model.js";
import Shift from "../models/Shift.Model.js";
import bcrypt from "bcryptjs";
import { generatePassword, sendWelcomeEmail } from "../utils/emailService.js";
import { generateEmployeeId } from "../utils/employeeId.js";

const createUser = async (req, res) => {
    try {
        // Parse complex fields if they are sent as JSON strings via FormData
        const bodyContent = { ...req.body };
        Object.keys(bodyContent).forEach(key => {
            if (typeof bodyContent[key] === 'string' && (bodyContent[key].startsWith('[') || bodyContent[key].startsWith('{'))) {
                try {
                    bodyContent[key] = JSON.parse(bodyContent[key]);
                } catch (e) {
                    // Not valid JSON
                }
            }
        });

        const { emailId, email, firstName, lastName } = bodyContent;
        const targetEmail = emailId || email;
        
        if (!targetEmail) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: targetEmail });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }
        
        // Handle profile photo if uploaded
        let profilePhoto = bodyContent.profilePhoto;
        if (req.file) {
            profilePhoto = req.file.filename;
        }

        // Generate employee ID if not provided
        let employeeId = bodyContent.employeeId;
        if (!employeeId || employeeId.trim() === '') {
            employeeId = await generateEmployeeId();
        }

        // Generate random password
        const temporaryPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Construct full name
        const name = `${firstName || ''} ${lastName || ''}`.trim() || bodyContent.name || 'Unnamed User';

        // Handle Shift resolution if shift name is provided
        let shiftId = null;
        if (bodyContent.shift) {
            const shiftObj = await Shift.findOne({ shiftName: bodyContent.shift });
            if (shiftObj) shiftId = shiftObj._id;
        }

        // Create new user with all fields, mapping as necessary
        const newUser = new User({
            ...bodyContent,
            email: targetEmail,
            dateJoined: bodyContent.dateOfJoining || bodyContent.dateJoined,
            workSetup: {
                location: bodyContent.jobLocation || bodyContent.branch || (bodyContent.workSetup ? bodyContent.workSetup.location : ''),
                shift: shiftId
            },
            profilePhoto,
            name,
            employeeId,
            password: hashedPassword,
            forcePasswordReset: true
        });

        await newUser.save();
        
        // Send welcome email with credentials
        const emailResult = await sendWelcomeEmail(targetEmail, name, employeeId, temporaryPassword);
        
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
        console.error("Error in createUser controller:", error);
        
        // Handle duplicate key errors (code 11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                success: false, 
                message: `Duplicate field error: A user with this ${field} already exists.` 
            });
        }

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: `Validation error: ${messages.join(', ')}` 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error during employee creation",
            error: error.message 
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({ 
            role: { $ne: 'Admin' },
            status: { $in: ['Active', 'Inactive', 'Onboarding'] } 
        })
        .populate('workSetup.shift')
        .select("-password")
        .sort({ createdAt: -1 });

        const processedUsers = users.map(user => {
            const userObj = user.toObject();
            if (userObj.workSetup && userObj.workSetup.shift) {
                userObj.shift = userObj.workSetup.shift.shiftName;
            }
            return userObj;
        });

        res.status(200).json({ success: true, users: processedUsers });
    } catch (error) {
        console.log("Error in getUsers controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('workSetup.shift')
            .select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add top-level shift field for frontend compatibility
        const userObj = user.toObject();
        if (userObj.workSetup && userObj.workSetup.shift) {
            userObj.shift = userObj.workSetup.shift.shiftName;
        }

        res.status(200).json({ success: true, user: userObj });
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

        // Handle profile photo update
        // Map alternative field names if necessary (matching createUser logic)
        if (updateData.dateOfJoining && !updateData.dateJoined) {
            updateData.dateJoined = updateData.dateOfJoining;
        }

        // Handle profile photo update
        if (req.file) {
            updateData.profilePhoto = req.file.filename;
        } else if (updateData.profilePhoto === 'null') {
             // Handle case where photo might be explicitly cleared
             updateData.profilePhoto = null;
        }
        
        // Handle Shift update if provided as name
        if (updateData.shift) {
            const shiftObj = await Shift.findOne({ shiftName: updateData.shift });
            if (shiftObj) {
                updateData['workSetup.shift'] = shiftObj._id;
            }
            delete updateData.shift; // Remove root field as it's not in schema
        }

        // Handle Branch/Location update
        if (updateData.branch) {
            updateData['workSetup.location'] = updateData.branch;
            // Note: keeping root 'branch' as it exists in schema too
        }

        // Update name if firstName or lastName changed
        if (updateData.firstName || updateData.lastName) {
            const userForName = await User.findById(req.params.id);
            const firstName = updateData.firstName || userForName.firstName || '';
            const lastName = updateData.lastName || userForName.lastName || '';
            updateData.name = `${firstName} ${lastName}`.trim();
        }

        // Handle nested fields that might have been sent as strings from FormData
        delete updateData._id;
        delete updateData.__v;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        // Certain fields in req.body might be "[object Object]" if not handled correctly on frontend
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === '[object Object]' || updateData[key] === 'undefined' || updateData[key] === 'null') {
                delete updateData[key];
                return;
            }
            
            // Try to parse JSON strings (for arrays/objects sent via FormData)
            if (typeof updateData[key] === 'string' && (updateData[key].startsWith('[') || updateData[key].startsWith('{'))) {
                try {
                    updateData[key] = JSON.parse(updateData[key]);
                } catch (e) {
                    // Not valid JSON, leave as is
                }
            }
        });

        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        ).select("-password").populate('workSetup.shift');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add top-level shift field for frontend compatibility
        const userObj = user.toObject();
        if (userObj.workSetup && userObj.workSetup.shift) {
            userObj.shift = userObj.workSetup.shift.shiftName;
        }

        res.status(200).json({ success: true, message: "User updated successfully", user: userObj });
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
        
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error during profile update", 
            error: error.message 
        });
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
