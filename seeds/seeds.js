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
        title: `Coding Bootcamp`
    },
    {
        title: `Pop-Culture`
    },
];

const topicData = [
    {
        title: `Vanilla JavaScript`
    },
    {
        title: `REACT`
    },
    {
        title: `JavaScript`
    },
    {
        title: `Game of Thrones`
    },
    {
        title: `Star Wars`
    }
];

const cardData = [
    // JS Questions
    {
        title: `What is Vanilla JavaScript?`,
        content: `Vanilla JavaScript refers to the use of plain JavaScript without any additional libraries or frameworks.`,
        difficulty: 1,
    },
    {
        title: `What are the basic data types in JavaScript?`,
        content: `The basic data types in JavaScript are: string, number, boolean, null, undefined, and symbol (added in ES6).`,
        difficulty: 2,
    },
    {
        title: `How do you declare a variable in JavaScript?`,
        content: `Variables in JavaScript can be declared using the var, let, or const keywords, followed by the variable name.`,
        difficulty: 1,
    },
    {
        title: `What is the difference between let, const, and var in JavaScript?`,
        content: `var has function scope and can be redeclared and reassigned.

        let has block scope and can be reassigned but not redeclared.
        
        const has block scope and cannot be reassigned or redeclared.
        `,
        difficulty: 3,
    },
    {
        title: `How do you loop through an array in JavaScript?`,
        content: `You can loop through an array in JavaScript using a for loop, forEach() method, for...of loop, or map() method.`,
        difficulty: 3,
    },
    {
        title: `What is JavaScript mostly used for?`,
        content: `JS is primarily used for creating interactive web pages.`,
        difficulty: 1,
    },
    {
        title: `What is the difference between null and undefined?`,
        content: `null is an assignment value that represents the intentional absence of any object value, while undefined is a variable that has been declared but has not been assigned a value.`,
        difficulty: 3,
    },
    {
        title: `What is the difference between == and === in JavaScript?`,
        content: `The == operator compares the values for equality after performing type coercion, while the === operator compares the values for equality without performing type coercion.`,
        difficulty: 1,
    },
    {
        title: `What is a closure in JavaScript?`,
        content: `A closure is a function that has access to its own scope, the scope in which it was defined, and the scope of its parent function.`,
        difficulty: 3,
    },
    {
        title: `What is hoisting in JavaScript?`,
        content: `Hoisting is a JavaScript behavior where variable and function declarations are moved to the top of their containing scope during the compilation phase.`,
        difficulty: 3,
    },
    {
        title: `What is the event loop in JavaScript?`,
        content: `The event loop is a mechanism in JavaScript that allows asynchronous operations to be executed in a non-blocking manner, ensuring that the program remains responsive.`,
        difficulty: 2,
    },
    {
        title: `What is the difference between synchronous and asynchronous programming?`,
        content: `Synchronous programming executes code sequentially, blocking further execution until a task is completed. Asynchronous programming allows multiple tasks to be executed concurrently without blocking.`,
        difficulty: 2,
    },
    {
        title: `What is the purpose of the this keyword in JavaScript?`,
        content: `The this keyword refers to the object that is currently executing the code. Its value is determined by how a function is called`,
        difficulty: 1,
    },
    {
        title: `What is the difference between map() and forEach() array methods?`,
        content: `Both map() and forEach() iterate over an array, but map() returns a new array with the results of applying a provided function to each element, while forEach() does not return anything.`,
        difficulty: 2,
    },
    {
        title: `What is the difference between call() and apply() methods in JavaScript?`,
        content: `Both call() and apply() are used to invoke a function with a specified this value and arguments. The difference is in how the arguments are passed: call() accepts an argument list, while apply() accepts an array of arguments.`,
        difficulty: 3,
    },
    {
        title: `What is the purpose of the bind() method in JavaScript?`,
        content: `The bind() method creates a new function that, when called, has its this keyword set to a specified value. It is often used to bind a function to a specific context.`,
        difficulty: 3,
    },
    {
        title: `What is event delegation in JavaScript?`,
        content: `Event delegation is a technique where you attach an event listener to a parent element instead of individual child elements. This allows you to handle events on dynamically added elements.`,
        difficulty: 2,
    },
    {
        title: `What are arrow functions in JavaScript?`,
        content: `Arrow functions are a concise syntax for writing function expressions in JavaScript. They have a shorter syntax and do not bind their own this value, arguments, or super keywords.`,
        difficulty: 1,
    },
    {
        title: `What is a callback function in JavaScript?`,
        content: `A callback function is a function that is passed as an argument to another function and is invoked at a later point in time.`,
        difficulty: 1,
    },
    {
        title: `What is the purpose of the typeof operator in JavaScript?`,
        content: `The typeof operator is used to determine the data type of a value or variable.`,
        difficulty: 1,
    },
    // REACT Questions
    // GOT Questions
    {
        title: `Who is the author of the "A Song of Ice and Fire" book series, which inspired the Game of Thrones TV show?`,
        content: `George R.R. Martin`,
        difficulty: 2,
    },
    {
        title: `Which noble family rules the North of Westeros in Game of Thrones?`,
        content: `House Stark.`,
        difficulty: 1,
    },
    {
        title: `What is the name of Daenerys Targaryen's three dragons?`,
        content: `Drogon, Rhaegal, and Viserion.`,
        difficulty: 3,
    },
    {
        title: `Who is the character known as the "Three-Eyed Raven" in Game of Thrones?`,
        content: `Bran Stark`,
        difficulty: 2,
    },
    {
        title: `What is the name of the capital city of Westeros in Game of Thrones?`,
        content: `King's Landing`,
        difficulty: 1,
    },
]

//Encrypt seeded user passwords
const bcrypt = require("bcryptjs");

for (let studentObj of studentData) {
    studentObj.password = bcrypt.hashSync(studentObj.password, 6)
};

// Seeds Function 
const seedMe = async () => {
    await sequelize.sync({ force: true });
    const dbStudents = await Student.bulkCreate(studentData);
    const dbSubjects = await Subject.bulkCreate(subjectData);
    const dbTopics = await Topic.bulkCreate(topicData);
    const dbCards = await Card.bulkCreate(cardData);
    // add relationships between the data
    await dbStudents[0].addSubjects([1, 3]); 
    await dbStudents[1].addSubject([2]); 
    await dbSubjects[0].addTopics([1, 2]);
    await dbSubjects[1].addTopics([3]);
    await dbSubjects[2].addTopics([4, 5]);
    console.log(`Seeding completed :)`);
    process.exit(0)
};

//call the function
seedMe();