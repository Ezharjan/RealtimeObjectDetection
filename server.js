const express = require("express");

// create an app
const app = express();

// only static files for now
app.use(express.static("static"));

// listen port
// const PORT = process.env.PORT || 8080;
const PORT = process.env.PORT || 8811;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
