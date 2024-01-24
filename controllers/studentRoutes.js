const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {Student, Subject, Card} = require('../models');
const jwt = require("jsonwebtoken");
const withTokenAuth = require('../middleware/withTokenAuth');

//find all
router.get("/",(req,res)=>{
    Student.findAll().then(dbStudents=>{
        res.json(dbStudents)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//find one
router.get("/find/:id",(req,res)=>{
    Student.findByPk(req.params.id,{
        include:[Subject, Card]
    }).then(dbUser=>{
        if(!dbUser){
            res.status(404).json({msg:"no such one user id!"})
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
            res.status(404).json({msg:"no such user to delete!"})
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
            id:foundUser.id,
            username: foundUser.username
        },process.env.JWT_SECRET,{
            expiresIn:"2h"
        })
        res.json({
            token,
            student:foundUser
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({msg:"oh no!",err})
    })
});

// Find Session User
router.get("/logged-user", withTokenAuth, (req, res) => {
    Student.findByPk(req.tokenData.id, {
        include: [Subject, Card]
    }).then(dbStudent => {
        if (!dbStudent) {
            res.status(404).json({ msg: "no such student!!!!" })
        } else {
            res.json(dbStudent)
        }
    }).catch(err => {
        res.status(500).json({ msg: "oh no!", err })
    })
});

// Why is the logged-user still works after running the logout route?
// GET logout route
router.get('/logout', withTokenAuth, (req, res) => {
    // Invalidate the user's session or delete the session token stored on the client-side
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ msg: 'Failed to logout' });
      }  
      // Clear the session token from a cookie or local storage
      res.clearCookie('sessionToken');  
      // Send a response indicating successful logout
      res.json({ msg: 'Logout successful' });
    });
});

// Show all the cards of the logged in Student
router.get("/find-cards", withTokenAuth, (req,res)=>{
    Student.findByPk(req.tokenData.id, {
        include: [Card]
    }).then(dbStudent => {
        if (!dbStudent) {
            res.status(404).json({ msg: "no such student!!!!" })
        } else {
            res.json(dbStudent.Cards)
        }
    }).catch(err => {
        res.status(500).json({ msg: "oh no!", err })
    })
})

module.exports = router;