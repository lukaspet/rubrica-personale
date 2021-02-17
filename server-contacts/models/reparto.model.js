const sql = require("./db.js");

// constructor
const Reparto = function(reparto) {
  this.nomeReparto = reparto.nomeReparto;
};

Reparto.create = (newReparto, result) => {
  sql.query("INSERT reparto SET ?", newReparto, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created reparto: ", { id: res.insertId, ...newReparto });
    result(null, { id: res.insertId, ...newReparto });
  });
};

Reparto.getAll = result => {
  sql.query("SELECT * FROM reparto r ORDER BY r.nomeReparto ASC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("reparto: ", res);
    result(null, res);
  });
};

Reparto.remove = (id, result) => {
  sql.query("DELETE FROM reparto WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Reparto with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted reparto with id: ", id);
    result(null, res);
  });
};

module.exports = Reparto;
