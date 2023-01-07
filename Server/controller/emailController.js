const nodemailer = require('nodemailer');
const schedule = require('node-schedule')
const emailModel = require("../model/emailModel");
const userModel = require('../model/userModel');


const sendEmail = async (user, res) => {
  try {

    if (user.time === null) {


      user.time = Date.now();
    }



    let transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: process.env.HOST_MAIL,
        pass: process.env.HOST_MAIL_PASSWORD
      }
    });

    
      const usersList = await userModel.find(
        { email: { $ne: null } },
        { email: true,_id:false }
      );
     
    const emailList = usersList.map((obj) => {
      return obj.email;
    });
    let mailOptions = {

      to: emailList.toString(),
      subject: user.subject,
      text: user.text

    };
    const emailSave = await emailModel.create({
      to: mailOptions.to,
      subject: user.subject,
      text: user.text,
      time: user.time,
      status: 0



    })


    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(404).send({ message: error })
      } else {
        return res.send({ message: "mail send sucessfully" })
      }
    });
  } catch (error) {
    res.status(404).send({ message: error })
  }
}


// sendmail function

const scheduleEmail = async (req, res) => {

  try {

    const d = req.body.time
    if (d === 0) {
      d = Date.now();
    };
    req.body.time = Date.now();
    const someDate = new Date(d)
    schedule.scheduleJob(someDate, () => {
     let user = req.body
      sendEmail(user,res);
      schedule.gracefulShutdown();
    })
  } catch (error) {
    console.log(error);

  }

}


//  List email function

const listMail = async (req, res) => {
  try {


    const listMail = await emailModel.find({ status: 0 });

    res.json(listMail)

  } catch (error) {
    console.log(error);
  }
}

// Delete Email Function
const deleteMail = async (req, res) => {

  const deleteItemId = await emailModel.findById(req.params.id);
  const deleteItem = await emailModel.findByIdAndUpdate(deleteItemId, { status: 1 })
  console.log(deleteItemId);
  res.send("deleted sucessfully")
}

module.exports = { scheduleEmail, listMail, deleteMail }
