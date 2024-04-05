const mongoose=require('mongoose');
const classSchema=new mongoose.Schema({
    grade:{
        type:String,
    },
    rollnumber:[
        {type:Number},
    ]
});
module.exports=mongoose.model("Class",classSchema);