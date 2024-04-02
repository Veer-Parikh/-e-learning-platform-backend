// userRoutes.js

const express = require('express');
const router = express.Router();
const { createUser, loginUser,myProfile,allUsers,update,deleteUser,user,profilepic } = require('../user/userController');
const authenticateToken = require('../../middleware/auth');
const uploadMiddleware = require('../../middleware/multer');

router.post('/users', createUser)
router.post('/login', loginUser)
router.get('/my',authenticateToken,myProfile)
router.get('/all',allUsers)
router.patch('/update',authenticateToken,update)
router.delete('/delete',authenticateToken,deleteUser)
router.get('/user',authenticateToken,user)
router.post('/uploadpic',authenticateToken,uploadMiddleware.single('image'),profilepic)

module.exports = router;
