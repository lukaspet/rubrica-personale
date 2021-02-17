const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require('dotenv');
const app = express();

// Init environment
dotenv.config();

app.use(cors());
// var corsOptions = {
//   origin: "http://localhost:3120"
// };

// app.use(cors(corsOptions));

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});
const PORT = process.env.PORT || 3120;
require("./routes/filiale.routes.js")(app);
require("./routes/ruolo.routes.js")(app);
require("./routes/reparto.routes.js")(app);
require("./routes/contact.routes.js")(app);
require("./routes/logfrontend.routes.js")(app);
require("./routes/user.routes.js")(app);
// set port, listen for requests
app.listen(PORT, () => {
  console.log("Server is running on port 3120.");
});
