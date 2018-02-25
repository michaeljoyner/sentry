let db = require("../../database/connection");
let moment = require("moment");

class StatusReport {
  constructor(report_data) {
    this.id = report_data.id;
    this.url_id = report_data.url_id;
    this.status = report_data.status;
    this.message = report_data.message;
    this.created_at = report_data.created_at;
  }

  static async all() {
    var reports = await db("status_reports").select();

    return reports.map(report_data => new StatusReport(report_data));
  }

  static async latest(limit) {
    var reports = await db("status_reports")
      .orderBy("created_at", "desc")
      .limit(limit);

    return reports.map(report_data => new StatusReport(report_data));
  }

  static async create(status_attributes = {}) {
    var [id] = await db("status_reports").insert({
      url_id: status_attributes.url_id,
      status: status_attributes.status,
      message: status_attributes.message,
      created_at: status_attributes.created_at || moment().unix()
    });

    return await StatusReport.find(id);
  }

  async update(update_attributes) {
    await db("status_reports")
      .where("id", this.id)
      .update(update_attributes);

    return await StatusReport.find(this.id);
  }

  static async find(id) {
    var report_data = await db("status_reports")
      .where("id", id)
      .first();

    return new StatusReport(report_data);
  }

  static async olderThan(timestamp) {
    const reports_data = await db("status_reports").where(
      "created_at",
      "<",
      timestamp
    );

    return reports_data.map(report => new StatusReport(report));
  }

  static async withUrlId(url_id) {
    const reports_data = await db("status_reports").where("url_id", url_id);
    return reports_data.map(report => new StatusReport(report));
  }

  async del() {
    await db("status_reports")
      .where("id", this.id)
      .del();
  }

  isOkay() {
    return this.status / 100 < 4;
  }
}

module.exports = StatusReport;
