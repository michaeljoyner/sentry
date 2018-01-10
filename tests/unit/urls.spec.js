let db = require("../../database/connection");
let assert = require("chai").assert;
let Url = require("../../app/models/Url");
let assertDatabaseMissing = require("../utilities/assertDatabaseMissing");
let assertDatabaseHas = require("../utilities/assertDatabaseHas");

describe("The Url Class", () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  it("returns a url instance from create method", async () => {
    var url = await Url.create("https://test.test");

    assert.instanceOf(url, Url);
    assert.equal(url.url, "https://test.test");
    assert.isTrue(url.should_report);
    assert.exists(url.created_at);
  });

  it("finds a url with a given id", async () => {
    var url = await Url.create("https://test.test");

    var found_url = await Url.find(url.id);

    assert.instanceOf(found_url, Url);
    assert.deepEqual(url, found_url);
  });

  it("can be deleted", async () => {
    var url = await Url.create("https://test.test");

    await url.delete();

    await assertDatabaseMissing("urls", { id: url.id });
  });

  it("can retrieve all urls", async () => {
    var urlA = await Url.create("http://one.test");
    var urlB = await Url.create("http://two.test");

    var urls = await Url.all();

    assert.isArray(urls);
    assert.equal(2, urls.length);
    assert.exists(urls.find(url => url.url === "http://one.test"));
    assert.exists(urls.find(url => url.url === "http://two.test"));
    urls.forEach(url => {
      assert.instanceOf(url, Url);
    });
  });

  it("can be stood down from being reported", async () => {
    var url = await Url.create("http://one.test");

    assert.isTrue(url.should_report);

    url.standDown();

    assert.isFalse(url.should_report);
    await assertDatabaseHas("urls", {
      url: "http://one.test",
      should_report: 0
    });
  });

  it("can be put back on guard for reporting", async () => {
    var url = await Url.create("http://one.test");

    url.standDown();
    assert.isFalse(url.should_report);

    url.onGuard();

    assert.isTrue(url.should_report);
    await assertDatabaseHas("urls", {
      url: "http://one.test",
      should_report: 1
    });
  });
});
