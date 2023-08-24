const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const pinRoute=require("./routes/pins");
const userRoute=require("./routes/users");


const app=express();

//Configuration
dotenv.config();
app.use(express.json());



// mongoose connection 
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("MongoDB is connected");
}).catch((err)=>console.log(err));

//always before using app.listen
app.use("/api/users",userRoute);
app.use("/api/pins",pinRoute); // marked for check


// App listen
app.listen(8800,()=>{
    console.log("Backend Server is running");
})