// orderController.js

import dotenv from 'dotenv';   // Import dotenv
dotenv.config();               // Load environment variables

import { reduceVetFoodQuantity } from './VetFoodController.js';

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  


const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";  // Adjust this to match your frontend's URL

    console.log('req.user:', req.user);  // Add this at the start of placeOrder

    try {
        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user information" });
        }

        // Create a new order in the database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false  // Initially set payment as false until payment is completed
        });

        // Save the new order to the database
        await newOrder.save();

        // Clear the user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare the line items for Stripe
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "lkr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,  // Amount in cents
            },
            quantity: item.quantity,
        }));

        // Add delivery charge to the line items
        line_items.push({
            price_data: {
                currency: "lkr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 300 * 100,  // Example delivery fee in cents
            },
            quantity: 1,
        });

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
           success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

        });

        // Return the session URL for frontend redirection
        res.json({
            success: true,
            session_url: session.url  // Stripe Checkout session URL
        });

    } catch (error) {
        console.log('Error placing order:', error);
        res.status(500).json({ success: false, message: "Error placing the order", error: error.message });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    console.log('Verify request received:', req.body);  // Log the incoming body for debugging

    try {
        if (!orderId || !success) {
            return res.status(400).json({ success: false, message: "Missing parameters" });
        }

        // If payment was successful
        if (success === "true") {
            const order = await orderModel.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
            
            // Update payment status
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            console.log('Verifying order:', orderId);

            // Update stock quantity for each item in the order
            for (let item of order.items) {
                console.log('Updating stock for item:', item._id, 'by quantity:', item.quantity);
                const quantityToReduce = item.quantity;

                // Ensure reduceVetFoodQuantity does not send its own response
                try {
                    await reduceVetFoodQuantity({
                        body: { id: item._id, quantity: quantityToReduce } 
                    });  // Remove res from here to avoid sending response multiple times
                } catch (err) {
                    // Handle stock reduction errors here
                    console.error(`Failed to update stock for item ${item._id}:`, err);
                    return res.status(500).json({ success: false, message: "Error updating stock" });
                }
            }

            // After all updates are done, respond to the frontend
            return res.json({ success: true, message: "Payment successful, stock updated" });
        } else {
            // If payment failed
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Payment failed, order canceled" });
        }
    } catch (error) {
        console.log('Error verifying order:', error);
        return res.status(500).json({ success: false, message: "Error verifying the order", error: error.message });
    }
};



const userOrders = async (req, res) => {
    try {
        console.log('Authenticated user:', req.user);  // Debug: Check authenticated user info
        const orders = await orderModel.find({ userId: req.user.id });  // Fetch orders using req.user.id
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: "Error fetching user orders", error: error.message });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log('Error listing orders:', error);
        res.status(500).json({ success: false, message: "Error listing orders", error: error.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.log('Error updating status:', error);
        res.status(500).json({ success: false, message: "Error updating status", error: error.message });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
