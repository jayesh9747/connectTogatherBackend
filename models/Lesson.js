const mongoose=require("mongoose")
const lessonSchema=new mongoose.Schema({
   lessonName:{
    type:String,
    trim:true,
    required:true,
   },
   description:{
    type:String,
    trim:true,
    required:true,
   },
   videoFile:{
    type:String,
   }
});
module.exports=mongoose.model("Lesson",lessonSchema);