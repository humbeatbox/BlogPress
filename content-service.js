// const fs = require("fs"); // required at the top of your module
const fs = require("fs").promises;

class ContentService {
  // let articles = [];
  // let categories = [];
  constructor() {
    this.articles = [];
    this.categories = [];
  }

  initialize() {
    return fs
      .readFile("./data/articles.json", "utf8")
      .then((data) => {
        this.articles = JSON.parse(data);
        // console.log(this.articles);
        return fs.readFile("./data/categories.json", "utf8");
      })
      .then((data) => {
        this.categories = JSON.parse(data);
        // console.log(this.categories);
      })
      .catch((err) => {
        return Promise.reject("unable to read files: " + err);
      });
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
