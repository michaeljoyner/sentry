let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, { name: "Testy", id: 1 });
  });

  passport.use(
    new LocalStrategy((username, password, done) => {
      if (
        username === process.env.AUTH_USER &&
        password === process.env.AUTH_PASSWORD
      ) {
        return done(null, {
          id: 1,
          name: "Testy"
        });
      }
      return done(null, false);
    })
  );

  return app;
};
