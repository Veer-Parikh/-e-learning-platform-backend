const prisma = require("../../prisma")

async function createEnrollment(req, res) {
    try {
        const { courseCourseId } = req.params;
        const userId = req.user.id;

        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                courseCourseId,
                userId
            }
        });

        if (existingEnrollment) {
            return res.status(400).send("User is already enrolled in this course");
        }
        const enrollment = await prisma.enrollment.create({
            data: {
                courseCourseId,
                userId
            }
        });

        console.log("Enrolled successfully");
        return res.status(200).send(enrollment);
    } catch (error) {
        console.error("Error creating enrollment");
        return res.status(400).send("Could not create enrollment");
    }
}

async function deleteEnrollment(req,res) {
    try{
        const enrollment = await prisma.enrollment.delete({
          where:{
            userId:req.user.id 
          }
        })
        if(!enrollment) return res.send("enrollment does not exist")
        if(enrollment) return res.send("enrollment deleted successfully")
    } catch(err) {
        res.status(400).send(err)
    }
}

async function userEnrollments(req, res) {
    const { userId } = req.user.id;
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: {
                userId:userId
            },
            select: {
                courseCourseId:true,
                createdAt:true
            }
        });
        return res.status(200).send(enrollments);
    } catch (e) {
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
        return res.status(200).send(enrollments);
    } catch (e) {
        return res.status(400).send("No enrollments found for the specified course");
    }
}


module.exports = { createEnrollment,deleteEnrollment,userEnrollments,courseEnrollments }