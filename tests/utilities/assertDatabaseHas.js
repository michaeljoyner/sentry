var db = require("../../database/connection");
var assert = require("assert");

async function assertDatabaseHas(table, data) {
  var result = await db(table)
    .where(data)
    .count("* as num_rows");

  const count = result[0].num_rows;

  assert.equal(count, 1, `Did not find a matching row in the ${table} table`);
}

module.exports = assertDatabaseHas;
