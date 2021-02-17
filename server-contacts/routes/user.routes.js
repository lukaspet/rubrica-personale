module.exports = app => {
  const user = require("../controllers/user.controller.js");

  app.post("/contatti/api/user", user.create);

};
