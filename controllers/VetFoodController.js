import VetFoodModel from "../models/VetFood.js";
import fs from 'fs';

// add vet food item
const addVetFood = async(req,res) => {

    let image_filename = `${req.file.filename}`;
    const food = new VetFoodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })

    try{
        await food.save();
        res.json({success:true,message:"Food Added"})
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

 

// all food list
const listVetFood = async(req,res) => {
    try{
        const food = await VetFoodModel.find({});
        res.json({success:true, data:food});
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

//remove food item
const removeVetFood = async(req,res) =>{
    try{
        const food = await VetFoodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{});
        await VetFoodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Food item removed"});
        
    }
    catch(error){
        console.log(error)
        res.json({success:false, message:"Error"});
    }
}

 export {addVetFood, listVetFood, removeVetFood}
