const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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

module.exports = router;