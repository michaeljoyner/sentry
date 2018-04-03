let Url = require("../models/Url");

function asArray(input) {
  return Array.isArray(input) ? input : [input];
}

exports.show = async function(req, res, next) {
  const url = await Url.find(parseInt(req.params.id));
  const recent = await url.recentReports();
  const reps = recent.map(report => ({
    status: report.status,
    message: report.message,
    created_at: report.created_at
  }));

  const data = {
    id: url.id,
    url: url.url,
    report_summary: await url.reportSummary(),
    recent_reports: reps
  };
  return res.json(data);
};

exports.index = async function(req, res, next) {
  var urls = await Url.all();
  return res.json(urls);
};

exports.create = async function(req, res, next) {
  const urls = asArray(req.body.url);

  const created_urls = urls.map(async url => await Url.create(url));
  res.json(created_urls);
};

exports.delete = async function(req, res, next) {
  var url = await Url.find(parseInt(req.params.id));
  url.delete();
  res.send("ok");
};
