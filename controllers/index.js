const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get("/",(req,res)=>{
     res.render("home")        
});

const studentRoutes = require('./studentRoutes');
router.use('/api/students', studentRoutes);

const teacherRoutes = require('./teacherRoutes');
router.use('/api/teachers', teacherRoutes);

const cardRoutes = require('./cardRoutes');
router.use('./api/cards', cardRoutes);

const subjectRoutes = require(`./subjectRoutes`);
router.use(`/api/subjects`, subjectRoutes);

const topicRoutes = require(`./topicRoutes`);
router.use(`/api/topics`, topicRoutes)

// router.get("/sessiondata",(req,res)=>{
//     res.json(req.session)
// });

// router.post("/student/login",(req,res)=>{
//     User.findOne({
//         where:{
//             username:req.body.username,
//         }
//     }).then(foundUser=>{
//         if(!foundUser){
//             res.status(401).json({msg:"Invalid username/password"})
//         } else {
//             if(!bcrypt.compareSync(req.body.password,foundUser.password)){
//                 res.status(401).json({msg:"Invalid username/password"})
//             } else {
//                 req.session.user = {
//                     id:foundUser.id,
//                     username:foundUser.username
//                 }
//                 res.json(foundUser)
//             }
//         }
//     })
// });

// router.post("/teachers/login",(req,res)=>{
//     User.findOne({
//         where:{
//             teachername:req.body.teachername,
//         }
//     }).then(foundUser=>{
//         if(!foundUser){
//             res.status(401).json({msg:"Invalid username/password"})
//         } else {
//             if(!bcrypt.compareSync(req.body.password,foundUser.password)){
//                 res.status(401).json({msg:"Invalid username/password"})
//             } else {
//                 req.session.teacher = {
//                     id:foundUser.id,
//                     teachername:foundUser.teachername
//                 }
//                 res.json(foundUser)
//             }
//         }
//     })
// });

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

// router.get("/logout",(req,res)=>{
//     req.session.destroy();
//     res.render("logout")
// })

// router.get("/signup",(req,res)=>{
//     res.render("signup")
// });

module.exports = router;