let axios = require("axios");
let StatusReport = require("../models/StatusReport");

class Check {
  static async onUrl(url) {
    var resp;
    try {
      resp = await axios.get(url.url);
    } catch (err) {
      resp = err.response || { status: 500 };
    }

    var report = await StatusReport.create({
      url_id: url.id,
      status: resp.status,
      message: ""
    });

    if (report.isOkay()) {
      url.onGuard();
      return;
    }

    Check.report(url, report);
  }

  static async report(url, report) {
    var webhook_url = process.env.SLACK_URL;

    try {
      await axios.post(webhook_url, {
        text: `${url.url} responded with a ${report.status}. Check it out`
      });
      url.standDown();
    } catch (err) {}
  }
}

module.exports = Check;
