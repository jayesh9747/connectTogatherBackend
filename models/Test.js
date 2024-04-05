const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
    question: {
        type: String,
    },
    options: {
        type: [String]
    },
    answer: {
        type: Number,
    }
});

module.exports = mongoose.model("testquestion", TestSchema);
