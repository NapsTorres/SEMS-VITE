const { createPool } = require("mysql2");
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sportevent1',
  port: 3306,
  connectTimeout: 120000  // 120 seconds
});


module.exports = pool;