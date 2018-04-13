let express = require("express");
let router = express.Router();
let urlsController = require("../controllers/UrlsController");
let reportsController = require("../controllers/ReportsController");
let monitoredUrlsController = require("../controllers/MonitoredUrlsController");
let pageLinksController = require("../controllers/PageLinksController");
let path = require("path");
let AuthController = require("../controllers/AuthController");
let isLoggedIn = require("../middleware/IsLoggedIn");

router.get("/", isLoggedIn, function(req, res) {
  const csrf_token = req.csrfToken();
  return res.render("home", { csrf_token });
});

router.get("/login", function(req, res, next) {
  const csrf_token = req.csrfToken();
  return res.render("login", { csrf_token });
});

router.get("/urls", urlsController.index);

router.post("/urls", urlsController.create);

router.get("/urls/:id", urlsController.show);

router.delete("/urls/:id", urlsController.delete);

router.get("/status-reports", reportsController.index);

router.post("/monitored-urls", monitoredUrlsController.create);

router.get("/page-links", pageLinksController.index);

router.post("/login", AuthController.login);

module.exports = router;
