const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {Student, Subject, Topic, Card} = require('../models');
const jwt = require("jsonwebtoken");

//find all
router.get("/",(req,res)=>{
    Student.findAll().then(dbStudents=>{
        res.json(dbStudents)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//find one
router.get("/:id",(req,res)=>{
    Student.findByPk(req.params.id,{
        include:[Subject, Card]
    }).then(dbUser=>{
        if(!dbUser){
            res.status(404).json({msg:"no such user!"})
        } else{
            res.json(dbUser)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//create
router.post("/",(req,res)=>{
    Student.create({
        username:req.body.username,
        password:req.body.password,
        email: req.body.email,
    }).then(newUser=>{
        res.json(newUser)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//edit
router.put("/:id",(req,res)=>{
    Student.update({
        username:req.body.username,
        password:req.body.password,
        email: req.body.email,
    },{
        where:{
            id:req.params.id
        }
    }).then(editUser=>{
        if(!editUser[0]){
            res.status(404).json({msg:"no such user!"})
        } else{
            res.json(editUser[0])
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//delete
router.delete("/:id",(req,res)=>{
    Student.destroy({
        where:{
            id:req.params.id
        }
    }).then(delUser=>{
        if(!delUser){
            res.status(404).json({msg:"no such user!"})
        } else{
            res.json(delUser)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});

//login
router.post("/login",(req,res)=>{
    //1. find the user who is trying to login
    Student.findOne({
        where:{
            username:req.body.username
        }
    }).then(foundUser=>{
        if(!foundUser || !bcrypt.compareSync(req.body.password,foundUser.password)){
            return res.status(401).json({msg:"invalid login credentials"})
        };
        const token = jwt.sign({
            email:foundUser.email,
            id:foundUser.id
        },process.env.JWT_SECRET,{
            expiresIn:"2h"
        })
        res.json({
            token,
            user:foundUser
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({msg:"oh no!",err})
    })
});

// // GET logout route
// router.get('/logout', (req, res) => {
//     // Invalidate the user's session or delete the session token stored on the client-side
//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({ msg: 'Failed to logout' });
//       }  
//       // Clear the session token from a cookie or local storage
//       res.clearCookie('sessionToken');  
//       // Send a response indicating successful logout
//       res.json({ msg: 'Logout successful' });
//     });
// });
// GET logout route
router.get("/logout", (req, res) => {
    req.session.destroy();
    console.log("Logged out!");
    res.send("Logged out!");
});

// router.get('/getUserIdByUsername/:username', async (req, res) => {
//     try {
//       const username = req.params.username;
//       const user = await Student.findOne({
//         where: { username: username },
//         attributes: ['id'],
//       });
  
//       if (user) {
//         res.json({ userId: user.id });
//       } else {
//         res.status(404).json({ error: 'Student not found' });
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

// //find by username
// router.get("/findUser/:id",(req,res)=>{
//     Student.findOne({
//         include:[Posts, Likes],
//         where: {
//             id: req.params.id,
//     }}).then(foundUser=>{
//         if(!foundUser){
//             res.status(404).json({msg:"no such user!"})
//         } else{
//             res.render("foundUser",
//             {
//                 users:foundUser.toJSON()
//             })
//             // res.json(foundUser)
//         }

//     }).catch(err=>{
//         res.status(500).json({msg:"oh no!",err})
//     })
// });

// router.get('/getUsernameById/:id', async (req, res) => {
//     try {
//       const id = req.params.id;
//       const user = await Student.findOne({
//         where: { id: id },
//         attributes: ['username'],
//       });
  
//       if (user) {
//         res.json({ username: user.username });
//       } else {
//         res.status(404).json({ error: 'Student not found' });
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });



module.exports = router;