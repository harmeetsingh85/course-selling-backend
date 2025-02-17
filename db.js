const mongoose =require('mongoose');

const userSchema =new mongoose.Schema({
    email:{type:String, require:true},
    password:{type:String, require:true},
})
const adminSchema=new mongoose.Schema({
    email:{type:String, require:true},
    password:{type:String, require:true},
})
const courseSchema=new mongoose.Schema({
    title:{type:String, require:true},
    description:{type:String, require:true},
    price:{type:Number, require:true},
    developerId:mongoose.Schema.ObjectId
})
const purchaseSchema=new mongoose.Schema({
    courseId:{type : mongoose.Schema.ObjectId,ref:"course"},
    userId:{type :mongoose.Schema.ObjectId, ref:"user"}
})

const adminModel=mongoose.model('admin',adminSchema);
const userModel=mongoose.model('user',userSchema);
const courseModel=mongoose.model('course',courseSchema);
const purchaseModel=mongoose.model('purchase',purchaseSchema);
module.exports={adminModel,userModel,courseModel,purchaseModel};
