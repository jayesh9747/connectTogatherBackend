const mongoose = require("mongoose");

const testScoreSchema = new mongoose.Schema({
      Studentid:{
            type:mongoose.Types.ObjectId,
            ref:"Student",
            required:true
      },
    score:{
      type:Number,
      required:true,
      default:0
    },
    totalScore:{
      type:Number,
      required:true,
      default:10
    },
    dates:{
      type:Date,
      default:Date.now()
    }
});
module.exports = mongoose.model("testScore", testScoreSchema);
