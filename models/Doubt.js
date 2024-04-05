const mongoose=require("mongoose")
const doubtSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
    },
    file:{
        type:String,
        trim:true,
    },
    status:{
        type:String,
        enum:["solved","unsolved"],
    },
    description:{
        type:String,
        trim:true,
    }

})
module.exports=mongoose.model("Doubt",doubtSchema);