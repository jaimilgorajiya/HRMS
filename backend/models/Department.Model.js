import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
    {
        departmentId: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        headOfDepartment: {
            type: String
        },
        location: {
            type: String
        },
        addedBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
