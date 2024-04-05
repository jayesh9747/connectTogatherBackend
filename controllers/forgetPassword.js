const User=require("../models/User");
const {mailSender}=require("../utils/mailSender");
const bcrypt=require('bcrypt');
const uuid = require('uuid');
require("dotenv").config();
//creating a unique token;
async function handelResetPasswordToken(req,res){
    try{
        const {email}=req.body;
        // console.log(email);
        const uuid4 = uuid.v4()
        const existUser=await User.findOne({email});
         if(!existUser){
            return res.status(400).json({
                success:false,
                message:"User doesnot exists",
            })
         }
        //creating a unique token or frontend url
        const token=uuid4;
        const user=await User.findOneAndUpdate({email},{resetPasswordToken:token,
            resetPasswordTokenExpiresAt:Date.now()+5*60*1000}); 
        let url=process.env.FRONTEND_URL;
        url +="/reset-password/"+token;
        // console.log("This is url to reset your password",url);
        await mailSender(email,url,"Url to reset password");
        return res.status(200).json({
            success:true,
            message:"Token Url is generated and Send on Email successfully"
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
//functiont ochange and reset password
async function handelResetPassword(req,res){
    try{
       const {newPassword,token}=req.body;
       console.log(newPassword,token);
       //here is anoce thing since token is also valid therefore token will be used to query as primary insted of email
       const userExist=await User.findOne({resetPasswordToken:token});
       console.log(userExist);
       if(!userExist){
        return res.status(400).json({
            success:false,
            message:"No user exist for given token",
        })
       }
       //chacking if token expored or not
       if(userExist.resetPasswordTokenExpiresAt<Date.now()){
        console.log("token has been expired");
            return res.status(400).json({
            success:false,
            message:"Token has been expired",
        })
       }
       const hashedPassword=await bcrypt.hash(newPassword,10);
       const updatedUser=await User.findOneAndUpdate({resetPasswordToken:token},{password:newPassword},{new:true});
       return res.status(200).json({
        success:true,
        message:"Password has been updates successfully",
       })

    }catch(err){
        console.log("Error in forget password");
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
};
module.exports={handelResetPassword,handelResetPasswordToken};