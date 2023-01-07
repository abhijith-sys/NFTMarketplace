const {scheduleEmail,listMail,deleteMail} = require('../controller/emailController')
const router = require('express').Router();

router.post("/sendMail",scheduleEmail);
router.get("/listMail",listMail);
router.delete("/deleteMail/:id",deleteMail)


module.exports =router
