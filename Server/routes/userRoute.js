const router = require("express").Router();
const {
  getNonce,
  verifySignature,
  userdetails,
  addUserCoverPhoto,
  addUserProfilePhoto,
  getUser,
  refreshUserToken,
  getUserCollectedNft,
  getUserCreatedNft,
  getTopCreators,
  getTopTrendingNftCollection,
  getUserById,
  getUserApprovedBids,
  addLinks,

} = require("../controller/userController.js");
const authenticateToken = require("../middleware/auth");
const validateExpression = require("../middleware/Validators/UserValidator.js");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,

  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.get("/", authenticateToken, getUser);
router.post("/getNonce", validateExpression("getNounce"), getNonce);
router.post("/verifySignature", validateExpression("verifySignature"), verifySignature);
router.put("/userdetails", authenticateToken, validateExpression("userDetails"), userdetails);
router.put("/addUserCoverPhoto", authenticateToken, upload.single("cover_photo"), validateExpression("image"), addUserCoverPhoto);
router.put("/addUserProfilePhoto", authenticateToken, upload.single("profile_photo"), validateExpression("image"), addUserProfilePhoto);
router.put("/refresh", validateExpression("refreshToken"), refreshUserToken);
router.put("/addLinks", authenticateToken, validateExpression("addLinks"), addLinks);
// .
router.get("/getUserById/:id", validateExpression("getById"), getUserById);
router.get("/getUserCollectedNft", authenticateToken, validateExpression("commonGet"), getUserCollectedNft
);
router.get("/getTopCreators", getTopCreators);
router.get("/getUserCreatedNft", authenticateToken, validateExpression("commonGet"), getUserCreatedNft
);
router.get("/getTopTrendingNftCollection", getTopTrendingNftCollection);
router.get("/approvedBids", authenticateToken, getUserApprovedBids)


router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send({ message: "image limit should be 5mb", errorCode: 720 });
  } else if (err) {
    return res.status(404).send({ message: "unknown error", errorCode: 500 });
  }
});

module.exports = router;
