let assert = require("chai").assert;
let db = require("../../database/connection");
let assertDatabaseHas = require("../utilities/assertDatabaseHas");
let ReportSummary = require("../../app/models/ReportSummary");

describe("Report Summaries", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  it("creates a new tally for a new url", async () => {
    const data = {
      url_id: 1,
      successes: 200,
      failures: 3
    };

    await ReportSummary.tally(data);

    await assertDatabaseHas("report_summaries", data);
  });

  it("updates the tally for an existing url", async () => {
    await ReportSummary.tally({
      url_id: 1,
      successes: 200,
      failures: 3
    });

    await ReportSummary.tally({
      url_id: 1,
      successes: 300,
      failures: 4
    });

    await assertDatabaseHas("report_summaries", {
      url_id: 1,
      successes: 500,
      failures: 7
    });
  });

  it("returns an existing summary based on url id if exists", async () => {
    await ReportSummary.tally({
      url_id: 1,
      successes: 200,
      failures: 3
    });

    var summary = await ReportSummary.getByUrlId(1);

    assert.instanceOf(summary, ReportSummary);
    assert.equal(1, summary.url_id);
    assert.equal(200, summary.successes);
    assert.equal(3, summary.failures);
  });

  it("can be updated", async () => {
    await ReportSummary.tally({
      url_id: 1,
      successes: 200,
      failures: 3
    });

    var summary = await ReportSummary.getByUrlId(1);

    summary = await summary.update({
      successes: 700,
      failures: 8
    });

    assert.equal(700, summary.successes);
    assert.equal(8, summary.failures);

    await assertDatabaseHas("report_summaries", {
      url_id: 1,
      successes: 700,
      failures: 8
    });
  });
});
