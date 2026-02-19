import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["Admin", "Manager", "Employee"],
            default: "Employee"
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Onboarding", "Resigned", "Terminated", "Absconding", "Retired"],
            default: "Active"
        },
        phone: {
            type: String
        },
        dateOfBirth: {
            type: Date
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other", "Prefer not to say"],
            default: "Prefer not to say"
        },
        profilePhoto: {
            type: String
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            pincode: String
        },
        emergencyContact: {
            name: String,
            relation: String,
            phone: String
        },
        employeeId: {
            type: String,
            unique: true,
            sparse: true
        }, 
        position: {
            type: String
        },
        designation: {
            type: String
        },
        department: {
            type: String
        },
        dateJoined: {
            type: Date
        },
        employmentType: {
            type: String
        },
        workSetup: {
            location: String,
            mode: {
                type: String,
                enum: ["Office", "Hybrid", "Remote"],
                default: "Office"
            },
            shift: String
        },
        salaryDetails: {
            salaryType: {
                type: String,
                enum: ["Monthly", "Hourly", "Contract"]
            },
            baseSalary: Number,
            payGrade: String,
            effectiveFrom: Date,
            ctc: Number
        },
        reportingTo: {
            type: String
        },
        inviteSent: {
            type: Boolean,
            default: false
        },
        forcePasswordReset: {
            type: Boolean,
            default: true
        },
        permissions: {
            moduleAccess: [String],
            approvalRights: {
                type: Boolean,
                default: false
            }
        },
        documents: {
            resume: String,
            idProof: String,
            photograph: String,
            offerLetter: String,
            appointmentLetter: String,
            nda: String,
            bankPassbook: String,
            panCard: String
        },
        verification: {
            status: {
                type: String,
                enum: ["Pending", "Verified"],
                default: "Pending"
            },
            verifiedBy: String,
            verificationDate: Date
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

export default User;
