import express from "express";
import { addVetFood, listVetFood, getVetFoodById, removeVetFood, updateVetFood } from "../controllers/VetFoodController.js";
import multer from "multer";

const VetFoodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

VetFoodRouter.post("/add", upload.single("image"), addVetFood);
VetFoodRouter.get("/list", listVetFood);
VetFoodRouter.get("/:id", getVetFoodById);   
VetFoodRouter.post("/remove", removeVetFood);
VetFoodRouter.put("/update", updateVetFood);   

export default VetFoodRouter;
