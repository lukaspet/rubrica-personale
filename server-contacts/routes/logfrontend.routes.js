module.exports = app => {
  const logfrontend = require("../controllers/logfrontend.controller.js");

  // Create a new Filiale
  app.post("/contatti/api/logfrontend", logfrontend.create);

  // Retrieve all Filiali
  // app.get("/filiale", filiale.findAll);

  // Delete a Filiale with id
  // app.delete("/filiale/:id", filiale.delete);

};
