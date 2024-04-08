const prisma = require("../../prisma");
const logger = require("../../utils/logger");

async function createCourse(req, res) {
    try {
        const { title, description, category, level, fees, creatorId } = req.body;
        const course = await prisma.course.create({
            data: {
                title,
                description,
                category,
                level,
                fees,
                creatorId
            },
        });
        logger.info("Course saved successfully");
        return res.json(course);
    } catch (error) {
        logger.error("Error creating course:", error);
        return res.status(400).send("Error creating course");
    }
}

async function updateCourse(req, res) {
    const input = req.body;
    try {
        const data = {};
        if (input.title) data.title = input.title;
        if (input.description) data.description = input.description;
        if (input.category) data.category = input.category;
        if (input.level) data.level = input.level;
        if (input.fees) data.fees = input.fees;

        const course = await prisma.course.update({
            where: {
                id: req.params.id
            },
            data: data
        });
        logger.info("Course updated successfully");
        return res.status(200).send(course);
    } catch (error) {
        logger.error("Error updating course:", error);
        return res.status(400).send(error);
    }
}

async function deleteCourse(req, res) {
    try {
        const creator = await prisma.course.delete({
            where: {
                id: req.params.id
            }
        });
        if (!creator) return res.send("Course does not exist");
        if (creator) return res.send("Course deleted successfully");
    } catch (error) {
        logger.error("Error deleting course:", error);
        return res.status(400).send(error);
    }
}

async function getCourses1(req, res) {
    try {
        const { pagination1 } = req;
        const courses = pagination1.result;
        logger.info("Courses fetched successfully");
        return res.status(200).json(courses);
    } catch (error) {
        logger.error("Error fetching courses:", error);
        return res.status(500).send("Internal Server Error");
    }
}

const pagination1 = (model) => {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const limit = parseInt(req.query.limit) || 3; // Default limit is 3

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {};

        if (endIndex < model.length) {
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
            result.result = await model.findMany({
                select: {
                    title: true,
                    description: true,
                    level: true,
                    fees: true,
                    category: true,
                    courseId: true
                },
                skip: startIndex,
                take: limit
            });
            req.pagination1 = result;
            next();
        } catch (e) {
            logger.error(e);
            return res.status(500).send("Internal Server Error");
        }
    };
};

async function getCourses2(req, res) {
    try {
        const { pagination2 } = req;
        const courses = pagination2.result;
        logger.info("Courses fetched successfully");
        return res.status(200).json(courses);
    } catch (error) {
        logger.error("Error fetching courses:", error);
        return res.status(500).send("Internal Server Error");
    }
}


const pagination2 = (model) => {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const limit = parseInt(req.query.limit) || 3; // Default limit is 3

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {};

        if (endIndex < model.length) {
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
            result.result = await model.findMany({
                select: {
                    title: true,
                    description: true,
                    level: true,
                    category: true
                },
                skip: startIndex,
                take: limit
            });
            req.pagination2 = result;
            next();
        } catch (e) {
            logger.error(e);
            return res.status(500).send("Internal Server Error");
        }
    };
};

async function courseCategory(req, res) {
    const { category } = req.query;
    try {
        const courses = await prisma.course.findMany({
            where: {
                category: category
            },
            select: {
                title: true,
                description: true,
                level: true,
                fees: true,
                category: true
            }
        });
        logger.info("Courses fetched successfully");
        return res.status(200).send(courses);
    } catch (error) {
        logger.error("Error fetching courses:", error);
        return res.status(400).send("No courses found for the specified category");
    }
}

async function courseLevel(req, res) {
    const { level } = req.query;
    try {
        const courses = await prisma.course.findMany({
            where: {
                level: level
            },
            select: {
                title: true,
                description: true,
                level: true,
                fees: true,
                category: true
            }
        });
        logger.info("Courses fetched successfully");
        return res.status(200).send(courses);
    } catch (error) {
        logger.error("Error fetching courses:", error);
        return res.status(400).send("No courses found for the specified level");
    }
}

async function courseCategoryLevel(req, res) {
    const { category, level } = req.query;
    try {
        const courses = await prisma.course.findMany({
            where: {
                category: category,
                level: level
            },
            select: {
                title: true,
                description: true,
                level: true,
                fees: true,
                category: true
            }
        });
        logger.info("Courses fetched successfully");
        return res.status(200).send(courses);
    } catch (error) {
        logger.error("Error fetching courses:", error);
        return res.status(400).send("No courses found for the specified filters");
    }
}

async function courseFees(req, res) {
    const { fees } = req.query;
    try {
        const courses = await prisma.course.findMany({
            where: {
                fees: {
                    lte: parseFloat(fees)
                }
            },
            select: {
                title: true,
                description: true,
                level: true,
                fees: true,
                category: true
            }
        });
        logger.info("Courses fetched successfully");
        return res.status(200).send(courses);
    } catch (error) {
        logger.error("Error fetching courses:", error);
        return res.status(400).send("No courses found for the specified fees");
    }
}
module.exports = {createCourse,updateCourse,deleteCourse,getCourses1,pagination1,getCourses2,pagination2,courseCategory,courseCategoryLevel,courseFees,courseLevel}