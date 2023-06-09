const Class = require("../model/Class");

exports.createClass= async(req, res)=>{
    try {
        const{classCode}= req.body;
        // console.log(classCode);
        const isExist = await Class.findOne({classCode:classCode});
        if(isExist){
            return res.status(400).json({
                success:false,
                message:"class code already present"
            })
        } 
        if(!classCode){
            return res.status(400).json({
                success:false,
                message:"Please provide class Name"
            })
        }
        const result= await Class.create({classCode});
        return res.status(200).json({
            success:true,
            message:"Class created successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}

exports.getClassList= async(req, res)=>{
    try {
        const list= await Class.find({}).select('classCode').exec();
        return res.status(200).json({
            success:true,
            list:list
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error
        })
    }
}

exports.getStudentList= async(req, res)=>{
    try {
        const {classCode}= req.body;
        if(!classCode){
            return res.status(401).json({
                success:false,
                message:"Please provide classCode"
            })
        }
        const list = await Class.find({classCode:classCode}).select('students').populate({
            path:"students",
            select:'firstName lastName emailId'
        });
        return res.status(200).json({
            success:true,
            list:list
        })
    } catch (error) {
        
    }
}
