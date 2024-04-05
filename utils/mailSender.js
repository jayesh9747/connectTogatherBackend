const nodemailer=require("nodemailer");
require("dotenv").config();

const mailSender=async (email,title,body)=>{
      try{
        let transporter = nodemailer.createTransport(
            {
                host:process.env.MAIL_HOST,
                auth:{
                    user:process.env.MAIL_USER,
                    pass:process.env.MAIL_PASS
                }
            }
        )
        const info = await transporter.sendMail({
            from:"Menty One-to-One Doubt Solving",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log("Info of Mail Sender: ",info);
        return info;

      }catch(error){
         console.log("Error in sending mail: ",error);
      }
};
module.exports={mailSender};