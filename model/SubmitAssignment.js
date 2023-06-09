const mongoose = require("mongoose");

const submitAssignmentSchema= new mongoose.Schema({
    assignmentId:{
        type:mongoose.Types.ObjectId,
        ref:"Assignment",
        required:true
    },
    answerList:[
       {
        type:String,
        required:true
       }
    ],
    studentId:{
            type:mongoose.Types.ObjectId,
            ref:"Student"
    },
    submitedAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports= mongoose.model("SubmitAssignment", submitAssignmentSchema);