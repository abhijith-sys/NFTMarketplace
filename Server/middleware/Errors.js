const { validationResult } = require("express-validator");
const expressValidationError = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (errors.errors.length !== 0) {
      return res.status(700).send(errors.errors);
    } else {
      next();
    }
  } catch (error) {
    return res.status(999).send("err")
  }
};

module.exports = expressValidationError;
