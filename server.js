const express = require("express");
const sequelize = require('./config/connection');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const allRoutes = require('./controllers/');
const PORT = process.env.PORT || 3001;
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());

const fetch = (...args) =>
    import('node-fetch').then(({default: fetch})=> fetch(...args))


app.use(bodyParser.json())

const CLIENT_ID = '560f1c16a1a52dfe50c0';
const CLIENT_SECRET = process.env.CLIENT_SEC

// app.get('/getAccessToken', async function(req, res){
//     try {
//         const params = new URLSearchParams({
//             client_id: CLIENT_ID,
//             client_secret: CLIENT_SECRET,
//             code: req.query.code
//         });
    
//         const response = await fetch('https://github.com/login/oauth/access_token', {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: params
//         });
//         // console.log(req.query.code);
//         // const params = '?client_id='+ CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '$code=' + req.query.code;
//         // const response = await fetch('https://github.com/login/oauth/access_token'+ params, {
//         //     method: 'POST',
//         //     headers: {
//         //         'Accept': 'application/json'
//         //     }
//         // });
//         if (!response) {
//             throw new Error('Failed to fetch response');
//         }
//         if (!response.ok) {
//             throw new Error('Failed to fetch access token');
//         }
//         console.log(response)
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error('Error fetching access token:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
app.get('/getAccessToken', async function(req, res){
    console.log(req.query.code);
    const params = '?client_id='+ CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '$code=' + req.query.code;
    await fetch('https://github.com/login/oauth/access_token'+ params, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        }).then((response)=>{
            console.log(response);
            return response.json()
        }).then((data)=>{
            console.log(data);
            res.json(data)
        }).catch((error)=>{
            console.log(error)
            res.status(500).json({error: 'internal server error'})
        })
})

app.get('/getUserData', async function (req, res){
    const authorizationHeader = req.get('Authorization');
 await fetch('https://api.github.com/user', {
    method : 'GET',
    headers : {
        'Authorization' : authorizationHeader
    }
 }).then((response)=>{
    return response.json()
}).then((data)=>{
    res.json(data)
}).catch((error)=>{
    console.log(error);
    res.status(500).json({error: 'itnernal server eror'})
})
})
// app.post('/api/send-email', async (req, res) => {
//     const { email, authCode } = req.body;
//  const transporter = nodemailer.createTransport({
//         // host: "smtp.forwardemail.net",
//         // port: 465,
//         service: 'aol',
//         auth: {
//           user: 'brillamentee@aol.com',
//           pass: process.env.mailPass,
//         },
//       });
//     try {
//         await transporter.sendMail({
//           from: 'brillamentee@aol.com',
//           to: email,
//           subject: 'Authentication Code',
//           text: `Your authentication code is: ${authCode}`,
//         });
    
//         console.log('Email sent with authentication code');
//         res.sendStatus(200);
//       } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ error: 'Error sending email. Please try again.' });
//       }
//     });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(`/`, allRoutes)

sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
        console.log('App listening on PORT ' + PORT);
    });
});