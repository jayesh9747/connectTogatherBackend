const {uploadImageToCloudinary}=require("../utils/imageUploader");
const Doubt=require("../models/Doubt");
const Student=require("../models/Student");
const Instructor=require("../models/Instructor");
const mongoose=require('mongoose');
const socketIO=require('./../socketio')
async function handelAskDoubt(req,res){
    try{ 
        const userId=req.user.id;
        const file=req.files?.file;
        const {description}=req.body;
        
        if(!file||!description){
            return res.status(400).json({
                success:false,
                message:"Complete all details",
            })
        }
        const cloudinaryResponse=await uploadImageToCloudinary(file,"menty");
        console.log(cloudinaryResponse);
        const imageLink=cloudinaryResponse.secure_url;
        const responseDb=await Doubt.create({userId:userId,file:imageLink,description:description});
        console.log(responseDb);
        //fetching user details
        console.log(userId);
        const id=new mongoose.Types.ObjectId(userId);
        console.log(id);
        const studentDb=await Student.findOne({ studentId:id});
        console.log(studentDb);
        const std=studentDb.std;
        console.log("=============================");
        console.log(std);
        //fetching all teachers
        const instructorDb=await Instructor.find({std:{$elemMatch:{$eq:`${std}`}}});
        console.log(instructorDb);
        const iIdArray=[];
        instructorDb.forEach((element)=>{
            iIdArray.push(element.instructorId.toString());
        })

        // iIdArray.push(userId);
        // iIdArray.push("65e377ef6901f10787470a09");
// ===========================================
const chat={
doubtID:responseDb._id,
studentId:studentDb.studentId   
}


iIdArray.forEach((id)=>{
    socketIO.emitMessage(id,chat);
    console.log(id);
})

// ============================================

        console.log(iIdArray);
        return res.status(200).json({
            success:true,
            message:"Dobut created successfully",
            responseDb,
            instructorDb,
        })
    }catch(err){
        console.log("Error in creating doubt",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
};
async function handelGetUserDoubt(req,res){
    try{
        const {id}=req.body;
        console.log("Doubt id",id)
        if(!id){
            return res.status(400).json({
                success:false,
                message:"Doubt id is not present",
            })
        };
        const response = await Doubt.findOne({ _id: id.id });
        console.log("Response: ",response)
        if(!response){
            return res.status(400).json({
                success:false,
                message:"Invalid Doubt Id",
            
            })
        }
        return res.status(200).json({
            success:true,
            message:"Doubt is fetched successfullt",
            data:response
        })
    }catch(err){
        console.log("Error infteching doubut",err.message);
        return res.status(400).json({
            success:false,
            message:err.message,
        })
    }
}
module.exports={handelAskDoubt,handelGetUserDoubt};