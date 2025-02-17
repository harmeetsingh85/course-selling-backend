const express=require("express");
const adminRoute=express.Router();
const bcrypt=require('bcryptjs');
const zod=require("zod");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const JWT_ADMIN_SECRET=process.env.JWT_ADMIN_SECRET;

const {adminModel, courseModel}=require('../db');
const adminMiddleware=require('../middleware/admin');

adminRoute.post('/signUp',async function(req,res){
    let reqObj=zod.object({
        email:zod.string().min(6).max(20).email(),
        password:zod.string().min(3).max(20).regex(/[A-Z]/,"password contain atleast one capital letter")
    })
    let parsedBody=reqObj.safeParse(req.body);
    if(!parsedBody.success){
        return res.json({
            "msg":"incorrect details",
            "errors":parsedBody.error.format()
        })
    }
    let email=req.body.email;
    let password=req.body.password;
    let hashPassword=await bcrypt.hash(password,8);
    await adminModel.create({
        email:email,
        password:hashPassword
    })
    res.json({"msg":"adminSignUp"});
})

adminRoute.post('/signIn',async function(req,res){
    let reqObj=zod.object({
        email:zod.string().min(6).max(20).email(),
        password:zod.string().min(3).max(20).regex(/[A-Z]/,"password contain atleast one capital letter")
    })
    let parsedBody=reqObj.safeParse(req.body);
    if(!parsedBody.success){
        return res.json({
            "msg":"incorrect details",
            "errors":parsedBody.error.format()
        })
    }
    let email=req.body.email;
    let password=req.body.password;
    let findedMail=await adminModel.findOne({
        email:email
    });
    let pass= await bcrypt.compare(findedMail.password,password);
    if( !(findedMail&& pass) ){
        return res.json({
            "msg":"incorrect details"
        })
    }
    let token=jwt.sign({id:findedMail._id},JWT_ADMIN_SECRET);
    res.json({
        "msg":"login succcess",
        "token":token,
    });
})

adminRoute.post('/createCourse',adminMiddleware,async function(req,res){
    let reqObj=zod.object({
      title:zod.string().min(3).max(200),
      description:zod.string().min(3).max(2000),
      price:zod.number().min(1).max(100000)
    })
    let parsedBody=reqObj.safeParse(req.body);
    if(!parsedBody.success){
        return res.json({"msg":parsedBody.error.format()})
    }
    let {title, description, price}=req.body;
    await courseModel.create({
        title,description,price,
        developerId:req.id
    })
    res.json({"msg":"course created successfully"});

})

//see all your createdd courses
adminRoute.get('/createdcourses',adminMiddleware,async function(req,res){
    let courses=await courseModel.find({developerId:req.id});
    if(!courses){
        return res.json({"msg":"you dont created any course"});
    }
    else{
        res.json(courses);
    }
})

//see all courses 
adminRoute.get('/allCourses',async function(req,res){
    let allCourse=await courseModel.find({});
    if(!allCourse){
        return res.json({"msg":"no course is available to purchase"});
    }
    res.json(allCourse);
})


module.exports=adminRoute;