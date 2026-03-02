import User from "../models/User.Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateEmployeeId } from "../utils/employeeId.js";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });

    res.cookie("jwt", token, {

        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure: false, // Set to true only in production with HTTPS
        sameSite: "lax",
    });
    return token;
}
    
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Only Admin can register from the frontend
        if (role && role !== "Admin") {
            return res.status(403).json({ 
                success: false, 
                message: "Only Admin accounts can be registered through this portal." 
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate employee ID automatically
        const employeeId = await generateEmployeeId();

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: "Admin", // Force role to Admin
            status: "Active", // Explicitly set status to Active
            employeeId
        });

        if (newUser) {
            const token = generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                success: true,
                message: "Admin account created successfully",
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    status: newUser.status,
                    token
                }
            });
        }
        else {
            res.status(400).json({ success: false, message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in register controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check status - allow if undefined/missing for backwards compatibility
    if (user.status && user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Contact admin.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT Cookie
    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        token: token,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current and new passwords are required" });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ success: false, message: "New password cannot be the same as the current password" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid current password" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("Change Password Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { register, login, logout, verifyUser, changePassword };
