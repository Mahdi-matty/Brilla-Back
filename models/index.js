const Teacher = require('./teacher');
const Student = require('./student');
const Subject = require(`./subject`);
const Topic = require('./topic');
const Card = require('./card')

// students and subjects
Student.hasMany(Subject, {
    onDelete: `CASCADE`
});
Subject.belongsTo(Student);

// subjects and topics
Subject.hasMany(Topic, {
    onDelete: `CASCADE`
});
Topic.belongsTo(Subject);

// topics and cards
Topic.hasMany(Card, {
    onDelete: `CASCADE`
});
Card.belongsTo(Topic);

// cards and students (creator)
Student.hasMany(Card, {
    onDelete: `CASCADE`
})
Card.belongsTo(Student);


module.exports= {
    Teacher,
    Student,
    Card, 
    Subject,
    Topic
}