const express = require('express');
const router = express.Router();
const {Student, Topic, Subject, Card} = require('../models');
const withTokenAuth = require('../middleware/withTokenAuth');

//find all
router.get("/",(req,res)=>{
    Card.findAll({
        include: [Student, Topic]
    }).then(dbCards=>{
        res.json(dbCards)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});

//find one
router.get("/find/:id",(req,res)=>{
    Card.findByPk(req.params.id,{
        include:[Topic, Student]
    }).then(dbCard=>{
        if(!dbCard){
            res.status(404).json({msg:"no such Card!"})
        } else{
            res.json(dbCard)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//create
router.post("/", withTokenAuth, (req,res)=>{
    Card.create({
        title: req.body.title,
        content: req.body.content,
        difficulty: req.body.difficulty,
        StudentId: req.tokenData.id,
        TopicId: req.body.TopicId
    }).then(newCard=>{
        res.json(newCard)
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//edit
router.put("/:id",(req,res)=>{
    Card.update({
        title: req.body.title,
        content: req.body.content,
        difficulty: req.body.difficulty
    },{
        where:{
            id:req.params.id
        }
    }).then(editCard=>{
        if(!editCard[0]){
            res.status(404).json({msg:"no such Card!"})
        } else{
            res.json(editCard[0])
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

//delete
router.delete("/:id",(req,res)=>{
    Card.destroy({
        where:{
            id:req.params.id
        }
    }).then(delCard=>{
        if(!delCard){
            res.status(404).json({msg:"no such Card!"})
        } else{
            res.json(delCard)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});


// //query or route to find cards linked to a single user
// router.get("/:id",(req,res)=>{
//     Card.findAll({
//       where:{
//         cardId:req.params.id
//       },
//       include:[Student, Topic]
//     }).then(dbCards=>{
//         if(!dbCards){
//             res.status(404).json({msg:"no such Card!"})
//         } else{
//             res.json(dbCards)
//         }
//     }).catch(err=>{
//         res.status(500).json({msg:"oh no!",err})
//     })
// });

// //edit
// router.put("/:id", isAuthenticated, (req, res) => {
//   Card.update(
//     {
//       title: req.body.title,
//       content: req.body.content,
//       user_id: req.body.user_id,
//       UserId: req.session.user.id,
//     },
//     {
//       where: {
//         id: req.params.id,
//         UserId:req.session.user.id
//       },
//     }
//   )
//   .then((editedCard) => {
//     if (!editedCard[0]) {
//       res.status(404).json({ msg: "no such Like!" });
//     } else {
//       res.json(editedCard);
//     }
//   })
//   .catch((err) => {
//     res.status(500).json({ msg: "oh no!", err });
//   });
// });

module.exports = router;