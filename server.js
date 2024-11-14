const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = 9527; // assign a port
const path = require("path");
const ContentService = require("./content-service");
const contentService = new ContentService();
app.use(express.static("public")); //static files for "/css/main.css
require("dotenv").config();

//for Cloudinary
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const upload = multer(); // No disk storage, files are stored in memory

async function startServer() {
  try {
    await contentService.initialize();
    console.log("Content service initialized");

    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on ${HTTP_PORT}`);
    });
  } catch (err) {
    console.error("Error initializing content service:", err);
    process.exit(1);
  }
}

startServer();
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

//part 1, step 2
app.get("/articles/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addArticle.html"));
});
//part 2 step3
//for post the article (provided by professor)
app.post("/articles/add", upload.single("featureImage"), (req, res) => {
  //have the file then upload to cloudinary
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      return result;
    }

    upload(req)
      .then((uploaded) => {
        processArticle(uploaded.url);
      })
      .catch((err) =>
        res.status(500).json({ message: "Image upload failed", error: err })
      );
  } else {
    //no file uploaded the ""
    processArticle("");
  }

  function processArticle(imageUrl) {
    req.body.featureImage = imageUrl;

    contentService
      .addArticle(req.body)
      .then(() => res.redirect("/articles"))
      .catch((err) =>
        res.status(500).json({ message: "Article creation failed", error: err })
      );
  }
});
