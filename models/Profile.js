const mongoose=require("mongoose")

const profileSchema=new mongoose.Schema({
    dateOfBirth:{
        type:Date,
    },
    gender:{
        type:String,
    },
    contactNumber:{
        type:String,
        trim:true
    },
    about:{
        type:String,
        trim:true
    }

})

module.exports=mongoose.model("Profile",profileSchema);