function sendSuccess(res, status, data) {
  res.status(status).json(data);
}

function sendError(res, status, code, message, details = []) {
  res.status(status).json({
    error: {
      code,
      message,
      details,
    },
  });
}

module.exports = {
  sendSuccess,
  sendError,
};
