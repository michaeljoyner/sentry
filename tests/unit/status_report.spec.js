let assert = require("chai").assert;
let StatusReport = require("../../app/models/StatusReport.js");
let db = require("../../database/connection");
let assertDatabaseHas = require("../utilities/assertDatabaseHas");

describe("Status Reports", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  it("creates a db entry", async () => {
    const data = {
      url_id: 1,
      status: 200,
      message: ""
    };

    await StatusReport.create(data);

    await assertDatabaseHas("status_reports", data);
  });

  it("returns an instance of StausReport from create method", async () => {
    const data = {
      url_id: 1,
      status: 200,
      message: ""
    };

    var report = await StatusReport.create(data);

    assert.instanceOf(report, StatusReport);
    assert.exists(report.id);
    assert.equal(report.url_id, 1);
    assert.equal(report.status, 200);
    assert.equal(report.message, "");
    assert.exists(report.created_at);
  });

  it("can find a status report from a given id", async () => {
    const data = {
      url_id: 1,
      status: 200,
      message: ""
    };

    var report = await StatusReport.create(data);

    var found_report = await StatusReport.find(report.id);

    assert.instanceOf(found_report, StatusReport);
    assert.deepEqual(found_report, report);
  });

  it("can return all reports", async () => {
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

    var reports = await StatusReport.all();

    assert.isArray(reports);
    assert.equal(2, reports.length);
    assert.exists(reports.find(report => report.url_id === 1));
    assert.exists(reports.find(report => report.url_id === 2));
    reports.forEach(report => {
      assert.instanceOf(report, StatusReport);
    });
  });

  it("can return the latest records of a given number", async () => {
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

    await StatusReport.create({
      url_id: 3,
      status: 400,
      message: "Test three"
    });

    var reports = await StatusReport.latest(2);

    assert.isArray(reports);
    assert.equal(2, reports.length);
    assert.exists(reports.find(report => report.url_id === 2));
    assert.exists(reports.find(report => report.url_id === 3));
    reports.forEach(report => {
      assert.instanceOf(report, StatusReport);
    });
  });

  it("knows if a report is okay or not", async () => {
    var reportA = await StatusReport.create({
      url_id: 1,
      status: 200,
      message: "Test one"
    });

    var reportB = await StatusReport.create({
      url_id: 2,
      status: 301,
      message: "Test two"
    });

    var reportC = await StatusReport.create({
      url_id: 1,
      status: 404,
      message: "Test one"
    });

    var reportD = await StatusReport.create({
      url_id: 2,
      status: 500,
      message: "Test two"
    });

    assert.isTrue(reportA.isOkay());
    assert.isTrue(reportB.isOkay());
    assert.isFalse(reportC.isOkay());
    assert.isFalse(reportD.isOkay());
  });
});
