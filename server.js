const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = 9527; // assign a port
const path = require("path");
app.set("views", path.join(__dirname, "views"));
const ContentService = require("./content-service");
const contentService = new ContentService();
app.use(express.static("public")); //static files for "/css/main.css
require("dotenv").config();

//AS4 setup ejs
app.set("view engine", "ejs");
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

//Create routes for / (Home), /about, /articles, and /categories.
//redirect to the about page
app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  //res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render("about");
});

// app.get("/categories", (req, res) => {
//   // console.log("!server!category!");
//   contentService
//     .getCategories()
//     .then((data) => {
//       res.json(data); // Send the published articles as JSON response
//     })
//     .catch((err) => {
//       res.json({ message: err }); // Send the error message if something went wrong
//     });
// });
app.get("/categories", (req, res) => {
  contentService
    .getCategories()
    .then((data) => {
      res.render("categories", { categories: data });
    })
    .catch((err) => {
      res.render("categories", { message: err });
    });
});
//part 1, step 2
app.get("/articles/add", (req, res) => {
  contentService
    .getCategories() //get the category
    .then((categories) => {
      //then pass the categories to the addArticle page for select the category
      res.render("addArticle", { categories: categories });
    })
    .catch((err) => {
      res.render("addArticle", {
        categories: [],
        message: "Error loading categories: " + err,
      });
    });
});

//part 2 step3 and we must need to add the comment to get the full mark
//for post the article (provided by professor)
//This route is handle the form submissions for adding new articles
app.post("/articles/add", upload.single("featureImage"), (req, res) => {
  //have the file then upload to cloudinary
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          //if upload success then resolve the result
          if (result) resolve(result);
          else reject(error);
        });
        //pipe the file buffer to the stream
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    //for upload the file
    async function upload(req) {
      let result = await streamUpload(req);
      return result;
    }
    //upload the file and get the url
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
    console.log("no uploaded file");
  }
  //for process the article with the image url
  function processArticle(imageUrl) {
    req.body.featureImage = imageUrl;
    console.log("req.body and in processArticle");
    console.log(req.body);
    //call the addArticle function from contentService to handle the article
    contentService
      .addArticle(req.body)
      .then(() => res.redirect("/articles"))
      .catch((err) =>
        res.status(500).json({ message: "Article creation failed", error: err })
      );
  }
});

//AS3 part4 step1
// app.get("/articles", (req, res) => {
//   //check if the query string contains the category parameter
//   //it will like "/articles?category=value"
//   if (req.query.category) {
//     contentService
//       .getArticlesByCategory(req.query.category)
//       .then((articles) => res.json(articles))
//       .catch((err) => res.status(404).json({ message: err }));
//   }
//   //check if the query string contains the minDate parameter
//   //it will like "/articles?minDate=value"
//   else if (req.query.minDate) {
//     contentService
//       .getArticlesByMinDate(req.query.minDate)
//       .then((articles) => res.json(articles))
//       .catch((err) => res.status(404).json({ message: err }));
//   } else {
//     //if no query string then return all articles
//     //it will like "/articles"
//     contentService
//       .getAllArticles()
//       .then((articles) => res.json(articles))
//       .catch((err) => res.status(404).json({ message: err }));
//   }
// });
//End of AS3 part4 step1

//AS4
//chage the res.json to res.render
app.get("/articles", (req, res) => {
  //check if the query string contains the category parameter
  if (req.query.category) {
    contentService
      .getArticlesByCategory(req.query.category)
      .then((data) => {
        console.log("Found articles:", data);
        res.render("articles", { articles: data });
      })
      .catch((err) => {
        console.log("Error:", err);
        res.render("articles", { message: err });
      });
  }
  //check if the query string contains the minDate parameter
  else if (req.query.minDate) {
    contentService
      .getArticlesByMinDate(req.query.minDate)
      .then((data) => {
        res.render("articles", { articles: data });
      })
      .catch((err) => {
        res.render("articles", { message: err });
      });
  } else {
    //if no query string then return all articles
    contentService
      .getAllArticles()
      .then((data) => {
        res.render("articles", { articles: data });
      })
      .catch((err) => {
        res.render("articles", { message: err });
      });
  }
});

//AS3 part4 step2
//for get the article by id
//it will like "/articles/:id"
app.get("/articles/:id", (req, res) => {
  contentService
    .getArticleById(parseInt(req.params.id)) //neet to parse the id to integer
    .then((article) => res.json(article))
    .catch((err) => res.status(404).json({ message: err }));
});

//End of AS3 part4 step2

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
