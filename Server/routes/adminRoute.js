const { listUser, csvExport, login, count, getUserById} = require('../controller/adminController');
const adminValidator = require('../middleware/Validators/adminValidator');

const router = require('express').Router();

router.post("/", adminValidator("login"), login)
router.get("/listUser", adminValidator("list-user"), listUser)
router.get("/csvExport", csvExport)
router.get("/count",count)
router.get("/user/:id",getUserById)

module.exports = router