const mongoose=require("mongoose");
const subjectSchema=new mongoose.Schema({
    subjectName:{
        type:String,
    },
    grade:{
       type:String,
       required:true,
    },
    homework:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Homework",
    },
    examType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Exam"
    },
})

module.exports=mongoose.model("Subject",subjectSchema);