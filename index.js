const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 8080; // assign a port
const HOST = "127.0.0.1"; // assign a host
const path = require("path");
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, HOST, () =>
  console.log(`server listening on: ${HTTP_PORT}`)
);

app.get("/", (req, res, next) => {
  console.log("First middleware");
  next();
});
app.get("/", (req, res) => {
  console.log("GET request detected");
  //res.send("Hsiao-Kang Chang - 120049234");
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.post("/submit", (req, res) => {
  console.log("POST request detected");
  res.send("Form submitted");
});
