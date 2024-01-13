const Teacher = require('./teacher');
const Student = require('./student');

Teacher.hasMany(Student, {
    foreignKey: 'teacher_id',
})
Student.belongsToMany(Teacher, {
    foreignKey: 'teacher_id',
})


module.exports= {
    Teacher,
    Student
}