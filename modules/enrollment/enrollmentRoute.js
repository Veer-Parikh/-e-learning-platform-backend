const {createEnrollment,deleteEnrollment,userEnrollments,courseEnrollments} = require("./enrollmentController")
const express = require('express');
const router = express.Router();
const {authenticateToken,authenticateTokenAdmin} = require('../../middleware/auth');

router.post('/create/:courseCourseId',authenticateToken,createEnrollment)
router.delete('/delete',authenticateToken,deleteEnrollment)
router.get('/user',authenticateToken,userEnrollments)
router.get('/course/:courseCourseId',authenticateTokenAdmin,courseEnrollments)

module.exports = router