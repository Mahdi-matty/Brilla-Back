const express = require('express');
const router = express.Router();
const {Student, Topic, Subject, Card} = require('../models');
const withTokenAuth = require('../middleware/withTokenAuth');
const { Op } = require('sequelize');
const nodemailer = require("nodemailer");
const accountTransport = require(`../helpers/account_transport.json`)
const { google } = require("googleapis");

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
    Student.findByPk(req.params.receiverId)
    .then(dbUser=>{
        if(!dbUser){
            res.status(404).json({msg:"no such Card!"})
        } else{
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
                    // send notification email
                    const oAuth2Client = new google.auth.OAuth2(
                        accountTransport.auth.clientId,
                        accountTransport.auth.clientSecret,
                        "https://developers.google.com/oauthplayground",
                   );
                        
                   oAuth2Client.setCredentials({refresh_token: accountTransport.auth.refreshToken});
                   
                   const sendMail = async () => {
                        try{
                             const accessToken = await oAuth2Client.getAccessToken()
                             console.log(dbUser)
                             const transporter = nodemailer.createTransport({
                             service: "gmail",
                             auth: {
                                  type: "OAuth2",
                                  user: "brilla.mente119@gmail.com",
                                  clientId: "1081860614942-35bler21rblrhncs0m6mi96ig2juru4b.apps.googleusercontent.com",
                                  clientSecret: process.env.CLIENT_SECRET,
                                  refreshToken: "1//04Fyj5itNSx3jCgYIARAAGAQSNgF-L9IrcQaVocBuTN8W80FAdJ9nBsQt79Gs2nkYTbyIgTSCc3E7touYMvhmPq06AK_XRCNcRg",
                                  accessToken: accessToken
                             }    
                             });
              
                             const mailOptions = {
                             from: `Brilla-Mente ${accountTransport.auth.user}`,
                             to: `andresromerosilva05@gmail.com`,
                             subject: `You have received a flash card`,
                             text: `You have received a card from ${req.tokenData.username}. Please log into your Brilla-Mente account to accept it or reject it`
                             }
                        
                             const result = await transporter.sendMail(mailOptions);
                        
                             // verify connection configuration
                             transporter.verify(function (error, success) {
                             if (error) {
                                  console.log(error);
                             } else {
                                  console.log("Server is ready to take our messages");
                             }
                             });
                        
                             return result;
                        
                        } catch (err) {
                             console.log(err);
                        };
                   };
                   sendMail()
                        .then(result=>res.status(200).send(`enviado`))
                        .catch(error=>console.log(error.message))
                }
            }).catch(err=>{
                res.status(500).json({msg:"oh no!",err})
            })
        }
    }).catch(err=>{
        res.status(500).json({msg:"oh no!",err})
    })    
});

//receive a card (by adding a topic). Change the status to from pending to accepted
// Adding a topic will automatically add a subject
router.put("/accept-card/:CardId/:TopicId",(req,res)=>{
    Card.update({
        status: `accepted`,
        TopicId: req.params.TopicId
    },{
        where:{
            id:req.params.CardId
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
});

// Show all pending cards in a Student's profile
router.get("/find-pending",withTokenAuth, (req,res)=>{
    Card.findAll({
        where: {
            StudentId: req.tokenData.id,
            status: `pending`
        }        
    }).then(dbCards=>{
        if(!dbCards){
            res.status(404).json({msg:"no such Cards!"})
        } else{
            res.json(dbCards)
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

module.exports = router;