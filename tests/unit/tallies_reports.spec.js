let assert = require("chai").assert;
let reportSummaries = require("../../app/reports/reportSummaries");
let db = require("../../database/connection");
let StatusReport = require("../../app/models/StatusReport");

describe("Tallying of status reports", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  async function makeReports(data) {
    let by_urls = data.map(url_data =>
      url_data.statuses.map(status =>
        StatusReport.create({
          url_id: url_data.id,
          status: status,
          message: ""
        })
      )
    );

    return await Promise.all(by_urls.reduce((acc, ar) => acc.concat(ar), []));
  }

  it("tallies given reports correctly", async () => {
    let reports = await makeReports([
      { id: 1, statuses: [200, 200, 200, 300, 200, 500, 400] },
      { id: 2, statuses: [400, 404, 200, 300, 200, 500, 400] },
      { id: 3, statuses: [400, 404, 500, 500, 500, 500, 400] },
      { id: 4, statuses: [200, 200, 200, 200, 200, 200, 200] }
    ]);

    const expected = [
      {
        url_id: 1,
        successes: 5,
        failures: 2
      },
      {
        url_id: 2,
        successes: 3,
        failures: 4
      },
      {
        url_id: 3,
        successes: 0,
        failures: 7
      },
      {
        url_id: 4,
        successes: 7,
        failures: 0
      }
    ];

    assert.deepEqual(expected, reportSummaries(reports));
  });
});
