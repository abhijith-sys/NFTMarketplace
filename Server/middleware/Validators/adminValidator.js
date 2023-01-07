const { body, query, param, check } = require("express-validator");
const mongoose = require("mongoose");

const adminValidator = (expression) => {
  switch (expression) {
    case "login": {
      return [

        body("email")
          .notEmpty()
          .withMessage("provide email")
          .isEmail()
          .withMessage("provide valid email"),

        body("password")
          .notEmpty()
          .withMessage("provide password"),
      ];
    }
    case "list-user": {
      return [

        query("pageNo")
          .optional()
          .isNumeric()
          .withMessage("page No must be number"),

        query("limit")
          .optional()
          .isNumeric()
          .withMessage("limit must be number"),

        query("keyWord")
          .optional(),
      ];
    }

    default:
      return ["error exists"];
  }
};

module.exports = adminValidator;
