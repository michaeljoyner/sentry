let db = require("../../database/connection");
let assert = require("chai").assert;
let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let StatusReport = require("../../app/models/StatusReport");

chai.use(chaiHttp);

describe("Fetching a list of reports", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  it("return a list of recent reports", async () => {
    await StatusReport.create({
      url_id: 1,
      status: 200,
      message: "Test one"
    });

    await StatusReport.create({
      url_id: 2,
      status: 500,
      message: "Test two"
    });

    var res = await chai
      .request(server)
      .get(`/status-reports`)
      .send();

    var reports = res.body;

    assert.isArray(reports);
    assert.equal(2, reports.length);
    assert.exists(reports.find(report => report.url_id === 1));
    assert.exists(reports.find(report => report.url_id === 2));
  });

  it("only returns the most recent one hundred checks", async () => {
    for (let i = 0; i < 120; i++) {
      await StatusReport.create({
        url_id: i + 1,
        status: 200,
        message: ""
      });
    }

    var res = await chai
      .request(server)
      .get(`/status-reports`)
      .send();

    var reports = res.body;

    assert.isArray(reports);
    assert.equal(100, reports.length);
  });
});
