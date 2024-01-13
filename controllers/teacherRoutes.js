const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const {Student, Teacher,} = require('../models');

//find all
router.get("/",(req,res)=>{
    Teacher.findAll().then(dbUsers=>{
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
    Teacher.findByPk(req.params.id,{
        include:[Posts,]
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

router.get('/getUserIdByTeacherName/:teachername', async (req, res) => {
    try {
      const teachername = req.params.teachername;
      const user = await Teacher.findOne({
        where: { teachername: teachername },
        attributes: ['id'],
      });
  
      if (user) {
        res.json({ userId: user.id });
      } else {
        res.status(404).json({ error: 'Teacher not found' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//find by username
router.get("/findUser/:id",(req,res)=>{
    Teacher.findOne({
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
router.get('/getTeacherNameById/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const teacher = await Teacher.findOne({
        where: { id: id },
        attributes: ['teachername'],
      });
  
      if (user) {
        res.json({ teachername: teacher.teachername });
      } else {
        res.status(404).json({ error: 'Teacher not found' });
      }
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//create
router.post("/",(req,res)=>{
    Teacher.create({
        teachername:req.body.teachername,
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
    Teacher.findOne({
        where:{
            teachername:req.body.teachername
        }
    }).then(foundUser=>{
        if(!foundUser){
            res.status(401).json({msg:"Invalid teachername/password"})
        } else {
            if(!bcrypt.compareSync(req.body.password,foundUser.password)){
                res.status(401).json({msg:"Invalid teachername/password"})
            } else {
                req.session.user = {
                    id:foundUser.id,
                    teachername:foundUser.teachername
                }
                res.json(foundUser)
            }
        }
    })
})
//edit
router.put("/:id",(req,res)=>{
    Teacher.update({
        teachername:req.body.teachername,
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
    Teacher.destroy({
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