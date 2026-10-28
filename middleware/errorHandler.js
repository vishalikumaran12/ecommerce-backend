
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    message: err.statusCode
      ? err.message
      : "Internal server error"
  });
};

module.exports = errorHandler;

