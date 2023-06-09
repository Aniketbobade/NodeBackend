const express = require("express");

const router= express.Router();

const {createStudent, 
        studentLogin,
        getAssigmnent,
        submitAssignment}= require("../controller/StudentController");
const {createClass}= require("../controller/ClassController");
const {createTeacher
     ,teacherLogin, 
      createAssignment, 
      addClass,
      getAllSubmitAssignment}= require("../controller/TeacherController");

// middleware 
const {isAuth, isStudent, isTeacher} = require("../middleware/auth");

// all below class routes
router.post("/class/createClass", createClass);


// all below Student
router.post("/student/createStudent",createStudent );
router.get("/student/login", studentLogin);
router.get("/student/assignment",isAuth,isStudent,getAssigmnent);
router.post("/student/submitAssignment", isAuth, isStudent, submitAssignment);

// all below Teacher Routes
router.post("/teacher/createTeacher", createTeacher);
router.get("/teacher/login", teacherLogin);
router.post("/teacher/addClass",isAuth, isTeacher, addClass);
router.get("/teacher/createAssignment", isAuth,isTeacher, createAssignment);
router.get("/teacher/getList", isAuth,isTeacher, getAllSubmitAssignment);

module.exports= router;