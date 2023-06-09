const mongoose = require("mongoose");

const studentScema = mongoose.Schema({
    rollNo:{type:Number, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true, unique: true},
    password:{type:String, required:true},
    classId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Class",
        required:true
    }
});

module.exports= mongoose.model("Student", studentScema);