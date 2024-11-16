// const fs = require("fs"); // required at the top of your module
const fs = require("fs").promises;
const path = require("path");

class ContentService {
  constructor() {
    this.articles = [];
    this.categories = [];
  }
  initialize() {
    const articlesPath = path.join(__dirname, "data", "articles.json");
    const categoriesPath = path.join(__dirname, "data", "categories.json");

    return new Promise((resolve, reject) => {
      fs.readFile(articlesPath, "utf8")
        .then((data) => {
          this.articles = JSON.parse(data);
          return fs.readFile(categoriesPath, "utf8");
        })
        .then((data) => {
          this.categories = JSON.parse(data);
          resolve();
        })
        .catch((err) => {
          reject("Unable to read files: " + err);
        });
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

  //AS3 part3 step1
  addArticle(article) {
    return new Promise((resolve, reject) => {
      try {
        const newArticle = {
          id: this.articles.length + 1,
          title: article.title,
          content: article.content,
          author: article.author,
          category: article.category,
          featureImage: article.featureImage || "",
          published: article.published ? true : false,
          articleDate:
            article.articleDate || new Date().toISOString().split("T")[0],
          //get the date and use the T to split the date and time and get the date only
        };
        this.articles.push(newArticle);
        resolve(newArticle);
      } catch (error) {
        console.error("Error in addArticle:", error);
        reject(error);
      }
    });
  }
  //end of AS3 part3 step1

  //AS3 part3 step3
  //forvide by professor
  getArticlesByCategory = (category) => {
    return new Promise((resolve, reject) => {
      const filteredArticles = this.articles.filter(
        (article) => article.category === category
      );
      if (filteredArticles.length > 0) {
        resolve(filteredArticles);
      } else {
        reject("no results returned");
      }
    });
  };

  getArticlesByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
      const minDate = new Date(minDateStr);
      const filteredArticles = this.articles.filter(
        (article) => new Date(article.articleDate) >= minDate
      );
      if (filteredArticles.length > 0) {
        resolve(filteredArticles);
      } else {
        reject("no results returned");
      }
    });
  };

  getArticleById = (id) => {
    return new Promise((resolve, reject) => {
      const foundArticle = this.articles.find((article) => article.id === id);
      if (foundArticle) {
        resolve(foundArticle);
      } else {
        reject("no result returned");
      }
    });
  };
  //End of AS3 part3 step3
}

module.exports = ContentService;
