const session = require("express-session");
const express = require("express");
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

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

app.use(session(sess));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

sequelize.sync({ force: false }).then(function() {
    http.listen(PORT, function() {
        console.log('App listening on PORT ' + PORT);
    });
});