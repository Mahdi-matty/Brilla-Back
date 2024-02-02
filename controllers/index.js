const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const withTokenAuth = require('../middleware/withTokenAuth');
const { Topic, Teacher, Subject, Student, Card } = require(`../models`);
const transporter = require(`../helpers/mailer`)
require('dotenv').config();

router.get("/",(req,res)=>{
     res.send(`Hi`)   
});

const studentRoutes = require('./studentRoutes');
router.use('/api/students', studentRoutes);

const teacherRoutes = require('./teacherRoutes');
router.use('/api/teachers', teacherRoutes);

const cardRoutes = require('./cardRoutes');
router.use('/api/cards', cardRoutes);

const subjectRoutes = require(`./subjectRoutes`);
router.use(`/api/subjects`, subjectRoutes);

const topicRoutes = require(`./topicRoutes`);
router.use(`/api/topics`, topicRoutes)

// get token info
router.get(`/test`, (req, res) => {
     res.send(`route is working`)
});

// send email - test route - sendgrid


// send email - test route
// router.get(`api/send-email/:email`, withTokenAuth, (req, res) => {
//      transporter.sendMail({
//           from: process.env.EMAIL,
//           to: req.params.email,
//           subject: `Test Email`,
//           body:`this is a test email`
//      });
//      res.status(200).json({ok: true, message: `Email sent :)`})
// })


// router.get("/students/profile",(req,res)=>{
//     if(!req.session.user){
//         res.redirect("/login")
//     } else {
//         Student.findByPk(req.session.user.id,{
//             include:[Follow, Posts, Likes, followedBy, followsTo]
//         }).then(dbUser=>{
//             const hbsUser = dbUser.toJSON();
//             console.log('my hbsUsers: ',hbsUser)
//             res.render("profile",{
//                 users:hbsUser
//             })  
//         }).catch(err=>{
//             res.status(500).json({msg:"oh no!",err})
//         })
//     }
// });

// router.get("/teachers/profile",(req,res)=>{
//     if(!req.session.user){
//         res.redirect("/login")
//     } else {
//         Teacher.findByPk(req.session.user.id,{
//             include:[Follow, Posts, Likes, followedBy, followsTo]
//         }).then(dbUser=>{
//             const hbsUser = dbUser.toJSON();
//             console.log('my hbsUsers: ',hbsUser)
//             res.render("profile",{
//                 users:hbsUser
//             })  
//         }).catch(err=>{
//             res.status(500).json({msg:"oh no!",err})
//         })
//     }
// });

module.exports = router;