const Logfrontend = require("../models/logfrontend.model.js");

// Create and Save a new Logfrontend
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Logfrontend
  const logfrontend = new Logfrontend({
    message: req.body.message,
    user: req.body.user,
    eventType: req.body.eventType,
    // datetime: req.body.datetime,
    url: req.body.url,
  });

  // Save Logfrontend in the database
  Logfrontend.create(logfrontend, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Filiale."
      });
    else res.send(data);
  });
};


