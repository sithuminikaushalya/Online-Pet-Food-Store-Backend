import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login admin
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await adminModel.findOne({ username });

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin doesn't exist" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Create and send token
        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { loginAdmin };
