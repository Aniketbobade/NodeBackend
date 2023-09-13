const Class = require("../model/Class");
const Student = require("../model/Student");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SubmitAssignment = require("../model/SubmitAssignment");
const Assignment = require("../model/Assignment");

exports.createStudent = async (req, res) => {
    try {
        const { firstName, lastName, email, password, classCode } = req.body;
        if (!firstName || !lastName || !email || !password || !classCode) {
            return res.status(400).json({
                success: false,
                message: "all fields requied"
            });
        }
        const isExist = await Student.findOne({email:email});

         if(isExist){
            return res.status(400).json({
                success:true,
                message:"you email already register"
            })
         }

        const classId = await Class.findOne({ classCode: classCode });
        // console.log("this is class id",classId);
        const getLastRollNo = await Student.findOne({ classId: classId._id }).sort('-rollNo').exec();
        // console.log(getLastRollNo);
        let maxRollno;
        
        if (getLastRollNo === null) {
            maxRollno = 1;
        } else {
            maxRollno = getLastRollNo.rollNo + 1;
        }
        // console.log(maxRollno);
        const hashPassword = await bcrypt.hash(password, 10);
        const studentDetails = await Student.create({
            firstName,
            lastName,
            rollNo: maxRollno,
            email,
            password: hashPassword,
            classId: classId._id
        });
        const addToClassList = await Class.findOneAndUpdate(
            { classCode },
            { $push: { students: studentDetails._id } },
            { new: true }
        );
        // console.log(addToClassList);
        return res.status(200).json({
            success: true,
            message: "Account create successfully",
            data: studentDetails
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message

        })
    }
}

exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            })
        }
        const user = await Student.findOne({ email: email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not register, please register"
            });
        }
        const passwordCheck = bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({
                success: false,
                message: "your password not match"
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            classId: user.classId
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        user.token = token;
        user.password = undefined;

        // create cookies
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "user login successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error.message
        })
    }
}

exports.getAssigmnent = async (req, res) => {
    try {
        const user = req.user;
        // console.log(user);
        result = await Assignment.find({ classes: user.classId }).select('subject listOfQuestions createdAt').
            populate({
                path: "createdBy",
                select: 'firstName lastName'
            }).exec();
        // console.log(result);
        return res.status(200).json({
            success: true,
            Data: result
        })
    } catch (error) {
        console.log(eror);
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error
        })
    }
}

exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId, answerList } = req.body;
        if (!assignmentId || !answerList) {
            return res.status(401).json({
                success: false,
                message: "please provide all fields"
            })
        }
        const student = req.user;
        // console.log("student", student);
        const existingSubmission = await SubmitAssignment.findOne({ studentId: student.id, assignmentId: assignmentId });

        
        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted the assignment."
            });
        }
        const result = await SubmitAssignment.create({
            assignmentId,
            answerList,
            studentId: student.id
        });

        return res.status(200).json({
            success: true,
            message: "Assigmnent submitted successfully",
            data: result
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