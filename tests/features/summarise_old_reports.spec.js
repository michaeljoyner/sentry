let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let db = require("../../database/connection");
let assert = require("chai").assert;
let assertDatabaseHas = require("../utilities/assertDatabaseHas");
let assertDatabaseMissing = require("../utilities/assertDatabaseMissing");
let Url = require("../../app/models/Url");
let StatusReport = require("../../app/models/StatusReport");
let moment = require("moment");
let ReportSummary = require("../../app/models/ReportSummary");

describe("Summarising old reports", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  async function createOldReports(url, statuses) {
    return await Promise.all(
      statuses.map(status_code =>
        StatusReport.create({
          url_id: url.id,
          status: status_code,
          message: ""
        }).then(report =>
          report.update({
            created_at: moment()
              .subtract(3, "days")
              .format("YYYY-MM-DD HH:mm:ss")
          })
        )
      )
    );
  }

  it("create a summary for each url", async () => {
    var siteA = await Url.create("http://site_a.test");
    var siteB = await Url.create("http://site_b.test");

    var reportsA = await createOldReports(siteA, [200, 200, 200, 500]);
    var reportsB = await createOldReports(siteB, [400, 200, 200, 500]);

    await ReportSummary.run();

    await assertDatabaseHas("report_summaries", {
      url_id: siteA.id,
      successes: 3,
      failures: 1
    });

    await assertDatabaseHas("report_summaries", {
      url_id: siteB.id,
      successes: 2,
      failures: 2
    });

    await assertDatabaseMissing("status_reports", {
      url_id: siteA.id
    });

    await assertDatabaseMissing("status_reports", {
      url_id: siteB.id
    });
  });
});
