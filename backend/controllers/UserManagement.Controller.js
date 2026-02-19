import User from "../models/User.Model.js";
import Role from "../models/Role.Model.js";
import Grade from "../models/Grade.Model.js";
import Resignation from "../models/Resignation.Model.js";
import ExitRecord from "../models/ExitRecord.Model.js";

// MANAGERS LIST
const getManagers = async (req, res) => {
    try {
        const managers = await User.find({ role: 'Manager' }).select("-password");
        res.status(200).json({ success: true, managers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// EX-EMPLOYEES LIST
const getExEmployees = async (req, res) => {
    try {
        const exEmployees = await User.find({ status: { $in: ['Resigned', 'Terminated', 'Inactive'] } }).select("-password");
        res.status(200).json({ success: true, exEmployees });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// NEW JOINERS (ONBOARDING PIPELINE)
const getNewJoiners = async (req, res) => {
    try {
        // Assume 'Onboarding' status means not fully active yet
        const newJoiners = await User.find({ status: 'Onboarding' }).select("-password");
        res.status(200).json({ success: true, newJoiners });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// UPCOMING RETIREMENTS
const getUpcomingRetirements = async (req, res) => {
    try {
        // Assuming retirement age is 60
        const retirementAge = 60;
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);

        // Find users whose 60th birthday is within next 6 months
        // Note: Logic simplification. In prod, use DOB field + aggregation.
        // Assuming user has 'dob' field.
        const users = await User.find({ dob: { $exists: true } }).select("-password");
        
        const retiringUsers = users.filter(user => {
            if (!user.dob) return false;
            const birthDate = new Date(user.dob);
            const retirementDate = new Date(birthDate.getFullYear() + retirementAge, birthDate.getMonth(), birthDate.getDate());
            return retirementDate >= today && retirementDate <= sixMonthsFromNow;
        });

        res.status(200).json({ success: true, retiringUsers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// OTHER EMPLOYEES (CONTRACT/INTERN)
const getOtherEmployees = async (req, res) => {
    try {
        const others = await User.find({ employmentType: { $in: ['Contract', 'Intern', 'Freelance'] } }).select("-password");
        res.status(200).json({ success: true, others });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// EXIT RECORD MANAGEMENT
const getExitRecord = async (req, res) => {
    try {
        const { userId } = req.params;
        let exitRecord = await ExitRecord.findOne({ userId });

        if (!exitRecord) {
            // Check if user exists and is an ex-employee to create a default record
            const user = await User.findById(userId);
            if (user && ['Resigned', 'Terminated', 'Inactive'].includes(user.status)) {
                exitRecord = await ExitRecord.create({
                    userId,
                    exitDate: new Date(), 
                    reason: 'Not specified',
                    status: 'Pending Clearance'
                });
            } else {
                 return res.status(404).json({ success: false, message: "Exit record not found" });
            }
        }
        res.status(200).json({ success: true, exitRecord });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateExitRecord = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        
        const exitRecord = await ExitRecord.findOneAndUpdate(
            { userId }, 
            updates, 
            { new: true, upsert: true }
        );
        
        res.status(200).json({ success: true, exitRecord });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export { 
    getManagers, 
    getExEmployees, 
    getNewJoiners, 
    getUpcomingRetirements, 
    getOtherEmployees,
    getExitRecord,
    updateExitRecord
};
