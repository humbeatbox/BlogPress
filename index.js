const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = 9527; // assign a port
const path = require("path");

app.use(express.static("public")); //static files for "/css/main.css

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () =>
  console.log(`Express http server listening on ${HTTP_PORT}`)
);
//Create routes for / (Home), /about, /articles, and /categories.
//redirect to the about page
app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/articles", (req, res) => {
  contentService
    .getPublishedArticles()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/categories", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/test.html"));
});
