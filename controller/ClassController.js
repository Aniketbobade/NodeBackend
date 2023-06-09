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
