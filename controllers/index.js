const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const withTokenAuth = require('../middleware/withTokenAuth');
const { Topic, Teacher, Subject, Student, Card } = require(`../models`);
require('dotenv').config();
const nodemailer = require("nodemailer");
const accountTransport = require(`../helpers/account_transport.json`)
const { google } = require("googleapis");

router.get("/",(req,res)=>{
     res.send(`Hi`)   
});

const studentRoutes = require('./studentRoutes');
router.use('/api/students', studentRoutes);

const teacherRoutes = require('./teacherRoutes');
router.use('/api/teachers', teacherRoutes);

const cardRoutes = require('./cardRoutes');
router.use('/api/cards', cardRoutes);

const subjectRoutes = require(`./subjectRoutes`);
router.use(`/api/subjects`, subjectRoutes);

const topicRoutes = require(`./topicRoutes`);
router.use(`/api/topics`, topicRoutes)

// get token info
router.get(`/test`, (req, res) => {
     res.send(`route is working`)
});

// send email - test route - sendgrid


// send email - test route
router.post(`/send-email`, async (req, res) => {

     console.log(`hi`)

     const oAuth2Client = new google.auth.OAuth2(
          accountTransport.auth.clientId,
          accountTransport.auth.clientSecret,
          "https://developers.google.com/oauthplayground",
     );
          
     oAuth2Client.setCredentials({refresh_token: accountTransport.auth.refreshToken});
     
     const sendMail = async () => {
          try{
               const accessToken = await oAuth2Client.getAccessToken()
          
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
               to: `santiago1.dsrr@gmail.com`,
               subject: `You have received a flash card`,
               text: `You have received a card from. Please log into your Brilla-Mente account to accept it or reject it`
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
})

module.exports = router;