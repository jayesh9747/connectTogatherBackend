const Class=require("../models/Class");
async function getAllStudents(req,res){
    try{
        const {grade}=req.body;
        const classDb=await Class.findOne({grade:grade});
        return res.status(200).json({
            success:true,
            message:"Detailed fetched successfully",
            classDb,
        })
    }
    catch(err){
        console.log("Error in fetching the class details",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
};
module.exports={getAllStudents};