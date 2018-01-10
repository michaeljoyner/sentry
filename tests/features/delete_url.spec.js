let db = require("../../database/connection");
let assert = require("chai").assert;
let Url = require("../../app/models/Url");
let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let assertDatabaseMissing = require("../utilities/assertDatabaseMissing");

chai.use(chaiHttp);

describe("Deleting a url from the database", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  it("deletes a url record from the database", async () => {
    var url = await Url.create("https://test.test");

    var res = await chai
      .request(server)
      .delete(`/urls/${url.id}`)
      .send();

    assert.equal(200, res.status);

    await assertDatabaseMissing("urls", { id: url.id });
  });
});
