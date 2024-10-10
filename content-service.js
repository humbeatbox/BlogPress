// const fs = require("fs"); // required at the top of your module
const fs = require("fs").promises;
const path = require("path");

class ContentService {
  // let articles = [];
  // let categories = [];
  constructor() {
    this.articles = [];
    this.categories = [];
  }

  initialize() {
    //use path.join to create a path to the articles.json file
    const articlesPath = path.join(__dirname, "data", "articles.json");
    const categoriesPath = path.join(__dirname, "data", "categories.json");
    return (
      fs
        // .readFile("./data/articles.json", "utf8")
        .readFile(articlesPath, "utf8")
        .then((data) => {
          this.articles = JSON.parse(data);
          return fs.readFile(categoriesPath, "utf8");
        })
        .then((data) => {
          this.categories = JSON.parse(data);
        })
        .catch((err) => {
          return Promise.reject("unable to read files: " + err);
        })
    );
  }
  getPublishedArticles() {
    return new Promise((resolve, reject) => {
      const publishedArticles = this.articles.filter(
        (article) => article.published === true
      );
      if (publishedArticles.length > 0) {
        resolve(publishedArticles);
      } else {
        reject("no results returned");
      }
    });
  }
  //get all articles
  getAllArticles() {
    return new Promise((resolve, reject) => {
      if (this.articles.length > 0) {
        // console.log(this.articles);
        // console.log("articles");
        resolve(this.articles);
      } else {
        reject("no results returned");
      }
    });
  }

  //get all categories
  getCategories() {
    return new Promise((resolve, reject) => {
      if (this.categories.length > 0) {
        resolve(this.categories);
      } else {
        reject("no results returned");
      }
    });
  }
}

module.exports = ContentService;
