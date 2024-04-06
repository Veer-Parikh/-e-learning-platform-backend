const prisma = require("../../prisma");
const logger = require("../../utils/logger");

async function createEnrollment(req, res) {
    try {
        const userId = req.user.id;
        const courseCourseId = req.params.courseCourseId

        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                courseCourseId,
                userId
            }
        });

        if (existingEnrollment) {
            logger.error("User Already exits")
            return res.status(400).send("User is already enrolled in this course");
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                courseCourseId,
                userId
            }
        });

        logger.info("Enrolled successfully");
        return res.status(200).send(enrollment);
    } catch (error) {
        logger.error("Error creating enrollment", error);
        return res.status(400).send("Could not create enrollment");
    }
}



async function deleteEnrollment(req,res) {
    try{
        const enrollment = await prisma.enrollment.delete({
          where:{
            userId:req.user.id,
            enrollmentId:req.body.enrollmentId
          }
        })
        if(!enrollment) {
            logger.error("enrollment does not exist")    
            return res.send("enrollment does not exist")
        }
        if(enrollment) {
            logger.info("enrollment deleted successfully")
            return res.send("enrollment deleted successfully")
        }
    } catch(err) {
        res.status(400).send(err)
        logger.error(err)
    }
}

async function userEnrollments(req, res) {
    const userId  = req.user.id;
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId:userId
            },
            select: {
                courseCourseId:true,
                userId:true,
                createdAt:true
            }
        });
        logger.info("user enrollments found successfully")
        return res.status(200).send(enrollments);
    } catch (e) {
        logger.error("no enrollments found for the specified user")
        return res.status(400).send("No enrollments found for the specified user");
    }
}

async function courseEnrollments(req, res) {
    const { courseCourseId } = req.params 
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: {
                courseCourseId:courseCourseId
            },
            select: {
                userId:true,
                createdAt:true
            }
        });
        logger.info("course enrollments found successfully")
        return res.status(200).send(enrollments);
    } catch (e) {
        logger.error("no enrollments found for the speicified course")
        return res.status(400).send("No enrollments found for the specified course");
    }
}


module.exports = { createEnrollment,deleteEnrollment,userEnrollments,courseEnrollments }