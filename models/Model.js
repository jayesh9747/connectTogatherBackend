const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
      msgtype:String,
      imagename:String,
      user:String,
      message: String,
      room:String,
      replyingto:String,
      replyingmsg:String,
      chatID:String
      });
const chatModel=mongoose.model('room1',chatSchema);
module.exports=chatModel;