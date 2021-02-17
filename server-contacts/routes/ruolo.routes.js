module.exports = app => {
  const ruolo = require("../controllers/ruolo.controller.js");

  // Create a new Ruolo
  app.post("/contatti/api/ruolo", ruolo.create);

  // Retrieve all Ruolo
  app.get("/contatti/api/ruolo", ruolo.findAll);

  // Delete a Ruolo with id
  app.delete("/contatti/api/ruolo/:id", ruolo.delete);

};
