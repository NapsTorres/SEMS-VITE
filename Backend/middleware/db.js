const { createPool } = require("mysql2");

const pool = createPool({
  host: process.env.DB_HOST,       // RDS endpoint
  user: process.env.DB_USER,       // RDS username
  password: process.env.DB_PASSWORD, // RDS password
  database: process.env.DB_DATABASE, // RDS database name
  port: 3306,
  connectionLimit: 10,
  connectTimeout: 120000 // 120 seconds
});

module.exports = pool;
