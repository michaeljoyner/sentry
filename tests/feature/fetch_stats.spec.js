let db = require("../../database/connection");
let assert = require("chai").assert;
let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let StatusReport = require("../../app/models/StatusReport");
let Url = require("../../app/models/Url");
let ReportSummary = require("../../app/models/ReportSummary");
let moment = require("moment");

chai.use(chaiHttp);

describe("Fetching general stats", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  it("returns all the empty stats", async () => {
    var res = await chai
      .request(server)
      .get(`/status-reports`)
      .send();

    var stats = res.body;

    const expected = {
      grand_totals: {
        urls: 0,
        successes: null,
        failures: null
      },
      last_checked: null,
      recent_failures: []
    };

    assert.deepEqual(expected, stats);
  });

  it("returns the correct stats", async () => {
    const recent_timestamp = moment().unix();
    const url = await Url.create("http://test.test");

    const report = await StatusReport.create({
      url_id: url.id,
      status: 500,
      message: "Test message",
      created_at: recent_timestamp
    });

    await ReportSummary.tally({
      url_id: url.id,
      successes: 888,
      failures: 22
    });

    const expected = {
      grand_totals: {
        urls: 1,
        successes: 888,
        failures: 22
      },
      last_checked: recent_timestamp,
      recent_failures: [
        {
          id: report.id,
          page_name: "http://test.test",
          created_at: report.created_at
        }
      ]
    };

    const res = await chai
      .request(server)
      .get(`/status-reports`)
      .send();

    const stats = res.body;

    assert.deepEqual(expected, stats);
  });
});
