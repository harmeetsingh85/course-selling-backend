const express=require('express');
const app=express();
const mongoose  = require('mongoose');
require("dotenv").config();

const userRoute=require("./routes/userRoutes");
const adminRoute=require("./routes/adminRoutes");


app.use(express.json());
app.use("/user",userRoute);
app.use("/admin",adminRoute);

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("db connected and app started");
}
main();