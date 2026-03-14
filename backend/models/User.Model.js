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
            unique: true,
            trim: true,
            lowercase: true
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
        aliasName: {
            type: String
        },
        countryCode: {
            type: String
        },
        probationPeriodDays: {
            type: Number
        },
        trainingCompletionDate: {
            type: Date
        },
        dateOfPermanent: {
            type: Date
        },
        branch: {
            type: String
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
            shift: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Shift'
            }
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
        subDepartment: {
            type: String
        },
        grade: {
            type: String
        },
        employeeLevel: {
            type: String
        },
        biometricId: {
            type: String
        },
        previousMemberId: {
            type: String
        },
        isInternationalWorker: {
            type: String,
            default: "No"
        },
        insuranceNumber: {
            type: String
        },
        insuranceCompanyName: {
            type: String
        },
        insuranceExpiryDate: {
            type: Date
        },
        retirementAge: {
            type: Number
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
