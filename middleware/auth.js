const Student = require("../model/Student");
const Teacher = require("../model/Teacher");
const jwt= require("jsonwebtoken");

require("dotenv").config();

exports.isAuth= async(req, res, next)=>{
    try {
       
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"token not found"
            });
       }
       // if token found compare 
       try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user= decode;
    //    console.log(decode);
       } catch (error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"token is invalid"
        })
       }
       next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}

exports.isTeacher= async(req, res, next)=>{
    try {
        const user= req.user;
        const isPresent = await Teacher.findOne({_id:user.id});
        if(!isPresent){
            return res.status(401).json({
                success:false,
                message:"this is protected route for teacher only"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}

exports.isStudent = async(req, res, next)=>{
   try {
    const user= req.user;
    const isPresent = await Student.findById({_id:user.id});
    if(!isPresent){
        return res.status(401).json({
            success:false,
            message:"this is protected route only for student"
        })
    }
    next();
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"something went wrong",
        error:error.message
    })
   }
}