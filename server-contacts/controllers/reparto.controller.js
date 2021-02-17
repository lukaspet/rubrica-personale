const Reparto = require("../models/reparto.model.js");

// Create and Save a new Reparto
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Reparto
  const reparto = new Reparto({
    nomeReparto: req.body.nomeReparto,
  });

  // Save Reparto in the database
  Reparto.create(reparto, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Reparto."
      });
    else res.send(data);
  });
};

// Retrieve all Reparto from the database.
exports.findAll = (req, res) => {
  Reparto.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving reparto."
      });
    else res.send(data);
  });
};

// Delete a Reparto with the specified id in the request
exports.delete = (req, res) => {
  Reparto.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Reparto with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Reparto with id " + req.params.id
        });
      }
    } else res.send({ message: `Reparto was deleted successfully!` });
  });
};

