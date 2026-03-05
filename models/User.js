const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

userId:String,
name:String,
email:String,
password:String,
pin:String,

balance:{
type:Number,
default:0
}

},{timestamps:true});

module.exports = mongoose.model("User",UserSchema);