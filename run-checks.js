require("dotenv").config();
let Url = require("./app/models/Url");
let Check = require("./app/Checks/Check");
let db = require("./database/connection");

Url.all().then(urls => {
  const checks = urls.map(url => Check.onUrl(url));
  Promise.all(checks)
    .then(() => db.destroy())
    .catch(() => {});
});
