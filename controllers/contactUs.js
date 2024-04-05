const {mailSender}=require("../utils/mailSender");
require("dotenv").config();
async function handelContactUs(req,res){
    try{
        const {name,email,contactNumber,message}=req.body;
        console.log(name,email,contactNumber,message);
        if(!name||!email||!contactNumber||!message){
            return res.status(400).json({
                success:false,
                message:"All fileds are required",
            })
        }
        //sending mail to Edtech
        await mailSender(process.env.ADMIN_MAIL,`${name}  , ${email} , ${contactNumber} ,${message}`,`This is message from ${email}`);
        //sending confirmation emial that you message have been delivered
        await mailSender(email,"You message have been sent successfully","This is message from EdTech");
        return res.status(200).json({
            success:true,
            message:"contact info send successfully",
        })
    }catch(err){
        console.log("Error in sending contact info");
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
};
module.exports={handelContactUs};