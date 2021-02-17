const sql = require("./db.js");

// constructor
const Logfrontend = function(logfrontend) {
  this.message = logfrontend.message;
  this.event_type = logfrontend.eventType;
  this.url = logfrontend.url;
  // this.datetime = logfrontend.datetime, // .toISOString().replace(/T/, ' ').replace(/\..+/, ''); created at databasa as default value
  this.user = logfrontend.user;
};

Logfrontend.create = (newLog, result) => {
  console.log(newLog);
  sql.query("INSERT INTO log_frontend SET ?", newLog, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created log: ", { id: res.insertId, ...newLog });
    result(null, { id: res.insertId, ...newLog });
  });
};

module.exports = Logfrontend;
