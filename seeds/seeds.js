// Import the models
const {Card, Student, Subject, Teacher, Topic} = require(`../models`);

//Require sequelize through the connection file
const sequelize = require(`../config/connection`);

// Add Data
const studentData = [
    {
    username: `David`,
    password: `password`,
    email: `santiago1.dsrr@gmail.com`
    },
    {
    username: `Mahdi`,
    password: `password`,
    email: `mmiq69@gmail.com`
    },
];

const subjectData = [
    {
        title: `Full-Stack Developer`
    },
    {
        title: `Pop-Culture`
    },
];

const topicData = [
    {
                
    }
]

//Encrypt seeded user passwords
const bcrypt = require("bcryptjs");

for (let studentObj of studentData) {
    studentObj.password = bcrypt.hashSync(studentObj.password, 6)
};

// Seeds Function 
const seedMe = async () => {
    await sequelize.sync({ force: false });
    const dbStudents = await Student.bulkCreate(studentData);
    const dbSubjects = await Subject.bulkCreate(subjectData);
    const dbTopics = await Topic.bulkCreate(topicData)
    console.log(`Seeding completed :)`);
    process.exit(0)
};

//call the function
seedMe();