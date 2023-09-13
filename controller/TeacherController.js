const Teacher = require("../model/Teacher");
const generateCode= require("../functions/basicFunctions");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const Assignment = require("../model/Assignment");
const Class = require("../model/Class");
const SubmitAssignment = require("../model/SubmitAssignment");
require("dotenv").config();


exports.createTeacher= async(req, res)=>{
    try {
        const{firstName, lastName, password, email, subject }= req.body;
        if(!firstName || !lastName || !password || !email || ! subject){
            return res.status(400).json({
                success:false,
                message:"Please provide all fields"
            })
        }
        const userExist= await Teacher.findOne({email:email});
        if(userExist){
            return res.status(401).json({
                success:false,
                message:"your email all ready present"
            })
        }
        const hashPassword = await bcrypt.hash(password,10);
        const id= generateCode(subject);

        const result= await Teacher.create({
            firstName,
            lastName,
            email,
            password:hashPassword,
            subject,
            id:id
        });
        return res.status(200).json({
            success:true,
            message:"Account created successfully",
            data:result
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error.message
            
        });
    }
}

exports.teacherLogin= async(req, res)=>{
    try {
        const {email, password}= req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide all fields"
            })
        }
        const user= await Teacher.findOne({email:email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not register, please register"
            });
        }
        const passwordCheck= bcrypt.compare(password, user.password);
        if(!passwordCheck){
            return res.status(400).json({
                success:false,
                message:"your password not match"
            })
        }
        const payload={
            email:user.email,
            id:user._id
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET);

        user.token=token;
        user.password= undefined;

        // create cookies
        const options={
            expires: new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly:true
        }

        // res.set("Authorization", `Bearer ${token}`).status(200).json({
        //     success: true,
        //     token,
        //     user,
        //     message: "User logged in successfully",
        //   });

        res.cookie("token", token, options).status(200).json({
            success:true,
            token,
            user,
            message:"user login successfully"
        });

        
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}

exports.addClass = async(req ,res)=>{
    try {
        const{classCode}= req.body;
        const user= req.user;
        // console.log("user is ",user);
        if(!classCode){
            return res.status(200).json({
                success:false,
                message:"Please provide class code"
            })
        }
        const classes = await Class.find({classCode});
        // console.log("classes", classes);
        const classIdObj= [];
        classes.forEach((oneClass)=>{
                classIdObj.push(oneClass._id);
        });
        const arr=classIdObj.map((id) => id.toString());
        // console.log("arr", arr);
        const result = await Teacher.findOneAndUpdate(
            {email:user.email},
            {
               $set:{classCodes:classIdObj}
            },
            {new:true}
        ).populate("classCodes").exec();
        classCode.map( async(test)=>{
            // console.log("inside map", test);
            const addToClassList= await Class.findOneAndUpdate(
                {classCode:test},
                {$push: {teachers:result._id}},
                {new:true}
            )
            console.log(addToClassList);
        });
        return res.status(200).json({
            success:true,
            message:"classes added successfully",
            data:result
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            success:false,
            message:"something went wrong",
            error:error.message
        })
    }
}

exports.createAssignment = async(req, res)=>{
    try {
       const {classes, listOfQuestions}= req.body;
       if(!classes || !listOfQuestions){
        return res.status(200).json({
            success:false,
            message:"please provide all fields"
        })
       }
       const user=req.user;
    //    checking is teacher belong to that class or not
       const isTeacherAllow = await Teacher.findOne(
        {_id:user.id,classCodes:{$all:classes}}
       );
       if(!isTeacherAllow){
        return res.status(400).json({
            success:false, 
            message:"you don't have permission to access mention class"
        })
       }

       const result = await Assignment.create({
        classes,
        subject:isTeacherAllow.subject,
        listOfQuestions,
        createdBy:user.id
       });
       return res.status(200).json({
        success:true,
        message:"assignment added successfully",
        data:result
       })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error.message

        })
    }
}

exports.getAllSubmitAssignment= async(req, res)=>{
    try {
        const {assignmentId}= req.body;
        if(!assignmentId){
            return res.status(400).json({
                success:false,
                message:"Please provide all fields"
            })
        }
        const list= await SubmitAssignment.find({assignmentId}).populate(
            {path:'studentId',
            select:'rollNo firstName lastName'}
        ).select('answerList submitedAt').exec();
        return res.status(200).json({
            success:true,
            data:list
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error
        })
    }
}

