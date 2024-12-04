require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_USER_NAME,
  host: process.env.PG_SQL_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_SQL_PORT,
  ssl: { rejectUnauthorized: false },
});

class ContentService {
  constructor() {}

  //init database connection
  async initialize() {
    try {
      //use pool.query to connect to the database
      await pool.query("SELECT NOW()");
      console.log("Database connected successfully - content server");
    } catch (err) {
      throw new Error("Unable to connect to database: " + err);
    }
  }

  //get all published article
  async getPublishedArticles() {
    try {
      //sql query the article only published
      const result = await pool.query(
        "SELECT * FROM articles WHERE published = true"
      );
      //if no result
      if (result.rows.length === 0) {
        throw new Error("no results returned");
      }
      //because we use the async function so we need to use the await to wait for the result
      //and use the Promise.all to wait for all(query and addCate....) the result
      return await Promise.all(
        //use the map to create new array to the category id to category name
        result.rows.map((article) => this.addCategoryDetailsToArticle(article))
      );
    } catch (err) {
      throw new Error("Error from getting published articles: " + err.message);
    }
  }

  //get all articles with no filter
  async getAllArticles() {
    try {
      //query all articles
      const result = await pool.query("SELECT * FROM articles");
      // console.log(result);
      if (result.rows.length === 0) {
        throw new Error("no results returned");
      }
      //use the map to chage the category id to category name
      return await Promise.all(
        result.rows.map((article) => this.addCategoryDetailsToArticle(article))
      );
    } catch (err) {
      throw new Error("Error from getting all articles: " + err.message);
    }
  }

  //get all categories
  async getCategories() {
    try {
      //query all categories
      const result = await pool.query("SELECT * FROM categories");
      //if no result
      if (result.rows.length === 0) {
        throw new Error("no results returned");
      }
      return result.rows;
    } catch (err) {
      throw new Error("Error getting categories: " + err.message);
    }
  }

  //get all articles by category
  //porvide by professor
  //modify fomr Gary
  async getArticlesByCategory(category) {
    try {
      //query all articles by category(first parameter)
      const result = await pool.query(
        "SELECT * FROM articles WHERE category = $1",
        [parseInt(category)]
      );

      if (result.rows.length === 0) {
        throw new Error("no results returned");
      }

      return await Promise.all(
        result.rows.map((article) => this.addCategoryDetailsToArticle(article))
      );
    } catch (err) {
      throw new Error("Error getting articles by category: " + err.message);
    }
  }

  // get articles by time
  async getArticlesByMinDate(minDateStr) {
    try {
      const result = await pool.query(
        "SELECT * FROM articles WHERE articleDate >= $1",
        [minDateStr]
      );

      if (result.rows.length === 0) {
        throw new Error("no results returned");
      }

      return await Promise.all(
        result.rows.map((article) => this.addCategoryDetailsToArticle(article))
      );
    } catch (err) {
      throw new Error("Error getting articles by date: " + err.message);
    }
  }
  async addArticle(articleData) {
    //because my addArticle page is just sort by this sequence
    //so I just use the sequence to insert the data
    //need to be change later
    const query = `
      INSERT INTO articles (title, content, author, category, featureImage, published, articleDate)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `;
    //use returning can get a result back without using anyother query to find the data

    try {
      //run that query
      //first parameter is the query script
      //second parameter is the data that need to be insert pass to the query
      const result = await pool.query(query, [
        articleData.title,
        articleData.content,
        articleData.author,
        parseInt(articleData.category),
        articleData.featureImage || "",
        articleData.published ? true : false,
        articleData.articleDate || new Date().toISOString().split("T")[0],
      ]);

      //if insert fail
      if (result.rows.length === 0) {
        throw new Error("Error adding article");
      }
      //we don't need to save the category name in the database
      //so just return the article
      // return await this.addCategoryDetailsToArticle(result.rows[0]);
      return result.rows[0];
    } catch (err) {
      throw new Error("Error adding article: " + err.message);
    }
  }
  //get article by id
  async getArticleById(id) {
    try {
      const result = await pool.query("SELECT * FROM articles WHERE id = $1", [
        parseInt(id),
      ]);

      //not published
      const article = result.rows[0];
      if (!article.published) {
        throw new Error("404");
      }

      //if not exist
      if (result.rows.length === 0) {
        throw new Error("404");
      }
      console.log("In get by ID", article);
      return await this.addCategoryDetailsToArticle(article);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  //for get a article name by id
  async getCategoryById(categoryId) {
    try {
      const result = await pool.query(
        "SELECT name FROM categories WHERE id = $1",
        [categoryId]
      );
      return result.rows.length > 0 ? result.rows[0].name : "Unknown Category";
    } catch (error) {
      console.error("Error in getCategoryById:", error);
      return "Unknown Category";
    }
  }

  //transfer the category id to category name
  async addCategoryDetailsToArticle(article) {
    try {
      //use the await function to get the category name by the category id
      const categoryName = await this.getCategoryById(article.category);
      //console.log(article);
      return {
        ...article, //copy the article object
        //only transfer the category id to category name
        categoryName,
      };
    } catch (error) {
      console.error("Error in addCategoryDetailsToArticle:", error);
      return {
        ...article,
        categoryName: "Unknown Category",
      };
    }
  }
}

module.exports = ContentService;
