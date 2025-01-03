# Web322 Assignment

Student Name: Hsiao-Kang Chang

Student Number: 120049234

Student Email: hchang67@myseneca.ca

Date Created: Sep 13 2024

---

GITHUB URL: https://github.com/humbeatbox/Web322_Assignments

VERCEL URL :
https://web322-assignments-nine.vercel.app/

branch version :
https://web322-assignments-git-main-garys-projects-cd75ff6a.vercel.app/

preview version :
[web322-assignments-ifb8klk41-garys-projects-cd75ff6a.vercel.app](https://web322-assignments-ifb8klk41-garys-projects-cd75ff6a.vercel.app/)

---

### Technology Stack

**Frontend**: EJS

**Backend**: TBD

**Database**: TBD

### Notes

By submitting this as my assignment, I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this assignment has been copied manually or electronically from any other source (including web sites) or distributed to other students.

## Assignment 3 to Assignment 4 Updates

### Template Engine Integration

- Installed and configured EJS as the template engine
- Converted all HTML files to EJS format
- Implemented partials for reusable components (nav and footer)
- Set up proper view engine configuration in Express

### Navigation Enhancement

- Created a shared navigation bar partial (`views/partials/nav.ejs`)
- Implemented active state highlighting for current page
- Added consistent navigation across all pages

### Footer Enhancement

- Created a shared footer partial (`views/partials/footer.ejs`)
- Implemented consistent footer styling
- Added padding to prevent content overlap

### Articles Page Improvements

- Converted JSON response to EJS template rendering
- Added table view for articles listing
- Implemented category filtering through clickable links
- Added article title links to individual article pages
- Integrated proper error handling and messages
- Added category names instead of IDs in the display

### Categories Page Updates

- Converted JSON response to EJS template rendering
- Created a dedicated categories view
- Implemented proper error handling
- Added visual styling for better user experience

### Single Article View

- Created new article detail view (`views/article.ejs`)
- Implemented 404 handling for unpublished articles and non-existent articles
- Added feature image support
- Included back to articles navigation

### Add Article Page Updates

- Enhanced the article submission form
- Integrated dynamic category selection from database
- Maintained Cloudinary image upload functionality
- Improved form validation and error handling

### Data Structure Improvements

- Modified category storage to use IDs instead of names
- Implemented category name lookup functionality
- Added proper data relationship between articles and categories

## Assignment 4 to Assignment 5 Updates

### Database Migration

- Migrated from JSON file-based storage to PostgreSQL database hosted on Neon.tech
- Created two main tables: `categories` and `articles`

### Create two table

- id is serial
- name is unique

```sql
CREATE TABLE categories (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL UNIQUE
);
```

- category is reference to category table
- context is unknow and i found that we can use TEXT

```sql
CREATE TABLE articles (
id SERIAL PRIMARY KEY,
title VARCHAR(255) NOT NULL,
content TEXT NOT NULL,
author VARCHAR(255) NOT NULL,
category INTEGER NOT NULL REFERENCES categories(id),
featureImage VARCHAR(500),
published BOOLEAN DEFAULT false,
articleDate DATE DEFAULT CURRENT_DATE
);
```

### Content Service Updates (content-service.js)

- Key changes include:
  - Implemented proper SQL transactions
  - Added parameterized queries for security
  - Updated return types to match database structure
  - Added new methods for article management (update/delete)

### Server Updates (server.js)

- Added new routes for article management(by management key)
- Added support for:
  - PUT /articles/:id for updating articles
  - DELETE /articles/:id for removing articles

### Navigation Updates

- Added new "Manage Articles" link in navigation(For test edit and delete route)
- Enhanced routing logic to handle management views

### New Features

#### Article Management Interface

New Views Added:

- manageArticle.ejs: Form for editing individual articles
- manageArticles.ejs: List view of all articles with management controls
