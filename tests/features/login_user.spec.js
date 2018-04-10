let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let db = require("../../database/connection");
let assert = require("chai").assert;
let assertDatabaseHas = require("../utilities/assertDatabaseHas");
let url = require("url");
let expect = chai.expect;
let session = require("express-session");
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

  it("a non logged in user is redirected to login", async () => {
    var res = await chai.request(server).get("/");

    const redirect_url = url.parse(res.redirects[0]);
    expect(res).to.be.redirect;

    assert.equal(redirect_url.pathname, "/login");
  });

  it("an existing user can log in", async () => {
    process.env.AUTH_USER = "test@test.com";
    process.env.AUTH_PASSWORD = "test_secret";
    var res = await chai
      .request(server)
      .post("/login")
      .send({
        username: "test@test.com",
        password: "test_secret"
      });

    const redirect_url = url.parse(res.redirects[0]);
    expect(res).to.be.redirect;

    assert.equal(redirect_url.pathname, "/");
  });

  it("redirects back to login if incorrect username is given", async () => {
    process.env.AUTH_USER = "test@test.com";
    process.env.AUTH_PASSWORD = "test_secret";
    var res = await chai
      .request(server)
      .post("/login")
      .send({
        username: "other@user.com",
        password: "test_secret"
      });

    const redirect_url = url.parse(res.redirects[0]);
    expect(res).to.be.redirect;

    assert.equal(redirect_url.pathname, "/login");
  });

  it("redirects back to login if incorrect password is given", async () => {
    process.env.AUTH_USER = "test@test.com";
    process.env.AUTH_PASSWORD = "test_secret";
    var res = await chai
      .request(server)
      .post("/login")
      .send({
        username: "test@test.com",
        password: "wrong_secret"
      });

    const redirect_url = url.parse(res.redirects[0]);
    expect(res).to.be.redirect;

    assert.equal(redirect_url.pathname, "/login");
  });
});
