const sql = require("./db.js");

// constructor
const Contact = function(contact) {
  this.nome = contact.nome;
  this.cognome = contact.cognome;
  this.telefonoFisso = contact.telefonoFisso;
  this.email = contact.email;
  this.cellulare = contact.cellulare;
  if(contact.filialeId === undefined)
  {contact.filialeId = 0}
  this.filialeId = contact.filialeId;
  if(contact.ruoloId === undefined)
  {contact.ruoloId = 0}
  this.ruoloId = contact.ruoloId;
  if(contact.repartoId === undefined)
  {contact.repartoId = 0}
  this.repartoId = contact.repartoId;
};

Contact.create = (newContact, result) => {
  sql.query("INSERT INTO rubrica_personale SET ?", newContact, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created contact: ", { id: res.insertId, ...newContact });
    result(null, { id: res.insertId, ...newContact });
  });
};

Contact.getAll = result => {
  sql.query("SELECT * FROM rubrica_personale r JOIN ruolo ru ON r.ruoloId = ru.id WHERE ru.visibilieRubrica = 0 ORDER BY r.cognome ASC, r.nome ASC", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("contact: ", res);
    result(null, res);
  });
};

Contact.updateById = (id, contact, result) => {
  sql.query(
    "UPDATE rubrica_personale SET nome = ?, cognome = ?, telefonoFisso = ?, cellulare = ?, email = ?, ruoloId = ?, filialeId = ?, repartoId = ? WHERE id = ?",
    [contact.nome, contact.cognome, contact.telefonoFisso, contact.cellulare, contact.email, contact.ruoloId, contact.filialeId, contact.repartoId, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Contact with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated contact: ", { id: id, ...contact });
      result(null, { id: id, ...contact });
    }
  );
};

Contact.remove = (id, result) => {
  sql.query("DELETE FROM rubrica_personale WHERE id = ?", id, (err, res) => {
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

    console.log("deleted contact with id: ", id);
    result(null, {res, id});
  });
};

module.exports = Contact;
