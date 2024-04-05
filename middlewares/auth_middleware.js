const jwt=require('jsonwebtoken');
require("dotenv").config();
//check for authentication
async function isAuth(req,res,next){
    try{
        console.log(req);
        const token=req.cookies.token||req.body.token||req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token is not available",
            })
        }
        try{
        const payload=jwt.verify(token,process.env.JWT_SECRET_KEY);
        // console.log("This is payload from user",payload);
        //----------------------------
        req.user=payload;
        //----------------------------
        }catch(err){
            console.log("Eroor in verifying token",err.message);
            return res.status(400).json({
                success:false,
                message:err
            })
        }
        next();
    }catch(err){
        console.log("Error in isAuth middlewares");
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
//is Student verification
async function isStudent(req,res,next){
    try{
       if(req.user.role!="Student"){
            return res.status(400).json({
                success:false,
                message:"Not Authorised for Student Route",
            })
       }
       next();
    }catch(err){
        console.log("Error in student authorization");
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
//is Teacher verification
async function isInstructor(req,res,next){
    try{
       if(req.user.role!="Instructor"){
            return res.status(400).json({
                success:false,
                message:"Not Authorised for Instructor Route",
            })
       }
       next();
    }catch(err){
        console.log("Error in instructor authorization");
        return res.status(500).json({
            success:false,
            message:err
        })
    }
}
//is admin verification
async function isAdmin(req,res,next){
    try{
       if(req.user.role!="admin"){
            return res.status(400).json({
                success:false,
                message:"Not Authorised for Admin Route",
            })
       }
       next();
    }catch(err){
        console.log("Error in Admin authorization");
        return res.status(500).json({
            success:false,
            message:err
        })
    }
}
module.exports={isAuth,isAdmin,isInstructor,isStudent};