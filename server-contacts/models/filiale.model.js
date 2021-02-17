const sql = require("./db.js");

// constructor
const Filiale = function(filiale) {
  this.nomeFiliale = filiale.nomeFiliale;
  this.indirizzo = filiale.indirizzo,
  this.citta = filiale.citta,
  this.provincia = filiale.provincia,
  this.cap = filiale.cap,
  this.email = filiale.email,
  this.telefono = filiale.telefono,
  this.fax = filiale.fax
};

Filiale.create = (newFiliale, result) => {
  sql.query("INSERT INTO filiale SET ?", newFiliale, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created filiale: ", { id: res.insertId, ...newFiliale });
    result(null, { id: res.insertId, ...newFiliale });
  });
};

Filiale.getAll = result => {
  sql.query("SELECT * FROM filiale f ORDER BY f.nomeFiliale ASC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("filiale: ", res);
    result(null, res);
  });
};

Filiale.updateById = (id, filiale, result) => {
  sql.query(
    "UPDATE filiale SET nomeFiliale = ?, indirizzo = ?, citta = ?, provincia = ?, cap = ?, email = ?, telefono = ?, fax = ? WHERE id = ?",
    [filiale.nomeFiliale, filiale.indirizzo, filiale.citta, filiale.provincia, filiale.cap, filiale.email, filiale.telefono, filiale.fax, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Filiale with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated filiale: ", { id: id, ...filiale });
      result(null, { id: id, ...filiale });
    }
  );
};

Filiale.remove = (id, result) => {
  sql.query("DELETE FROM filiale WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Filiale with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted filiale with id: ", id);
    result(null, res);
  });
};

module.exports = Filiale;
