import Department from "../models/Department.Model.js";

// Helper function to generate unique department ID
const generateDepartmentId = async () => {
    const year = new Date().getFullYear();
    const count = await Department.countDocuments();
    const id = `DEPT${year}${String(count + 1).padStart(4, '0')}`;
    
    // Check if ID exists, if so increment
    const exists = await Department.findOne({ departmentId: id });
    if (exists) {
        return `DEPT${year}${String(count + 2).padStart(4, '0')}`;
    }
    return id;
};

const createDepartment = async (req, res) => {
    try {
        const { name, description, headOfDepartment, location } = req.body;
        
        // Check if department name already exists
        const exists = await Department.findOne({ name });
        if (exists) {
            return res.status(400).json({ success: false, message: "Department already exists" });
        }

        // Generate department ID
        const departmentId = await generateDepartmentId();

        // Get admin name from authenticated user
        const addedBy = req.user.name || req.user.email;

        const newDepartment = new Department({ 
            departmentId,
            name, 
            description, 
            headOfDepartment, 
            location,
            addedBy
        });
        await newDepartment.save();

        res.status(201).json({ success: true, message: "Department created successfully", department: newDepartment });
    } catch (error) {
        console.log("Error in createDepartment controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({}).sort({ name: 1 });
        res.status(200).json({ success: true, departments });
    } catch (error) {
        console.log("Error in getDepartments controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { name, description, headOfDepartment, location } = req.body;
        
        // Don't allow updating departmentId or addedBy
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { name, description, headOfDepartment, location },
            { new: true, runValidators: true }
        );

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }

        res.status(200).json({ success: true, message: "Department updated successfully", department });
    } catch (error) {
        console.log("Error in updateDepartment controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found" });
        }
        res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        console.log("Error in deleteDepartment controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { createDepartment, getDepartments, updateDepartment, deleteDepartment };
