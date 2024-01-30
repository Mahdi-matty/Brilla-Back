const express = require('express');
const router = express.Router();
const {Student, Topic, Subject, Card} = require('../models');
const withTokenAuth = require('../middleware/withTokenAuth');
const { Op } = require('sequelize');

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
        TopicId: req.body.TopicId,
        status: `origin`,
        sentBy: null,
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

// Show all the cards in a topic
router.get("/find-by-topic/:TopicId",(req,res)=>{
    Card.findAll({
        where: {
            TopicId: req.params.TopicId,
            [Op.or]:[
                {status: `accepted`},
                {status: `origin`}
            ]    
        }        
    }).then(dbCards=>{
        console.log(dbCards);
        if(!dbCards){
            res.status(404).json({msg:"no such Cards!"})
        } else{
            res.json(dbCards)
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
});

// get the cards for a quiz (including multiple difficulties)
router.get("/find-cards/:topicId/:cardDifficulty",(req,res)=>{
    // which difficulties does the user want? 1, 2, 3, 12, 23, 13, 123
    const difficulty = req.params.cardDifficulty;
    if(difficulty.length === 1){
        Card.findAll({
            where: {
                TopicId: req.params.topicId,
                difficulty: difficulty
            }
        }).then(dbCard=>{
            if(!dbCard){
                res.status(404).json({msg:"no such Card!"})
            } else{
                res.json(dbCard)
            }
        }).catch(err=>{
            res.status(500).json({msg:"oh no!",err})
        });
    } else if (difficulty.length === 2){
        const diffArray = difficulty.split(``)
        Card.findAll({
            where: {
                TopicId: req.params.topicId,
                [Op.or]:[
                    {difficulty: diffArray[0]},
                    {difficulty: diffArray[1]}
                ]
            }
        }).then(dbCard=>{
            if(!dbCard){
                res.status(404).json({msg:"no such Card!"})
            } else{
                res.json(dbCard)
            }
        }).catch(err=>{
            res.status(500).json({msg:"oh no!",err})
        });
    } else {
        Card.findAll({
            where: {
                TopicId: req.params.topicId,
            }
        }).then(dbCard=>{
            if(!dbCard){
                res.status(404).json({msg:"no such Card!"})
            } else{
                res.json(dbCard)
            }
        }).catch(err=>{
            res.status(500).json({msg:"oh no!",err})
        });
    };
});

// send a card to another user
router.post("/send/:cardId/:receiverId", withTokenAuth,(req,res)=>{
    Card.findByPk(req.params.cardId)
    .then(dbCard=>{
        if(!dbCard){
            res.status(404).json({msg:"no such Card!"})
        } else{
            const newCardObj = {
                title: dbCard.title,
                content: dbCard.content,
                difficulty: dbCard.difficulty,
                status: `pending`,
                StudentId: req.params.receiverId,
                sentBy: req.tokenData.username
            }
            Card.create(newCardObj)
                .then(newCard=>{
                    res.json(newCard)
                }).catch(err=>{
                    res.status(500).json({msg:"oh no! Error creating the copy",err})
                })
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })
})

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