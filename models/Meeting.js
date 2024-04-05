const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({

    "title":String,
    "description":String,
    "date":Date,
    "time":String,
    "g_meet":String
})

module.exports = mongoose.model('Meeting', MeetingSchema);


