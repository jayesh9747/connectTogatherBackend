const Subject=require("../models/Subject");
async function createSubject(req,res){
    try{
        const {subjectName,grade}=req.body;
        if(!subjectName||!grade){
            return res.status(400).json({
                success:false,
                message:"Provide Subject Name",
            })
        }
        const subjectExist=await Subject.findOne({subjectName:subjectName});
        if(subjectExist){
            if(grade==subjectExist.grade){
                return res.status(400).json({
                    success:false,
                    message:"Subject for that grade already already",
                })
            }
        }
        const subjectDbResponse=await Subject.create({subjectName:subjectName,grade:grade});
        return res.status(200).json({
            success:true,
            message:"Subject is created successfully",
        })

    }catch(err){
        console.log("Error in creating subject");
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
};
async function addHomework(req,res){
    try{
        const {subjectId,homework}=req.body;
        const subjectDb=await Subject.findByIdAndUpdate({subjectId},{homework:homework});
        return res.status(200).json({
            success:true,
            message:"homework have been updated successfully",
        })
    }
    catch(err){
        console.log("error in adding homework");
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
};
async function fetchAllSubjectsByGrade(req,res){
    try{
        const {grade}=req.body;
        if(!grade){
            return res.status(400).json({
                success:false,
                message:"Complete all fileds",
            })
        }
        const subjectDb=await Subject.find({grade:grade});
        return res.status(200).json({
            success:true,
            subjectDb,
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

async function fetchAllSubject(req,res){
    try{
       const allSubject=await Subject.find();
       return res.status(200).json({
        success:true,
        data:allSubject,
        message:"all subject fetch successfully"
       })
    }catch(error){
        console.log("error in fetchin homework");
        return res.status(500).json({
            success:false,
            message:err.message,
        })

    }
}
module.exports={createSubject,addHomework,fetchAllSubject, fetchAllSubjectsByGrade};
