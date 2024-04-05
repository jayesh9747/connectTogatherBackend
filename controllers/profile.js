const User=require("../models/User");
const Profile=require("../models/Profile");
const Course=require("../models/Course");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const { mailSender}=require("../utils/mailSender");
const bcrypt=require('bcrypt');
async function handelUpdateProfileInfo(req,res){
    try{
        const {firstName,lastName="",contactNumber,gender,about="",dateOfBirth}=req.body;
        //fetching userId from request object
        const userId=req.user.id;
        const _user=await User.findById(userId);
        const profileId=_user.profile._id;
        const profile=await Profile.findById(profileId);
        profile.contactNumber=contactNumber;
        profile.gender=gender;
        profile.about=about;
        profile.dateOfBirth=dateOfBirth;
        await profile.save();
        const user=await User.findByIdAndUpdate(userId,{firstName:firstName,lastName:lastName}).populate("profile").exec();
        return res.status(200).json({
            success:true,
            message:"Profile is updated successfully",
            user,
        })
    }catch(err){
        console.log("Error in editting the profile",err);
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
};
//function to delete user account
async function handelDeleteAccount(req,res){
    try{
        const userId=req.user.id;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"Complete All details",
            })
        }
        const userDb=await User.findById(userId);
        if(!userDb){
            return res.status(400).json({
                success:false,
                message:"User not found",
            })
        }
        const profileId=userDb.profile;
        //deleting profile
        await Profile.findByIdAndDelete(profileId);
        //deleting a user
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            success:true,
            message:"Account have been deleted successfully",
        })
    }catch(err){
        console.log("Error in deleting user account");
        return res.status(500).json({
            success:false,
            message:err,
        })
    }
}
//update profile picture
async function handelUpdateProfilePicture(req,res){
    try{
        const userId=req.user.id;
        const profilePicture=req.files.file;
        if(!profilePicture){
            return res.status(400).json({
                success:false,
                message:"Profile picture is not available",
            })
        }
        const userDb=await User.findById(userId);
        const cloudinaryResponse=await uploadImageToCloudinary(profilePicture,process.env.CLOUDINARY_FOLDER);
        const thumbnailLink=String(cloudinaryResponse.secure_url);
        const user=await User.findByIdAndUpdate(userId,{image:thumbnailLink},{new:true}).populate("profile").exec();
        return res.status(200).json({
            success:true,
            message:"Profile picture have been updated successfully",
            user,
        })
    }catch(err){
        console.log("Error in updating the profile picture",err);
        return res.status(500).json({
            success:false,
            message:err,
        })
    }
};
//update the password
async function handelUpdatePassword(req,res){
    try{
        const userId=req.user.id;
        console.log(userId);
        const {oldPassword,newPassword}=req.body;
        console.log(oldPassword,newPassword);
        const userDb=await User.findById(userId);
        const hp=await bcrypt.hash(oldPassword,10);
        console.log(hp,userDb.password);
        if(await bcrypt.compare(oldPassword,userDb.password)){
            const hashedPassword=await bcrypt.hash(newPassword,10);
            await User.findByIdAndUpdate(userId,{password:hashedPassword});
            await  mailSender(userDb.email,newPassword,"Your updated password for EdTech");
            return res.status(200).json({
                success:true,
                message:"Password Updated Sucessfully",
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Enter Correct Old Password",
            })
        }
    }catch(err){
        console.log("Error in updating password",err.message);
                    return res.status(500).json({
                success:false,
                message:err.message,
            })
    }
}
//get all details od a user
async function getAllUserDetails(req,res){
    try{
        const userId=req.user.id;
        const userDetails=await User.findById(userId).populate("profile").exec();
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            userDetails,
          })
    }catch(err){
        console.log("Error in fecthing all detail of the user");
        return res.status(500).json({
            success: false,
            message: err,
          })
    }
}
//instructor dashboard
const instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructorId: req.user.id })
  
      const courseData = courseDetails.map((course) => {  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
        }
        return courseDataWithStats
      })
  
       res.status(200).json({
          courses: courseData,
        })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }
module.exports={handelUpdateProfileInfo,handelDeleteAccount,handelUpdateProfilePicture, handelUpdatePassword,getAllUserDetails,instructorDashboard};