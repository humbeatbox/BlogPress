const express = require("express"); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = 9527; // assign a port
const path = require("path");
//for Cloudinary
const multer = require("multer");
const upload = multer(); // No disk storage, files are stored in memory
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();
//Import ContentService
const ContentService = require("./content-service");
const contentService = new ContentService();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//niddleware part
app.use(express.static("public")); //static files for "/css/main.css
app.set("views", path.join(__dirname, "views"));
//need this for parsing the form parameter data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//AS4 setup ejs
app.set("view engine", "ejs");

//Create routes for / (Home), /about, /articles, and /categories.
//redirect to the about page
app.get("/", (req, res) => {
  res.redirect("/about");
});

app.get("/about", (req, res) => {
  //res.sendFile(path.join(__dirname, "/views/about.html"));
  res.render("about");
});

app.get("/categories", (req, res) => {
  contentService
    .getCategories()
    .then((categories) => {
      // Using res.format() to provide appropriate responses based on the request type
      res.format({
        // JSON response for API requests
        "application/json": () => {
          res.json({
            success: true,
            data: categories,
            message: "Categories retrieved successfully",
          });
        },
        // HTML response for browser requests - remains the same as before
        "text/html": () => {
          res.render("categories", { categories: categories });
        },
      });
    })
    .catch((err) => {
      // Error handling with appropriate format for each request type
      res.format({
        // JSON error response for API requests
        "application/json": () => {
          res.status(500).json({
            success: false,
            message: "Error in /categories" + err,
          });
        },
        // HTML error response for browser requests
        "text/html": () => {
          // We can either render the categories page with an error message
          res.render("categories", { message: err });
        },
      });
    });
});

app.get("/articles/add", (req, res) => {
  contentService
    .getCategories() //get the category
    .then((categories) => {
      res.format({
        // JSON response for API requests - provides category data for form building
        "application/json": () => {
          res.json({
            success: true,
            data: {
              categories: categories,
            },
            message: "Categories retrieved successfully for article creation",
          });
        },
        // HTML response for browser requests - renders the form with categories
        "text/html": () => {
          res.render("addArticle", {
            categories: categories,
            message: null, // Including message field for consistency
          });
        },
      });
    })
    .catch((err) => {
      //if error then show the error message
      //Handle errors with appropriate format for each request type
      res.format({
        //JSON error response with detailed information
        "application/json": () => {
          res.status(500).json({
            success: false,
            message: "Error loading categories for article creation",
            error: err,
            data: {
              categories: [],
            },
          });
        },
        // HTML error response maintaining form accessibility
        "text/html": () => {
          res.render("addArticle", {
            categories: [], // Empty array so the form can still render
            message: "Error loading categories: " + err,
          });
        },
      });
    });
});

//for post the article (provided by professor)
//This route is handle the form submissions for adding new articles
app.post("/articles/add", upload.single("featureImage"), (req, res) => {
  //move to the top before use it
  //for process the article with the image url
  function processArticle(imageUrl) {
    req.body.featureImage = imageUrl;
    // console.log("req.body and in processArticle");
    // console.log(req.body);
    //call the addArticle function from contentService to handle the article
    contentService
      .addArticle(req.body)
      .then((newArticle) => {
        res.format({
          // For API requests, return JSON with the new article details
          "application/json": () => {
            res.status(201).json({
              success: true,
              message: "Article created successfully",
              data: {
                article: newArticle,
              },
            });
          },
          // For browser requests, redirect to the articles page
          "text/html": () => {
            res.redirect("/articles");
          },
        });
      })
      .catch((err) => {
        res.format({
          "application/json": () => {
            res.status(500).json({
              success: false,
              message: "Article creation failed",
              error: err.toString(),
            });
          },
          "text/html": () => {
            res.render("addArticle", {
              categories: [],
              message: "Error creating article: " + err,
            });
          },
        });
      });
  }
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
});

//AS4
//chage the res.json to res.render
app.get("/articles", (req, res) => {
  const isManageView = req.query.manage === "true";
  //for share this route to the manage view

  //check if the query string contains the category parameter
  //if the query string contains the category parameter
  if (req.query.category) {
    contentService
      .getArticlesByCategory(req.query.category)
      .then((data) => {
        //show all the articles with the category
        res.format({
          "application/json": () => {
            res.json({
              success: true,
              data: data,
            });
          },
          // Render EJS for browser requests
          "text/html": () => {
            res.render("articles", { articles: data });
          },
        });
      })

      .catch((err) => {
        //if error then show the error message
        res.format({
          "application/json": () => {
            res.status(500).json({
              success: false,
              message: err,
            });
          },
          "text/html": () => {
            res.render("articles", { message: err });
          },
        });
      });
  }
  //check if the query string contains the minDate parameter
  else if (req.query.minDate) {
    contentService.getArticlesByMinDate(req.query.minDate).then((data) => {
      //show all the articles with the minDate
      res.format({
        "application/json": () => {
          res.status(500).json({
            success: false,
            message: err,
          });
        },
        "text/html": () => {
          res.render("articles", { message: err });
        },
      });
    });
  } else {
    //if no query string then return all articles

    contentService
      .getAllArticles()
      .then((data) => {
        res.format({
          "application/json": () => {
            res.json({
              success: true,
              data: data,
            });
          },
          "text/html": () => {
            //use isManageView to check if the manage page
            if (isManageView) {
              res.render("manageArticles", { articles: data });
            } else {
              res.render("articles", { articles: data });
            }
          },
        });
      })
      .catch((err) => {
        res.format({
          "application/json": () => {
            res.status(500).json({
              success: false,
              message: err,
            });
          },
          "text/html": () => {
            if (isManageView) {
              res.render("manageArticles", { message: err });
            } else {
              res.render("articles", { message: err });
            }
          },
        });
      });
  }
});

//for get the article by id
//it will like "/articles/:id"
app.get("/article/:id", (req, res) => {
  const isManageMode = req.query.manage === "true"; //new feature to check if the manage mode

  contentService
    .getArticleById(parseInt(req.params.id), isManageMode) //new feature neet to parse the id to integer and default is false for stadard query
    .then((article) => {
      //need to get the categories for the manage page else just show the article
      if (isManageMode) {
        return contentService.getCategories().then((categories) => {
          res.render("manageArticle", {
            article: article,
            categories: categories,
          });
        });
      }

      // Using res.format() to handle both JSON and HTML responses
      res.format({
        // JSON response for API requests
        "application/json": () => {
          res.json({
            success: true,
            data: article,
          });
        },
        //if success then show the article(pass the article to the article page as parameter)
        // console.log("Here is in get article by ID route", article);
        "text/html": () => {
          res.render("article", { article: article });
        },
      });
    })
    .catch((err) => {
      // Handle errors with appropriate format
      res.format({
        // JSON error response
        "application/json": () => {
          res.status(404).json({
            success: false,
            message: err,
          });
        },
        // HTML error response
        "text/html": () => {
          res.status(404).render("errors/404", { title: "404 Not Found" });
        },
      });
    });
});
//-------------------------------------------------------------------
// use the put to update the article
app.put("/articles/:id", upload.single("featureImage"), async (req, res) => {
  try {
    let imageUrl = req.body.currentImage; //sabe the original image

    // if have the uimage file then upload to cloudinary
    if (req.file) {
      //upload to cloudinary
      const result = await new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      imageUrl = result.url;
    }

    //save the article data fomr wbe page
    const articleData = {
      ...req.body,
      featureImage: imageUrl,
    };

    const updatedArticle = await contentService.updateArticle(
      req.params.id,
      articleData
    );
    res.format({
      // Handle JSON API responses
      "application/json": () => {
        res.json({
          success: true,
          data: updatedArticle,
          message: "Article updated successfully",
        });
      },
      // Handle HTML browser responses
      "text/html": () => {
        // Redirect to the manage articles page after successful update
        res.redirect("/articles/manage");
      },
    });
  } catch (err) {
    res.status(500).json({ message: err });
    // Error handling with format
    res.format({
      // JSON error response for API requests
      "application/json": () => {
        res.status(500).json({
          success: false,
          message: err.toString(),
        });
      },
      // HTML error response for browser requests
      "text/html": () => {
        res.status(500).render("errors/500", {
          message: "Error updating article",
          error: err,
        });
      },
    });
  }
});

//delete article
app.delete("/articles/:id", async (req, res) => {
  try {
    await contentService.deleteArticle(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

//404 error route shopuld be the last route
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "404 Not Found" });
});

//500 server error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/500", {
    message: "Something broke!",
    error: err,
  });
});
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

// Start the server in the end after all the routes have been defined
startServer();
