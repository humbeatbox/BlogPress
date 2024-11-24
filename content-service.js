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
      const publishedArticles = this.articles
        //only get the published articles
        .filter((article) => article.published === true)
        //need to use the function to transfer the category id to category name
        .map((article) => this.addCategoryDetailsToArticle(article));

      if (publishedArticles.length > 0) {
        //if have the published articles then return the articles
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
        //need to use the function to transfer the category id to category name
        const articlesWithCategories = this.articles.map((article) =>
          this.addCategoryDetailsToArticle(article)
        );
        resolve(articlesWithCategories);
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
          category: parseInt(article.category), //save in int(ID)
          featureImage: article.featureImage || "",
          published: article.published ? true : false,
          articleDate:
            article.articleDate || new Date().toISOString().split("T")[0],
          //get the date and use the T to split the date and time and get the date only
        };
        if (!this.categories.find((data) => data.id === newArticle.category)) {
          reject("Invalid category ID");
          return;
        }

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
      const filteredArticles = this.articles
        .filter((article) => article.category === parseInt(category))
        //need to use the function to transfer the category id to category name
        .map((article) => this.addCategoryDetailsToArticle(article));

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
      // const filteredArticles = this.articles.filter(
      //   (article) => new Date(article.articleDate) >= minDate
      // );
      const filteredArticles = this.articles
        .filter((article) => new Date(article.articleDate) >= minDate)
        .map((article) => this.addCategoryDetailsToArticle(article));

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
        //if exist
        if (foundArticle.published) {
          //if published
          resolve(this.addCategoryDetailsToArticle(foundArticle));
        } else {
          reject("404"); //not published
        }
      } else {
        reject("404"); //not exist
      }
    });
  };
  //End of AS3 part3 step3

  //for get a category name by id
  getCategoryById(categoryId) {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  }

  //transfer the category id to category name
  addCategoryDetailsToArticle(article) {
    return {
      ...article, //copy the article object
      //only transfer the category id to category name
      categoryName: this.getCategoryById(article.category),
    };
  }
}

module.exports = ContentService;
