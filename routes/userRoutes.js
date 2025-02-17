const express=require('express');
const userRoute=express.Router();
const zod=require('zod');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require("dotenv").config();
const JWT_USER_SECRET=process.env.JWT_USER_SECRET;

const {userModel, courseModel}=require('../db');
const {purchaseModel}=require('../db');
const userMiddleware=require('../middleware/user');

userRoute.post('/signUp',async function(req,res){
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
    await userModel.create({
        email:email,
        password:hashPassword
    })
    res.json({"msg":"userSignUp success"});
})

userRoute.post('/signIn',async function(req,res){
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
    let findedMail=await userModel.findOne({
        email:email
    });
    let pass=await bcrypt.compare(findedMail.password,password);
    if( !(findedMail&& pass) ){
        return res.json({
            "msg":"incorrect details"
        })
    }
    let token=jwt.sign({id:findedMail._id},JWT_USER_SECRET);
    res.json({
        "msg":" user login succcess",
        "token":token,
    });
})

//purchase the course
userRoute.get('/purchase-course',userMiddleware,async function(req,res){
    //put zod validation here also
    let userId=req.id;
    let courseId=req.body.courseId;
    await purchaseModel.create({
        userId:userId,
        courseId:courseId
    })
    res.json({"msg":"course purchased successfully"});
})

//see your purchased courses
userRoute.get('/myCourses',userMiddleware,async function(req,res){
    let userCourses=await purchaseModel.find({userId:req.id}).populate('courseId');
    if(!userCourses){
        return res.json({"msg":"u dont have any course"});
    }
    res.json(userCourses);
})

//see all courses
userRoute.get('/allCourses',async function(req,res){
    let allCourse=await courseModel.find({});
    if(!allCourse){
        return res.json({"msg":"no course is available to purchase"});
    }
    res.json(allCourse);
})

module.exports=userRoute;