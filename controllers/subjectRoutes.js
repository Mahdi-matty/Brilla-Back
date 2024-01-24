const express = require('express');
const router = express.Router();
const {Student, Topic, Subject, Card} = require('../models');
const withTokenAuth = require('../middleware/withTokenAuth');

//find all
router.get("/",(req,res)=>{
    Subject.findAll({
        include: [Topic]
    }).then(dbSubjects=>{
        res.json(dbSubjects)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});

//find one
router.get("/find/:id",(req,res)=>{
    Subject.findByPk(req.params.id,{
        include:[Student, Topic]
    }).then(dbSubject=>{
        if(!dbSubject){
            res.status(404).json({msg:"no such Subject!"})
        } else{
            res.json(dbSubject)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//create
router.post("/", withTokenAuth,(req,res)=>{
    Subject.create({
        title:req.body.title,
        StudentId: req.tokenData.id
    }).then(newSubject=>{
        res.json(newSubject)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//edit
router.put("/:id",(req,res)=>{
    Subject.update({
        title:req.body.title,
    },{
        where:{
            id:req.params.id
        }
    }).then(editSubject=>{
        if(!editSubject[0]){
            res.status(404).json({msg:"no such subject!"})
        } else{
            res.json(editSubject[0])
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//delete
router.delete("/:id",(req,res)=>{
    Subject.destroy({
        where:{
            id:req.params.id
        }
    }).then(delSubject=>{
        if(!delSubject){
            res.status(404).json({msg:"no such Subject!"})
        } else{
            res.json(delSubject)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});

// Show all the subjects of the logged in Student
router.get("/student-subjects", withTokenAuth, (req, res) => {
    Student.findByPk(req.tokenData.id, {
        include: [Subject]
    }).then(dbStudent => {
        if (!dbStudent) {
            res.status(404).json({ msg: "no such student!!!!" })
        } else {
            res.json(dbStudent.Subjects)
        }
    }).catch(err => {
        res.status(500).json({ msg: "oh no!", err })
    })
});

// Show the topics of a subject by the subject's ID 
router.get("/find-topics/:id",(req,res)=>{
    Subject.findByPk(req.params.id,{
        include:[Topic]
    }).then(dbSubject=>{
        if(!dbSubject){
            res.status(404).json({msg:"no such Subject!"})
        } else{
            res.json(dbSubject.Topics)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})


module.exports = router;