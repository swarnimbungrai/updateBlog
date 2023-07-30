const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "raiswornimbung@gmail.com",
      pass: "vhlqbqgbuqesohgs",
    },
  });

  const mailOptions = {
    from: "Swa <raiswornimbung@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: "Your otp is  " + options.otp,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;