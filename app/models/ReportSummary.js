let db = require("../../database/connection");
let moment = require("moment");
let StatusReport = require("../models/StatusReport");
let reportSummaries = require("../reports/reportSummaries");

class ReportSummary {
  constructor(summary_attributes) {
    this.id = summary_attributes.id;
    this.url_id = summary_attributes.url_id;
    this.successes = summary_attributes.successes;
    this.failures = summary_attributes.failures;
  }

  static async run() {
    const cutoff_timestamp = moment()
      .subtract(2, "days")
      .format("YYYY-MM-DD HH:mm:ss");

    const old_reports = await StatusReport.olderThan(cutoff_timestamp);

    await Promise.all(
      reportSummaries(old_reports).map(summary => ReportSummary.tally(summary))
    );

    await Promise.all(old_reports.map(report => report.del()));
  }

  static async tally(summary) {
    let report_summary = await ReportSummary.getByUrlId(summary.url_id);

    if (report_summary) {
      return await report_summary.update({
        successes: report_summary.successes + summary.successes,
        failures: report_summary.failures + summary.failures
      });
    }
    await db("report_summaries").insert(summary);
  }

  static async getByUrlId(id) {
    var summary = await db("report_summaries")
      .where("url_id", id)
      .first();

    if (summary) {
      return new ReportSummary(summary);
    }
  }

  static async grandTotals() {
    return await db("report_summaries")
      .count("id as urls")
      .sum("successes as successes")
      .sum("failures as failures")
      .first();
  }

  async update(update_data) {
    await db("report_summaries")
      .where("id", this.id)
      .update(update_data);

    return ReportSummary.getByUrlId(this.url_id);
  }

  static async getOlderReports(cutoff_timestamp) {
    return await db("status_reports").where(
      "created_at",
      "<",
      cutoff_timestamp
    );
  }

  static async deleteOlderReports(cutoff_timestamp) {
    return await db("status_reports")
      .where("created_at", "<", cutoff_timestamp)
      .del();
  }
}

module.exports = ReportSummary;
