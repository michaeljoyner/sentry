let bodyParser = require("body-parser");

let session = require("express-session");
let csrf = require("csurf");
let handlebars = require("express-handlebars");

module.exports = function(express) {
  let app = express();

  app.set("views", "./resources/views");
  app.engine("handlebars", handlebars());
  app.set("view engine", "handlebars");

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(
    session({
      secret: "sentry",
      resave: false,
      saveUninitialized: true
    })
  );

  const ignoreMethods =
    process.env.NODE_ENV !== "production"
      ? ["GET", "HEAD", "OPTIONS", "POST", "PUT", "DELETE"]
      : ["GET", "HEAD", "OPTIONS"];
  app.use(csrf({ cokies: false, ignoreMethods }));

  return app;
};
