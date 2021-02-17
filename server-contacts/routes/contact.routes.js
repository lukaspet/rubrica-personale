module.exports = app => {
  const contact = require("../controllers/contact.controller.js");

  // Create a new Contact
  app.post("/contatti/api/contact", contact.create);

  // Update Contact with id
  app.put("/contatti/api/contact/:id", contact.update);

  // Retrieve all Contacts
  app.get("/contatti/api/contact", contact.findAll);

  // Delete a Cotnact with id
  app.delete("/contatti/api/contact/:id", contact.delete);

};
