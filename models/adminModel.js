import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },  // Changed from email to username
    password: { type: String, required: true },

}, { minimize: false });

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
