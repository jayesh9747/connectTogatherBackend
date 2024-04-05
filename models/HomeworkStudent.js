const mongoose=require("mongoose");
const homeworkReviewSchema=new mongoose.Schema({
   rollnumber:{
    type:String,
   },
   date:{
    type:String, 
   },
   review:{
    type:String,
   }
});
module.exports=mongoose.model("HomeworkReview",homeworkReviewSchema);