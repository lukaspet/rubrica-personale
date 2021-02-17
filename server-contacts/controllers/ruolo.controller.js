const Ruolo = require("../models/ruolo.model.js");

// Create and Save a new Ruolo
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Ruolo
  const ruolo = new Ruolo({
    nomeRuolo: req.body.nomeRuolo,
  });

  // Save Ruolo in the database
  Ruolo.create(ruolo, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Ruolo."
      });
    else res.send(data);
  });
};

// Retrieve all Ruolo from the database.
exports.findAll = (req, res) => {
  Ruolo.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ruolo."
      });
    else res.send(data);
  });
};

// Delete a Ruolo with the specified id in the request
exports.delete = (req, res) => {
  Ruolo.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Ruolo with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Ruolo with id " + req.params.id
        });
      }
    } else res.send({ message: `Ruolo was deleted successfully!` });
  });
};

