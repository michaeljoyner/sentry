let environment = process.env.NODE_ENV || "production";
let knex = require("knex")(require("../knexfile")[environment]);
module.exports = knex;
