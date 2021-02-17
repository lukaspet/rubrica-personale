module.exports = app => {
  const reparto = require("../controllers/reparto.controller.js");

  // Create a new reparto
  app.post("/contatti/api/reparto", reparto.create);

  // Retrieve all reparto
  app.get("/contatti/api/reparto", reparto.findAll);

  // Delete a reparto with id
  app.delete("/contatti/api/reparto/:id", reparto.delete);

};
