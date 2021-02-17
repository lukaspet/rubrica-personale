const Filiale = require("../models/filiale.model.js");

// Create and Save a new Filiale
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Filiale
  const filiale = new Filiale({
    nomeFiliale: req.body.nomeFiliale,
    indirizzo: req.body.indirizzo,
    citta: req.body.citta,
    provincia: req.body.provincia,
    cap: req.body.cap,
    email: req.body.email,
    telefono: req.body.telefono,
    fax: req.body.fax
  });

  // Save Filiale in the database
  Filiale.create(filiale, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Filiale."
      });
    else res.send(data);
  });
};

// Update Filiale
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Filiale.updateById(
    req.params.id,
    new Filiale(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Filiale with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Filiale with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Retrieve all Filiali from the database.
exports.findAll = (req, res) => {
  Filiale.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving filiali."
      });
    else res.send(data);
  });
};

// Delete a Filiale with the specified id in the request
exports.delete = (req, res) => {
  Filiale.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Filiale with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Filiale with id " + req.params.id
        });
      }
    } else res.send({ message: `Filiale was deleted successfully!` });
  });
};

