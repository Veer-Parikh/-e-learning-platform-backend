// userController.js
const bcrypt = require('bcrypt');
const prisma = require('../../prisma');
const {sendReg,sendLogin} = require('../../utils/resend');
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken');
const logger = require('../../utils/logger');

async function createCreator(req, res) {
  try {
    const {username,firstName,lastName,email,password,bio} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const creator = await prisma.creator.create({
      data: {
        username ,
        firstName ,
        lastName ,
        email ,
        password : hashedPassword,
        bio 
      },
    })
    .then(()=>{
      logger.info("user saved successfully")
      sendReg(email);
    })
    .catch((err)=>{
      logger.error("err in saving the creator",err)
    });
    res.status(200).json(creator);
  } catch (error) {
    logger.error(error);
    res.send(error);
  }
}

async function loginCreator(req, res) {
  try {
    const { username, password } = req.body;
    const existingCreator = await prisma.creator.findFirst({ where: { username: username } });

    if (existingCreator) {
      const validPass = await bcrypt.compare(password, existingCreator.password);
      if (validPass) {
        const token = jwt.sign({ _id: existingCreator.id }, process.env.Access_Token); //, { expiresIn: '3h' }
        res.json(token);
        sendLogin();
      } else {
        logger.fatal("invalid password")
        res.status(400).send('Invalid password');
      }
    } else {
      logger.error("creator not found")
      res.status(400).send('creator not found');
    }
  } catch (err) {
    logger.error("Error logging in",err);
    res.status(500).send('An error occurred while logging in');
  }
}

//get the creators profile
async function myCreatorProfile(req,res) {
  try {
    const creator = await prisma.creator.findFirst({ 
      where:{
        id:req.user.id
    }});
    logger.info("creator profile found successfully")
    res.send(creator)
  } catch(err) {
    res.status(400).send(err)
    logger.error(err)
  }
}

//you can get alll the creators profiles and this is kept without authentication so that all can see users but to open the specific creator you need to login
async function allCreators(req,res) {
  try{
    const creators = await prisma.creator.findMany({
      select:{
        username:true ,
        firstName:true,
        bio:true,
        id:true
      }
    })
    logger.info("creators profile found successfully")
    return res.status(200).send(creators);
  } catch(err) {
    logger.error(err)
    return res.status(400).send("no creators found")
  }
}

//endpoint to view specified creator profile
async function creator(req,res) {
  const {id} = req.params;
  try{
    const creator = await prisma.creator.findFirst({ where: {id:id}})
    logger.info("creator found")
    return res.status(200).send(creator);
  } catch(err){
    logger.error(err)
    return res.status(400).send(err)
  }
}

async function update(req,res) {
  const input = req.body
  const id = req.user.id
  try{
    const data = {};
    if (input.username) data.username = input.username;
    if (input.firstName) data.firstName = input.firstName;
    if (input.lastName) data.lastName = input.lastName;
    if (input.email) data.email = input.email;
    if (input.bio) data.bio = input.bio;

    const creator = await prisma.creator.update({
      where:{
        id:id
      },
      data:data
    })
    logger.info("creator updated successfully")
    return res.status(200).send(creator)
  } catch (err){
    logger.error("error updating course",err)
    return res.status(400).send(err)
  }
}

async function deleteCreator(req,res) {
  try{
    const creator = await prisma.creator.delete({
      where:{
        id: req.user.id
      }
    })
    if(!creator) {
      logger.error("user doesnt exist")
      return res.send("user does not exist")
    }
    if(creator){
      logger.info("user deletedd succesfully")
      return res.send("user deleted successfully")
    }
  } catch(err) {
    logger.error(err)
    res.status(400).send(err)
  }
}
        
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function profilepic (req, res) {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const profilePicUrl = result.secure_url;

    const user = await prisma.creator.update({
      where: {
        id: req.user.id
      },
      data: {
        pfp : profilePicUrl
      }
    });
    logger.info("picture uploaded")
    return res.send("Profile picture uploaded and saved.");
  } catch (error) {
    logger.error("Error uploading profile picture:", error);
    return res.status(400).send(error);
  }
}

const pagination = (model) => {
  return async (req, res, next) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const result = {};

      if (endIndex < (await prisma.model.countDocuments().exec())) {
          result.next = {
              page: page + 1,
              limit: limit
          };
      }
      if (startIndex > 0) {
          result.previous = {
              page: page - 1,
              limit: limit
          };
      }

      try {
          result.result = await prisma.model.find().limit(limit).skip(startIndex).exec();
          res.pagination = result;
          next();
      } catch (e) {
          logger.error(e);
          res.status(500).send(e);
      }
  };
};

module.exports = { createCreator,loginCreator,myCreatorProfile,allCreators,creator,update,deleteCreator,profilepic };
