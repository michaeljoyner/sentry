let express = require("express");
let router = express.Router();
let urlsController = require("../controllers/UrlsController");
let reportsController = require("../controllers/ReportsController");
let monitoredUrlsController = require("../controllers/MonitoredUrlsController");
let pageLinksController = require("../controllers/PageLinksController");
let path = require("path");

router.get("/", function(req, res, next) {
  return res.sendFile(
    path.resolve(__dirname + "/../../resources/views/home.html")
  );
});

router.get("/urls", urlsController.index);

router.post("/urls", urlsController.create);

router.get("/urls/:id", urlsController.show);

router.delete("/urls/:id", urlsController.delete);

router.get("/status-reports", reportsController.index);

router.post("/monitored-urls", monitoredUrlsController.create);

router.get("/page-links", pageLinksController.index);

module.exports = router;
