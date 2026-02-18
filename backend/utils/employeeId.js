import User from "../models/User.Model.js";

// Helper function to generate unique employee ID
export const generateEmployeeId = async () => {
    const year = new Date().getFullYear();
    const count = await User.countDocuments();
    const id = `EMP${year}${String(count + 1).padStart(4, '0')}`;
    
    // Check if ID exists, if so increment
    const exists = await User.findOne({ employeeId: id });
    if (exists) {
        // Try one more increment (simple retry, could be recursively robust but simple is fine for now)
        return `EMP${year}${String(count + 2).padStart(4, '0')}`;
    }
    return id;
};
