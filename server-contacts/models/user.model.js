const sql = require("./db.js");

// constructor
const User = function(user) {
  this.username = user.username;
  this.password = user.password;
};

User.create = (user, result) => {
  if (user.username && user.password) {
    // check if user exists
            sql.query('SELECT * FROM users WHERE username = ? AND password = ?;', [user.username, user.password], function(err, res) {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }
              if (res.length > 0) {
                  result(null, res[0]);
                  return;
              } else {
                  result('Errore username o password!', null);
                  return;
              }
            });
  } else {
            result('Prego inserisci username o password', null);
  }
};


module.exports = User;
