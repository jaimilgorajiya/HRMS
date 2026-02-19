import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    permissions: [{ 
        type: String 
    }], // e.g., 'view_employees', 'manage_payroll'
    description: { 
        type: String 
    }
}, {
    timestamps: true
});

const Role = mongoose.model("Role", roleSchema);

export default Role;