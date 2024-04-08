const express = require('express');
const router = express.Router();
const { createCreator,loginCreator,myCreatorProfile,allCreators,creator,update,deleteCreator,profilepic, pagination } = require("./superAdminController");
const {authenticateToken,authenticateTokenAdmin} = require('../../middleware/auth');
const uploadMiddleware = require('../../middleware/multer');
const prisma = require("../../prisma")

router.post('/signup', createCreator)
router.post('/login', loginCreator)
router.get('/my',authenticateTokenAdmin,myCreatorProfile)
router.get('/all',pagination(prisma.creator),allCreators)
router.patch('/update',authenticateTokenAdmin,update)
router.delete('/delete',authenticateTokenAdmin,deleteCreator)
router.get('/creator/:id',authenticateToken,creator)
router.post('/uploadpic',authenticateTokenAdmin,uploadMiddleware.single('image'),profilepic)

module.exports = router;