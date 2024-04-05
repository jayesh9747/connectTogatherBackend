const User=require('../models/User');
const Category=require('../models/Category');
const Course=require("../models/Course");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
require("dotenv").config();
//function to create a course by an instructor
async function handelCreateCourse(req,res){
    try{
        const {title,description,whatYouWillLearn,category}=req.body;
        const thumbnail=req.files.file;
        if(!title||!description||!whatYouWillLearn||!category||!thumbnail){
            return res.status(400).json({ 
                success:false,
                message:"All fileds are required",
            });
        }
        //uploading file to cloudinary
        const cloudinaryResponse=await uploadImageToCloudinary(thumbnail,process.env.CLOUDINARY_FOLDER);
        //getting uploaded image url link
        const thumbnailLink=String(cloudinaryResponse.secure_url);
        //here is a point to be noted is that the request object will contain the id of respective instructor
        // and the category wiil be given in the req.body
        //checking whether the incomming category i valid or not
        const categoryDb=await Category.findOne({name:category});
        if(!categoryDb){
            return res.status(400).json({
                success:false,
                message:"Invalid category"
            })
        }
        //checking thether invoked instructor is present in database or not
        const userId=req.user.id;//here we add req.user=payload in login auth
        const userDb=await User.findById(userId);
        console.log(userDb);
        if(!userDb){
            return res.status(400).json({
                success:false,
                message:"No instructor is present with the given userId",
            })
        }
        //fecthc categoryId from categoryDb
        //fetch userId from userDb
        //use thumbnialLink
        //create a course with the above given data
        const courseDb=await Course.create({title,
                                        description,
                                        instructorId:userDb._id,
                                        whatYouWillLearn,
                                        thumbnail:thumbnailLink,
                                        category:categoryDb._id
                                    });
        console.log("Created course id",courseDb);
        //updating the created course to the enrolled courses filed of the
        //if user is student courses of User shows the bought courses by the student
        //if user is instructor  courses of user shows the created course by the instructro
        // await User.findByIdAndUpdate({_id:userDb._id} ,{$push:{courses:courseDb._id}},{new:true});
        return res.status(200).json({
            success:true,
            message:"creating of course fileds in successfull",
            courseDb,
        })
    }catch(err){
        console.log("Error in creating course ");
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
//function to display all courses
async function handelDisplayAllCourse(req,res){
    try{
        const allCourses=await Course.find({}).populate("instructor").exec();
        return res.status(200).json({
            success:true,
            message:"All Course have been fetched",
            allCourses,
        })
    }catch(err){
        conseol.log("error in fetching all course details");
        return res.status(500).json({
            success:false,
            message:err,
        })
    }
}
//function to get all details with a given Courseid woth all population
async function handelGetCourseDetail(req,res){
    try{
        const {courseId}=req.body;
        console.log(courseId);
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Course Id is not present",
            })
        }
        const courseDb=await Course.findById(courseId)
        // .populate({path:"instructorId",populate:{path:"profile"}})
        .populate("lesson")
        .populate("category")
        .exec();
        if(!courseDb){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with course id: ${courseDb._id}`,
            })
        };
        return res.status(200).json({
            success:true,
            message:"Course details are fetched successfully",
            courseDb,
        })
    }catch(err){
        console.log("Error in fetchinh detial about a course");
        return res.status(200).json({
            success:false,
            message:err,
        })
    }
};
//function to edit a course detail
async function handelEditCourse(req,res){
    try{

    }catch(err){

    }
}
module.exports={handelCreateCourse,handelDisplayAllCourse,handelGetCourseDetail,handelEditCourse};