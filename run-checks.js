require("dotenv").config();
let Url = require("./app/models/Url");
let Check = require("./app/Checks/Check");

Url.all().then(urls => checkUrls(urls));

function checkUrls(urls) {
  urls.forEach(url => Check.onUrl(url));
}
