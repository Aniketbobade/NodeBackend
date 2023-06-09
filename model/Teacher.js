const mongoose = require("mongoose");

const teacherScema = mongoose.Schema({
    id:{type:String, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    subject:{type:String, required:true},
    joinDate:{type:Date, default:Date.now(), require:true},
    classCodes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Class"
        }
    ]
});

module.exports= mongoose.model("Teacher", teacherScema);