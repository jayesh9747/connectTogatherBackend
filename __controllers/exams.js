const Exam=require("../models/Exam");
const Subject=require("../models/Subject");
const mongoose=require('mongoose');
async function creatingExam(req,res){
    try{
        const {subjectId,examName,totalMarks,grade}=req.body;
        if(!subjectId||!examName||!totalMarks||!grade){
            return res.status(400).json({
                success:false,
                message:"provide all fields",
            })
        }
        const subId=new mongoose.Types.ObjectId(subjectId);
        const examDb=await Exam.create({SubjectId:subId,examName:examName,totalMarks:totalMarks,grade:grade});
        return res.status(200).json({
            success:true,
            message:"Exam have been created successfully",
        })
    }
    catch(err){
        console.log("error in creating a exam",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
};
async function addingMarks(req,res){
    try{
        const {examId,record}=req.body;
        console.log(examId,record);
        const examDb=await Exam.findByIdAndUpdate(examId,{marksRecord:record},{new:true});
        if(!examDb){
            return res.status(400).json({
                success:false,
                message:"Exam with this given id is not present",
            })
        }
        // console.log(examDb);
        return res.status(200).json({
            success:true,
            examDb,
        })
    }
    catch(err){
        console.log("error in adding marks",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
//display all exams
async function dispalyAllExamByClass(req,res){
    try{
        const {grade}=req.body;
        if(!grade){
            return res.status(400).json({
                success:false,
                message:"Require all fields",
            })
        }
        const ExamDb=await Exam.find({grade:grade}).populate("SubjectId");
        // console.log(ExamDb);
        return res.status(200).json({
            success:true,
            ExamDb,
        })
    }
    catch(err){
        console.log("Error in fetching exam by grade",err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
module.exports={creatingExam,addingMarks,dispalyAllExamByClass};