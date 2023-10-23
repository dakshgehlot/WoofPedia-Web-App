require("dotenv").config();
var nodemailer = require("nodemailer");

function sendEmail(
  user_email,
  breed,
  height,
  weight,
  lifespan,
  temperament,
  image
) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  var emailBody = `
    <h1>Here is your dog information!</h1>
    <p>Breed: ${breed}</p>
    <p>Height: ${height}</p>
    <p>Weight: ${weight}</p>
    <p>Lifespan: ${lifespan}</p>
    <p>Temperament: ${temperament}</p>
    <p>Image URL: ${image}</p>
    `;

  var mailOptions = {
    from: process.env.EMAIL,
    to: user_email,
    subject: "Dog Information",
    html: emailBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = sendEmail;
