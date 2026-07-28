const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    name: String,
    email: String,
    phone: String,
    age: Number,
    password: String,
    gender: String,
    qualification: String,
    course: String,
    subject: String,
    address: String,
    skills: [String]

});

module.exports = mongoose.model("Student", studentSchema);

