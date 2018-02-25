let db = require("../../database/connection");
let assert = require("chai").assert;
let server = require("../../server");
let chai = require("chai");
let chaiHttp = require("chai-http");
let StatusReport = require("../../app/models/StatusReport");
let moxios = require("moxios");

chai.use(chaiHttp);

describe("Fetching local links from a page", () => {
  beforeEach(async () => {
    moxios.install();
    await db.migrate.latest();
  });

  afterEach(async () => {
    moxios.uninstall();
    await db.migrate.rollback();
  });

  it("returns a list of unique linked site urls", async () => {
    moxios.stubRequest("https://page.test", {
      status: 200,
      responseText: `
            <html>
            <head>
                <title>Test Page</title>
            </head>
            <body>
                <nav>
                    <a href="/page2.html"></a>
                    <a href="/page3.html"></a>
                    <a href="/page4.html"></a>
                </nav>
                <div>
                    <p>Useless stuff</p>
                </div>
                <footer>
                <a href="/page5.html"></a>
                <a href="/page2.html"></a>
                <a href="http://different-site.test"></a>
                <a href="https://page.test/page6.html"></a>
                </footer>
            </body>
            </html>
        `
    });

    var res = await chai
      .request(server)
      .get(`/page-links?url=` + encodeURIComponent("https://page.test"))
      .send();

    assert.deepEqual(
      [
        "https://page.test/page2.html",
        "https://page.test/page3.html",
        "https://page.test/page4.html",
        "https://page.test/page5.html",
        "https://page.test/page6.html"
      ],
      res.body
    );
  });
});
