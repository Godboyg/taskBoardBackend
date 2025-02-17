const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 4000;
const userModel = require("./db/mongoose");
require("dotenv").config();

app.use(cors({
    origin: "https://papaya-cannoli-31b605.netlify.app"
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("hello");
})

app.post("/createUser",async(req,res)=>{
    const { name, email , password } = req.body;
    console.log(name,email,password);

    const userExists = await userModel.findOne({ email });

    if(!userExists){

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password : hashedPassword
        })  

        const token = jwt.sign({ _id: user._id , email : user.email },process.env.Secret);

        await user.save();
        res.status(201).json({user,token});
    }
    else{
        console.log("User already exist");
    }

})

app.post("/loginUser",async(req,res)=>{
    const { email , password } = req.body;

    const user = await userModel.findOne({ email });

    if(!user){
        res.status(400).json({message : "Invalid Cridentials"});
    }

    const isPasswordMatch = await bcrypt.compare(password , user.password);

    if(!isPasswordMatch){
        return res.status(400).json({ message : "Invalid Password"});
        // return alert("Wrong Passsword");
    }

    const token = jwt.sign({ _id: user._id , email : user.email },process.env.Secret);

    res.status(201).json({ message : "user logged in" , token});

})

app.listen(port,()=>{
    console.log(`server connected at ${port}`);
})
