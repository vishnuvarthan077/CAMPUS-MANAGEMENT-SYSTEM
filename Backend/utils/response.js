/**
 * Standardized success response handler
 */
const sendSuccess = (res, statusCode, message, data = null, extra = {}) => {
  const responsePayload = {
    success: true,
    message,
    ...extra,
  };

  if (data !== null && data !== undefined) {
    responsePayload.data = data;
  }

  return res.status(statusCode).json(responsePayload);
};

/**
 * Standardized error response handler
 */
const sendError = (res, statusCode, message, errors = null) => {
  const responsePayload = {
    success: false,
    message,
  };

  if (errors !== null && errors !== undefined) {
    responsePayload.errors = errors;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = {
  sendSuccess,
  sendError,
};

