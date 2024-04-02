// userRoutes.js

const express = require('express');
const router = express.Router();
const { createUser, loginUser,myProfile,allUsers,user,profilepic } = require('../user/userController');
const {authenticatetoken} = require('../../middleware/auth')

router.post('/users', createUser)
router.post('/login', loginUser)
router.get('/my',authenticatetoken,myProfile)
router.get('/all',allUsers)
router.get('/user',authenticatetoken,user)
router.post('/uploadpic',authenticatetoken,upload.single('image'),profilepic)

module.exports = router;
