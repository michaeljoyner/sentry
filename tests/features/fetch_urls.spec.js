let db = require("../../database/connection");
let assert = require("chai").assert;
let Url = require("../../app/models/Url");
let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let assertDatabaseMissing = require("../utilities/assertDatabaseMissing");

chai.use(chaiHttp);

describe("Fetching a list of all urls", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  it("return the list of all urls", async () => {
    [1, 2, 3, 4, 5].forEach(
      async index => await Url.create(`https://test_${index}.test`)
    );

    var res = await chai
      .request(server)
      .get(`/urls`)
      .send();

    assert.equal(200, res.status);

    var urls = res.body;

    assert.isArray(urls);
    assert.equal(5, urls.length);
    [1, 2, 3, 4, 5].forEach(index => {
      assert.exists(urls.find(url => url.url === `https://test_${index}.test`));
    });
  });
});
