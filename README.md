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
