let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let db = require("../../database/connection");
let assert = require("chai").assert;
let assertDatabaseHas = require("../utilities/assertDatabaseHas");
let Url = require("../../app/models/Url");
let StatusReport = require("../../app/models/StatusReport");
let ReportSummary = require("../../app/models/ReportSummary");
let moment = require("moment");
chai.use(chaiHttp);

describe("Getting Url data", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  after(async () => {
    await server.close();
  });

  it("returns the url data", async () => {
    const url = await Url.create("http://page.test");
    const timestamp = moment().unix();

    await StatusReport.create({
      url_id: url.id,
      status: 200,
      message: "",
      created_at: timestamp
    });

    await StatusReport.create({
      url_id: url.id,
      status: 400,
      message: "",
      created_at: timestamp
    });

    await ReportSummary.tally({
      url_id: url.id,
      successes: 77,
      failures: 11
    });

    var res = await chai
      .request(server)
      .get(`/urls/${url.id}`)
      .send();

    assert.equal(res.status, 200);

    const expected = {
      id: url.id,
      url: "http://page.test",
      report_summary: {
        successes: 77,
        failures: 11
      },
      recent_reports: [
        { status: 200, message: "", created_at: timestamp },
        { status: 400, message: "", created_at: timestamp }
      ]
    };

    assert.deepEqual(expected, res.body);
  });
});
