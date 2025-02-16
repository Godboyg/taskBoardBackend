const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("DB connected");
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    }
})

module.exports = mongoose.model("user",userSchema);