const router = require("express").Router();
const {
  getUserCart,
  addToCart,
  deleteCartItem,
  getUserCartIds,
  checkOutCart
} = require("../controller/cartController");
const authenticateToken = require("../middleware/auth");
const validateExpression = require("../middleware/Validators/cartWishValidator");

router.use(authenticateToken);
router.get("/", validateExpression("get"), getUserCart);
router.get("/getUserCartIds", validateExpression("get"), getUserCartIds);
router.put("/addToCart", validateExpression("add"), addToCart);
router.post("/checkout",checkOutCart)
router.delete(
  "/deleteCartItem/:id",
  validateExpression("delete"),
  deleteCartItem
);

module.exports = router;
