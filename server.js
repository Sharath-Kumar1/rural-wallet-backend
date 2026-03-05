const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------------- Middleware ---------------- */

app.use(express.json());

app.use(
cors({
origin: "*",
methods: ["GET","POST","PUT","DELETE"]
})
);

/* ---------------- MongoDB ---------------- */

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
console.log("MongoDB Connected");
})
.catch(err=>{
console.log("MongoDB Error:",err);
});

/* ---------------- Routes ---------------- */

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallet");

app.use("/api/auth",authRoutes);
app.use("/api/wallet",walletRoutes);

/* ---------------- Test Route ---------------- */

app.get("/",(req,res)=>{
res.send("Rural Wallet Backend Running");
});

/* ---------------- Error Handler ---------------- */

app.use((err,req,res,next)=>{
console.error(err);
res.status(500).json("Server Error");
});

/* ---------------- Server ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT,"0.0.0.0",()=>{
console.log("Server running on port",PORT);
});