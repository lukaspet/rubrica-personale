module.exports = app => {
  const filiale = require("../controllers/filiale.controller.js");

  // Create a new Filiale
  app.post("/contatti/api/filiale", filiale.create);

  // Update Filiale with id
  app.put("/contatti/api/filiale/:id", filiale.update);

  // Retrieve all Filiali
  app.get("/contatti/api/filiale", filiale.findAll);

  // Delete a Filiale with id
  app.delete("/contatti/api/filiale/:id", filiale.delete);

};
