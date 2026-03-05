const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({

receiptId:String,
userId:String,
type:String,
amount:Number,

date:{
type:Date,
default:Date.now
}

});

module.exports = mongoose.model("Transaction",TransactionSchema);