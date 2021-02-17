const User = require("../models/user.model.js");

// Create and Save a new Filiale
exports.create = (req, res) => {
  // Validate request
  console.log(req.body);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Filiale
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  // Save Filiale in the database
  User.create(user, (err, data) => {
    if (err) {
      if(err === "Errore username o password!"){
        res.status(401).send(
           "Errore username o password!"
        )}
      else if(err === "Prego inserisci username o password"){
          res.status(401).send(
            "Prego inserisci username o password!"
         )}
      else{
        res.status(500).send(
          "Some error occurred while validating user."
        )};}
    else res.send(data);
  });
};
