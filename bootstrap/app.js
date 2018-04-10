let bodyParser = require("body-parser");

let session = require("express-session");

module.exports = function(express) {
  let app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(
    session({
      secret: "sentry",
      resave: false,
      saveUninitialized: true
    })
  );

  return app;
};
