let db = require("../../database/connection");

class Url {
  constructor(url_data) {
    this.url = url_data.url;
    this.id = url_data.id;
    this.should_report = url_data.should_report === 1;
    this.created_at = url_data.created_at;
  }

  static async all() {
    var urls = await db("urls").select();

    return urls.map(url_data => new Url(url_data));
  }

  static async create(url) {
    var [id] = await db("urls").insert({
      url: url,
      should_report: true,
      created_at: new Date().getTime()
    });

    return await Url.find(id);
  }

  static async find(id) {
    var url_data = await db("urls")
      .where("id", id)
      .first();

    return new Url(url_data);
  }

  async delete() {
    await db("urls")
      .where("id", this.id)
      .delete();
  }

  standDown() {
    this.should_report = false;
    this.update();
  }

  onGuard() {
    this.should_report = true;
    this.update();
  }

  async update() {
    await db("urls")
      .where("id", this.id)
      .update({
        should_report: this.should_report,
        updated_at: new Date().getTime()
      });
  }
}

module.exports = Url;
