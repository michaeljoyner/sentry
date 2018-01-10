let db = require("../../database/connection");
let assert = require("chai").assert;
let Url = require("../../app/models/Url");
let Check = require("../../app/Checks/Check");
let StatusReport = require("../../app/models/StatusReport");
let moxios = require("moxios");

describe("Reporting on checks", () => {
  beforeEach(async () => {
    moxios.install();
    await db.migrate.latest();
  });

  afterEach(async () => {
    moxios.uninstall();
    await db.migrate.rollback();
  });

  it("stands down a url from reporting once successfully reported", async () => {
    var url = await Url.create("https://test.test");
    var report = await StatusReport.create({
      url_id: url.id,
      status: 400,
      message: ""
    });

    moxios.stubRequest("https://mock-slack.test", { status: 200 });

    await Check.report(url, report);

    assert.isFalse(url.should_report);
  });

  it("does not stand down the url if a report fails", async () => {
    var url = await Url.create("https://test.test");
    var report = await StatusReport.create({
      url_id: url.id,
      status: 400,
      message: ""
    });

    moxios.stubRequest("https://mock-slack.test", { status: 500 });

    await Check.report(url, report);

    assert.isTrue(url.should_report);
  });
});
