mailer = require("nodemailer");
smtpProtocol = mailer.createTransport({
  service: "Gmail",
  auth: {
    user: "adityapatildev2810@gmail.com",
    pass: "lfqsebfbrmkfixig",
  },
});

function between(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

otp = between(1000, 9999);
var mailoption = {
  from: "adityapatildev2810@gmail.com",
  to: "bhushanvp.7@gmail.com",
  subject: "One Time Password",
  html: `Hello user. Your one time password is <b>${otp}</b>`,
};

smtpProtocol.sendMail(mailoption, function (err, response) {
  // console.log("inside");
  if (err) {
    console.log(err);
  }
  console.log("Message Sent" + response.message);
  smtpProtocol.close();
});

