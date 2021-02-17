const sql = require("./db.js");

// constructor
const Ruolo = function(ruolo) {
  this.nomeRuolo = ruolo.nomeRuolo;
};

Ruolo.create = (newRuolo, result) => {
  sql.query("INSERT INTO ruolo SET ?", newRuolo, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created ruolo: ", { id: res.insertId, ...newRuolo });
    result(null, { id: res.insertId, ...newRuolo });
  });
};

Ruolo.getAll = result => {
  sql.query("SELECT * FROM ruolo r ORDER BY r.nomeRuolo ASC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("ruolo: ", res);
    result(null, res);
  });
};

Ruolo.remove = (id, result) => {
  sql.query("DELETE FROM ruolo WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Ruolo with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted ruolo with id: ", id);
    result(null, res);
  });
};

module.exports = Ruolo;
