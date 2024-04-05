const mongoose=require("mongoose")
const BlogSchema=new mongoose.Schema(
      {"Number":Number,
            "Heading":String,
      "text":String,
      "LikeCount":Number
      }
)
module.exports=mongoose.model("devdynamo",BlogSchema);