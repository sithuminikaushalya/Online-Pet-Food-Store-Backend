import mongoose from "mongoose";
import { type } from "os";

const VetFoodSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:String, required:true},
    image:{type:String, required:true},
    category:{type:String, required:true},
})

const VetFoodModel =mongoose.models.food || mongoose.model('food',VetFoodSchema );

export default VetFoodModel;