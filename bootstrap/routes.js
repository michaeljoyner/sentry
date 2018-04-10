let routes = require("../app/routes/routes");

module.exports = function(app) {
  app.use(routes);

  return app;
};
