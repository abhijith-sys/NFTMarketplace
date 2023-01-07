const { body, query, param } = require("express-validator");
const mongoose = require("mongoose");

const expression = (expression) => {
  switch (expression) {
    case "get": {
      return [
        query("page")
          .trim()
          .isNumeric()
          .optional()
          .withMessage({
            message: "page number should be number",
            errorCode: 712,
          }),
        query("limit")
          .trim()
          .isNumeric()
          .optional()
          .withMessage({
            message: "limit  should be number",
            errorCode: 713,
          }),
      ];
    }
    case "add": {
      return [
        body("_id")
          .trim()
          .exists()
          .notEmpty()
          .custom((id) => mongoose.isValidObjectId(id))
          .withMessage({
            "message": "provide the correct id",
            "errorCode": 715
          }
          ),
      ];
    }
    case "addToWish": {
      return [
        body("wishlistArray")
          .isArray()
          .withMessage({
            "message":  "it should be array",
            "errorCode": 717
          }
         )
          .isLength({ min: 1 })
          .withMessage({
            "message": "array should not be empty",
            "errorCode": 716
          }
          )
          .isLength({ max: 50 })
          .withMessage({
            "message":  "array max size is 50",
            "errorCode": 719
          }
         )
          .custom((wishArray) => {
            for (const element of wishArray) {
              if (!mongoose.isValidObjectId(element)) {
                return false;
              }
            }
            return true;
          })
          .withMessage({
            "message": "provide the correct id",
            "errorCode": 715
          }
          ),
      ];
    }
    case "delete": {
      return [
        param("id")
          .trim()
          .exists()
          .notEmpty()
          .custom((id) => mongoose.isValidObjectId(id))
          .withMessage({
            "message": "provide the correct id",
            "errorCode": 715
          }
          ),
      ];
    }

    default:
      return ["error exists"];
  }
};

module.exports = expression;
