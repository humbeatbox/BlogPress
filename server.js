const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));

app.get("/", (req, res) => {
  res.send("Hsiao-Kang Chang - 120049234");
});
