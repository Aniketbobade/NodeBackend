const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    classes :[
        {type:mongoose.Types.ObjectId,
        ref:"Class"
        }
    ],
    subject:{
        type:String,
        required:true
    },
    listOfQuestions :[{
        type:String,
        required:true
    }],
    createdBy :{
        type: mongoose.Types.ObjectId,
        ref:"Teacher",
        required:true
    },
    createdAt :{
        type: Date,
        default:Date.now()
    },
    submitedStudent:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Student"
        }
    ]
})


module.exports= mongoose.model("Assignment", assignmentSchema);
