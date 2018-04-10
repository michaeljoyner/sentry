require("dotenv").config();

let express = require("express");
let app = require("./bootstrap/app")(express);

require("./bootstrap/auth")(app);
require("./bootstrap/routes")(app);

app.use(express.static("public"));
let server = app.listen(3030, () => {});

module.exports = server;
