const { listUser, csvExport, login, count } = require('../controller/adminController');
const adminValidator = require('../middleware/Validators/adminValidator');

const router = require('express').Router();

router.post("/", adminValidator("login"), login)
router.get("/listUser", adminValidator("list-user"), listUser)
router.get("/csvExport", csvExport)
router.get("/count",count)

module.exports = router