const express = require('express');
const router = express.Router();
const {Student, Topic, Subject, Card} = require('../models');

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
router.get("/:id",(req,res)=>{
    Subject.findByPk(req.params.id,{
        include:[Student, Topic]
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
    Subject.create({
        title:req.body.title,
    }).then(newSubject=>{
        res.json(newSubject)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
    // Add the subject to the logged user's profile
    
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

module.exports = router;