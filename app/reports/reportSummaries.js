module.exports = function(reports) {
  return [...new Set(reports.map(report => report.url_id))].map(id => ({
    url_id: id,
    successes: reports.filter(report => report.url_id === id && report.isOkay())
      .length,
    failures: reports.filter(report => report.url_id === id && !report.isOkay())
      .length
  }));
};
