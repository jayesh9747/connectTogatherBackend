const mongoose=require('mongoose');
const attendanceSchema=new mongoose.Schema({
    date:{
        type:String,
    },
    grade:{
       type:String,
    }, 
    presence:[],
    // rollnumber:{
    //     type:Number,
    // },
    // presence:{
    //     type:String,
    //     enum:["prensent","absent"],
    // }
})
module.exports=mongoose.model("Attendance",attendanceSchema);