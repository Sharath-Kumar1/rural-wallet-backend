const router = require("express").Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/authMiddleware");
const bcrypt = require("bcryptjs");


/* GET BALANCE */

router.get("/balance",auth,async(req,res)=>{

const user = await User.findById(req.user.id);

res.json({balance:user.balance});

});


/* DASHBOARD TRANSACTION */

router.post("/transaction",auth,async(req,res)=>{

const {type,amount,pin} = req.body;

const user = await User.findById(req.user.id);

const validPin = await bcrypt.compare(pin,user.pin);

if(!validPin)
return res.status(400).json("Wrong PIN");


if(type==="withdraw" && user.balance<amount)
return res.status(400).json("Insufficient balance");


if(type==="deposit")
user.balance += Number(amount);

if(type==="withdraw")
user.balance -= Number(amount);


await user.save();

const receiptId = "RWL"+Date.now();

const txn = new Transaction({
receiptId,
userId:user._id,
type,
amount
});

await txn.save();

res.json({
receiptId,
balance:user.balance
});

});


/* ATM TRANSACTION */

router.post("/atm-transaction",async(req,res)=>{

try{

const {userId,pin,amount,type} = req.body;

const user = await User.findOne({userId});

if(!user)
return res.status(400).json("User not found");

const validPin = await bcrypt.compare(pin,user.pin);

if(!validPin)
return res.status(400).json("Wrong PIN");


if(type==="withdraw" && user.balance < amount)
return res.status(400).json("Insufficient balance");


if(type==="deposit")
user.balance += Number(amount);

if(type==="withdraw")
user.balance -= Number(amount);


await user.save();

const receiptId = "RWL"+Date.now();

const txn = new Transaction({
receiptId,
userId:user._id,
type,
amount
});

await txn.save();

res.json({
receiptId,
balance:user.balance
});

}
catch(err){

console.log(err);
res.status(500).json("Server Error");

}

});


/* TRANSACTION HISTORY */

router.get("/history",auth,async(req,res)=>{

const txns = await Transaction.find({
userId:req.user.id
}).sort({date:-1});

res.json(txns);

});


module.exports = router;