let Url = require("../models/Url");

exports.index = async function(req, res, next) {
  var urls = await Url.all();
  return res.json(urls);
};

exports.create = async function(req, res, next) {
  var url = await Url.create(req.body.url);
  res.json(url);
};

exports.delete = async function(req, res, next) {
  var url = await Url.find(parseInt(req.params.id));
  url.delete();
  res.send("ok");
};
