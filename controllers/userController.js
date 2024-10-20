import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
 

//login user
/*const loginUser = async(req,res) =>{
   const {email,password} = req.body;
   try{
    const user = await userModel.findOne({email});

    if(!user){
        return res.json({success:false, message:"User Doesn,t exist"})
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.json({success:false, message:"Invalid Credentials"})
    }

    const token = createToken(user._id);
    res.json({success:true,token})

   }
   
   catch(error){
    console.log(error);
    res.json({success:false, message:"Error"})
   }


}*/

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    console.log('Login request received');

    if (!emailRegex.test(email)) {
        console.log('Invalid email format');
        return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    console.time('totalLoginTime');
    try {
        console.time('findUserTime');
        const user = await userModel.findOne({ email }).exec(); // Use exec() to ensure it returns a promise
        console.timeEnd('findUserTime');

        if (!user) {
            console.log('User not found');
            console.timeEnd('totalLoginTime');
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        console.time('bcryptCompareTime');
        const isMatch = await bcrypt.compare(password, user.password);
        console.timeEnd('bcryptCompareTime');

        if (!isMatch) {
            console.log('Invalid credentials');
            console.timeEnd('totalLoginTime');
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        console.time('createTokenTime');
        const token = createToken(user._id);
        console.timeEnd('createTokenTime');

        console.log('Login successful');
        console.timeEnd('totalLoginTime');
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const createToken = (id)=>{
        return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async(req,res) =>{
    const{name,password,email} = req.body;
    try{
        //check whether user already exists
        const exists = await userModel.findOne({email});
        if (exists){
            return res.json({success:false,message:"User already exists"})
        }

        //validating email format and strong password
        if(!validator.isEmail(email)){
           return res.json({success:false,message:"Please enter a valid email"}) 
        }

        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
        }

        //Hashing user password
        const salt = await bcrypt.genSalt(10)//5-15
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token});
    }
    catch{
            console.log("error")
            res.json({success:"false",message:"Error"})
    }
}
export {loginUser , registerUser}