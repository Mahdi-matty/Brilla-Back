const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const {Student, Teacher} = require('../models');
const isMyPost = require('../middleware/isMyPost');

//find all
router.get("/",(req,res)=>{
    Student.findAll().then(dbUsers=>{
        res.json(dbUsers)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})
router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.send("logged out!")
})

//find one
router.get("/:id",(req,res)=>{
    Student.findByPk(req.params.id,{
        include:[Posts, Likes]
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

router.get('/getUserIdByUsername/:username', async (req, res) => {
    try {
      const username = req.params.username;
      const user = await Student.findOne({
        where: { username: username },
        attributes: ['id'],
      });
  
      if (user) {
        res.json({ userId: user.id });
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//find by username
router.get("/findUser/:id",(req,res)=>{
    Student.findOne({
        include:[Posts, Likes],
        where: {
            id: req.params.id,
    }}).then(foundUser=>{
        if(!foundUser){
            res.status(404).json({msg:"no such user!"})
        } else{
            res.render("foundUser",
            {
                users:foundUser.toJSON()
            })
            // res.json(foundUser)
        }

    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});
router.get('/getUsernameById/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const user = await Student.findOne({
        where: { id: id },
        attributes: ['username'],
      });
  
      if (user) {
        res.json({ username: user.username });
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

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
//login
router.get("/login",(req,res)=>{
    //1. find the user who is trying to login
    Student.findOne({
        where:{
            username:req.body.username
        }
    }).then(foundUser=>{
        if(!foundUser){
            res.status(401).json({msg:"Invalid username/password"})
        } else {
            if(!bcrypt.compareSync(req.body.password,foundUser.password)){
                res.status(401).json({msg:"Invalid username/password"})
            } else {
                req.session.user = {
                    id:foundUser.id,
                    username:foundUser.username
                }
                res.json(foundUser)
            }
        }
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
            res.json(editUser)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})
//delete
router.delete("/:id",isMyPost,(req,res)=>{
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
})


module.exports = router;