import express from 'express'; //Import express
//import mongoose from 'mongoose'; //Import mongoose
//import bodyParser from 'body-parser';//Import  body-parser
import cors from 'cors'; //Import cors-for resource sharing
import dotenv from 'dotenv'; 
import { connectDB } from './config/db.js';
import VetFoodRouter from './routes/VetFoodRoute.js';
import userRouter from './routes/userRoute.js';

//App configuration
const app= express();
dotenv.config(); //Configure dotenv

const PORT = process.env.PORT || 4000;  

//middleware
app.use(express.json());
app.use(cors()); //Enable cors

//app.use(bodyParser.json());/*json wl tiyenne key value pairs.mongodb wl ek thiyn nisa thma mehm gnne*/

//db connection
connectDB();

//api endpoints
app.use("/api/food", VetFoodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)


app.get("/", (req,res) =>{
        res.send("API Working")
})

app.listen(PORT, () =>{
        console.log(`Server started on http://localhost:${PORT}`)
})








 
 