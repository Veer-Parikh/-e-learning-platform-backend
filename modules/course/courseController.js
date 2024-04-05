const prisma = require("../../prisma")


async function createCourse(req,res) {
    try{
        const {title,description,category,level,fees,creatorId} = req.body
        const course = await prisma.course.create({
            data:{
                title,    
                description,  
                category,  
                level,  
                fees,
                creatorId
            },
        })
        .then(() => {
            console.log("cousrse saved successfully")
        })
        .catch((err) => {
            console.log("error in saving the user",err)
        })
        res.json(course)
    } catch(e) {
        console.log(e)
        res.send("error creating course")
    }
}

async function updateCourse(req,res) {
    const input = req.body
    try{
        const data ={}
        if (input.title) data.title = input.title;
        if (input.description) data.description = input.description;
        if (input.category) data.category = input.category;
        if (input.level) data.level = input.level;
        if (input.fees) data.fees = input.fees;

        const course = await prisma.course.update({
            where:{
                id:req.params.id
            },
            data:data
        })
        return res.status(200).send(course)
    } catch(e) {
        return res.status(400).send(err)
    }
}

async function deleteCourse(req,res) {
    try{
      const creator = await prisma.course.delete({
        where:{
          id: req.params.id
        }
      })
      if(!creator) return res.send("course does not exist")
      if(creator) return res.send("course deleted successfully")
    } catch(err) {
      res.status(400).send(err)
    }
  }

async function getCourses1(req,res) {
    try{
        const courses = await prisma.course.findMany({
            select:{
                title:true,
                description:true,
                level:true,
                fees:true,
                category:true,
                courseId:true
            }
        })
        return res.status(200).send(courses);
    } catch(e) {
        return res.status(400).send("no courses found")  
    }
}

async function getCourses2(req,res) {
    try{
        const courses = await prisma.course.findMany({
            select:{
                title:true,
                description:true,
                level:true,
                category:true
            }
        })
        return res.status(200).send(courses);
    } catch(e) {
        return res.status(400).send("no courses found")  
    }
}

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
        return res.status(200).send(courses);
    } catch (e) {
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
        return res.status(200).send(courses);
    } catch (e) {
        return res.status(400).send("No courses found for the specified level");
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
        return res.status(200).send(courses);
    } catch (e) {
        return res.status(400).send("No courses found for the specified fees");
    }
}


async function courseCategoryLevel(req,res) {
    const { category,level } = req.query;
    try {
        const courses = await prisma.course.findMany({
            where: {
                category:category,
                level:level
            },
            select: {
                title: true,
                description: true,
                level: true,
                fees: true,
                category: true
            }
        });
        return res.status(200).send(courses);
    } catch (e) {
        return res.status(400).send("No courses found for the specified filters");
    }
}

module.exports = {createCourse,updateCourse,deleteCourse,getCourses1,getCourses2,courseCategory,courseCategoryLevel,courseFees,courseLevel}