const nodemailer = require("nodemailer");
require('dotenv').config();
const accountTransport = require(`./account_transport.json`)
const { google } = require("googleapis");

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
          clientSecret: "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",
          refreshToken: "1//04Fyj5itNSx3jCgYIARAAGAQSNgF-L9IrcQaVocBuTN8W80FAdJ9nBsQt79Gs2nkYTbyIgTSCc3E7touYMvhmPq06AK_XRCNcRg",
          accessToken: accessToken
      }
    
        // host: "smtp.office365.com",
        // port: 587,
        // secure: false,
        // auth: {
        //   user: process.env.EMAIL,
        //   pass: process.env.EMAIL_PASSWORD,
        // },
    });

  } catch (err) {
    console.log(err);
  }
}


// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

module.exports = transporter