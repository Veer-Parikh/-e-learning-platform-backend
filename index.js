const express = require('express');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const cors = require('cors')
const bodyParser = require('body-parser')
const logger = require("./utils/logger")

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin:'*'
    })
)

app.use(express.json());
app.use(bodyParser.json());

// app.get('/', async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

const userRoutes = require('./modules/user/userRoute')
app.use('/user',userRoutes)

const superAdminRoutes = require('./modules/superAdmin/superAdminRoute')
app.use('/creator',superAdminRoutes)

const coursesRoutes = require('./modules/course/courseRoute')
app.use('/course',coursesRoutes)

const enrollmentRoutes = require('./modules/enrollment/enrollmentRoute')
app.use('/enroll',enrollmentRoutes)