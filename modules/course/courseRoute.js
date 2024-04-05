const {createCourse,updateCourse,deleteCourse,getCourses1,getCourses2,courseCategory,courseCategoryLevel,courseFees,courseLevel} = require("./courseController")
const express = require('express');
const router = express.Router();
const {authenticateToken,authenticateTokenAdmin} = require('../../middleware/auth');


router.post('/create',authenticateTokenAdmin,createCourse)
router.patch('/update/:id',authenticateTokenAdmin,updateCourse)
router.delete('/delete/:id',authenticateTokenAdmin,deleteCourse)
router.get('/all',authenticateToken,getCourses1)
router.get('/courses',getCourses2)
router.get('/category',authenticateToken,courseCategory)
router.get('/both',authenticateToken,courseCategoryLevel)
router.get('/fees',authenticateToken,courseFees)
router.get('/level',authenticateToken,courseLevel)

module.exports = router