exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("status_reports", table => {
      table.increments();
      table.integer("url_id");
      table.integer("status");
      table.string("message").nullable();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("status_reports")]);
};
