const mongoose = require("mongoose");

/**
 * Higher-order middleware to run a validator function on incoming requests
 * @param {Function} validatorFn - Function taking req and returning array of { field, message }
 */
const validate = (validatorFn) => {
  return (req, res, next) => {
    const errors = validatorFn(req);
    if (errors && errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    next();
  };
};

/**
 * Middleware to validate MongoDB ObjectId in route params
 * @param {string} paramName - Name of the route parameter (default 'id')
 */
const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: [
          {
            field: paramName,
            message: `Invalid MongoDB ObjectId: ${id}`,
          },
        ],
      });
    }
    next();
  };
};

module.exports = {
  validate,
  validateObjectId,
};

