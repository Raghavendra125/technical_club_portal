# technical_club_portal
The Technical Club Portal is a web-based platform that promotes technical learning and collaboration among learners and tech enthusiasts. It offers a variety of features to create an engaging and dynamic learning environment. 

## Technical Club Portal Setup Instructions
The Technical Club Portal is a platform designed for students to enhance their technical skills through various activities. Users can:
 **Technology Stack**:
- Backend: Node.js
- Frontend: HTML, CSS, JavaScript
- Database: MySQL
- Other Tools:
  - bcrypt for password hashing
  - express-session for session management
  - dotenv for environment variables
  - 
**System Requirements**:
- Node.js: v14 or higher
- MySQL: v8 or higher
- npm: v6 or higher
- Operating System: Windows/Linux/MacOS
- 
## Setup Instructions:
1. **Install Prerequisites**
(a)Install Node.js and npm: Download and install Node.js from [Node.js official website](https://nodejs.org/).
(b)Install MySQL: Download and install MySQL Server from [MySQL official website](https://dev.mysql.com/).
(c)Install Required npm Packages: by typing the command "npm install" in shell or terminal
2. **Configure the Database**
 after installing and setting up the MySQL connect to the database using username and password
 for e.g. "MySQL -u {username} -p" and enter password
(a). Create a MySQL database: by using command "CREATE DATABASE technical_club;"
(b). Import the database schema (if provided as an SQL file): "mysql -u <username> -p technical_club < database/schema.sql".
(c). Update the database connection details in `database/db.js`: 
const pool = mysql.createPool({
       host: 'localhost',
       user: 'your_username',
       password: 'your_password',
       database: 'technical_club',
   });
(d). Create the tables in the database: after creating and connecting to database use "technical_club_db_creation.sql" file provided in the database folder to create and insert data into tables.
3. **Set Environment Variables**
Create a “.env” file in the root directory and add:
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=technical_club
SESSION_SECRET=your_secret_keY
4.**Prepare the Frontend**
Place your HTML, CSS, and JavaScript files in the `public` folder. The main entry point for users is `public/login.html`.
5.**Start the Server**
Run the server using: "node server.js"
The server will be available at `http://localhost:3000/login.html`.

## For Troubleshooting:
1. Database Connection Issues:
   - Verify MySQL credentials in `.env`.
   - Ensure MySQL server is running.
2. Missing Dependencies:
   - Run `npm install` to install missing packages.
3. Port Conflicts:
   - Change the `PORT` in `.env` if 3000 is already in use.
4. Code Execution Errors:
   - Ensure compilers/interpreters for supported languages are installed and accessible in the system's     PATH.

