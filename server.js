import express from 'express'; 
import cors from 'cors';  
import dotenv from 'dotenv'; 
import { connectDB } from './config/db.js';
import VetFoodRouter from './routes/VetFoodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import adminRouter from './routes/adminRoute.js';

//App configuration
const app= express();
dotenv.config(); 

const PORT = process.env.PORT || 4000;  

app.use(express.json());
app.use(cors()); 

//db connection
connectDB();

//api endpoints
app.use("/api/food", VetFoodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart" , cartRouter)
app.use("/api/order", orderRouter)
app.use('/api/admin', adminRouter)

app.get("/", (req,res) =>{
        res.send("API Working");
});

app.listen(PORT, () =>{
        console.log(`Server started on http://localhost:${PORT}`)
})








 
 