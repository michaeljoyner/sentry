let StatusReport = require("../models/StatusReport");
let ReportSummary = require("../models/ReportSummary");

exports.index = async function(req, res, next) {
  const grand_totals = await ReportSummary.grandTotals();
  const recent_faliures = await StatusReport.recentFailures();
  const last_checked = await StatusReport.lastTimeReported();

  return res.json({
    grand_totals,
    recent_failures: recent_faliures.map(f => ({
      id: f.id,
      page_name: f.page_name,
      created_at: f.created_at
    })),
    last_checked
  });
};
