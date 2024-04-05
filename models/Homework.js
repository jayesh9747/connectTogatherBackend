const mongoose=require("mongoose");
const homeworkSchema=new mongoose.Schema({
    subjectName:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"Subject",
    },
    grade:{
        type:String,
    },
    question:{
        type:String,
    },
    date:{
        type:String,
    }
});
module.exports=mongoose.model("Homework",homeworkSchema);