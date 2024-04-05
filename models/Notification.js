const mongoose=require("mongoose")

const notificationSchema=new mongoose.Schema({
    instructorId:{
        type:mongoose.Schema.Types.ObjectId
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId
    },
    doubtId:{
        type:mongoose.Schema.Types.ObjectId
    }

})

module.exports=mongoose.model("Notification",notificationSchema);