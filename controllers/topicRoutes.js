const express = require('express');
const router = express.Router();
const {Student, Topic, Subject, Card} = require('../models');

//find all
router.get("/",(req,res)=>{
    Topic.findAll().then(dbTopic=>{
        res.json(dbTopic)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});

//find one
router.get("/:id",(req,res)=>{
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

module.exports = router;