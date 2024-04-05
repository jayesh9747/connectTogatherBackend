const mongoose=require("mongoose")
const CalenderSchema=new mongoose.Schema(
      {"date":Number,
      "month":String,
      "year":Number,
      "event":String,
      "description":String,
      }
)
module.exports=mongoose.model("CalenderSchema",CalenderSchema);