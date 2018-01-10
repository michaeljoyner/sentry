let StatusReport = require("../models/StatusReport");

exports.index = async function(req, res, next) {
  var reports = await StatusReport.latest(100);
  return res.json(reports);
};
