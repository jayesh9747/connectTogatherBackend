const User=require("../models/User");
const Otp=require("../models/Otp");
const Profile=require("../models/Profile");
const Student=require("../models/Student");
const Instructor=require("../models/Instructor");
const Class=require("../models/Class");
const otpGenerator=require('otp-generator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require("dotenv").config();
//========================================================send otp
//function to validate email using regular expression

async function handelSendOtp(req,res){
    try{

        const {email}=req.body;
        console.log(email);
        //validating email where it is in correct regular expression form or not
        const userExist=await User.findOne({email});
        //if user exist than do this
        if(userExist){
            return res.status(409).json({
                success:false,
                message:"User already Registered"
            })
        }
        //generate otp
        const otp=Math.floor(Math.random() * 9000) + 1000;
        //creating the generated otp entry in database
        console.log(email,otp);
        const dbresponse=await Otp.create({otp:otp,email:email});
        return res.status(200).json({
            success:true,
            message:"Otp is generated successfulty",
            otp,
        })    
    }catch(err){
        console.log("Error in otp generation"); 
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
};
//=========================function to signup functionality
async function handelSignUp(req,res){
    try{
        const {firstName,lastName,email,password,role,otp}=req.body;
        if(!firstName||!lastName||!email||!password||!role||!otp){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //checking whether already exists in database or not
        console.log(firstName,lastName,email,password,role,otp);
        const userExist=await User.find({email});
        console.log(userExist);
        if(userExist.length>0){
            return res.status(200).json({
                success:false,
                message:"User is already registered",
            })
        }
        //finding otp from database
        const otpDbResponse=await Otp.findOne({email}).sort({createdAt:-1}).limit(1);
        console.log(otpDbResponse);
        if(otpDbResponse.length==0){
            return res.status(404).json({
                success:false,
                message:"Otp not found",
            })
        }
        //cheking otp is correct or not
        else if(otpDbResponse.otp!=otp){
            return res.status(400).json({
                success:false,
                message:"Invalid Otp",
            })
        }
        //creating a profile for creating entry in User model
        // const profileDbResponse=await Profile.create({image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`});
        const profileDbResponse=await Profile.create({
            gender:null,
            dateOfBirth:null,
            contactNumber:null,
            about:null,
        })
        console.log("Profile Object is created",profileDbResponse);
        //hashing password
        const hashedPassword=await bcrypt.hash(password,10);
        //creating user in User model
        const user=await User.create({firstName,lastName,email,password:hashedPassword,role,profile:profileDbResponse._id,
        image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        fibt:null,
        });
        console.log("User object is created",user);
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        });
     
    }catch(err){
        console.log("Error in singup",err);
        return res.status(500).json({
            success:false,
            message:err
        })
    }
}
//===========================login function
async function handelLogin(req,res){
    try{
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"All fileds are required",
            })
        }
        console.log("Login:",email)
        const userExist=await User.findOne({email}).populate("profile").exec();
        if(!userExist){
            return res.status(404).json({
                success:false,
                message:"User is not Registered, First SignUp",
            })
        }
        console.log(userExist);
        if(await bcrypt.compare(password,userExist.password)){
            //creating a token
            const payload={
                email:userExist.email,
                id:userExist._id,
                role:userExist.role,
            };
            const token=jwt.sign(payload,process.env.JWT_SECRET_KEY||"menty@123");
            const user=userExist.toObject();
            user.token=token;
            user.password=null;
            //creating cookies
            const cookieOptions={
                expiresIn:new Date(Date.now()+1*24*60*60*100),
            }
            res.cookie("token",token,cookieOptions).status(200). json({
                success:true,
                message:"Login is Successful",
                user,
                token,
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            })
        }
    }catch(err){
        console.log("Error in Login");
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
async function handelStudentInfo(req,res){
    try{
        const {userId,std,rollnumber,field}=req.body;
        console.log(userId,std,field,rollnumber);
        if(!std||!field||!rollnumber){
            return res.status(400).json({
                success:false,
                message:"All fileds are required",
            });
        }
        const studentPresent=await Student.findOne({studentId:userId});
        if(studentPresent){
            return res.status(400).json({
                success:false,
                message:"Student details  already presernt required",
            });
        }
        const response=await Student.create({studentId:userId,std:std,field:field,rollnumber:rollnumber});
        console.log(response);
        const classDb=await Class.findOneAndUpdate({grade:std},{$push:{rollnumber:rollnumber}});
        if(!classDb){
            return res.status(400).json({
                success:false,
                message:"This class is not available",
            })
        }
        return res.status(200).json({
            success:true,
            message:"Studetn details are creates successfully",
            response,
        })
    }catch(err){
        console.log("Error in adding student detials",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
async function handelInstructorInfo(req,res){
    console.log("i am arrived there");
    try{
        const {userId,subjectSpecification,std}=req.body;
        console.log(userId,subjectSpecification,std);
        if(!userId||!subjectSpecification||std.length==0){
            return res.status(400).json({
                success:false,
                message:"All fileds are required",
            });
        }
        const instructorPresent=await Instructor.findOne({instructorId:userId});
        if(instructorPresent){
            return res.status(400).json({
                success:false,
                message:"Student details  already presernt required",
            });
        }
        const response=await Instructor.create({instructorId:userId,subjectSpecification:subjectSpecification,std:std});
        console.log(response);
        return res.status(200).json({
            success:true,
            message:"Studetn details are creates successfully",
            response,
        })
    }catch(err){
        console.log("Error in adding student detials",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

module.exports={handelSendOtp,handelSignUp,handelLogin,handelStudentInfo,handelInstructorInfo};