const mongoose=require("mongoose");

const studentSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    std:{ 
        type:String,
        required:true 
    },
    rollnumber:{
        type:Number,
        required:true,
    },
    field:{
        type:String,
        enum:["School Student","Dropper","College Student"]
    }
})


module.exports=mongoose.model("Student",studentSchema);