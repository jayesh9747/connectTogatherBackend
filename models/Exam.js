const mongoose=require('mongoose');
const examSchema=new mongoose.Schema({
    SubjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subject",
    },
    grade:{
        type:String,
    },
    examName:{
        type:String,
    },
    totalMarks:{
        type:Number,
    },
    marksRecord:[
    ],
    
})
module.exports=mongoose.model("Exam",examSchema);