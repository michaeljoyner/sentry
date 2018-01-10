let Url = require("../models/Url");

exports.create = async function(req, res, next) {
  var url = await Url.find(req.body.url_id);

  url.onGuard();

  return res.json();
};
