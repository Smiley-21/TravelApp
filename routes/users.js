const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");

//register
router.post("/register", async(req,res)=>{
    try{

        //generate  secret Password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);



        //Create new User
        const newUser=new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });
        //save user and send response
        const user=await newUser.save();
        res.status(200).json(user._id);

    }catch(err){
        res.status(500).json(err);
    }
})


//login
router.post("/login", async(req,res)=>{
    try{
        // console.log("Finding User");
        //find User
       
        const FUser=await User.findOne({
            username:req.body.username
        });
        // console.log(FUser);
        if(!FUser){
            return res.status(400).json("Wrong Username or Password");
        }


        // //validate password
        const validPassword=await bcrypt.compare(req.body.password,FUser.password);
        if(!validPassword){
            return res.status(400).json("Wrong Username or Password");
        }

        // //Successful response
        res.status(200).json({id:FUser._id,username:FUser.username})

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports=router;