const mongoose=require("mongoose");
const instructorSchema=new mongoose.Schema({
    instructorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    std:{
        type:[String],
        required:true
    },
    subjectSpecification:{ 
        type:String
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],
    liveStream:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"LiveStreaming"
        }
    ],
    follower:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student"
        } 
    ]
})


module.exports=mongoose.model("Instructor",instructorSchema);