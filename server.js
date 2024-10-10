const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = 9527; // assign a port
const path = require("path");
const ContentService = require("./content-service");
const contentService = new ContentService();
app.use(express.static("public")); //static files for "/css/main.css

const initializeMid = (req, res, next) => {
  contentService
    .initialize()
    .then(() => {
      console.log("Content service initialized");
      next();
    })
    .catch((err) => {
      console.log("Error initializing content service:", err);
      res.status(500).send("Failed to initialize content service");
    });
};

app.use(initializeMid);
// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () =>
  console.log(`Express http server listening on ${HTTP_PORT}`)
);

// contentService
//   .initialize()
//   .then(() => {
//     app.listen(HTTP_PORT, () =>
//       console.log(`Express http server listening on ${HTTP_PORT}`)
//     );
//   })
//   .catch((err) => {
//     console.log("Error initializing content service:", err);
//   });

//Create routes for / (Home), /about, /articles, and /categories.
//redirect to the about page
app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/articles", (req, res) => {
  console.log("!server!articles!");
  contentService
    .getAllArticles()
    .then((data) => {
      res.json(data); // Send the published articles as JSON response
    })
    .catch((err) => {
      res.json({ message: err }); // Send the error message if something went wrong
    });
});

app.get("/categories", (req, res) => {
  console.log("!server!category!");
  contentService
    .getCategories()
    .then((data) => {
      res.json(data); // Send the published articles as JSON response
    })
    .catch((err) => {
      res.json({ message: err }); // Send the error message if something went wrong
    });
});
