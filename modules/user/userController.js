// userController.js
const bcrypt = require('bcrypt');
const prisma = require('../../prisma');
const {sendReg,sendLogin} = require('../../utils/resend');
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')

async function createUser(req, res) {
  try {
    const {username,firstName,lastName,email,password,bio} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username ,
        firstName ,
        lastName ,
        email ,
        password : hashedPassword,
        bio 
      },
    })
    .then((user)=>{
      console.log("user saved successfully")
      sendReg(email);
    })
    .catch((err)=>{
      console.log("err in saving the user",err)
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const existingUser = await prisma.user.findFirst({ where: { username: username } });

    if (existingUser) {
      const validPass = await bcrypt.compare(password, existingUser.password);
      if (validPass) {
        const token = jwt.sign({ _id: existingUser.id }, process.env.Access_Token); //, { expiresIn: '3h' }
        res.json(token);
        sendLogin();
      } else {
        res.status(400).send('Invalid password');
      }
    } else {
      res.status(400).send('User not found');
    }
  } catch (err) {
    console.error("Error logging in",err);
    res.status(500).send('An error occurred while logging in');
  }
}

async function myProfile(req,res) {
  try {
    const user = await prisma.user.findFirst({ 
      where:{
        _id:req.user.id
    }});
    res.send(user)
  } catch(err) {
    res.status(400).send(err)
    console.log(err)
  }
}

async function allUsers(req,res) {
  try{
    const users = await prisma.user.findMany({
      select:{
        username:true ,
        firstName:true,
        bio:true
    }})
    return res.status(200).send(users);
  } catch(err) {
    return res.status(400).send("no users found")
  }
}

async function user(req,res) {
  const {username} = req.params.username
  try{
    const user = await prisma.user.findFirst({ where: {username:username}})
    res.send(user);
  } catch(err){
    res.send(err)
  }
}
        
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const profilepic= async(req,res)=>{
  try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const profilePicUrl = result.secure_url;

      const user = await user.findById(req.user._id);
      user.profilePicUrl = profilePicUrl;
      await user.save();
      return res.send("Profile picture uploaded and saved.");
  } catch (error) {
      return res.status(500).send(error);
  }
}

module.exports = { createUser,loginUser,myProfile,allUsers,user,profilepic };
