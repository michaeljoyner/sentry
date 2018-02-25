let assert = require("chai").assert;
let StatusReport = require("../../app/models/StatusReport.js");
let db = require("../../database/connection");
let assertDatabaseHas = require("../utilities/assertDatabaseHas");
let assertDatabaseMissing = require("../utilities/assertDatabaseMissing");
let moment = require("moment");

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
      message: "Test one",
      created_at: moment()
        .subtract(4, "hours")
        .unix()
    });

    await StatusReport.create({
      url_id: 2,
      status: 500,
      message: "Test two",
      created_at: moment()
        .subtract(3, "hours")
        .unix()
    });

    await StatusReport.create({
      url_id: 3,
      status: 400,
      message: "Test three",
      created_at: moment()
        .subtract(2, "hours")
        .unix()
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

  it("can be updated", async () => {
    var reportA = await StatusReport.create({
      url_id: 1,
      status: 200,
      message: "Test one"
    });

    reportA = await reportA.update({
      created_at: moment()
        .subtract(2, "days")
        .startOf("day")
        .unix()
    });

    assert.equal(
      moment()
        .subtract(2, "days")
        .startOf("day")
        .unix(),
      reportA.created_at
    );
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

  it("can query for status records older than a given timestamp", async () => {
    await StatusReport.create({
      url_id: 1,
      status: 200,
      message: "Test one",
      created_at: moment()
        .subtract(4, "days")
        .unix()
    });

    await StatusReport.create({
      url_id: 2,
      status: 500,
      message: "Test two",
      created_at: moment()
        .subtract(3, "days")
        .unix()
    });

    await StatusReport.create({
      url_id: 3,
      status: 400,
      message: "Test three",
      created_at: moment()
        .subtract(1, "day")
        .unix()
    });

    let reports = await StatusReport.olderThan(
      moment()
        .subtract(2, "days")
        .unix()
    );
    assert.isArray(reports);
    assert.equal(2, reports.length);
    assert.exists(reports.find(report => report.url_id === 2));
    assert.exists(reports.find(report => report.url_id === 1));
    reports.forEach(report => {
      assert.instanceOf(report, StatusReport);
    });
  });

  it("can be deleted", async () => {
    let report = await StatusReport.create({
      url_id: 2,
      status: 500,
      message: "Test two"
    });

    await report.del();

    await assertDatabaseMissing("status_reports", { id: report.id });
  });

  it("can query by url_id", async () => {
    await StatusReport.create({
      url_id: 1,
      status: 111,
      message: "Test one"
    });

    await StatusReport.create({
      url_id: 2,
      status: 500,
      message: "Test two"
    });

    await StatusReport.create({
      url_id: 1,
      status: 333,
      message: "Test three"
    });

    let reports = await StatusReport.withUrlId(1);
    assert.isArray(reports);
    assert.equal(2, reports.length);
    assert.exists(reports.find(report => report.status === 111));
    assert.exists(reports.find(report => report.status === 333));
    reports.forEach(report => {
      assert.instanceOf(report, StatusReport);
    });
  });
});
