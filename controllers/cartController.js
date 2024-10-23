import userModel from "../models/userModel.js";


// Adding items to user cart
const addToCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user.id);  
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};  

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.user.id, { cartData });
        res.json({ success: true, message: "Added to cart", cartData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
};

// Removing items from user cart
const removeFromCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user.id); 
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {}; 

        
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;

            
            if (cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId];
            }

            await userModel.findByIdAndUpdate(req.user.id, { cartData });
            res.json({ success: true, message: "Removed from cart", cartData });
        } else {
            res.status(400).json({ success: false, message: "Item not in cart or invalid quantity" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error removing from cart" });
    }
};

// Getting the cart data
const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user.id); 
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {}; 

        res.json({ success: true, cartData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching cart data" });
    }
};
// Updating items in the user cart
const updateCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user.id); 
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const updatedCart = req.body.cart; 

        await userModel.findByIdAndUpdate(req.user.id, { cartData: updatedCart });
        res.json({ success: true, message: "Cart updated", cartData: updatedCart });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating cart" });
    }
};

export { addToCart, removeFromCart, getCart, updateCart };



