require('dotenv').config(); // Load environment variables
 
// db.js
const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
  connectionLimit: 10 // Adjust as needed to control pool size
});

pool.getConnection((err,conn)=>{
  if(err) console.log(err)
  console.log("connected successfully")
})

module.exports = pool;