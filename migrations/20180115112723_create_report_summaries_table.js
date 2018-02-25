exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("report_summaries", table => {
      table.increments();
      table.integer("url_id");
      table.integer("successes");
      table.integer("failures");
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("report_summaries")]);
};
