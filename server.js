const session = require("express-session");
const express = require("express");
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
app.use(cors());

const sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge:1000*60*60*2
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(bodyParser.json())
app.post('/api/send-email', async (req, res) => {
    const { email, authCode } = req.body;

const transporter = nodemailer.createTransport({
        // host: "smtp.forwardemail.net",
        // port: 465,
        service: 'aol',
        auth: {
          user: 'brillamentee@aol.com',
          pass: process.env.mailPass,
        },
      });
    try {
        await transporter.sendMail({
          from: 'brillamentee@aol.com',
          to: email,
          subject: 'Authentication Code',
          text: `Your authentication code is: ${authCode}`,
        });
    
        console.log('Email sent with authentication code');
        res.sendStatus(200);
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email. Please try again.' });
      }
    });

app.use(session(sess));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
        console.log('App listening on PORT ' + PORT);
    });
});