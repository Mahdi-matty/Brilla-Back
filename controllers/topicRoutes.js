const express = require('express');
const router = express.Router();
const {Student, Topic, Subject, Card} = require('../models');
const withTokenAuth = require('../middleware/withTokenAuth');

//find all
router.get("/",(req,res)=>{
    Topic.findAll().then(dbTopic=>{
        res.json(dbTopic)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});

//find one
router.get("/find/:id",(req,res)=>{
    Topic.findByPk(req.params.id,{
        include:[Subject, Card]
    }).then(dbTopic=>{
        if(!dbTopic){
            res.status(404).json({msg:"no such topic!"})
        } else{
            res.json(dbTopic)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//create
router.post("/",(req,res)=>{
    Topic.create({
        title:req.body.title,
        SubjectId: req.body.SubjectId
    }).then(newTopic=>{
        res.json(newTopic)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//edit
router.put("/:id",(req,res)=>{
    Topic.update({
        title:req.body.title,
    },{
        where:{
            id:req.params.id
        }
    }).then(editTopic=>{
        if(!editTopic[0]){
            res.status(404).json({msg:"no such topic!"})
        } else{
            res.json(editTopic[0])
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//delete
router.delete("/:id",(req,res)=>{
    Topic.destroy({
        where:{
            id:req.params.id
        }
    }).then(delTopic=>{
        if(!delTopic){
            res.status(404).json({msg:"no such Topic!"})
        } else{
            res.json(delTopic)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});

// Show all the topics of the logged in Student
router.get("/student-topics", withTokenAuth, (req, res) => {
    Subject.findAll({
        where: {
            StudentId: req.tokenData.id
        },
        include: [Topic]
    }).then(dbSubjects => {
        if (!dbSubjects) {
            res.status(404).json({ msg: "no such Subjects!!!!" })
        } else {
            const topics = [];
            for(let subject of dbSubjects){
                for(let topic of subject.Topics){
                    topics.push(topic)
                }
            }
            res.json(topics)
        }
    }).catch(err => {
        res.status(500).json({ msg: "oh no!", err })
    })
});

module.exports = router;