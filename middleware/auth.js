const jwt = require('jsonwebtoken');
const prisma = require("../prisma");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(400).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.Access_Token, async (err, decoded) => {
    if (err) {
      return res.status(400).send('');
    }
    try {
      const user = await prisma.user.findUnique({ where: { id: decoded._id } });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Error authenticating user:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
}

const authenticateTokenAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(400).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.Access_Token, async (err, decoded) => {
    if (err) {
      return res.status(400).send('');
    }
    try {
      const admin = await prisma.creator.findUnique({ where: { id: decoded._id } });
      if (!admin) {
        return res.status(400).json({ error: 'Admin not found' });
      }
      req.user = admin;
      next();
    } catch (error) {
      console.error('Error authenticating user:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
}

module.exports = {authenticateToken,authenticateTokenAdmin}
