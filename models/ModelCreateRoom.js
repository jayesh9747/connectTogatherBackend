const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
      room:{type:String,unique:true}
      });
const roomModel=mongoose.model('roomCollection',RoomSchema);
module.exports=roomModel;