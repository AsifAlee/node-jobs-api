const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong try again later",
  };
  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field.Please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "ValidationError") {
    customError.message = `Validation error ${Object.keys(err.errors)
      .map((item) => item)
      .join(",")} required`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if (err.name === "CastError") {
    customError.message = `No id found with value ${JSON.stringify(err.value)}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  console.log("unhandled error is:", err);
  // return res.status(customError.statusCode).send({ err });

  return res.status(customError.statusCode).json({ err: customError.message });
};

module.exports = errorHandlerMiddleware;
