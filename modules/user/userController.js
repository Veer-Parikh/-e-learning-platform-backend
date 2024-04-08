const bcrypt = require('bcrypt');
const prisma = require('../../prisma');
const { sendReg, sendLogin } = require('../../utils/resend');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const logger = require('../../utils/logger');

async function createUser(req, res) {
  try {
    const { username, firstName, lastName, email, password, bio } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        bio,
      },
    })
      .then((user) => {
        logger.info("User saved successfully");
        sendReg(email);
      })
      .catch((err) => {
        logger.error("Error in saving the user", err);
      });
    res.status(200).json(user);
  } catch (error) {
    logger.error(error);
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
        logger.fatal("incorrect passsword")
        res.status(400).send('Invalid password');
      }
    } else {
      logger.error("user not found")
      res.status(400).send('User not found');
    }
  } catch (err) {
    logger.error("Error logging in", err);
    res.status(500).send('An error occurred while logging in');
  }
}

async function myProfile(req, res) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id
      }
    });
    logger.info("User profile found successfully");
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
    logger.error(err);
  }
}

async function allUsers(req, res) {
  try {
    const { pagination } = req;
    const users = pagination.result; 
    logger.info("Users profile found successfully");
    return res.status(200).json(users);
  } catch (err) {
    logger.error(err);
    return res.status(500).send("Internal Server Error");
  }
}

async function user(req, res) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findFirst({ where: { id: id } })
    logger.info("User found");
    res.send(user);
  } catch (err) {
    res.send(err);
    logger.error(err);
  }
}

async function update(req, res) {
  const input = req.body;
  const id = req.user.id;
  try {
    const data = {};
    if (input.username) data.username = input.username;
    if (input.firstName) data.firstName = input.firstName;
    if (input.lastName) data.lastName = input.lastName;
    if (input.email) data.email = input.email;
    if (input.bio) data.bio = input.bio;

    const user = await prisma.user.update({
      where: {
        id: id
      },
      data: data
    });
    logger.info("User updated successfully");
    return res.status(200).send(user);
  } catch (err) {
    logger.error("Error updating course", err);
    return res.status(400).send(err);
  }
}

async function deleteUser(req, res) {
  try {
    const user = await prisma.user.delete({
      where: {
        id: req.user.id
      }
    });
    if (!user) {
      logger.error("User doesn't exist");
      return res.send("User does not exist");
    }
    if (user) {
      logger.info("User deleted successfully");
      return res.send("User deleted successfully");
    }
  } catch (err) {
    logger.error(err);
    res.status(400).send(err);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function profilepic(req, res) {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const profilePicUrl = result.secure_url;

    const user = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        pfp: profilePicUrl
      }
    });
    logger.info("picture uploaded");
    return res.send("Profile picture uploaded and saved.");
  } catch (error) {
    logger.error("Error uploading profile picture:", error);
    return res.status(400).send(error);
  }
}

const pagination = (model) =>{
  return async (req,res,next) => {
      const page = parseInt(req.query.page) || 1; // Default page is 1
      const limit = parseInt(req.query.limit) || 3; // Default limit is 3 because i have less users rn

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const result = {};

      if (endIndex < model.length) {
          result.next = {
              page: page + 1,
              limit: limit
          }
      }

      if (startIndex > 0) {
          result.previous = {
              page: page - 1,
              limit: limit
          }
      }

      try {
          result.result = await model.findMany({
            select:{
              username:true,
              email:true,
              bio:true,
              pfp:true,
              id:true
            },
            skip: startIndex,
            take: limit
          });
          req.pagination = result;
          next();
      } catch(e) {
          logger.error(e);
          return res.status(500).send("Internal Server Error");
      }
  }
}

module.exports = { createUser, loginUser, myProfile, allUsers, user, update, deleteUser, profilepic,pagination };
