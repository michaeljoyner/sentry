let express = require("express");
let app = express();
let routes = require("./app/routes/routes");
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);
app.use(express.static("public"));
var server = app.listen(3030, () => {});

module.exports = server;
