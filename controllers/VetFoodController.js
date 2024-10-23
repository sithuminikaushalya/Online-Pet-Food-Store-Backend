import VetFoodModel from "../models/VetFood.js";
import fs from 'fs';
import path from 'path';

// Add vet food item
const addVetFood = async (req, res) => {
    const imageFilename = req.file ? req.file.filename : null;
    const food = new VetFoodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity, // Added quantity
        category: req.body.category,
        image: imageFilename
    });

    try {
        await food.save();
        res.status(201).json({ success: true, message: "Food item added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to add food item" });
    }
};

// List all vet food items with optional category filter
const listVetFood = async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};

    try {
        const foods = await VetFoodModel.find(filter);
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to retrieve food items" });
    }
};

// Get vet food item by ID
const getVetFoodById = async (req, res) => {
    const { id } = req.params;

    try {
        const food = await VetFoodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }
        res.status(200).json({ success: true, data: food });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to retrieve food item" });
    }
};

// Remove vet food item
const removeVetFood = async (req, res) => {
    const { id } = req.body;

    try {
        const food = await VetFoodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Remove the associated image file
        const imagePath = path.join('uploads', food.image);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Failed to delete image:', err);
            }
        });

        await VetFoodModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Food item removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to remove food item" });
    }
};

// Update vet food item
const updateVetFood = async (req, res) => {
    const { id, name, description, price, quantity, category } = req.body; 

    try {
        const food = await VetFoodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

         
        food.name = name || food.name;
        food.description = description || food.description;
        food.price = price || food.price;
        food.quantity = quantity || food.quantity; // Update quantity
        food.category = category || food.category;

        await food.save();
        res.status(200).json({ success: true, message: "Food item updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update food item" });
    }
};

// Update only the quantity of vet food item
const updateVetFoodQuantity = async (req, res) => {
    const { id, quantity } = req.body;

    try {
        const food = await VetFoodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        food.quantity = quantity; // Update only the quantity

        await food.save();
        res.status(200).json({ success: true, message: "Food item quantity updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update food item quantity" });
    }
};

// Reduce vet food item quantity after an order is placed
const reduceVetFoodQuantity = async (req, res = null) => {
    const { id, quantity } = req.body; // Destructure id and quantity from req.body

    try {
        const food = await VetFoodModel.findById(id);
        if (!food) {
            if (res) {
                return res.status(404).json({ success: false, message: "Food item not found" });
            }
            throw new Error("Food item not found");
        }

        // Check if there is enough quantity to reduce
        if (food.quantity < quantity) {
            if (res) {
                return res.status(400).json({ success: false, message: "Insufficient quantity available" });
            }
            throw new Error("Insufficient quantity available");
        }

        // Reduce the quantity
        food.quantity -= quantity;

        await food.save();

        // Only send response if res exists (i.e., it's a standalone call)
        if (res) {
            return res.status(200).json({ success: true, message: "Food item quantity reduced successfully" });
        }
    } catch (error) {
        console.error('Failed to reduce food item quantity:', error);
        
        // If res is provided (standalone call), send response
        if (res) {
            return res.status(500).json({ success: false, message: "Failed to update food item quantity" });
        }
        // If not, throw the error to be handled by the caller
        throw error;
    }
};


const getItemDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const food = await VetFoodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Determine stock status based on quantity
        const stockStatus = food.quantity > 0 ? 'available' : 'out of stock';

        res.status(200).json({
            success: true,
            item: {
                ...food._doc,
                stockStatus // Add stock status to the response
            }
        });
    } catch (error) {
        console.error('Error retrieving item details:', error);
        res.status(500).json({ success: false, message: "Failed to retrieve item details" });
    }
};



export { addVetFood, listVetFood, getVetFoodById, removeVetFood, updateVetFood, updateVetFoodQuantity,reduceVetFoodQuantity,getItemDetails };
