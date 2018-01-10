let db = require("../../database/connection");
let assert = require("chai").assert;
let assertDatabaseHas = require("../utilities/assertDatabaseHas");
let Url = require("../../app/models/Url");
let http = require("http");
let Check = require("../../app/Checks/Check");
let StatusReport = require("../../app/models/StatusReport");
let moxios = require("moxios");
let sinon = require("sinon");

describe("Doing site checks", () => {
  beforeEach(async () => {
    moxios.install();
    await db.migrate.latest();
    sinon.spy(Check, "report");
  });

  afterEach(async () => {
    moxios.uninstall();
    await db.migrate.rollback();
    Check.report.restore();
  });

  it("can check a url and create a status report", async () => {
    var url = await Url.create("https://test.test");

    moxios.stubRequest("https://test.test", {
      status: 200
    });

    await Check.onUrl(url);

    await assertDatabaseHas("status_reports", {
      url_id: url.id,
      status: 200,
      message: ""
    });
  });

  it("reports a 500 status check", async () => {
    var url = await Url.create("https://test.test");

    moxios.stubRequest("https://test.test", {
      status: 500
    });

    await Check.onUrl(url);

    assert.isTrue(Check.report.calledOnce);
  });

  it("reports a 400 status check", async () => {
    var url = await Url.create("https://test.test");

    moxios.stubRequest("https://test.test", {
      status: 400
    });

    await Check.onUrl(url);

    assert.isTrue(Check.report.calledOnce);
  });
});
