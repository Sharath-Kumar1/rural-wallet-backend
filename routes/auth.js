const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* REGISTER */

router.post("/register",async(req,res)=>{

try{

const {name,email,password,pin} = req.body;

const exist = await User.findOne({email});

if(exist)
return res.status(400).json("User exists");

const hashPass = await bcrypt.hash(password,10);
const hashPin = await bcrypt.hash(pin,10);

const userId = "RWU"+Date.now();

const user = new User({
userId,
name,
email,
password:hashPass,
pin:hashPin
});

await user.save();

res.json({userId});

}
catch(err){
console.log(err);
res.status(500).json("Server error");
}

});


/* LOGIN */

router.post("/login",async(req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email});

if(!user)
return res.status(400).json("User not found");

const valid = await bcrypt.compare(password,user.password);

if(!valid)
return res.status(400).json("Wrong password");

const token = jwt.sign(
{ id:user._id, userId:user.userId },
process.env.JWT_SECRET
);

res.json({
token,
userId:user.userId
});

}
catch(err){
console.log(err);
res.status(500).json("Server error");
}

});

module.exports = router;