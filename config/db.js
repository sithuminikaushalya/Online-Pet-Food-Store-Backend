import { connect } from "http2";
import mongoose from "mongoose";

 export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://gayashathilakarathna:Y5xfWr205fim7ct9@cluster0.my3cjjj.mongodb.net/vetdrugs_db?retryWrites=true&w=majority&appName=Cluster0').then(()=>console.log("DB connected"));
}