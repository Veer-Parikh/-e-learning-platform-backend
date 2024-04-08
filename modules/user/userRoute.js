const express = require('express');
const router = express.Router();
const { createUser, loginUser,myProfile,allUsers,update,deleteUser,user,profilepic,pagination } = require('./userController');
const {authenticateToken} = require('../../middleware/auth');
const uploadMiddleware = require('../../middleware/multer');
const prisma = require("../../prisma")

router.post('/signup', createUser)
router.post('/login', loginUser)
router.get('/my',authenticateToken,myProfile)
router.get('/all',pagination(prisma.user),allUsers)
router.patch('/update',authenticateToken,update)
router.delete('/delete',authenticateToken,deleteUser)
router.get('/user/:id',authenticateToken,user)
router.post('/uploadpic',authenticateToken,uploadMiddleware.single('image'),profilepic)

module.exports = router;