const Contact = require("../models/contact.model.js");

// Create and Save a new Contact
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Contact
  const contact = new Contact({
    nome: req.body.nome,
    cognome: req.body.cognome,
    filialeId: req.body.filialeId,
    ruoloId: req.body.ruoloId,
    repartoId: req.body.repartoId,
    email: req.body.email,
    cellulare: req.body.cellulare,
    telefonoFisso: req.body.telefonoFisso
  });

  // Save Contact in the database
  Contact.create(contact, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Contact."
      });
    else res.send(data);
  });
};

// Update Contact
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Contact.updateById(
    req.params.id,
    new Contact(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Contact with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Contact with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Retrieve all Contacts from the database.
exports.findAll = (req, res) => {
  Contact.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving contacts."
      });
    else res.send(data);
  });
};

// Delete a Contact with the specified id in the request
exports.delete = (req, res) => {
  Contact.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Contact with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Contact with id " + req.params.id
        });
      }
    } else res.send({ message: `Contact was deleted successfully!`, data });
  });
};

