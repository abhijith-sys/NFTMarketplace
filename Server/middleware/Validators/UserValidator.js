const { body, query, param, check } = require("express-validator");
const ethers = require("ethers");
const mongoose = require("mongoose");

const expression = (expression) => {
  switch (expression) {
    case "getNounce": {
      return [
        body("metamaskId")
          .trim()
          .exists()
          .notEmpty()
          .withMessage({
            message: "provide metamaskId",
            errorCode: 701,
          })
          .custom((id) => ethers.utils.isAddress(id))
          .withMessage({
            message: "invalid metamaskId",
            errorCode: 700,
          }),
      ];
    }
    case "verifySignature": {
      return [
        body("verificationMessage").trim().exists().notEmpty().withMessage({
          message: "provide verification message",
          errorCode: 702,
        }),
        body("metamaskId")
          .trim()
          .exists()
          .notEmpty()
          .withMessage({
            message: "provide metamaskId",
            errorCode: 701,
          })
          .custom((id) => ethers.utils.isAddress(id))
          .withMessage({
            message: "invalid metamaskId",
            errorCode: 700,
          })
          .isLength({ max: 300 })
          .withMessage({
            message: "max length is 300",
            errorCode: 718,
          }),
      ];
    }
    case "userDetails": {
      return [
        body("name")
          .isString()
          .withMessage({
            message: "it should be string",
            errorCode: 706,
          })
          .trim()
          .exists()
          .notEmpty()
          .withMessage({
            message: "provide name",
            errorCode: 703,
          })
          .isLength({ min: 1, max: 20 })
          .withMessage({
            message: "max length of name is 20",
            errorCode: 708,
          }),
        body("email")
          .trim()
          .exists()
          .notEmpty()
          .withMessage({
            message: "provide email",
            errorCode: 704,
          })
          .isEmail()
          .withMessage({
            message: "it should be email",
            errorCode: 707,
          }),
        body("bio")
          .trim()
          .exists()
          .notEmpty()
          .withMessage({
            message: "provide bio",
            errorCode: 705,
          })
          .isString()
          .withMessage({
            message: "it should be string",
            errorCode: 706,
          })
          .isLength({ min: 1, max: 200 })
          .withMessage({
            message: "max length of bio is 200",
            errorCode: 709,
          }),
      ];
    }

    case "refreshToken": {
      return [
        body("refreshToken")
          .trim()
          .exists()
          .notEmpty()
          .withMessage({
            message: "provide refreshToken",
            errorCode: 711,
          })
          .isLength({ max: 300 })
          .withMessage({
            message: "max length is 300",
            errorCode: 718,
          }),
      ];
    }
    case "getById": {
      return [
        query("page").trim().isNumeric().optional().withMessage({
          message: "page number should be number",
          errorCode: 712,
        }),
        query("limit").trim().isNumeric().optional().withMessage({
          message: "limit number should be number",
          errorCode: 713,
        }),
        param("id")
          .trim()
          .exists()
          .notEmpty()
          .custom((id) => mongoose.isValidObjectId(id))
          .withMessage({
            message: "provide the correct id",
            errorCode: 715,
          }),
      ];
    }
    case "commonGet": {
      return [
        query("page").trim().isNumeric().optional().withMessage({
          message: "page number should be number",
          errorCode: 712,
        }),
        query("limit").trim().isNumeric().optional().withMessage({
          message: "limit number should be number",
          errorCode: 713,
        }),
      ];
    }
    case "image": {
      return [
        check("cover_photo")
          .isEmpty()
          .withMessage("should not be empty")
          .custom((value, { req }) => {
            console.log(req);
            return (
              req.file.mimetype === "image/png" ||
              req.file.mimetype === "image/jpg" ||
              req.file.mimetype === "image/jpeg"
            );
          })
          .withMessage("Only .png, .jpg and .jpeg format allowed")

      ];
    }
    case "addLinks": {
      return [
        body("links.*")
          .isString()
          .withMessage({
            message: "should be string",
            errorCode: 706,
          })
          .isLength({ max: 200 })
          .withMessage({
            message: "max length is 200 ",
            errorCode: 718,
          })
          .trim()
          .exists()
          .notEmpty()
          .withMessage({
            message: "it should  not be blank",
            errorCode: 714,
          }),
      ];
    }
    default:
      return ["error exists"];
  }
};

module.exports = expression;
