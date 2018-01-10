exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("urls", table => {
      table.increments();
      table.string("url");
      table.boolean("should_report");
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("urls")]);
};
