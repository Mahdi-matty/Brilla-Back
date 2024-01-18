const Teacher = require('./Teacher');
const Student = require('./Student');
const Subject = require(`./Subject`);
const Topic = require(`./Topic`);
const Card = require('./Card')

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


// cards and students (viewers)

module.exports= {
    Teacher,
    Student,
    Card, 
    Subject,
    Topic
}