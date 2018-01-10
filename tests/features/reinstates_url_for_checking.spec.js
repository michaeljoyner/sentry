let db = require("../../database/connection");
let assert = require("chai").assert;
let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let Url = require("../../app/models/Url");
let assertDatabaseHas = require("../utilities/assertDatabaseHas");

chai.use(chaiHttp);

describe("Fetching a list of reports", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  it("return a list of recent reports", async () => {
    var url = await Url.create("http://test.test");
    url.standDown();

    var res = await chai
      .request(server)
      .post(`/monitored-urls`)
      .send({ url_id: url.id });

    assert.equal(200, res.status);
    await assertDatabaseHas("urls", {
      id: url.id,
      should_report: 1
    });
  });
});
