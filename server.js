const express = require("express");
const sequelize = require('./config/connection');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const allRoutes = require('./controllers/');
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json())
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