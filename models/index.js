const Teacher = require('./teacher');
const Student = require('./student');
const Post = require('./post')

Teacher.hasMany(Student, {
    foreignKey: 'teacher_id',
})
Student.belongsToMany(Teacher, {
    foreignKey: 'teacher_id',
})
Student.hasMany(Post, {
    foreignKey: 'user_id'
})
Post.belongsTo(Student, {
    foreignKey: 'user_id'
})


module.exports= {
    Teacher,
    Student,
    Post
}