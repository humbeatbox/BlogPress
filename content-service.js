const fs = require("fs"); // required at the top of your module

//global variables
let articles = [];
let categories = [];
module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    //first read articles.json
    fs.readFile("./data/articles.json", "utf8")
      .then((data) => {
        articles = JSON.parse(data);
        return fs.readFile("./data/categories.json", "utf8");
      })
      .then((data) => {
        categories = JSON.parse(data);

        resolve();
      })
      .catch((err) => {
        reject("unable to read file");
      });
  });
};

module.exports.getPublishedArticles = function () {
  return new Promise((resolve, reject) => {
    //filter the articles array to return only the published articles
    const publishedArticles = articles.filter(
      (article) => article.published === true
    );
    //if there are published articles, resolve the promise with the array
    if (publishedArticles.length > 0) {
      resolve(publishedArticles);
    } else {
      //if no published articles, reject the promise
      reject("no results returned");
    }
  });
};

//get all articles
module.exports.getAllArticles = function () {
  return Promise((resolve, reject) => {
    if (articles.length > 0) {
      resolve(articles);
    } else {
      reject("no results returned");
    }
  });
};

//get all categories
module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    if (categories.length > 0) {
      resolve(categories);
    } else {
      reject("no results returned");
    }
  });
};
