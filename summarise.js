require("dotenv").config();
let ReportSummary = require("./app/models/ReportSummary");
let db = require("./database/connection");

ReportSummary.run()
  .then(() => db.destroy())
  .catch(() => {});
