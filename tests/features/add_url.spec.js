let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let db = require("../../database/connection");
let assert = require("chai").assert;
let assertDatabaseHas = require("../utilities/assertDatabaseHas");
let Url = require("../../app/models/Url");
chai.use(chaiHttp);

describe("Adding a Url", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  after(async () => {
    await server.close();
  });

  it("can add a url", async () => {
    var res = await chai
      .request(server)
      .post("/urls")
      .send({ url: "https://test.test" });

    assert.equal(res.status, 200);

    await assertDatabaseHas("urls", { url: "https://test.test" });
  });

  it("multiple urls can be added", async () => {
    var res = await chai
      .request(server)
      .post("/urls")
      .send({ url: ["https://test.test", "https://test_two.test"] });

    assert.equal(res.status, 200);

    await assertDatabaseHas("urls", { url: "https://test.test" });
    await assertDatabaseHas("urls", { url: "https://test_two.test" });
  });
});
