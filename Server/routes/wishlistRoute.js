const router = require("express").Router();
const {
  getUserWishlist,
  addToWishlist,
  deleteWishlistItem,
} = require("../controller/wishlistController");
const authenticateToken = require("../middleware/auth");
const validateExpression = require("../middleware/Validators/cartWishValidator");

router.use(authenticateToken);
router.get("/",validateExpression("get"), getUserWishlist);
router.put("/addToWishlist",validateExpression("addToWish"), addToWishlist);
router.delete("/deleteWishlistItem/:id",validateExpression("delete"), deleteWishlistItem);

module.exports = router;
