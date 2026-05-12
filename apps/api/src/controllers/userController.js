const { sendSuccess } = require('../utils/http');

function me(req, res) {
  return sendSuccess(res, 200, { user: req.user });
}

module.exports = {
  me,
};
